import { ImageResponse } from "next/og";

export const alt = "DMF Manpower - Fachkräfte aus Vietnam für Deutschland";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 45%, #1d4ed8 100%)",
          color: "#f8fafc",
          padding: "56px 64px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(59,130,246,0.35), transparent 35%), radial-gradient(circle at bottom left, rgba(14,165,233,0.18), transparent 28%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 64,
                height: 64,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "#93c5fd",
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              DMF
            </div>
            <span>DMF Manpower</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              maxWidth: "82%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(59,130,246,0.16)",
                border: "1px solid rgba(147,197,253,0.28)",
                color: "#bfdbfe",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              Fachkräfte aus Vietnam für Deutschland
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 68,
                lineHeight: 1.04,
                letterSpacing: "-0.06em",
                fontWeight: 800,
              }}
            >
              <span>Personalvermittlung</span>
              <span>für Pflege, Handwerk</span>
              <span>und Industrie</span>
            </div>

            <div
              style={{
                fontSize: 30,
                lineHeight: 1.35,
                color: "#cbd5e1",
                maxWidth: "92%",
              }}
            >
              Full-Service von Rekrutierung bis Visum. B2B-fokussiert, DSGVO-bewusst
              und auf den deutschen Markt ausgerichtet.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#94a3b8",
              fontSize: 24,
            }}
          >
            <span>dmf-talents.de</span>
            <span>Pflege • Handwerk • Industrie</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
