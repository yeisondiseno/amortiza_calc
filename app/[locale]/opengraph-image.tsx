// Next
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand colors — sync with app/globals.css
const SURFACE = "#f7f9fb"; // --color-surface
const FRAME = "#000000"; // --color-primary
const ACCENT = "#6cf8bb"; // --color-secondary-container
const TEXT_PRIMARY = "#191c1e"; // --color-on-surface
const TEXT_SECONDARY = "#45464d"; // --color-on-surface-variant
const URL_FG = "#006c49"; // --color-secondary
const URL_BG = "#e6faf0"; // light tint of --color-secondary-container

type Props = { params: Promise<{ locale: string }> };

const OGImage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "App" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: SURFACE,
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: FRAME,
              borderRadius: 14,
              position: "relative",
              display: "flex",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 12,
                top: 16,
                width: 8,
                height: 32,
                background: ACCENT,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 28,
                top: 26,
                width: 8,
                height: 22,
                background: ACCENT,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 44,
                top: 36,
                width: 8,
                height: 12,
                background: ACCENT,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 50,
                width: 44,
                height: 4,
                background: ACCENT,
                borderRadius: 2,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            LoanCalc
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: 64,
            fontSize: 60,
            fontWeight: 700,
            color: TEXT_PRIMARY,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            display: "flex",
            maxWidth: 1040,
          }}
        >
          {t("title")}
        </div>

        {/* Description */}
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: TEXT_SECONDARY,
            lineHeight: 1.4,
            display: "flex",
            maxWidth: 960,
          }}
        >
          {t("description")}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* URL chip */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: URL_FG,
              background: URL_BG,
              padding: "10px 22px",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
            }}
          >
            loanpayoff.info
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
};

export default OGImage;
