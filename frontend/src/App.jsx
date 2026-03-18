import { useState, useRef, useCallback, useEffect } from "react";
import html2canvas from "https://esm.sh/html2canvas@1.4.1";

const PROXY_URL = "https://scintillating-nourishment-production-db0b.up.railway.app";

const appStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');

  :root {
    --bg: #0a0a0f; --surface: #111118; --surface2: #18181f;
    --border: #2a2a35; --accent: #ff5c28; --accent2: #ff8c42;
    --text: #f0f0f5; --muted: #6b6b80; --success: #22c55e;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Cabinet Grotesk', sans-serif; min-height: 100vh; }
  .app { display: flex; min-height: 100vh; }

  .sidebar { width: 230px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 24px 0; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .sidebar-logo { padding: 0 20px 24px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
  .logo-text { font-family: 'Clash Display', sans-serif; font-size: 20px; font-weight: 700; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .logo-sub { font-size: 11px; color: var(--muted); margin-top: 3px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; cursor: pointer; color: var(--muted); font-size: 13px; font-weight: 600; border-left: 3px solid transparent; transition: all .2s; }
  .nav-item:hover { color: var(--text); background: var(--surface2); }
  .nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(255,92,40,.07); }
  .sidebar-footer { margin-top: auto; padding: 16px; border-top: 1px solid var(--border); }

  .main { margin-left: 230px; flex: 1; display: flex; flex-direction: column; }
  .topbar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .topbar-title { font-family: 'Clash Display', sans-serif; font-size: 17px; font-weight: 600; }

  .btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all .2s; font-family: 'Cabinet Grotesk', sans-serif; }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: #e04d1f; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(255,92,40,.4); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { color: var(--text); border-color: #555; }
  .btn:disabled { opacity: .4; cursor: not-allowed; transform: none !important; }

  .content { padding: 28px; flex: 1; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px; }
  .card-title { font-family: 'Clash Display', sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .card-title .num { color: var(--accent); }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  .upload-zone { border: 2px dashed var(--border); border-radius: 10px; padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all .2s; color: var(--muted); font-size: 12px; text-align: center; position: relative; overflow: hidden; min-height: 120px; justify-content: center; }
  .upload-zone:hover { border-color: var(--accent); background: rgba(255,92,40,.04); }
  .upload-zone.has-file { border-color: var(--success); border-style: solid; }
  .upload-zone img { width: 100%; max-height: 160px; object-fit: contain; border-radius: 6px; }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }

  .refs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
  .ref-thumb { aspect-ratio: 1; border-radius: 8px; overflow: hidden; position: relative; border: 1px solid var(--border); }
  .ref-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .ref-remove { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; background: rgba(0,0,0,.75); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 10px; color: white; opacity: 0; transition: opacity .2s; }
  .ref-thumb:hover .ref-remove { opacity: 1; }
  .add-ref { aspect-ratio: 1; border-radius: 8px; border: 2px dashed var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted); font-size: 22px; transition: all .2s; position: relative; }
  .add-ref:hover { border-color: var(--accent); color: var(--accent); }
  .add-ref input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 6px; display: block; }
  .form-input, .form-textarea { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 13px; color: var(--text); font-size: 13px; font-family: 'Cabinet Grotesk', sans-serif; outline: none; transition: border-color .2s; resize: none; }
  .form-input:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-textarea { min-height: 80px; }

  .format-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .format-item { background: var(--surface2); border: 2px solid var(--border); border-radius: 10px; padding: 12px 8px; cursor: pointer; text-align: center; transition: all .2s; font-size: 11px; font-weight: 700; }
  .format-item:hover { border-color: var(--accent); }
  .format-item.active { border-color: var(--accent); background: rgba(255,92,40,.1); color: var(--accent); }
  .format-preview { margin: 0 auto 6px; border-radius: 3px; }

  .style-detected { background: rgba(255,92,40,.06); border: 1px solid rgba(255,92,40,.2); border-radius: 10px; padding: 12px 14px; margin-top: 12px; font-size: 12px; color: var(--muted); line-height: 1.6; }
  .style-detected strong { color: var(--accent); display: block; margin-bottom: 6px; }

  .generate-bar { background: linear-gradient(135deg, var(--surface), rgba(255,92,40,.05)); border: 1px solid var(--border); border-radius: 14px; padding: 22px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 16px; }
  .generate-bar h3 { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .generate-bar p { color: var(--muted); font-size: 12px; }

  .creatives-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

  .creative-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: all .25s; }
  .creative-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.5); }
  .creative-preview-wrap { position: relative; overflow: hidden; }
  .var-badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.75); backdrop-filter: blur(6px); border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: white; z-index: 10; }
  .creative-footer { padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); }
  .creative-name { font-size: 12px; font-weight: 700; }
  .ctags { display: flex; gap: 5px; margin-top: 3px; flex-wrap: wrap; }
  .ctag { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 700; background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
  .cactions { display: flex; gap: 5px; }
  .ibtn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 7px; cursor: pointer; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); transition: all .2s; }
  .ibtn:hover { color: var(--text); border-color: #555; }
  .ibtn.d:hover { color: #f87171; border-color: #f87171; }

  .overlay { position: fixed; inset: 0; background: rgba(10,10,15,.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999; gap: 16px; backdrop-filter: blur(12px); }
  .overlay-logo { font-family: 'Clash Display', sans-serif; font-size: 28px; font-weight: 700; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .pbar { width: 300px; height: 3px; background: var(--border); border-radius: 99px; overflow: hidden; }
  .pfill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 99px; transition: width .5s ease; }
  .pstep { font-size: 12px; color: var(--muted); animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }

  .toast { position: fixed; bottom: 20px; right: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; gap: 9px; font-size: 12px; z-index: 1000; box-shadow: 0 8px 30px rgba(0,0,0,.5); animation: slideIn .3s ease; }
  .toast.success { border-color: var(--success); }
  .toast.error { border-color: #f87171; }
  @keyframes slideIn { from{transform:translateX(80px);opacity:0} to{transform:translateX(0);opacity:1} }

  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
  .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty h3 { font-family: 'Clash Display', sans-serif; font-size: 18px; color: var(--text); margin-bottom: 8px; margin-top: 16px; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

const FORMATS = [
  { id: "feed", label: "Feed 4:5", w: 4, h: 5 },
  { id: "story", label: "Story 9:16", w: 9, h: 16 },
  { id: "square", label: "Quad 1:1", w: 1, h: 1 },
];

function fileToBase64(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej; r.readAsDataURL(file); });
}
function fileToDataURL(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
}

const I = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const ic = {
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  dl: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  copy: "M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  spark: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
};

// ─── CREATIVE HTML RENDERER ───────────────────────────────────────────────────
// O layout é determinado 100% pelo que Claude Vision detectou nas referências.
// Gemini gera o fundo visual. HTML só posiciona a foto e o texto.
function CreativeHTML({ data, variation, style: S, format, background }) {
  const fmt = FORMATS.find(f => f.id === format) || FORMATS[0];
  const W = 340;
  const H = W * (fmt.h / fmt.w);

  const bg        = S?.bgColor      || "#1a1a1a";
  const textColor = S?.textColor    || "#ffffff";
  const accent    = S?.accentColor  || "#ff5c28";
  const useSerif  = S?.usesSerif    !== false;
  const handle    = S?.handle       || "";
  const credential = S?.credential  || "";
  const accentLight = isLightColor(accent);
  const bgLight     = isLightColor(bg);

  // Parâmetros de layout (extraídos pelo Claude Vision das referências)
  const textPos    = S?.textPosition   || "bottom";  // "bottom" | "top"
  const photoSide  = S?.photoOnSide    || false;      // foto ocupa só metade
  const photoRight = S?.photoSide !== "left";         // true = foto à direita
  const overlay    = S?.overlayGradient || "bottom";  // "bottom" | "top" | "none"
  const hasBand    = S?.hasSolidBand   || false;      // faixa sólida de cor

  const headline = variation?.headline    || data?.headline    || "";
  const sub      = variation?.subheadline || data?.subheadline || "";
  const cta      = variation?.cta         || data?.cta         || "SAIBA MAIS";
  const photo    = data?.expertImage;

  const hl = headline.length;
  const headSize = hl < 15 ? W*0.085 : hl < 25 ? W*0.068 : hl < 40 ? W*0.056 : W*0.046;

  const Headline = () => (
    <div style={{ fontSize: headSize, fontFamily: useSerif ? "Playfair Display, serif" : "Clash Display, sans-serif", fontWeight: 700, lineHeight: 1.08, marginBottom: W*0.02, letterSpacing: -0.5, wordBreak: "break-word", color: "inherit" }}>
      {useSerif ? headline.split(" ").map((w, i) => <span key={i} style={{ fontStyle: i%3===2 ? "italic" : "normal" }}>{w} </span>) : headline}
    </div>
  );

  const CTABlock = ({ color }) => (
    <div style={{ display: "inline-flex", alignItems: "center", padding: `${W*0.022}px ${W*0.045}px`, background: accent, borderRadius: 4, fontSize: W*0.027, fontWeight: 800, color: accentLight ? "#000" : "#fff", letterSpacing: 1, textTransform: "uppercase" }}>{cta}</div>
  );

  // ── Split Panel: painel de texto num lado, foto no outro ─────────────────────
  if (photoSide) {
    return (
      <div style={{ width: W, height: H, overflow: "hidden", display: "flex", flexDirection: photoRight ? "row" : "row-reverse", fontFamily: "Cabinet Grotesk, sans-serif" }}>
        {/* Painel de texto */}
        <div style={{ width: "46%", background: bg, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: `${W*0.07}px ${W*0.05}px ${W*0.07}px ${W*0.07}px`, position: "relative", zIndex: 2, color: textColor }}>
          {background && <img src={background} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.07 }} />}
          <div>
            {credential && <div style={{ fontSize: W*0.024, fontWeight: 700, color: accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: W*0.03 }}>{credential}</div>}
            {S?.hasDecorativeLine && <div style={{ width: W*0.07, height: 3, background: accent, marginBottom: W*0.03 }} />}
            <Headline />
            {sub && <div style={{ fontSize: W*0.03, color: bgLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.6)", lineHeight: 1.45 }}>{sub}</div>}
          </div>
          <div>
            {handle && <div style={{ fontSize: W*0.022, color: bgLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)", marginBottom: W*0.02 }}>{handle}</div>}
            <CTABlock />
          </div>
        </div>
        <div style={{ width: 3, background: accent, flexShrink: 0 }} />
        {/* Painel de foto */}
        <div style={{ flex: 1, position: "relative" }}>
          {background && <img src={background} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
          {photo && <img src={photo} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />}
          <div style={{ position: "absolute", inset: 0, background: photoRight ? "linear-gradient(90deg,rgba(0,0,0,.15),transparent 40%)" : "linear-gradient(270deg,rgba(0,0,0,.15),transparent 40%)" }} />
        </div>
      </div>
    );
  }

  // ── Full Bleed: foto + background cobrem tudo, texto em cima/baixo ────────────
  const gradients = {
    bottom: "linear-gradient(180deg, transparent 0%, transparent 28%, rgba(0,0,0,.65) 55%, rgba(0,0,0,.96) 80%, #000 100%)",
    top:    "linear-gradient(180deg, rgba(0,0,0,.93) 0%, rgba(0,0,0,.55) 35%, rgba(0,0,0,.1) 60%, transparent 100%)",
    none:   "none",
  };

  const onDark   = "#ffffff";
  const textClr  = hasBand ? textColor : onDark;
  const subClr   = hasBand ? (bgLight ? "rgba(0,0,0,.6)" : "rgba(255,255,255,.65)") : "rgba(255,255,255,.7)";
  const textPosStyle = textPos === "top"
    ? { position: "absolute", top: W*0.07, left: 0, right: 0, padding: `0 ${W*0.07}px` }
    : { position: "absolute", bottom: W*0.06, left: 0, right: 0, padding: `0 ${W*0.07}px` };

  return (
    <div style={{ width: W, height: H, position: "relative", overflow: "hidden", background: bg, fontFamily: "Cabinet Grotesk, sans-serif" }}>
      {background && <img src={background} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
      {photo && <img src={photo} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />}

      {/* Gradiente de overlay */}
      {overlay !== "none" && <div style={{ position: "absolute", inset: 0, background: gradients[overlay] || gradients.bottom }} />}

      {/* Faixa sólida de cor atrás do texto */}
      {hasBand && <div style={{ position: "absolute", ...(textPos === "top" ? { top: 0, left: 0, right: 0, height: "43%" } : { bottom: 0, left: 0, right: 0, height: "46%" }), background: bg, opacity: 0.94 }} />}

      {/* Barra de accent no topo */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${accent},transparent)` }} />

      {/* Handle / Credencial */}
      <div style={{ position: "absolute", top: W*0.05, left: W*0.06, right: W*0.06, display: "flex", justifyContent: "space-between", zIndex: 2 }}>
        {handle     && <span style={{ fontSize: W*0.026, fontWeight: 700, color: "rgba(255,255,255,.5)" }}>{handle}</span>}
        {credential && <span style={{ fontSize: W*0.026, fontWeight: 700, color: accent }}>{credential}</span>}
      </div>

      {/* Bloco de texto */}
      <div style={{ ...textPosStyle, zIndex: 2, color: textClr }}>
        {S?.hasDecorativeLine && <div style={{ width: W*0.1, height: 2, background: accent, marginBottom: W*0.025 }} />}
        <Headline />
        {sub && <div style={{ fontSize: W*0.034, color: subClr, marginBottom: W*0.03, lineHeight: 1.4 }}>{sub}</div>}
        <CTABlock />
      </div>
    </div>
  );
}

function isLightColor(hex) {
  if (!hex?.startsWith("#")) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 145;
}

// 3 variações de paleta mantendo o MESMO layout detectado das referências
function getVariantStyle(baseStyle, index) {
  if (!baseStyle) return { bgColor: "#1a1a1a", textColor: "#fff", accentColor: "#ff5c28" };
  const variants = [
    // 0: cores fiéis à referência
    { ...baseStyle },
    // 1: versão escura do mesmo layout
    { ...baseStyle, bgColor: isLightColor(baseStyle.bgColor || "#fff") ? "#111111" : lightenHex(baseStyle.bgColor || "#111", 55), textColor: isLightColor(baseStyle.bgColor || "#fff") ? "#ffffff" : "#111111" },
    // 2: accent como cor dominante, mesmo layout
    { ...baseStyle, bgColor: baseStyle.accentColor || "#ff5c28", textColor: isLightColor(baseStyle.accentColor || "#ff5c28") ? "#111111" : "#ffffff", accentColor: isLightColor(baseStyle.bgColor || "#fff") ? "#111111" : "#ffffff" },
  ];
  return variants[index] || variants[0];
}

function lightenHex(hex, amount) {
  if (!hex?.startsWith("#")) return hex;
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// ─── UPLOAD ZONE ──────────────────────────────────────────────────────────────
function UploadZone({ label, preview, onFile }) {
  const ref = useRef();
  return (
    <div className={`upload-zone ${preview ? "has-file" : ""}`} onClick={() => ref.current.click()}>
      <input ref={ref} type="file" accept="image/*" onChange={e => e.target.files[0] && onFile(e.target.files[0])} onClick={e => e.stopPropagation()} />
      {preview ? <img src={preview} alt="preview" /> : <><I d={ic.upload} size={24} /><strong style={{ fontSize: 12, color: "var(--text)" }}>{label}</strong><span>Clique ou arraste</span></>}
    </div>
  );
}

// ─── CREATIVE CARD ────────────────────────────────────────────────────────────
function CreativeCard({ creative, index, styleGuide, onDownload, onDelete, onDuplicate, format }) {
  const previewRef = useRef();
  const varStyle = getVariantStyle(styleGuide, index);
  const variation = creative.variations?.[index];
  const background = creative.backgrounds?.[index] || null;
  const fmt = FORMATS.find(f => f.id === format) || FORMATS[0];

  const layoutNames = ["Full Bleed", "Split Panel", "Cinematic"];

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 3, useCORS: true, allowTaint: true });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${variation?.name || "criativo"}-v${index + 1}.png`;
      a.click();
    } catch (e) {
      onDownload(null, variation?.name);
    }
  };

  return (
    <div className="creative-card">
      <div className="creative-preview-wrap">
        <div ref={previewRef}>
          <CreativeHTML data={creative} variation={variation} style={varStyle} format={format} background={background} />
        </div>
        <div className="var-badge">{layoutNames[index] || `V${index + 1}`}</div>
      </div>
      <div className="creative-footer">
        <div>
          <div className="creative-name">{variation?.name || `Criativo ${index + 1}`}</div>
          <div className="ctags">
            <span className="ctag">{fmt.label}</span>
            <span className="ctag">{variation?.angle || "copy"}</span>
          </div>
        </div>
        <div className="cactions">
          <div className="ibtn" onClick={() => onDuplicate(creative)}><I d={ic.copy} size={13} /></div>
          <div className="ibtn" onClick={handleDownload}><I d={ic.dl} size={13} /></div>
          <div className="ibtn d" onClick={() => onDelete(index)}><I d={ic.trash} size={13} /></div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function LaunchAdsAI() {
  const [tab, setTab] = useState("create");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const [toast, setToast] = useState(null);

  const [expertPreview, setExpertPreview] = useState(null);
  const [references, setReferences] = useState([]);
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cta, setCta] = useState("");
  const [copy, setCopy] = useState("");
  const [format, setFormat] = useState("feed");

  const [styleGuide, setStyleGuide] = useState(null);
  const [styleDesc, setStyleDesc] = useState("");
  const [creatives, setCreatives] = useState([]);
  const [library, setLibrary] = useState([]);

  const addRefInput = useRef();

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const analyzeRefs = async () => {
    if (!references.length) return null;
    try {
      const imgs = references.slice(0, 3).map(r => ({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: r.base64 } }));

      const res = await fetch(`${PROXY_URL}/api/claude`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 900,
          messages: [{
            role: "user",
            content: [
              ...imgs,
              {
                type: "text",
                text: `Analyze these ad reference images and return ONLY valid JSON. Replace each example value with what you actually observe:

{
  "bgColor": "#1a1a1a",
  "textColor": "#ffffff",
  "accentColor": "#ff5c28",
  "usesSerif": false,
  "hasDecorativeLine": true,
  "ctaStyle": "button",
  "handle": "@username or empty string",
  "credential": "Expert Title or empty string",
  "styleDescription": "Dark editorial with orange accents",
  "textPosition": "bottom",
  "photoOnSide": false,
  "photoSide": "right",
  "overlayGradient": "bottom",
  "hasSolidBand": false,
  "lightingStyle": "dramatic studio low-key",
  "colorMood": "dark monochrome with orange accents",
  "photographyStyle": "editorial portrait",
  "backgroundDesc": "dark textured studio background with subtle depth",
  "mood": "luxurious authoritative"
}

Rules:
- textPosition: "bottom" if text is in lower area, "top" if upper area
- photoOnSide: true only if photo occupies just one half of the card
- overlayGradient: "bottom", "top", or "none"
- hasSolidBand: true only if there is a solid color block behind the text
- All descriptive fields (lightingStyle, colorMood, photographyStyle, backgroundDesc, mood) must be in English`,
              },
            ],
          }],
        }),
      });

      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "{}";
      const guide = JSON.parse(text.replace(/```json|```/g, "").trim());
      console.log("✅ Guide extraído:", guide);
      return guide;
    } catch (e) {
      console.error("analyzeRefs error:", e);
      return null;
    }
  };

  const generateCopy = async (guide) => {
    try {
      const res = await fetch(`${PROXY_URL}/api/claude`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 900,
          messages: [{
            role: "user",
            content: `Expert em copywriting para lançamentos digitais no Brasil.

COPY BASE:
Headline: ${headline}
Sub: ${subheadline || "não informado"}
CTA: ${cta || "não informado"}
Estilo: ${guide?.styleDescription || "editorial clean"}

Gere 3 variações de copy com ângulos diferentes.
headline: máx 50 chars | sub: máx 65 chars | cta: máx 20 chars MAIÚSCULAS

Responda SOMENTE em JSON:
{
  "variations": [
    {"name":"Urgência","headline":"...","subheadline":"...","cta":"...","angle":"urgência"},
    {"name":"Benefício","headline":"...","subheadline":"...","cta":"...","angle":"benefício"},
    {"name":"Curiosidade","headline":"...","subheadline":"...","cta":"...","angle":"curiosidade"}
  ]
}`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "{}";
      return JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (e) {
      return null;
    }
  };

  const generateBackground = async (prompt, fmt) => {
    try {
      const res = await fetch(`${PROXY_URL}/api/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, format: fmt }),
      });
      const data = await res.json();
      const url = data.images?.[0]?.url;
      if (!url) console.error("fal.ai erro:", JSON.stringify(data));
      return url || null;
    } catch (e) {
      console.error("fal.ai fetch error:", e);
      return null;
    }
  };

  const buildImagePrompts = (guide, fmt) => {
    const parts = [
      guide?.backgroundDesc,
      guide?.lightingStyle && `${guide.lightingStyle} lighting`,
      guide?.colorMood && `${guide.colorMood} color palette`,
      guide?.photographyStyle && `${guide.photographyStyle} style`,
      guide?.mood && `${guide.mood} mood`,
      "professional advertising background",
      "no text, no people, no faces, ultra high quality",
    ].filter(Boolean);
    const base = parts.join(", ");
    const accent = guide?.accentColor || "#ff5c28";

    console.log("🎨 Image base prompt:", base);

    return [
      { prompt: base, fmt },
      { prompt: `${base}, darker moodier version, deeper shadows, dramatic cinematic lighting`, fmt },
      { prompt: `${base}, bold ${accent} color accent highlights, high contrast, vibrant energy`, fmt },
    ];
  };

  const handleGenerate = async () => {
    if (!headline) return showToast("Preencha a headline!", "error");
    setGenerating(true);
    setProgress(0);
    try {
      // Step 1: Analisar referências
      setProgress(15); setStep("Analisando referências com Claude Vision...");
      let guide = await analyzeRefs();

      if (guide) {
        setStyleGuide(guide);
        setStyleDesc(guide.styleDescription || "");
        console.log("✅ Style guide extraído:", guide);
        console.log("📝 Gemini prompt base:", guide.geminiPromptBase);
      } else {
        console.warn("⚠️ analyzeRefs retornou null — usando fallback");
        guide = { bgColor: "#1a1a1a", textColor: "#fff", accentColor: "#ff5c28", usesSerif: false, hasDecorativeLine: false, ctaStyle: "button", handle: "", credential: "", styleDescription: "Sem referências", textPosition: "bottom", photoOnSide: false, overlayGradient: "bottom", hasSolidBand: false, geminiPromptBase: null };
        setStyleGuide(guide);
      }

      if (!guide.geminiPromptBase) {
        console.warn("⚠️ geminiPromptBase vazio — Claude não gerou o prompt");
        showToast("Referências carregadas sem prompt Gemini — verifique o console", "error");
      }

      // Step 2: Gerar copy
      setProgress(40); setStep("Gerando variações de copy com IA...");
      const copyData = await generateCopy(guide);

      // Step 3: Gerar backgrounds com Gemini Imagen 3 (em paralelo)
      setProgress(60); setStep("Gerando 3 backgrounds únicos com Gemini Imagen 3...");
      const prompts = buildImagePrompts(guide, format);
      console.log("🎨 Prompts enviados ao fal.ai:", prompts.map(p => p.prompt));

      const backgrounds = await Promise.all(prompts.map(async (p, i) => {
        const result = await generateBackground(p.prompt, p.fmt);
        console.log(`🖼️ Gemini variação ${i + 1}:`, result ? "✅ imagem gerada" : "❌ falhou/null");
        return result;
      }));

      setProgress(90); setStep("Montando os criativos...");
      await new Promise(r => setTimeout(r, 300));

      const defaultVars = [
        { name: "Variação 1", headline, subheadline, cta: cta || "LEIA A LEGENDA", angle: "urgência" },
        { name: "Variação 2", headline, subheadline, cta: cta || "SAIBA MAIS", angle: "benefício" },
        { name: "Variação 3", headline, subheadline, cta: cta || "VER MAIS", angle: "curiosidade" },
      ];
      const creative = {
        headline, subheadline, cta, format,
        expertImage: expertPreview,
        backgrounds,
        variations: copyData?.variations || defaultVars,
        id: Date.now(),
        createdAt: new Date().toLocaleString("pt-BR"),
      };
      setProgress(100); setStep("Finalizando...");
      setCreatives([creative]);
      setLibrary(prev => [creative, ...prev]);

      const imgsOk = backgrounds.filter(Boolean).length;
      showToast(imgsOk > 0 ? `${imgsOk}/3 backgrounds gerados com FLUX!` : "Geração de imagem falhou — verifique a FAL_KEY", imgsOk > 0 ? "success" : "error");
    } catch (e) {
      console.error("❌ Erro handleGenerate:", e);
      showToast(`Erro: ${e.message}`, "error");
    } finally {
      setGenerating(false);
    }
  };

  const creative = creatives[0];
  const variations = creative?.variations || [];

  return (
    <>
      <style>{appStyle}</style>

      {generating && (
        <div className="overlay">
          <div className="overlay-logo">LaunchAds AI</div>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Claude Vision + Gemini Imagen 3 trabalhando...</p>
          <div className="pbar"><div className="pfill" style={{ width: `${progress}%` }} /></div>
          <div className="pstep">{step}</div>
          <div style={{ fontSize: 11, color: "var(--border)" }}>{progress}%</div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          <I d={toast.type === "success" ? ic.check : ic.x} size={14} />{toast.msg}
        </div>
      )}

      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-text">LaunchAds AI</div>
            <div className="logo-sub">Criativos que convertem</div>
          </div>
          {[{ id: "create", icon: ic.spark, label: "Criar Criativo" }, { id: "library", icon: ic.grid, label: "Biblioteca" }].map(item => (
            <div key={item.id} className={`nav-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
              <I d={item.icon} size={15} />{item.label}
            </div>
          ))}
          <div className="sidebar-footer">
            <div style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))", borderRadius: 10, padding: 12, fontSize: 12, fontWeight: 700, color: "white" }}>
              <div style={{ fontSize: 10, opacity: .8, marginBottom: 2 }}>PLANO PRO</div>Criativos ilimitados
            </div>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{tab === "create" ? "Criar Criativo" : "Biblioteca"}</div>
            {tab === "create" && (
              <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                <I d={ic.zap} size={15} />{generating ? "Gerando..." : "Gerar Criativos"}
              </button>
            )}
          </div>

          <div className="content">
            {tab === "create" && (
              <>
                <div className="generate-bar">
                  <div>
                    <h3>✦ Gerador com Análise de Referências</h3>
                    <p>Suba referências — a IA detecta o estilo e replica nos seus criativos</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(255,92,40,.1)", color: "var(--accent)", border: "1px solid rgba(255,92,40,.2)" }}>
                      <I d={ic.spark} size={12} /> Claude Vision
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(139,92,246,.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,.2)" }}>
                      <I d={ic.spark} size={12} /> FLUX Schnell
                    </div>
                  </div>
                </div>

                <div className="grid-2">
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="card">
                      <div className="card-title"><span className="num">01</span> Foto do Expert</div>
                      <UploadZone label="Upload da foto do expert" preview={expertPreview} onFile={async f => { setExpertPreview(await fileToDataURL(f)); showToast("Foto carregada!"); }} />
                    </div>

                    <div className="card">
                      <div className="card-title"><span className="num">02</span> Referências de Design</div>
                      <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.6 }}>
                        Suba criativos que você gosta. A IA detecta automaticamente o estilo e replica nas suas artes.
                      </p>
                      <div className="refs-grid">
                        {references.map((r, i) => (
                          <div className="ref-thumb" key={i}>
                            <img src={r.preview} alt="" />
                            <div className="ref-remove" onClick={() => setReferences(p => p.filter((_, j) => j !== i))}>✕</div>
                          </div>
                        ))}
                        {references.length < 6 && (
                          <div className="add-ref" onClick={() => addRefInput.current.click()}>
                            <input ref={addRefInput} type="file" accept="image/*" multiple onChange={async e => {
                              const files = Array.from(e.target.files);
                              const arr = await Promise.all(files.map(async f => ({ preview: await fileToDataURL(f), base64: await fileToBase64(f) })));
                              setReferences(p => [...p, ...arr].slice(0, 6));
                              showToast(`${files.length} referência(s) adicionada(s)!`);
                            }} />+
                          </div>
                        )}
                      </div>
                      {styleGuide && (
                        <div className="style-detected">
                          <strong>✦ Estilo detectado pela IA:</strong>
                          {styleDesc}
                          <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {[styleGuide.bgColor, styleGuide.textColor, styleGuide.accentColor].filter(Boolean).map((c, i) => (
                              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                                <span style={{ width: 12, height: 12, borderRadius: 3, background: c, border: "1px solid rgba(255,255,255,.15)", display: "inline-block" }} />{c}
                              </span>
                            ))}
                            <span style={{ fontSize: 11, background: "rgba(255,255,255,.08)", padding: "2px 6px", borderRadius: 4 }}>{styleGuide.usesSerif ? "Serif" : "Sans"}</span>
                            <span style={{ fontSize: 11, background: "rgba(255,255,255,.08)", padding: "2px 6px", borderRadius: 4 }}>texto: {styleGuide.textPosition || "?"}</span>
                            <span style={{ fontSize: 11, background: "rgba(255,255,255,.08)", padding: "2px 6px", borderRadius: 4 }}>foto: {styleGuide.photoOnSide ? `lado ${styleGuide.photoSide}` : "full"}</span>
                            <span style={{ fontSize: 11, background: "rgba(255,255,255,.08)", padding: "2px 6px", borderRadius: 4 }}>overlay: {styleGuide.overlayGradient || "none"}</span>
                            <span style={{ fontSize: 11, background: styleGuide.geminiPromptBase ? "rgba(34,197,94,.15)" : "rgba(248,113,113,.15)", padding: "2px 6px", borderRadius: 4, color: styleGuide.geminiPromptBase ? "#22c55e" : "#f87171" }}>
                              gemini prompt: {styleGuide.geminiPromptBase ? "✓ gerado" : "✗ vazio"}
                            </span>
                          </div>
                          {styleGuide.geminiPromptBase && (
                            <details style={{ marginTop: 8 }}>
                              <summary style={{ fontSize: 11, cursor: "pointer", color: "var(--muted)" }}>Ver prompt enviado ao Gemini</summary>
                              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, lineHeight: 1.5, wordBreak: "break-word" }}>{styleGuide.geminiPromptBase}</div>
                            </details>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="card">
                      <div className="card-title"><span className="num">03</span> Formato</div>
                      <div className="format-grid">
                        {FORMATS.map(f => (
                          <div key={f.id} className={`format-item ${format === f.id ? "active" : ""}`} onClick={() => setFormat(f.id)}>
                            <div className="format-preview" style={{ width: f.w > f.h ? 36 : 24, height: f.w > f.h ? 24 : f.w === f.h ? 24 : 42, background: format === f.id ? "var(--accent)" : "var(--border)" }} />
                            {f.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-title"><span className="num">04</span> Copy do Anúncio</div>
                    <div className="form-group">
                      <label className="form-label">Headline *</label>
                      <input className="form-input" placeholder="Ex: Você ainda normaliza a dor?" value={headline} onChange={e => setHeadline(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subheadline</label>
                      <input className="form-input" placeholder="Ex: Fisioterapeuta revela o método" value={subheadline} onChange={e => setSubheadline(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CTA</label>
                      <input className="form-input" placeholder="Ex: LEIA A LEGENDA" value={cta} onChange={e => setCta(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Copy Completa</label>
                      <textarea className="form-textarea" placeholder="Cole a copy completa aqui..." value={copy} onChange={e => setCopy(e.target.value)} style={{ minHeight: 100 }} />
                    </div>
                    <hr className="divider" />
                    <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleGenerate} disabled={generating}>
                      <I d={ic.zap} size={15} />{generating ? "Analisando e gerando..." : "Gerar 3 Criativos com IA"}
                    </button>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>A IA detecta o estilo das referências e replica nos criativos</p>
                  </div>
                </div>

                {variations.length > 0 && (
                  <>
                    <hr className="divider" />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <h2 style={{ fontFamily: "Clash Display", fontSize: 18, fontWeight: 700 }}>Criativos Gerados</h2>
                        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>3 variações no estilo das suas referências</p>
                      </div>
                      <button className="btn btn-ghost" onClick={handleGenerate}><I d={ic.refresh} size={13} />Regerar</button>
                    </div>
                    <div className="creatives-grid">
                      {variations.map((_, i) => (
                        <CreativeCard
                          key={i} creative={creative} index={i} styleGuide={styleGuide} format={format}
                          onDownload={() => showToast("Download iniciado!")}
                          onDelete={(idx) => { setCreatives(prev => { const c = { ...prev[0] }; c.variations = c.variations.filter((_, j) => j !== idx); return [c]; }); }}
                          onDuplicate={(c) => { setCreatives(prev => [...prev, { ...c, id: Date.now() }]); showToast("Duplicado!"); }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {tab === "library" && (
              library.length === 0 ? (
                <div className="empty"><I d={ic.grid} size={40} /><h3>Nenhum criativo ainda</h3><p>Crie seu primeiro criativo para aparecer aqui</p>
                  <button className="btn btn-primary" style={{ margin: "20px auto 0", display: "flex" }} onClick={() => setTab("create")}>Criar Agora</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
                  {library.map((c, i) => (
                    <div key={c.id || i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", cursor: "pointer" }} onClick={() => { setCreatives([c]); setTab("create"); }}>
                      <div style={{ aspectRatio: "4/5", background: "var(--surface2)", position: "relative", overflow: "hidden" }}>
                        {c.expertImage && <img src={c.expertImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .75 }} />}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent,rgba(0,0,0,.85))", display: "flex", alignItems: "flex-end", padding: 12 }}>
                          <div style={{ fontFamily: "Clash Display", fontSize: 12, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{(c.headline || "").slice(0, 45)}</div>
                        </div>
                      </div>
                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{c.variations?.[0]?.name || "Criativo"}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.createdAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
