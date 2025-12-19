import { log, spinner } from "@clack/prompts";
import { CONFIG } from "./config.ts";

export async function generateDailyReport(logs: string) {
  try {
    const s = spinner();
    s.start(`🤖 正在连接 AI 生成日报...`);

    const startTime = Date.now();

    const prompt = CONFIG.prompt + logs;

    const payload = {
      model: CONFIG.model,
      prompt,
      stream: false,
    };

    const response = await fetch(CONFIG.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态码: ${response.status}`);
    }

    const data = (await response.json()) as { response: string };

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    s.stop(`请求完成 (耗时 ${duration}s)`);
    log.info("🤖 AI 日报内容如下：");
    log.message(data.response);
    log.success("报告生成完毕！");
  } catch (error) {
    log.error("❌ AI 生成失败。请检查：");
    log.error(`错误详情: ${error}`);
  }
}
