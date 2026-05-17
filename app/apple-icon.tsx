// Next
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Brand colors — sync with app/globals.css
const FRAME = "#000000"; // --color-primary
const ACCENT = "#6cf8bb"; // --color-secondary-container

const AppleIcon = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: FRAME,
          borderRadius: 39,
          position: "relative",
          display: "flex",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 34,
            top: 45,
            width: 22,
            height: 90,
            background: ACCENT,
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 79,
            top: 73,
            width: 22,
            height: 62,
            background: ACCENT,
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 124,
            top: 101,
            width: 22,
            height: 34,
            background: ACCENT,
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 141,
            width: 124,
            height: 11,
            background: ACCENT,
            borderRadius: 6,
          }}
        />
      </div>
    ),
    { width: 180, height: 180 },
  );

export default AppleIcon;
