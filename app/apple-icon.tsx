import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 36,
        background: "#07111f",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          padding: 28,
          border: "8px solid #22d3ee",
          borderRadius: 32,
        }}
      >
        {[34, 60, 88].map((height, index) => (
          <div
            key={height}
            style={{
              width: 18,
              height,
              borderRadius: 9,
              background: index === 1 ? "#a3e635" : "#22d3ee",
            }}
          />
        ))}
      </div>
    </div>,
    size,
  );
}
