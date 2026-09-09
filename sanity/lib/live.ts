import type { ComponentType } from "react";
import { isSanityConfigured } from "../env";
import { client } from "./client";

/**
 * Server-safe Sanity fetch wrapper.
 *
 * `defineLive` wires a client-side live stream and must not be evaluated in a
 * client component graph. This project renders client components from server
 * sections, so a plain tagged fetch is the reliable production path.
 */
// biome-ignore lint/suspicious/noExplicitAny: Sanity query result types vary by GROQ query
export async function sanityFetch<T = any>({
  query,
  params,
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<{ data: T }> {
  if (!isSanityConfigured) {
    return { data: null as T };
  }

  try {
    const data = await client.fetch<T>(query, params ?? {}, {
      next: { revalidate: 60, tags: ["sanity"] },
    });
    return { data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Sanity fetch failed: ${message}`);
    return { data: null as T };
  }
}

export const SanityLive: ComponentType = () => null;
