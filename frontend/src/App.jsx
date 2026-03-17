import { useState, useRef, useCallback, useEffect } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #18181f;
    --border: #2a2a35;
    --accent: #ff5c28;
    --accent2: #ff8c42;
    --text: #f0f0f5;
    --muted: #6b6b80;
    --success: #22c55e;
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
  .format-preview { margin: 0 auto 6px; border-radius: 3px; transition: background .2s; }
  .format-item.active .format-preview { background: var(--accent) !important; }

  .style-tag { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; background: rgba(255,92,40,.1); color: var(--accent); border: 1px solid rgba(255,92,40,.2); margin-top: 10px; }

  .generate-bar { background: linear-gradient(135deg, var(--surface), rgba(255,92,40,.05)); border: 1px solid var(--border); border-radius: 14px; padding: 22px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 16px; }
  .generate-bar h3 { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .generate-bar p { color: var(--muted); font-size: 12px; }

  .creatives-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .creative-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: all .25s; }
  .creative-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.5); }
  .canvas-wrap { position: relative; background: #000; }
  .canvas-wrap canvas { display: block; width: 100%; height: auto; }
  .var-badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.75); backdrop-filter: blur(6px); border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: white; }
  .creative-footer { padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); }
  .creative-name { font-size: 12px; font-weight: 700; }
  .ctags { display: flex; gap: 5px; margin-top: 3px; }
  .ctag { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 700; background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
  .cactions { display: flex; gap: 5px; }
  .ibtn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 7px; cursor: pointer; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); transition: all .2s; font-size: 13px; }
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

// ─── CANVAS RENDERER ──────────────────────────────────────────────────────────
const CANVAS_W = 400;

const THEMES = [
  {
    // Variação 1: Fundo escuro, texto claro — estilo editorial dark
    name: "Dark Editorial",
    getBg: () => "#0d0d0d",
    getTextColor: () => "#ffffff",
    getAccent: () => "#ff5c28",
    getOverlay: (ctx, W, H) => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(0,0,0,0.1)");
      g.addColorStop(0.4, "rgba(0,0,0,0.5)");
      g.addColorStop(1, "rgba(0,0,0,0.95)");
      return g;
    },
    layout: "bottom",
  },
  {
    // Variação 2: Fundo claro, texto escuro — estilo clean editorial
    name: "Clean Light",
    getBg: (ref) => ref?.backgrounds?.[0] || "#f5f0e8",
    getTextColor: () => "#111111",
    getAccent: (ref) => ref?.accentColors?.[0] || "#1a1a1a",
    getOverlay: (ctx, W, H) => {
      const g = ctx.createLinearGradient(0, H * 0.3, 0, H);
      g.addColorStop(0, "rgba(245,240,232,0)");
      g.addColorStop(0.5, "rgba(245,240,232,0.7)");
      g.addColorStop(1, "rgba(245,240,232,0.98)");
      return g;
    },
    layout: "bottom",
  },
  {
    // Variação 3: Cor de destaque, alto contraste
    name: "Bold Color",
    getBg: (ref) => ref?.backgrounds?.[1] || "#1a1a2e",
    getTextColor: () => "#ffffff",
    getAccent: () => "#f5c518",
    getOverlay: (ctx, W, H) => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(0.5, "rgba(0,0,0,0.6)");
      g.addColorStop(1, "rgba(0,0,0,0.97)");
      return g;
    },
    layout: "bottom",
  },
];

function fitFontSize(ctx, text, fontBase, maxWidth, maxSize, minSize) {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `${fontBase.replace("SIZE", size)}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim());
      line = w + " ";
    } else line = test;
  }
  if (line) lines.push(line.trim());
  const limited = lines.slice(0, maxLines);
  limited.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return limited.length;
}

function drawCreative(canvas, data, themeIndex, styleRef) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const theme = THEMES[themeIndex];
  const PAD = W * 0.08;

  ctx.clearRect(0, 0, W, H);

  const variation = data.variations?.[themeIndex];
  const headline = variation?.headline || data.headline || "Headline aqui";
  const sub = variation?.subheadline || data.subheadline || "";
  const cta = variation?.cta || data.cta || "SAIBA MAIS";

  const bgColor = theme.getBg(styleRef);
  const textColor = theme.getTextColor(styleRef);
  const accentColor = theme.getAccent(styleRef);

  // 1. Background sólido
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);

  const finishDrawing = () => {
    // 3. Overlay gradiente
    const overlay = theme.getOverlay(ctx, W, H);
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, W, H);

    const bottomY = H * 0.58;

    // 4. Handle no topo
    if (styleRef?.handle) {
      ctx.font = `600 ${W * 0.03}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = themeIndex === 1 ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.5)";
      ctx.textAlign = "left";
      ctx.fillText(styleRef.handle, PAD, W * 0.065);
    }

    // 5. Headline — auto-ajusta tamanho
    ctx.textAlign = "left";
    const maxHeadlineW = W - PAD * 2;

    // Calcula tamanho da fonte para caber
    const isSerif = styleRef?.typography?.includes("serif") || styleRef?.typography?.includes("mixed");
    const fontFamily = isSerif ? "Playfair Display, Georgia, serif" : "Clash Display, sans-serif";

    let fontSize = W * 0.095;
    const minFontSize = W * 0.045;

    // Reduz até caber em 3 linhas
    while (fontSize > minFontSize) {
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      const words = headline.split(" ");
      let lines = 1, line = "";
      for (const w of words) {
        const test = line + w + " ";
        if (ctx.measureText(test).width > maxHeadlineW && line) { lines++; line = w + " "; }
        else line = test;
      }
      if (lines <= 3) break;
      fontSize -= 2;
    }

    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;

    const lineH = fontSize * 1.18;
    const linesDrawn = drawWrappedText(ctx, headline, PAD, bottomY, maxHeadlineW, lineH, 3);
    let currentY = bottomY + linesDrawn * lineH + W * 0.03;

    // 6. Subheadline
    if (sub && currentY < H * 0.85) {
      let subSize = W * 0.038;
      ctx.font = `${subSize}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = themeIndex === 1 ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.75)";
      drawWrappedText(ctx, sub, PAD, currentY, maxHeadlineW, subSize * 1.4, 2);
      currentY += subSize * 1.4 * 2 + W * 0.04;
    }

    // 7. CTA
    if (currentY < H * 0.94) {
      const ctaSize = W * 0.032;
      ctx.font = `800 ${ctaSize}px Cabinet Grotesk, sans-serif`;
      const ctaW = ctx.measureText(cta).width + PAD;
      const ctaH = ctaSize * 1.8;
      const ctaY = Math.min(currentY, H * 0.91 - ctaH);

      // Botão CTA
      ctx.fillStyle = accentColor;
      roundRect(ctx, PAD, ctaY, ctaW, ctaH, 6);

      // Texto CTA
      const ctaTextColor = themeIndex === 1 ? "#ffffff" : (accentColor === "#f5c518" ? "#000000" : "#ffffff");
      ctx.fillStyle = ctaTextColor;
      ctx.textAlign = "center";
      ctx.fillText(cta, PAD + ctaW / 2, ctaY + ctaH * 0.65);
    }

    // 8. Marca d'água de texto nas laterais (estilo editorial)
    if (styleRef?.hasTextWatermark) {
      ctx.save();
      ctx.font = `700 ${W * 0.022}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = themeIndex === 1 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
      ctx.textAlign = "left";
      const wText = headline.toUpperCase();
      for (let i = 0; i < 7; i++) {
        ctx.fillText(wText, -W * 0.01, H * 0.42 + i * W * 0.032);
      }
      ctx.restore();
    }
  };

  // 2. Foto do expert
  if (data.expertImage) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Posiciona foto na parte superior
      const targetH = H * 0.65;
      const scale = Math.max(W / img.width, targetH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (W - dw) / 2;
      ctx.drawImage(img, dx, 0, dw, dh);
      finishDrawing();
    };
    img.onerror = finishDrawing;
    img.src = data.expertImage;
  } else {
    // Fundo texturizado sem foto
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, bgColor);
    grad.addColorStop(1, shadeColor(bgColor, themeIndex === 1 ? -20 : 20));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    finishDrawing();
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function shadeColor(hex, amount) {
  if (!hex?.startsWith("#")) return hex || "#111";
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function fileToDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

const FORMATS = [
  { id: "feed", label: "Feed 4:5", w: 4, h: 5 },
  { id: "story", label: "Story 9:16", w: 9, h: 16 },
  { id: "square", label: "Quad 1:1", w: 1, h: 1 },
];

const PROXY_URL = "https://scintillating-nourishment-production-db0b.up.railway.app";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const I = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
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

// ─── UPLOAD ZONE ──────────────────────────────────────────────────────────────
function UploadZone({ label, preview, onFile }) {
  const ref = useRef();
  return (
    <div className={`upload-zone ${preview ? "has-file" : ""}`} onClick={() => ref.current.click()}>
      <input ref={ref} type="file" accept="image/*" onChange={e => e.target.files[0] && onFile(e.target.files[0])} onClick={e => e.stopPropagation()} />
      {preview
        ? <img src={preview} alt="preview" />
        : <><I d={ic.upload} size={24} /><strong style={{ fontSize: 12, color: "var(--text)" }}>{label}</strong><span>Clique ou arraste</span></>
      }
    </div>
  );
}

// ─── CREATIVE CARD ────────────────────────────────────────────────────────────
function CreativeCard({ creative, index, styleRef, onDownload, onDelete, onDuplicate }) {
  const canvasRef = useRef();
  const format = FORMATS.find(f => f.id === creative.format) || FORMATS[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const SCALE = 2;
    canvas.width = CANVAS_W * SCALE;
    canvas.height = CANVAS_W * (format.h / format.w) * SCALE;
    const ctx = canvas.getContext("2d");
    ctx.scale(SCALE, SCALE);
    drawCreative(canvas, creative, index, styleRef);
  }, [creative, index, styleRef, format]);

  const variation = creative.variations?.[index];

  return (
    <div className="creative-card">
      <div className="canvas-wrap">
        <canvas ref={canvasRef} />
        <div className="var-badge">Variação {index + 1}</div>
      </div>
      <div className="creative-footer">
        <div>
          <div className="creative-name">{variation?.name || `Criativo ${index + 1}`}</div>
          <div className="ctags">
            <span className="ctag">{format.label}</span>
            <span className="ctag">{THEMES[index].name}</span>
            <span className="ctag">{variation?.angle || "copy"}</span>
          </div>
        </div>
        <div className="cactions">
          <div className="ibtn" title="Duplicar" onClick={() => onDuplicate(creative)}><I d={ic.copy} size={13} /></div>
          <div className="ibtn" title="Download PNG" onClick={() => onDownload(canvasRef.current, variation?.name || `criativo-${index + 1}`)}><I d={ic.dl} size={13} /></div>
          <div className="ibtn d" title="Excluir" onClick={() => onDelete(index)}><I d={ic.trash} size={13} /></div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
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

  const [styleRef, setStyleRef] = useState(null);
  const [styleDesc, setStyleDesc] = useState("");
  const [creatives, setCreatives] = useState([]);
  const [library, setLibrary] = useState([]);

  const addRefInput = useRef();

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleExpert = async (file) => {
    setExpertPreview(await fileToDataURL(file));
    showToast("Foto carregada!");
  };

  const handleAddRefs = async (files) => {
    const arr = await Promise.all(Array.from(files).map(async f => ({
      preview: await fileToDataURL(f),
      base64: await fileToBase64(f),
    })));
    setReferences(prev => [...prev, ...arr].slice(0, 6));
    showToast(`${files.length} referência(s) adicionada(s)!`);
  };

  const analyzeRefs = async () => {
    if (!references.length) return null;
    try {
      const imageContents = references.slice(0, 3).map(r => ({
        type: "image",
        source: { type: "base64", media_type: "image/jpeg", data: r.base64 },
      }));
      const res = await fetch(`${PROXY_URL}/api/claude`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{
            role: "user",
            content: [
              ...imageContents,
              {
                type: "text",
                text: `Analise o estilo visual dessas referências de criativos para tráfego pago.
Responda SOMENTE em JSON válido sem markdown:
{
  "backgrounds": ["#hexcolor1","#hexcolor2"],
  "textColors": ["#hexcolor"],
  "accentColors": ["#hexcolor"],
  "typography": "serif|sans|mixed",
  "hasTextWatermark": true|false,
  "handle": "@handle se visível ou string vazia",
  "credential": "credencial se visível ou string vazia",
  "styleDescription": "descrição do estilo em português máx 60 chars"
}`,
              },
            ],
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

  const generateCopy = async (guide) => {
    try {
      const res = await fetch(`${PROXY_URL}/api/claude`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{
            role: "user",
            content: `Expert em copywriting para lançamentos digitais no Brasil.

COPY BASE:
Headline: ${headline}
Sub: ${subheadline || "não informado"}
CTA: ${cta || "não informado"}
Formato: ${format}

Gere 3 variações de copy. Cada headline deve ter NO MÁXIMO 50 caracteres.
Responda SOMENTE em JSON válido:
{
  "variations": [
    {"name":"string","headline":"string máx 50 chars","subheadline":"string máx 65 chars","cta":"string máx 20 chars MAIÚSCULAS","angle":"urgência"},
    {"name":"string","headline":"string máx 50 chars","subheadline":"string máx 65 chars","cta":"string máx 20 chars MAIÚSCULAS","angle":"benefício"},
    {"name":"string","headline":"string máx 50 chars","subheadline":"string máx 65 chars","cta":"string máx 20 chars MAIÚSCULAS","angle":"prova social"}
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

  const handleGenerate = async () => {
    if (!headline) return showToast("Preencha a headline!", "error");
    setGenerating(true);
    setProgress(0);

    try {
      const steps = [
        [20, "Analisando referências com IA..."],
        [45, "Extraindo paleta e tipografia..."],
        [65, "Gerando variações de copy..."],
        [85, "Montando os criativos..."],
        [100, "Finalizando..."],
      ];

      let guide = null;
      let copyData = null;

      for (let i = 0; i < steps.length; i++) {
        setProgress(steps[i][0]);
        setStep(steps[i][1]);

        if (i === 0) {
          guide = await analyzeRefs();
          if (guide) { setStyleRef(guide); setStyleDesc(guide.styleDescription || ""); }
        } else if (i === 2) {
          copyData = await generateCopy(guide);
        } else {
          await new Promise(r => setTimeout(r, 400));
        }
      }

      // Fallback style
      if (!guide) {
        guide = {
          backgrounds: ["#f5f0e8", "#1a1a2e"],
          textColors: ["#111111"],
          accentColors: ["#ff5c28"],
          typography: "mixed",
          hasTextWatermark: false,
          handle: "",
          credential: "",
          styleDescription: "Editorial moderno",
        };
        setStyleRef(guide);
      }

      // Fallback copy
      const defaultVariations = [
        { name: "Urgência", headline: headline.slice(0, 50), subheadline: subheadline || "Não perca essa oportunidade", cta: cta || "QUERO PARTICIPAR", angle: "urgência" },
        { name: "Benefício", headline: headline.slice(0, 50), subheadline: subheadline || "Descubra como transformar sua vida", cta: cta || "SAIBA MAIS", angle: "benefício" },
        { name: "Prova Social", headline: headline.slice(0, 50), subheadline: subheadline || "Mais de 10 mil pessoas já mudaram", cta: cta || "VER HISTÓRIAS", angle: "prova social" },
      ];

      const creative = {
        headline,
        subheadline,
        cta,
        format,
        expertImage: expertPreview,
        variations: copyData?.variations || defaultVariations,
        id: Date.now(),
        createdAt: new Date().toLocaleString("pt-BR"),
      };

      setCreatives([creative]);
      setLibrary(prev => [creative, ...prev]);
      showToast("3 criativos gerados! 🎉");
    } catch (e) {
      showToast("Erro ao gerar. Tente novamente.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (canvas, name) => {
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${name}.png`;
    a.click();
    showToast("Download iniciado!");
  };

  const handleDelete = (idx) => {
    setCreatives(prev => {
      const c = { ...prev[0] };
      c.variations = c.variations.filter((_, i) => i !== idx);
      return [c];
    });
  };

  const creative = creatives[0];
  const variations = creative?.variations || [];

  return (
    <>
      <style>{style}</style>

      {generating && (
        <div className="overlay">
          <div className="overlay-logo">LaunchAds AI</div>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Analisando referências e gerando criativos...</p>
          <div className="pbar"><div className="pfill" style={{ width: `${progress}%` }} /></div>
          <div className="pstep">{step}</div>
          <div style={{ fontSize: 11, color: "var(--border)" }}>{progress}%</div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          <I d={toast.type === "success" ? ic.check : ic.x} size={14} />
          {toast.msg}
        </div>
      )}

      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-text">LaunchAds AI</div>
            <div className="logo-sub">Criativos que convertem</div>
          </div>
          {[
            { id: "create", icon: ic.spark, label: "Criar Criativo" },
            { id: "library", icon: ic.grid, label: "Biblioteca" },
          ].map(item => (
            <div key={item.id} className={`nav-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
              <I d={item.icon} size={15} />{item.label}
            </div>
          ))}
          <div className="sidebar-footer">
            <div style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))", borderRadius: 10, padding: 12, fontSize: 12, fontWeight: 700, color: "white" }}>
              <div style={{ fontSize: 10, opacity: .8, marginBottom: 2 }}>PLANO PRO</div>
              Criativos ilimitados
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
                    <p>Suba referências — a IA analisa o estilo e replica nos seus criativos</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(255,92,40,.1)", color: "var(--accent)", border: "1px solid rgba(255,92,40,.2)" }}>
                    <I d={ic.spark} size={12} /> Claude Vision
                  </div>
                </div>

                <div className="grid-2">
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    <div className="card">
                      <div className="card-title"><span className="num">01</span> Foto do Expert</div>
                      <UploadZone label="Upload da foto do expert" preview={expertPreview} onFile={handleExpert} />
                    </div>

                    <div className="card">
                      <div className="card-title"><span className="num">02</span> Referências de Design</div>
                      <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>
                        Suba criativos que você gosta — a IA vai extrair as cores, tipografia e layout.
                      </p>
                      <div className="refs-grid">
                        {references.map((r, i) => (
                          <div className="ref-thumb" key={i}>
                            <img src={r.preview} alt="" />
                            <div className="ref-remove" onClick={() => setReferences(prev => prev.filter((_, j) => j !== i))}>✕</div>
                          </div>
                        ))}
                        {references.length < 6 && (
                          <div className="add-ref" onClick={() => addRefInput.current.click()}>
                            <input ref={addRefInput} type="file" accept="image/*" multiple onChange={e => handleAddRefs(e.target.files)} />
                            +
                          </div>
                        )}
                      </div>
                      {styleDesc && (
                        <div className="style-tag">
                          <I d={ic.spark} size={11} /> {styleDesc}
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
                      <input className="form-input" placeholder="Ex: Você ainda sente dor e acha normal?" value={headline} onChange={e => setHeadline(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subheadline</label>
                      <input className="form-input" placeholder="Ex: Fisioterapeuta revela método que mudou tudo" value={subheadline} onChange={e => setSubheadline(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CTA</label>
                      <input className="form-input" placeholder="Ex: LEIA A LEGENDA" value={cta} onChange={e => setCta(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Copy Completa</label>
                      <textarea className="form-textarea" placeholder="Cole a copy completa aqui..." value={copy} onChange={e => setCopy(e.target.value)} style={{ minHeight: 120 }} />
                    </div>

                    <hr className="divider" />

                    <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleGenerate} disabled={generating}>
                      <I d={ic.zap} size={15} />
                      {generating ? "Analisando e gerando..." : "Gerar 3 Criativos com IA"}
                    </button>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
                      3 variações com temas diferentes: Dark, Light e Bold
                    </p>
                  </div>
                </div>

                {variations.length > 0 && (
                  <>
                    <hr className="divider" />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <h2 style={{ fontFamily: "Clash Display", fontSize: 18, fontWeight: 700 }}>Criativos Gerados</h2>
                        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>3 variações — Dark, Light e Bold Color</p>
                      </div>
                      <button className="btn btn-ghost" onClick={handleGenerate}>
                        <I d={ic.refresh} size={13} />Regerar
                      </button>
                    </div>
                    <div className="creatives-grid">
                      {variations.map((_, i) => (
                        <CreativeCard
                          key={i}
                          creative={creative}
                          index={i}
                          styleRef={styleRef}
                          onDownload={handleDownload}
                          onDelete={handleDelete}
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
                <div className="empty">
                  <I d={ic.grid} size={40} />
                  <h3>Nenhum criativo ainda</h3>
                  <p>Crie seu primeiro criativo para aparecer aqui</p>
                  <button className="btn btn-primary" style={{ margin: "20px auto 0", display: "flex" }} onClick={() => setTab("create")}>Criar Agora</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 16 }}>
                  {library.map((c, i) => (
                    <div key={c.id || i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}
                      onClick={() => { setCreatives([c]); setStyleRef(styleRef); setTab("create"); }}>
                      <div style={{ aspectRatio: "4/5", background: "var(--surface2)", position: "relative", overflow: "hidden" }}>
                        {c.expertImage && <img src={c.expertImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .7 }} />}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent,rgba(0,0,0,.85))", display: "flex", alignItems: "flex-end", padding: 12 }}>
                          <div style={{ fontFamily: "Clash Display", fontSize: 12, fontWeight: 700, color: "white", lineHeight: 1.3 }}>
                            {(c.headline || "").slice(0, 45)}
                          </div>
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
