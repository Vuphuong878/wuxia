import { parseWorkerUrls, DEFAULT_IMAGE_GEN_WORKER_URLS } from '../utils/apiConfig';

export interface ImageGenOptions {
  prompt: string;
  num_steps?: number;
  width?: number;
  height?: number;
  model?: string;
}


export type ImageCachePrefix = 'npc' | 'map' | 'main' | 'item' | 'global';

export class ImageCacheService {
  private static dbName = 'WuxiaImageCache';
  private static storeName = 'images';
  private static db: IDBDatabase | null = null;

  private static async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async generateCacheKey(prompt: string, prefix: ImageCachePrefix = 'global', storyId?: string): Promise<string> {
    const salt = storyId || 'global';
    const combined = `${salt}:${prompt}`;
    const hash = await this.sha256(combined);
    return `${prefix}${hash}`;
  }

  private static async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve(this.db!);
      };
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  static async get(key: string): Promise<string | null> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('ImageCache get error:', e);
      return null;
    }
  }

  static async set(key: string, dataUrl: string): Promise<void> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(dataUrl, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('ImageCache set error:', e);
    }
  }
}

export class ImageService {
  /**
   * Checks if an image exists at the given path (cache or server)
   */
  static async checkImageExists(path: string, cacheKey?: string): Promise<string | null> {
    // 1. Check browser cache first
    if (cacheKey) {
      const cached = await ImageCacheService.get(cacheKey);
      if (cached) return cached;
    }

    // 2. Check public folder (server)
    if (!path) return null;
    try {
      const response = await fetch(path, { method: 'HEAD' });
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
          return path;
        }
      }
    } catch (error) {
      console.warn(`Error checking image existence at ${path}:`, error);
    }
    
    return null;
  }

  /**
   * Generates an image and automatically caches it in the browser
   */
  static async generateAndCache(workerUrl: string | string[], options: ImageGenOptions, cacheKey: string): Promise<string> {
    const dataUrl = await this.generateImage(workerUrl, options);
    await ImageCacheService.set(cacheKey, dataUrl);
    return dataUrl;
  }

  /**
   * Generates an image from a prompt and returns it as a Base64 string
   */
  static async generateImage(workerUrl: string | string[], options: ImageGenOptions): Promise<string> {
    const inputUrls = parseWorkerUrls(workerUrl);
    const defaultUrls = parseWorkerUrls(DEFAULT_IMAGE_GEN_WORKER_URLS);
    
    // Combine and remove duplicates while preserving order
    const urls = [...new Set([...inputUrls, ...defaultUrls])];

    if (urls.length === 0) {
      throw new Error("Chưa cấu hình URL cho Worker tạo ảnh.");
    }

    let lastErrorMessage = "";
    
    for (let i = 0; i < urls.length; i++) {
        let normalizedUrl = urls[i];

        // Node Discovery: If the URL is a discovery endpoint, resolve the actual worker URL
        if (normalizedUrl.includes('/api/nodes/')) {
          try {
            console.log(`[ImageService] Đang tìm node hoạt động từ: ${normalizedUrl}`);
            const discRes = await fetch(normalizedUrl);
            const discData = await discRes.json();
            if (discData.url) {
              normalizedUrl = discData.url;
              console.log(`[ImageService] Đã tìm thấy node: ${normalizedUrl}`);
            }
          } catch (e) {
            console.warn(`[ImageService] Lỗi discovery tại ${normalizedUrl}, chuyển sang link tiếp theo...`, e);
            continue;
          }
        }

        console.log(`[ImageService] Đang thử kết nối tới Worker tạo ảnh: ${normalizedUrl} (${i + 1}/${urls.length})`);

        const MAX_RETRIES = 2;
        const INITIAL_RETRY_DELAY = 1500;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            if (attempt > 0) {
                const backoffDelay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
                console.log(`[ImageService] Đang thử lại lần ${attempt}/${MAX_RETRIES} cho ${normalizedUrl} sau ${backoffDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoffDelay));
            }

            try {
              const formData = new FormData();
              formData.append('prompt', options.prompt);
              if (options.num_steps) formData.append('num_steps', String(options.num_steps));
              if (options.width) formData.append('width', String(options.width));
              if (options.height) formData.append('height', String(options.height));
              if (options.model) formData.append('model', options.model);
              
              const response = await fetch(normalizedUrl, {
                method: 'POST',
                headers: {
                  'x-model': options.model || '@cf/black-forest-labs/flux-2-klein-4b'
                },
                body: formData,
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = String(errorData.error || `HTTP error! status: ${response.status}`);
                
                // Check if this error is transient or quota-related
                const isRetryable = response.status >= 500 || 
                                   response.status === 429 ||
                                   errorMessage.includes('4006') || 
                                   errorMessage.toLowerCase().includes('daily free allocation') ||
                                   errorMessage.toLowerCase().includes('neurons');

                if (isRetryable && (attempt < MAX_RETRIES || i < urls.length - 1)) {
                    // If it's 4006 or 429, we might want to skip to the next URL sooner
                    // but for general 500s, we retry on the SAME URL first.
                    if ((errorMessage.includes('4006') || response.status === 429) && i < urls.length - 1) {
                        console.warn(`[ImageService] Worker ${normalizedUrl} đã hết hạn mức hoặc bận (4006/429). Đang chuyển sang URL kế tiếp...`);
                        break; // Break the attempt loop to move to next URL
                    }
                    console.warn(`[ImageService] Lỗi tạm thời từ ${normalizedUrl} (Lần ${attempt + 1}): ${errorMessage}. Đang chuẩn bị thử lại...`);
                    continue; // Continue to next attempt for this URL
                }
                
                throw new Error(errorMessage);
              }

              const blob = await response.blob();
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            } catch (error: any) {
              lastErrorMessage = error?.message || String(error);
              
              // If it's a fetch/connection error, retry on same URL or move to next
              if (attempt < MAX_RETRIES) {
                  console.warn(`[ImageService] Lỗi kết nối "${lastErrorMessage}" cho ${normalizedUrl} (Lần ${attempt + 1}). Thử lại...`);
                  continue; 
              }
              
              if (i < urls.length - 1) {
                  console.warn(`[ImageService] Đã thử hết số lần cho ${normalizedUrl}. Chuyển sang URL tiếp theo...`);
                  break; 
              }
              throw new Error(lastErrorMessage);
            }
        }
    }

    throw new Error(lastErrorMessage || "Không thể tạo ảnh sau khi đã thử tất cả các Worker URLs.");
  }

  /**
   * Helper to construct a character prompt
   */
  static constructCharacterPrompt(character: { 
    name: string, 
    gender?: string, 
    title?: string, 
    realm?: string, 
    appearanceDescription?: string, 
    appearance?: string, 
    sectId?: string, 
    isPlayer?: boolean,
    favorability?: number
  }): string {
    const isNPC = !character.isPlayer;
    const gender = (character.gender || "").toLowerCase();
    const isMale = gender === 'nam' || gender === 'male';

    const randomChoice = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const backgrounds = [
        "Misty mountain silhouettes, swirling clouds, and flying cranes in the background",
        "A tranquil bamboo forest with creeping fog and a serene koi pond in the background",
        "Ancient pavilion ruins partly hidden by low clouds and a pale full moon in the background",
        "A raging waterfall crashing down sheer cliffs covered in ancient pines in the background",
        "A serene lotus pond at dawn with mist rising from the water and distant mountains",
        "Snow-covered peaks under a starry night sky with ethereal glowing mist",
        "An ancient courtyard with blooming plum blossoms and scattered petals in the wind",
        "A majestic cliff face overlooking a sea of clouds at sunset"
    ];

    const maleClothes = [
        "wearing flowing black and white Daoist robes with silver crane embroidery",
        "wearing a midnight blue brocade overcoat with golden dragon motifs",
        "wearing pristine white scholar robes with light blue sashes fluttering in the wind",
        "wearing dark grey martial artist attire with leather bracers and a silver belt",
        "wearing an emerald green traditional hanfu layered with white silk",
        "wearing crimson inner robes covered by a shadowy black longcoat",
        "wearing plain but elegant grey linen robes with a wide bamboo hat on his back"
    ];

    const femaleClothes = [
        "wearing a flowing traditional Chinese hanfu with silk ribbons fluttering in the wind",
        "wearing an ethereal white silk dress with pale blue accents and wide sleeves",
        "wearing a vibrant red martial arts outfit with gold embroidery and dark silken sashes",
        "wearing a pale pink multilayered dress with delicate lotus patterns",
        "wearing an elegant lavender ruqun with sheer translucent outer layers",
        "wearing a dark emerald and gold traditional dress with a trailing skirt",
        "wearing a striking black silk hanfu with crimson flower embroidery"
    ];

    const baseStyle = "A traditional Chinese ink wash painting (Shuimofeng) of a";
    const cameraAndPose = "standing in the center of the frame, looking directly into the camera.";
    
    let characterSubject = "";
    let outfit = "";
    let specificColors = "";
    let pronoun = "";

    if (isMale) {
        characterSubject = "handsome male immortal martial artist, heroic features, tall stature, dignified posture";
        outfit = randomChoice(maleClothes);
        specificColors = "subtle, elegant color accents like pale gold or deep crimson on his attire, and sharp, defining ink strokes for his features";
        pronoun = "He";
    } else {
        characterSubject = "beautiful female immortal, stunningly elegant features, graceful demeanor";
        outfit = randomChoice(femaleClothes);
        specificColors = "subtle, elegant color accents like pale red on her lips, soft peach on her cheeks, and a hint of blue or gold in her silk robes";
        pronoun = "She";
    }

    const background = randomChoice(backgrounds);
    const artStyle = `The artwork features minimalist black and white ink drawings but with ${specificColors}. Ethereal and poetic atmosphere, expressive brushwork, high quality, artistic masterpiece. Cinematic lighting, hyper-realistic, 1080p resolution, highly detailed face and eyes, perfectly drawn hands, five fingers on each hand, anatomically correct hands, no deformed fingers, fantasy art style.`;

    let details = `${character.name}`;
    if (character.title) details += `, ${character.title}`;
    if (character.realm) details += `, cultivation realm: ${character.realm}`;
    
    // Support both NPC and Player appearance fields
    const desc = character.appearanceDescription || character.appearance;
    if (desc) details += `, appearance: ${desc}`;

    // Affection/Favorability based mood for NPCs
    if (isNPC && character.favorability !== undefined) {
        const fav = character.favorability;
        if (fav >= 80) {
            details += ", deeply in love, intimate expression, looking at viewer with devotion, soft blush, romantic atmosphere";
        } else if (fav >= 40) {
            details += ", affectionate gaze, gentle smile, warm and caring expression, slight blush";
        } else if (fav >= 20) {
            details += ", friendly and slightly bashful, pleasant expression, approachable aura";
        } else if (fav >= 10) {
            details += ", polite but reserved, modest smile, calm demeanor";
        } else {
            details += ", neutral expression, dignified and distant, mysterious aura";
        }
    }
    
    // Sect-based outfit logic (Optional additive details)
    let sectDetails = "";
    if (character.sectId) {
       const isEvil = character.sectId.toLowerCase().includes('ma') || character.sectId.toLowerCase().includes('tà') || character.sectId.toLowerCase().includes('cốt');
       if (isEvil) {
           sectDetails = "The attire incorporates dark sinister motifs with intricate patterns, reflecting an evil demonic sect vibe.";
       } else if (character.sectId !== 'none') {
           sectDetails = "The attire reflects orthodox sect elegance, giving a righteous and pure aura.";
       } else {
           sectDetails = "The clothing has a wandering martial artist style, travel-worn but stylish.";
       }
    }

    return `${baseStyle} ${characterSubject} ${cameraAndPose} ${pronoun} is ${outfit}. ${background}. ${artStyle} ${sectDetails} Character details: ${details}.`;
  }

  /**
   * Helper to construct an item prompt
   */
  static constructItemPrompt(item: { name: string, description?: string, type?: string, quality?: string }): string {
    const basePrompt = "Wuxia style item, traditional Chinese artifact painting, highly detailed, central focus, transparent background styling";
    let details = `${item.name}`;
    if (item.type) details += `, a ${item.type}`;
    if (item.quality) details += `, quality: ${item.quality}`;
    if (item.description) details += `, ${item.description}`;
    
    return `${basePrompt}, ${details}, vibrant colors, glowing aura, isolated item`;
  }

}
