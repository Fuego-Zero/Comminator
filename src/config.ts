import dotenv from "dotenv";

dotenv.config({ quiet: true });

const prompt = `
你是一名工作助理。请根据以下 Git Commit 记录，生成一份**极简的一句话日报**。

### 严格要求：
1. **要求**：必须每个项目独立总结，需要是单独的一行，每一个项目换一行。
2. **格式**：【项目名称】:<总结内容>
3. **形式**：总结内容必须是一段连贯的文字，**严禁使用列表、分点或换行**。
4. **内容**：必须包含所有有变动的项目名称，并精炼总结其核心工作（如修复了什么、新增了什么）。
5. **长度**：每个项目的总结**严格控制在 200 字以内**。
6. **语气**：专业、干练。

### 待处理的提交记录：
    `;

if (
  process.env.workspace === undefined ||
  process.env.author === undefined ||
  process.env.AI_API_URL === undefined ||
  process.env.AI_MODEL === undefined
) {
  throw new Error(
    "请在 .env 文件中正确配置 workspace, author 和 AI_API_URL 三个环境变量"
  );
}

export const CONFIG = {
  workspace: process.env.workspace,
  exclude: ["node_modules", "dist", "build", ".vscode", "temp"],
  prompt,
  author: process.env.author,
  url: process.env.AI_API_URL,
  model: process.env.AI_MODEL,
};
