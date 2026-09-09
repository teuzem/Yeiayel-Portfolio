export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-15";

const configuredDataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
const configuredProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();

export const isSanityConfigured = Boolean(
  configuredProjectId && configuredDataset,
);

// Client construction needs syntactically valid values. All network access is
// guarded by isSanityConfigured, so these placeholders are never queried.
export const dataset = configuredDataset || "production";
export const projectId = configuredProjectId || "unconfigured";
