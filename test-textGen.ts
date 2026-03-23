import { TextGenService } from './services/textGenService.js';

async function test() {
  const urls = "https://wuxia-nemotron-worker.vudinhtrungv1010.workers.dev/";
  const options = {
    messages: [
      { role: "system", "content": "Ngươi là một hệ thống võ hiệp." },
      { role: "user", "content": "Ta là Tiêu Viêm, ta muốn đi ra ngoài dạo." }
    ]
  };
  try {
    const res = await TextGenService.generateText(urls, options as any);
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
