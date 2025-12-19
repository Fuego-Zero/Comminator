import { execSync } from "child_process";
import path from "path";
import { CONFIG } from "./config.ts";
import {
  select,
  isCancel,
  cancel,
  intro,
  outro,
  log,
  spinner,
} from "@clack/prompts";
import { findGitRepos } from "./findGitRepos.ts";
import { generateDailyReport } from "./generateDailyReport.ts";
import dayjs from "dayjs";

async function run() {
  intro(`🔍 Git Daily Reporter - ${new Date().toLocaleDateString()}`);

  const timeRange = await select({
    message: "📅 请选择生成报告的时间范围:",
    options: [
      { value: "today", label: "今天 (Today)" },
      { value: "week", label: "本周 (This Week)" },
    ],
    initialValue: "today",
  });

  if (isCancel(timeRange)) {
    cancel("已取消操作");
    process.exit(0);
  }

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  if (timeRange === "week") {
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate.setDate(diff);
  }

  const sinceParam = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");

  log.info(`统计起始时间: ${sinceParam}`);

  const s = spinner();
  s.start(`🔍 正在深度扫描: ${CONFIG.workspace}...`);
  const repos = findGitRepos(CONFIG.workspace);
  s.stop(`扫描完成，找到 ${repos.length} 个仓库`);

  let activeLogs = "";
  for (const repoPath of repos) {
    try {
      const cmd = `git -C "${repoPath}" log --since="${sinceParam}" --author="${CONFIG.author}" --no-merges --pretty=format:"- %s"`;
      const logs = execSync(cmd, { encoding: "utf-8" }).trim();
      if (logs) {
        log.info(`✨ [${path.basename(repoPath)}] 发现新提交\n${logs}`);
        activeLogs += `【项目：${path.basename(repoPath)}】\n${logs}\n`;
      }
    } catch (e) {}
  }

  if (!activeLogs) {
    outro("☕️ 所选范围内暂无代码提交，休息一下吧！");
    return;
  }

  await generateDailyReport(activeLogs);

  outro("✅ 任务结束！");
}

run();
