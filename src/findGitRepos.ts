import fs from "fs";
import path from "path";
import { CONFIG } from "./config.ts";

/**
 * 递归寻找 Git 项目
 * @param currentPath 当前扫描路径
 * @param projectList 收集到的项目路径列表
 */
export function findGitRepos(
  currentPath: string,
  projectList: string[] = []
): string[] {
  const files = fs.readdirSync(currentPath);

  // 1. 检查当前目录是否就是 Git 仓库
  if (files.includes(".git")) {
    projectList.push(currentPath);
    return projectList; // 找到 .git 就停止向下递归，保护性能
  }

  // 2. 如果不是，则继续向子目录寻找
  for (const file of files) {
    if (CONFIG.exclude.includes(file)) continue; // 跳过黑名单

    const fullPath = path.join(currentPath, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findGitRepos(fullPath, projectList);
      }
    } catch (e) {
      // 忽略无权限访问的文件夹
    }
  }

  return projectList;
}
