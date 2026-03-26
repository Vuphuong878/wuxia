import { parseWorkerUrls, DEFAULT_TEXT_GEN_WORKER_URLS } from '../utils/apiConfig';

export interface TextGenMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TextGenOptions {
  messages: TextGenMessage[];
  max_tokens?: number;
  temperature?: number;
  id?: string;
  onDelta?: (delta: string, accumulated: string) => void;
  model?: string;
  top_p?: number;
  top_k?: number;
}

export interface TextGenResponse {
  response?: string;
  result?: { response?: string };
  error?: string;
}

export class TextGenService {
  /**
   * Generates text via one or more Cloudflare Workers running Nemotron model
   * @param workerUrl - Single URL or array of fallback URLs
   * @param options - Messages and generation parameters
   * @returns The generated text response
   */
  private static async verifyWorkerHealth(url: string): Promise<boolean> {
    try {
      // Use a very small request to check if the worker is responsive and healthy
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: '1' }],
          max_tokens: 1,
          temperature: 0,
        }),
        // @ts-ignore - Support for AbortSignal.timeout
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
      });

      return response.ok;
    } catch (error) {
      console.warn(`[TextGenService] Health check failed for ${url}:`, error);
      return false;
    }
  }

  // Max retries for transient capacity errors (3040) on the same URL
  private static readonly CAPACITY_RETRY_MAX = 5;
  private static readonly CAPACITY_RETRY_BASE_MS = 2000;

  private static isCapacityError(message: string): boolean {
    return message.includes('3040') || message.toLowerCase().includes('capacity temporarily exceeded');
  }

  static async generateText(workerUrl: string | string[], options: TextGenOptions): Promise<string> {
    const inputUrls = parseWorkerUrls(workerUrl);
    const defaultUrls = parseWorkerUrls(DEFAULT_TEXT_GEN_WORKER_URLS);

    // Combine and remove duplicates while preserving order
    const urls = [...new Set([...inputUrls, ...defaultUrls])];

    if (urls.length === 0) {
      throw new Error("Chưa cấu hình URL cho Worker tạo văn bản.");
    }

    let lastErrorMessage = "";
    let i = 0;

    while (i < urls.length) {
      let normalizedUrl = urls[i];

      // Node Discovery: If the URL is a discovery endpoint, resolve the actual worker URL
      if (normalizedUrl.includes('/api/nodes/')) {
        try {
          console.log(`[TextGenService] Đang tìm node hoạt động từ: ${normalizedUrl}`);
          const discRes = await fetch(normalizedUrl);
          const discData = await discRes.json();
          if (discData.url) {
            normalizedUrl = discData.url;
            console.log(`[TextGenService] Đã tìm thấy node: ${normalizedUrl}`);
          }
        } catch (e) {
          console.warn(`[TextGenService] Lỗi discovery tại ${normalizedUrl}, chuyển sang link tiếp theo...`, e);
          i++;
          continue;
        }
      }

      console.log(`[TextGenService] Đang thử kết nối tới Worker: ${normalizedUrl} (${i + 1}/${urls.length})`);

      try {
        const response = await fetch(normalizedUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-model': options.model || '@cf/zai-org/glm-4.7-flash',
            ...(options.id ? { 'x-session-affinity': options.id } : {}),
          },
          body: JSON.stringify({
            messages: options.messages,
            max_tokens: options.max_tokens || 131000,
            temperature: options.temperature || 1,
            top_p: options.top_p,
            top_k: options.top_k,
            id: options.id,
            model: options.model
          }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          let errorMessage = `HTTP ${response.status}: ${errorText}`;

          try {
            const errorData = JSON.parse(errorText);
            const serverError = (errorData && typeof errorData === 'object' && 'error' in errorData) ? (errorData as any).error : null;
            if (serverError) errorMessage = String(serverError);
          } catch (e) { }

          const is4006 = errorMessage.includes('4006') ||
            errorMessage.toLowerCase().includes('daily free allocation') ||
            errorMessage.toLowerCase().includes('neurons');

          const isTransient = is4006 || response.status === 429 || response.status >= 500;

          // Auto-retry for capacity errors (3040) on the SAME URL with exponential backoff
          if (this.isCapacityError(errorMessage)) {
            const retryKey = `__capacityRetry_${i}`;
            const currentRetry = ((this as any)[retryKey] || 0) as number;
            if (currentRetry < this.CAPACITY_RETRY_MAX) {
              (this as any)[retryKey] = currentRetry + 1;
              const delayMs = this.CAPACITY_RETRY_BASE_MS * Math.pow(2, currentRetry);
              console.warn(`[TextGenService] Lỗi dung lượng tạm thời (3040). Tự động thử lại lần ${currentRetry + 1}/${this.CAPACITY_RETRY_MAX} sau ${delayMs / 1000}s...`);
              await new Promise(r => setTimeout(r, delayMs));
              continue;
            }
            // Reset counter before falling through
            delete (this as any)[retryKey];
            console.warn(`[TextGenService] Đã hết lượt retry dung lượng (3040). Chuyển sang link dự phòng...`);
          }

          if (isTransient && i < urls.length - 1) {
            console.warn(`[TextGenService] Worker ${normalizedUrl} lỗi (${response.status}/${errorMessage.slice(0, 50)}). Đang tìm link dự phòng...`);
            let foundHealthy = false;
            for (let nextIdx = i + 1; nextIdx < urls.length; nextIdx++) {
              if (await this.verifyWorkerHealth(urls[nextIdx])) {
                i = nextIdx;
                foundHealthy = true;
                break;
              }
            }
            if (foundHealthy) {
              await new Promise(r => setTimeout(r, 100));
              continue;
            }
          }
          throw new Error(errorMessage);
        }

        let text = "";
        let errorDataFromStream: any = null;

        const responseText = (await response.text()).trim();

        try {
          const data = JSON.parse(responseText);
          if (data.error) errorDataFromStream = data;

          // Legacy support for wrapped JSON, or fallback to raw text if it's already the content
          text = data.response || data.result?.response || data.choices?.[0]?.message?.content || responseText;
        } catch (e) {
          // If not valid JSON, it's already the raw text response
          text = responseText;
        }

        // Handle onDelta for compatibility (send full text as one delta)
        if (options.onDelta && text) {
          options.onDelta(text, text);
        }

        if (!text && errorDataFromStream) {
          const errorStr = String(errorDataFromStream.error);
          const is4006Inside = errorStr.includes('4006') || errorStr.toLowerCase().includes('daily free allocation');

          if (is4006Inside && i < urls.length - 1) {
            console.warn(`[TextGenService] Worker ${normalizedUrl} báo lỗi 4006. Đang tìm link dự phòng...`);
            let foundHealthy = false;
            for (let nextIdx = i + 1; nextIdx < urls.length; nextIdx++) {
              if (await this.verifyWorkerHealth(urls[nextIdx])) {
                i = nextIdx;
                foundHealthy = true;
                break;
              }
            }
            if (foundHealthy) continue;
          }
          throw new Error(`Worker API Error: ${errorStr}`);
        }

        // Check for refusal phrases or empty text
        const refusalPhrases = [
          "i'm sorry",
          "i can't comply",
          "i cannot comply",
          "i apologize",
          "i am unable to",
          "không thể thực hiện",
          "xin lỗi, tôi không thể"
        ];

        const isRefusal = text.length > 0 && text.length < 200 && refusalPhrases.some(p => text.toLowerCase().includes(p));
        const isEmpty = !text || text.trim() === "";

        if (isEmpty || isRefusal) {
          if (i < urls.length - 1) {
            const reason = isEmpty ? "phản hồi trống" : `phát hiện từ chối ("${text.slice(0, 30)}...")`;
            console.warn(`[TextGenService] Worker ${normalizedUrl} ${reason}. Đang tìm link dự phòng...`);

            let foundHealthy = false;
            for (let nextIdx = i + 1; nextIdx < urls.length; nextIdx++) {
              if (await this.verifyWorkerHealth(urls[nextIdx])) {
                console.log(`[TextGenService] Tìm thấy link dự phòng hoạt động: ${urls[nextIdx]}`);
                i = nextIdx;
                foundHealthy = true;
                break;
              }
            }
            if (foundHealthy) {
              await new Promise(r => setTimeout(r, 100));
              continue;
            }
          }

          if (isEmpty) {
            throw new Error("Worker trả về phản hồi trống hoặc không đúng định dạng.");
          }
          // If it was a refusal but no more workers, we'll return it anyway or throw?
          // The user said "skip and next", so if no next, we might as well throw so the UI knows it failed.
          throw new Error(`Worker từ chối thực hiện và không còn link dự phòng: ${text}`);
        }

        return text;
      } catch (error: any) {
        lastErrorMessage = error?.message || String(error);

        // Retry only on connection errors
        const isNetworkError = lastErrorMessage.includes("fetch") ||
          lastErrorMessage.includes("network") ||
          lastErrorMessage.includes("Failed to fetch");

        if (isNetworkError && i < urls.length - 1) {
          console.warn(`[TextGenService] Lỗi kết nối tới ${normalizedUrl}: ${lastErrorMessage}. Thử link dự phòng...`);
          i++;
          await new Promise(r => setTimeout(r, 100));
          continue;
        }
        break;
      }
    }

    throw new Error(lastErrorMessage || "Không thể tạo văn bản sau khi đã thử tất cả các Worker URLs.");
  }

  /**
   * Tests the connection to a text generation worker
   * @param workerUrl - The Cloudflare Worker URL to test
   * @returns Connection test result
   */
  static async testConnection(workerUrl: string): Promise<{ ok: boolean; detail: string }> {
    const startedAt = Date.now();
    try {
      const text = await this.generateText(workerUrl, {
        messages: [
          { role: 'system', content: 'You are a connection test. Please only answer OK.' },
          { role: 'user', content: 'ping' }
        ],
        max_tokens: 50,
        temperature: 0,
      });
      const elapsed = Date.now() - startedAt;
      return { ok: true, detail: `Duration: ${elapsed}ms\n\n${text}` };
    } catch (error: any) {
      return { ok: false, detail: error?.message || 'Unknown error' };
    }
  }
}
