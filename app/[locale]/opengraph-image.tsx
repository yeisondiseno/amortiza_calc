// Next
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ locale: string }> };

export default async function OGImage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "App" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#f8fafc",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {t("title")}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 24,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {t("description")}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#3b82f6",
            marginTop: 48,
            padding: "10px 24px",
            border: "1px solid #3b82f6",
            borderRadius: 8,
          }}
        >
          loanpayoff.info
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
