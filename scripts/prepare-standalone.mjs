import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

if (!existsSync(join(standalone, "server.js"))) {
  throw new Error(
    'Standalone server output is missing. Ensure next.config.ts uses output: "standalone".',
  );
}

function copyDirectory(source, destination) {
  if (!existsSync(source)) return;
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true, force: true });
}

copyDirectory(join(root, "public"), join(standalone, "public"));
copyDirectory(
  join(root, ".next", "static"),
  join(standalone, ".next", "static"),
);

console.log("Prepared standalone server with public and static assets.");
