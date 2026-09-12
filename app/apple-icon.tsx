import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/site-settings";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const settings = await getSiteSettings();
  if (settings.faviconUrl) {
    const response = await fetch(settings.faviconUrl, {
      next: { revalidate: 300 },
    }).catch(() => null);
    if (response?.ok) {
      return new Response(await response.arrayBuffer(), {
        headers: { "Content-Type": contentType },
      });
    }
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 38,
        background: "#0b1726",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 40,
          bottom: 37,
          width: 105,
          height: 108,
          borderLeft: "9px solid #d8e5ef",
          borderBottom: "9px solid #d8e5ef",
          borderBottomLeftRadius: 8,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 60,
          width: 94,
          height: 67,
          borderTop: "12px solid #35c6a5",
          borderRadius: "50%",
          transform: "rotate(-28deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 105,
          width: 18,
          height: 18,
          borderRadius: 18,
          background: "#f5b942",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 84,
          width: 17,
          height: 17,
          borderRadius: 17,
          background: "#eaf3f8",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 123,
          top: 64,
          width: 20,
          height: 20,
          borderRadius: 20,
          background: "#35c6a5",
        }}
      />
    </div>,
    size,
  );
}
