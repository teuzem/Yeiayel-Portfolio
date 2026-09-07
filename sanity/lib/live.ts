import type { ComponentType } from "react";
import { client } from "./client";

/**
 * Server-safe Sanity fetch wrapper.
 *
 * `defineLive` wires a client-side live stream and must not be evaluated in a
 * client component graph. This project renders client components from server
 * sections, so a plain tagged fetch is the reliable production path.
 */
export async function sanityFetch<T = any>({
  query,
  params,
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<{ data: T }> {
  try {
    const data = await client.fetch<T>(query, params ?? {}, {
      next: { revalidate: 60, tags: ["sanity"] },
    });
    return { data };
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return { data: null as T };
  }
}

export const SanityLive: ComponentType = () => null;
