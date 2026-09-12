import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/site-settings";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
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
        borderRadius: 14,
        background: "#0b1726",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 14,
          bottom: 13,
          width: 38,
          height: 39,
          borderLeft: "3px solid #d8e5ef",
          borderBottom: "3px solid #d8e5ef",
          borderBottomLeftRadius: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 19,
          top: 22,
          width: 33,
          height: 23,
          borderTop: "4px solid #35c6a5",
          borderRadius: "50%",
          transform: "rotate(-28deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 21,
          top: 37,
          width: 6,
          height: 6,
          borderRadius: 6,
          background: "#f5b942",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 31,
          top: 30,
          width: 6,
          height: 6,
          borderRadius: 6,
          background: "#eaf3f8",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 42,
          top: 23,
          width: 7,
          height: 7,
          borderRadius: 7,
          background: "#35c6a5",
        }}
      />
    </div>,
    size,
  );
}
