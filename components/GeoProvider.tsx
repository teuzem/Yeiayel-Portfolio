"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AFRICAN_COUNTRIES } from "@/lib/pricing";

export interface GeoInfo {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  lat?: number;
  lon?: number;
  isp?: string;
  queryIp?: string;
  status?: "success" | "fail";
  loading: boolean;
}

interface GeoContextValue {
  geo: GeoInfo;
  isLocal: boolean;
  refresh: () => Promise<void>;
}

// Free geolocation by IP — no API key, no credit card, no payment required.
// ip-api.com free tier supports HTTP (from browser we use https via ipwho.is fallback).
const GeoContext = createContext<GeoContextValue | null>(null);

async function fetchGeo(): Promise<GeoInfo> {
  // Primary: ipwho.is (free, HTTPS, no key)
  try {
    const res = await fetch("https://ipwho.is/", { cache: "no-store" });
    if (res.ok) {
      const d = await res.json();
      if (d && d.success !== false && d.country_code) {
        return {
          country: d.country || undefined,
          countryCode: d.country_code || undefined,
          region: d.region || d.city || undefined,
          city: d.city || undefined,
          lat: typeof d.latitude === "number" ? d.latitude : undefined,
          lon: typeof d.longitude === "number" ? d.longitude : undefined,
          isp: d.connection?.isp || undefined,
          queryIp: d.ip || undefined,
          status: "success",
          loading: false,
        };
      }
    }
  } catch {
    /* fall through */
  }

  // Fallback: ipapi.co (free, HTTPS, no key)
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (res.ok) {
      const d = await res.json();
      if (d?.country_code) {
        return {
          country: d.country_name || undefined,
          countryCode: d.country_code || undefined,
          region: d.region || undefined,
          city: d.city || undefined,
          lat: d.latitude ?? undefined,
          lon: d.longitude ?? undefined,
          isp: d.org || undefined,
          queryIp: d.ip || undefined,
          status: "success",
          loading: false,
        };
      }
    }
  } catch {
    /* fall through */
  }

  // Final fallback: ip-api.com JSON
  try {
    const res = await fetch("https://ip-api.com/json/", { cache: "no-store" });
    if (res.ok) {
      const d = await res.json();
      if (d && d.status === "success") {
        return {
          country: d.country || undefined,
          countryCode: d.countryCode || undefined,
          region: d.regionName || undefined,
          city: d.city || undefined,
          lat: d.lat ?? undefined,
          lon: d.lon ?? undefined,
          isp: d.isp || undefined,
          queryIp: d.query || undefined,
          status: "success",
          loading: false,
        };
      }
    }
  } catch {
    /* ignore */
  }

  return { loading: false, status: "fail" };
}

export function GeoProvider({ children }: { children: ReactNode }) {
  const [geo, setGeo] = useState<GeoInfo>({ loading: true });

  const refresh = useCallback(async () => {
    setGeo((prev) => ({ ...prev, loading: true }));
    const result = await fetchGeo();
    setGeo(result);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isLocal = useMemo(() => {
    if (!geo.countryCode) return true; // default to local if unknown
    return AFRICAN_COUNTRIES.includes(geo.countryCode.toUpperCase());
  }, [geo.countryCode]);

  const value = useMemo<GeoContextValue>(
    () => ({ geo, isLocal, refresh }),
    [geo, isLocal, refresh],
  );

  return <GeoContext.Provider value={value}>{children}</GeoContext.Provider>;
}

export function useGeo(): GeoContextValue {
  const ctx = useContext(GeoContext);
  if (!ctx) {
    // Keep isolated routes and reusable components resilient. Routes should
    // still mount GeoProvider when location-aware pricing is required, but a
    // safe local default prevents a hard runtime crash during composition.
    return {
      geo: { loading: false, status: "fail" },
      isLocal: true,
      refresh: async () => undefined,
    };
  }
  return ctx;
}
