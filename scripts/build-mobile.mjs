import { spawn } from "node:child_process";
import { resolve } from "node:path";

const nextCli = resolve("node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextCli, "build"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    CAPACITOR: "true",
    GITHUB_ACTIONS: "false",
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
