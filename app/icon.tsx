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
        position: "relative",
        borderRadius: 14,
        background: "#07111f",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 42,
          height: 42,
          border: "3px solid #22d3ee",
          borderRadius: 12,
          transform: "rotate(45deg)",
        }}
      />
      <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
        {[12, 22, 32].map((height, index) => (
          <div
            key={height}
            style={{
              width: 6,
              height,
              borderRadius: 3,
              background: index === 1 ? "#a3e635" : "#22d3ee",
            }}
          />
        ))}
      </div>
    </div>,
    size,
  );
}
