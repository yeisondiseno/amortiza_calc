// Next
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Brand colors — sync with app/globals.css
const FRAME = "#000000"; // --color-primary
const ACCENT = "#6cf8bb"; // --color-secondary-container

const Icon = () =>
  new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: FRAME,
        borderRadius: 7,
        position: "relative",
        display: "flex",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 6,
          top: 8,
          width: 4,
          height: 16,
          background: ACCENT,
          borderRadius: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 13,
          width: 4,
          height: 11,
          background: ACCENT,
          borderRadius: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 18,
          width: 4,
          height: 6,
          background: ACCENT,
          borderRadius: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 5,
          top: 25,
          width: 22,
          height: 2,
          background: ACCENT,
          borderRadius: 1,
        }}
      />
    </div>,
    { width: 32, height: 32 },
  );

export default Icon;
