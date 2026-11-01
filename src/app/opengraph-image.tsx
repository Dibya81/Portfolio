import { ImageResponse } from "next/og";

export const alt = "Dibya Bhusal — software engineer building systems that have to be trusted";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "radial-gradient(ellipse at 85% 20%, #ff7a3d33, transparent 55%), radial-gradient(ellipse at 10% 90%, #5b8cff26, transparent 50%), #05070d",
          color: "#e8ecf4",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#9aa4b8", textTransform: "uppercase" }}>
          Software engineer · AI agents · Security · Web3 · IoT
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, lineHeight: 1, letterSpacing: -3 }}>Dibya Bhusal</div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#ffb38a", maxWidth: 920 }}>
            Systems that have to be trusted — and the receipts to prove it.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#6b7590" }}>Project 117 · NeighborHealth · Aptos Synapse · TRI-ZEROTRO</div>
      </div>
    ),
    size,
  );
}
