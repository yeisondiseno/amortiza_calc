// Next
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const AppleIcon = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 700,
            color: "#3b82f6",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          $
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  );

export default AppleIcon;
