import "server-only";
import { isSanityConfigured } from "../env";

export const isSanityWriteConfigured = Boolean(
  isSanityConfigured && process.env.SANITY_SERVER_API_TOKEN?.trim(),
);
