import { parseWorkerUrls, DEFAULT_TEXT_GEN_WORKER_URLS } from '../utils/apiConfig';

export interface TextGenMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TextGenOptions {
  messages: TextGenMessage[];
  max_tokens?: number;
  temperature?: number;
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
      const normalizedUrl = urls[i];
      console.log(`[TextGenService] Đang thử kết nối tới Worker: ${normalizedUrl} (${i + 1}/${urls.length})`);

      try {
        const response = await fetch(normalizedUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: options.messages,
            max_tokens: options.max_tokens || 131000,
            temperature: options.temperature || 0.7,
            stream: true, // Enabled streaming
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

        // Handle streaming response (SSE)
        let text = "";
        let errorDataFromStream: any = null;
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let done = false;
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunk = decoder.decode(value, { stream: !done });

            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') continue;
                try {
                  const data = JSON.parse(dataStr);
                  if (data.error) errorDataFromStream = data;
                  const delta = data.response || data.result?.response || data.choices?.[0]?.delta?.content || "";
                  text += delta;
                } catch (e) { }
              } else if (line.trim() && !line.startsWith(':')) {
                try {
                  const data = JSON.parse(line);
                  if (data.error) errorDataFromStream = data;
                  const delta = data.response || data.result?.response || "";
                  text += delta;
                } catch (e) { }
              }
            }
          }
        } else {
          const data = await response.json() as any;
          if (data.error) errorDataFromStream = data;
          text = data.response || data.result?.response || data.choices?.[0]?.message?.content || "";
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
