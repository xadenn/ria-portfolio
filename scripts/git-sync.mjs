#!/usr/bin/env node
import { execSync } from "child_process";

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: "inherit", encoding: "utf8", ...opts });
}

function runSilent(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

async function main() {
  console.log("\n=======================================================");
  console.log(" 🚀 SYNCING RIA VERMA PORTFOLIO TO GITHUB");
  console.log("=======================================================\n");

  const status = runSilent("git status --porcelain");
  const userMsg = process.argv.slice(2).join(" ").trim();
  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const commitMsg = userMsg || `chore: update portfolio (${now})`;

  if (status) {
    console.log("📦 Staging updated files...");
    run("git add .");

    console.log(`📝 Creating commit: "${commitMsg}"...`);
    run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
  } else {
    console.log("ℹ️ No uncommitted local file changes found.");
  }

  console.log("🌐 Pushing changes to GitHub (origin/main)...");
  try {
    run("git push origin main");
    console.log("\n✨ SUCCESS: All changes are live on GitHub!");
    console.log("🔗 https://github.com/xadenn/ria-portfolio\n");
  } catch (err) {
    console.error("\n❌ Push failed. Details:", err.message);
    process.exit(1);
  }
}

main();
