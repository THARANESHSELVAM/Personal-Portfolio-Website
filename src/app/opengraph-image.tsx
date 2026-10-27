import { ImageResponse } from "next/og";
import { SITE_METADATA } from "@/lib/siteConfig";

export const alt = `${SITE_METADATA.authorName} — Software Engineering Portfolio`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          backgroundColor: "#050914",
          backgroundImage:
            "radial-gradient(circle at 18% 18%, rgba(6, 182, 212, 0.16) 0%, transparent 45%), radial-gradient(circle at 82% 82%, rgba(59, 130, 246, 0.14) 0%, transparent 50%), linear-gradient(180deg, #070c18 0%, #040711 100%)",
          color: "#f8fafc",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Subtle grid pattern background accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.8,
          }}
        />

        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "rgba(6, 182, 212, 0.12)",
                border: "1px solid rgba(6, 182, 212, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22d3ee",
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
              }}
            >
              TS
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  color: "#f1f5f9",
                  textTransform: "uppercase",
                }}
              >
                {SITE_METADATA.authorName}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  letterSpacing: "0.2px",
                }}
              >
                Software Engineering Portfolio
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(6, 182, 212, 0.08)",
              border: "1px solid rgba(6, 182, 212, 0.25)",
              color: "#38bdf8",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#22d3ee",
              }}
            />
            <span>Interactive Engineering Showcase</span>
          </div>
        </div>

        {/* Center Hero Information */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "960px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              color: "#ffffff",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Full-Stack Software Engineer & Cloud Systems
          </div>
          <div
            style={{
              fontSize: "22px",
              lineHeight: 1.45,
              color: "#cbd5e1",
              maxWidth: "880px",
            }}
          >
            Bespoke engineering portfolio showcasing full-stack web applications, GIS cadastral mapping systems, applied data/AI implementations, verified learning milestones, and ATS-ready documentation.
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "18px 22px",
              borderRadius: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(51, 65, 85, 0.6)",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#22d3ee",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "4px",
              }}
            >
              Full-Stack Web
            </span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>
              Next.js 16 & React 19
            </span>
            <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
              App Router, Strict TS & Atomic State
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "18px 22px",
              borderRadius: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(51, 65, 85, 0.6)",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#38bdf8",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "4px",
              }}
            >
              Geospatial Systems
            </span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>
              Land Stack GIS
            </span>
            <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
              Cadastral Mapping & Cloud Workflows
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "18px 22px",
              borderRadius: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(51, 65, 85, 0.6)",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#818cf8",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "4px",
              }}
            >
              Verified Milestones
            </span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>
              Learning Diary & ATS
            </span>
            <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
              Dynamic Evidence Linking & PDF Export
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
