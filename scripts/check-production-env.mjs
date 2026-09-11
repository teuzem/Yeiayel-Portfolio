import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadLocalEnvFile() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;

  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const name = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[name] === undefined) process.env[name] = value;
  }
}

loadLocalEnvFile();

const configured = (name) => Boolean(process.env[name]?.trim());
const checks = [
  {
    label: "Application URL",
    ok: configured("NEXT_PUBLIC_APP_URL"),
    variables: ["NEXT_PUBLIC_APP_URL"],
  },
  {
    label: "Sanity public connection",
    ok:
      configured("NEXT_PUBLIC_SANITY_PROJECT_ID") &&
      configured("NEXT_PUBLIC_SANITY_DATASET") &&
      configured("NEXT_PUBLIC_SANITY_API_VERSION"),
    variables: [
      "NEXT_PUBLIC_SANITY_PROJECT_ID",
      "NEXT_PUBLIC_SANITY_DATASET",
      "NEXT_PUBLIC_SANITY_API_VERSION",
    ],
  },
  {
    label: "Sanity server writes",
    ok: configured("SANITY_SERVER_API_TOKEN"),
    variables: ["SANITY_SERVER_API_TOKEN"],
  },
  {
    label: "Sanity instant publishing webhook",
    ok: configured("SANITY_REVALIDATE_SECRET"),
    variables: ["SANITY_REVALIDATE_SECRET"],
  },
  {
    label: "Clerk authentication",
    ok:
      configured("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY") &&
      configured("CLERK_SECRET_KEY"),
    variables: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"],
    optional: true,
  },
  {
    label: "AI response provider",
    ok: configured("OPENAI_API_KEY") || configured("OPENROUTER_API_KEY"),
    variables: ["OPENAI_API_KEY", "OPENROUTER_API_KEY"],
  },
  {
    label: "Tavily live research",
    ok:
      configured("TAVILY_API_KEY") &&
      process.env.TWIN_RESEARCH_ENABLED?.trim().toLowerCase() !== "false",
    variables: ["TAVILY_API_KEY", "TWIN_RESEARCH_ENABLED"],
  },
];

console.log("Production environment readiness");
for (const check of checks) {
  const status = check.ok ? "READY" : check.optional ? "OPTIONAL" : "MISSING";
  console.log(`${status.padEnd(8)} ${check.label}`);
  for (const name of check.variables) {
    const value =
      name === "TWIN_RESEARCH_ENABLED"
        ? process.env[name]?.trim() || "(defaults to enabled)"
        : configured(name)
          ? "configured"
          : "missing";
    console.log(`         ${name}: ${value}`);
  }
}

const missingRequired = checks.filter((check) => !check.optional && !check.ok);
if (missingRequired.length) {
  console.error(
    `Environment is not production-ready: ${missingRequired
      .map((check) => check.label)
      .join(", ")}.`,
  );
  process.exitCode = 1;
} else {
  console.log("Environment is ready for AI Twin live research.");
}
