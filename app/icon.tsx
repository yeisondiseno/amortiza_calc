// Next
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const Icon = () =>
  new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#3b82f6",
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1,
        }}
      >
        $
      </div>
    </div>,
    { width: 32, height: 32 },
  );

export default Icon;
