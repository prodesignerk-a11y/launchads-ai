import { useState, useRef, useCallback, useEffect } from "react";

const style = `
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
  .style-detected strong { color: var(--accent); display: block; margin-bottom: 4px; }

  .generate-bar { background: linear-gradient(135deg, var(--surface), rgba(255,92,40,.05)); border: 1px solid var(--border); border-radius: 14px; padding: 22px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 16px; }
  .generate-bar h3 { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .generate-bar p { color: var(--muted); font-size: 12px; }

  .creatives-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .creative-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: all .25s; }
  .creative-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.5); }
  .canvas-wrap { position: relative; }
  .canvas-wrap canvas { display: block; width: 100%; height: auto; }
  .var-badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.75); backdrop-filter: blur(6px); border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: white; }
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

const PROXY_URL = "https://scintillating-nourishment-production-db0b.up.railway.app";
const CANVAS_W = 420;

// ─── CANVAS ENGINE ────────────────────────────────────────────────────────────
function drawCreative(canvas, data, variationIndex, styleGuide) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const PAD = W * 0.07;

  const variation = data.variations?.[variationIndex] || {};
  const headline = variation.headline || data.headline || "";
  const sub = variation.subheadline || data.subheadline || "";
  const cta = variation.cta || data.cta || "SAIBA MAIS";

  // Style from AI analysis
  const S = styleGuide || {};
  const bg = S.bgColor || "#f0ece4";
  const textColor = S.textColor || "#111111";
  const accentColor = S.accentColor || "#ff5c28";
  const isLight = isLightColor(bg);
  const useSerif = S.usesSerif !== false;
  const textPosition = S.textPosition || "middle"; // top | middle | bottom
  const overlayStrength = S.overlayStrength || 0.5; // 0-1
  const hasWatermark = S.hasWatermark || false;
  const handle = S.handle || "";
  const credential = S.credential || "";
  const ctaStyle = S.ctaStyle || "text"; // text | button | underline

  ctx.clearRect(0, 0, W, H);

  // 1. Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const renderTexts = () => {
    // 2. Overlay — only if needed based on style
    if (overlayStrength > 0 && data.expertImage) {
      const gradY1 = textPosition === "top" ? 0 : textPosition === "middle" ? H * 0.2 : H * 0.35;
      const gradY2 = textPosition === "top" ? H * 0.6 : H;
      const grad = ctx.createLinearGradient(0, gradY1, 0, gradY2);
      const alpha1 = textPosition === "middle" ? overlayStrength * 0.3 : 0;
      const alpha2 = overlayStrength;
      const overlayColor = isLight ? `rgba(245,240,232,${alpha2})` : `rgba(0,0,0,${alpha2})`;
      grad.addColorStop(0, `rgba(0,0,0,${alpha1})`);
      grad.addColorStop(1, overlayColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    // 3. Handle top-left & credential top-right
    if (handle || credential) {
      const metaSize = W * 0.028;
      ctx.font = `600 ${metaSize}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.55)";
      if (handle) { ctx.textAlign = "left"; ctx.fillText(handle, PAD, W * 0.07); }
      if (credential) { ctx.textAlign = "right"; ctx.fillText(credential, W - PAD, W * 0.07); }
    }

    // 4. Text Y position based on style
    let textStartY;
    if (textPosition === "top") textStartY = H * 0.18;
    else if (textPosition === "middle") textStartY = H * 0.32;
    else textStartY = H * 0.56;

    // 5. Small intro line (like "Você já percebeu como a gente • sempre tende a")
    if (sub && textPosition !== "bottom") {
      const introSize = W * 0.038;
      ctx.font = `400 ${introSize}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.75)";
      ctx.textAlign = "left";
      // Wrap sub into max 2 lines
      const subLines = wrapLines(ctx, sub, W - PAD * 2);
      subLines.slice(0, 2).forEach((line, i) => {
        ctx.fillText(line, PAD, textStartY + i * introSize * 1.4);
      });
      textStartY += subLines.slice(0, 2).length * introSize * 1.4 + introSize * 0.5;
    }

    // 6. Big headline
    ctx.textAlign = "left";
    const serifFont = "Playfair Display, Georgia, serif";
    const sansFont = "Clash Display, sans-serif";

    // Calculate font size to fill the space nicely
    const maxW = W - PAD * 2;
    let headFontSize = W * 0.13;
    const minSize = W * 0.055;

    while (headFontSize > minSize) {
      ctx.font = `bold ${headFontSize}px ${useSerif ? serifFont : sansFont}`;
      const lines = wrapLines(ctx, headline, maxW);
      if (lines.length <= 3) break;
      headFontSize -= 3;
    }

    ctx.font = `bold ${headFontSize}px ${useSerif ? serifFont : sansFont}`;
    ctx.fillStyle = textColor;

    const headLines = wrapLines(ctx, headline, maxW);
    const lineH = headFontSize * 1.12;

    headLines.slice(0, 3).forEach((line, i) => {
      // Italic for even lines if serif (like reference)
      if (useSerif && i % 2 === 1) {
        ctx.font = `italic bold ${headFontSize}px ${serifFont}`;
      } else {
        ctx.font = `bold ${headFontSize}px ${useSerif ? serifFont : sansFont}`;
      }
      ctx.fillText(line, PAD, textStartY + i * lineH);
    });

    const afterHead = textStartY + headLines.slice(0, 3).length * lineH;

    // 7. Sub below headline (if bottom layout)
    if (sub && textPosition === "bottom") {
      const subSize = W * 0.036;
      ctx.font = `400 ${subSize}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.7)";
      const subLines = wrapLines(ctx, sub, maxW);
      subLines.slice(0, 2).forEach((line, i) => {
        ctx.fillText(line, PAD, afterHead + W * 0.04 + i * subSize * 1.4);
      });
    }

    // 8. CTA
    const ctaY = H * 0.9;
    const ctaSize = W * 0.03;
    ctx.font = `700 ${ctaSize}px Cabinet Grotesk, sans-serif`;

    if (ctaStyle === "button") {
      const ctaW = ctx.measureText(cta).width + PAD * 0.8;
      const ctaH = ctaSize * 1.9;
      ctx.fillStyle = accentColor;
      roundRect(ctx, PAD, ctaY - ctaH * 0.7, ctaW, ctaH, 5);
      ctx.fillStyle = isLightColor(accentColor) ? "#000" : "#fff";
      ctx.textAlign = "center";
      ctx.fillText(cta, PAD + ctaW / 2, ctaY + ctaH * 0.25);
    } else if (ctaStyle === "underline") {
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.65)";
      ctx.textAlign = "center";
      ctx.fillText(cta, W / 2, ctaY);
      const tw = ctx.measureText(cta).width;
      ctx.beginPath();
      ctx.moveTo(W / 2 - tw / 2, ctaY + 3);
      ctx.lineTo(W / 2 + tw / 2, ctaY + 3);
      ctx.strokeStyle = isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Plain text CTA
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.6)";
      ctx.textAlign = "center";
      ctx.fillText(cta, W / 2, ctaY);
    }

    // 9. Watermark text (like reference)
    if (hasWatermark) {
      ctx.save();
      const wmSize = W * 0.02;
      ctx.font = `700 ${wmSize}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.055)" : "rgba(255,255,255,0.055)";
      ctx.textAlign = "left";
      const wm = headline.toUpperCase();
      // Left side
      ctx.save();
      ctx.translate(wmSize, H * 0.45);
      ctx.rotate(-Math.PI / 2);
      for (let i = 0; i < 5; i++) ctx.fillText(wm + "  ", 0, i * wmSize * 1.4);
      ctx.restore();
      // Right side
      ctx.save();
      ctx.translate(W - wmSize * 0.5, H * 0.7);
      ctx.rotate(-Math.PI / 2);
      for (let i = 0; i < 5; i++) ctx.fillText(wm + "  ", 0, i * wmSize * 1.4);
      ctx.restore();
      ctx.restore();
    }
  };

  // Draw expert photo
  if (data.expertImage) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = Math.max(W / img.width, H / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (W - dw) / 2;
      const dy = (H - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      renderTexts();
    };
    img.onerror = renderTexts;
    img.src = data.expertImage;
  } else {
    // Gradient bg without photo
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, bg);
    grad.addColorStop(1, shadeColor(bg, isLight ? -25 : 25));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    renderTexts();
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function wrapLines(ctx, text, maxWidth) {
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
  if (line.trim()) lines.push(line.trim());
  return lines;
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

function isLightColor(hex) {
  if (!hex?.startsWith("#")) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 145;
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

// ─── ICONS ────────────────────────────────────────────────────────────────────
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
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
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
function CreativeCard({ creative, index, styleGuide, onDownload, onDelete, onDuplicate }) {
  const canvasRef = useRef();
  const format = FORMATS.find(f => f.id === creative.format) || FORMATS[0];

  // Each variation gets a slight style tweak
  const varStyle = {
    ...styleGuide,
    bgColor: index === 0
      ? (styleGuide?.bgColor || "#f0ece4")
      : index === 1
        ? shadeColor(styleGuide?.bgColor || "#f0ece4", isLightColor(styleGuide?.bgColor || "#f0ece4") ? -15 : 15)
        : (styleGuide?.bgAlt || shadeColor(styleGuide?.bgColor || "#f0ece4", isLightColor(styleGuide?.bgColor || "#f0ece4") ? -35 : 35)),
    textColor: index === 1 && isLightColor(styleGuide?.bgColor || "#f0ece4")
      ? "#ffffff"
      : (styleGuide?.textColor || "#111111"),
    overlayStrength: index === 0 ? (styleGuide?.overlayStrength || 0.45) : index === 1 ? 0.6 : 0.7,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_W * (format.h / format.w);
    drawCreative(canvas, creative, index, varStyle);
  }, [creative, index, styleGuide, format]);

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
            <span className="ctag">{variation?.angle || "copy"}</span>
          </div>
        </div>
        <div className="cactions">
          <div className="ibtn" onClick={() => onDuplicate(creative)}><I d={ic.copy} size={13} /></div>
          <div className="ibtn" onClick={() => onDownload(canvasRef.current, variation?.name || `criativo-${index + 1}`)}><I d={ic.dl} size={13} /></div>
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
      const imgs = references.slice(0, 3).map(r => ({
        type: "image",
        source: { type: "base64", media_type: "image/jpeg", data: r.base64 },
      }));
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
                text: `Você é especialista em design de criativos para tráfego pago.
Analise DETALHADAMENTE o estilo visual dessas referências e extraia as propriedades exatas.

Responda SOMENTE em JSON válido sem markdown ou texto extra:
{
  "bgColor": "#hexcode da cor de fundo dominante",
  "bgAlt": "#hexcode variação do fundo para segunda versão",
  "textColor": "#hexcode cor principal do texto",
  "accentColor": "#hexcode cor de destaque/CTA",
  "usesSerif": true ou false (usa fonte serif no headline?),
  "textPosition": "top" ou "middle" ou "bottom" (onde o texto principal está?),
  "overlayStrength": 0.0 a 0.8 (quão forte é o overlay sobre a foto?),
  "hasWatermark": true ou false (tem texto repetido em marca d'água?),
  "ctaStyle": "text" ou "button" ou "underline" (como o CTA aparece?),
  "handle": "@handle se visível senão string vazia",
  "credential": "título/profissão se visível senão string vazia",
  "styleDescription": "descrição do estilo em português máx 80 chars"
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
Copy: ${copy || "não informada"}
Estilo detectado: ${guide?.styleDescription || "editorial clean"}

Gere 3 variações de copy. IMPORTANTE: headline máx 45 chars, sub máx 60 chars, cta máx 18 chars.
Responda SOMENTE em JSON válido:
{
  "variations": [
    {"name":"Urgência","headline":"string","subheadline":"string","cta":"MAIÚSCULAS","angle":"urgência"},
    {"name":"Benefício","headline":"string","subheadline":"string","cta":"MAIÚSCULAS","angle":"benefício"},
    {"name":"Curiosidade","headline":"string","subheadline":"string","cta":"MAIÚSCULAS","angle":"curiosidade"}
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
      const stepsConfig = [
        [15, "Analisando referências com Claude Vision..."],
        [40, "Extraindo cores, tipografia e layout..."],
        [60, "Gerando variações de copy com IA..."],
        [80, "Montando os criativos..."],
        [100, "Finalizando..."],
      ];

      let guide = null;
      let copyData = null;

      for (let i = 0; i < stepsConfig.length; i++) {
        setProgress(stepsConfig[i][0]);
        setStep(stepsConfig[i][1]);
        if (i === 0) {
          guide = await analyzeRefs();
          if (guide) { setStyleGuide(guide); setStyleDesc(guide.styleDescription || ""); }
        } else if (i === 2) {
          copyData = await generateCopy(guide);
        } else {
          await new Promise(r => setTimeout(r, 350));
        }
      }

      // Fallback
      if (!guide) {
        guide = {
          bgColor: "#f0ece4", bgAlt: "#1a1a2e",
          textColor: "#111111", accentColor: "#ff5c28",
          usesSerif: true, textPosition: "middle",
          overlayStrength: 0.45, hasWatermark: false,
          ctaStyle: "text", handle: "", credential: "",
          styleDescription: "Editorial clean com serif",
        };
        setStyleGuide(guide);
      }

      const defaultVars = [
        { name: "Urgência", headline: headline.slice(0, 45), subheadline: subheadline.slice(0, 60), cta: cta || "LEIA A LEGENDA", angle: "urgência" },
        { name: "Benefício", headline: headline.slice(0, 45), subheadline: subheadline.slice(0, 60), cta: cta || "SAIBA MAIS", angle: "benefício" },
        { name: "Curiosidade", headline: headline.slice(0, 45), subheadline: subheadline.slice(0, 60), cta: cta || "VER MAIS", angle: "curiosidade" },
      ];

      const creative = {
        headline, subheadline, cta, format,
        expertImage: expertPreview,
        variations: copyData?.variations || defaultVars,
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
                    <p>Suba referências — a IA detecta cores, tipografia e layout e replica no seu criativo</p>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(255,92,40,.1)", color: "var(--accent)", border: "1px solid rgba(255,92,40,.2)" }}>
                    <I d={ic.spark} size={12} /> Claude Vision
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
                            }} />
                            +
                          </div>
                        )}
                      </div>
                      {styleDesc && (
                        <div className="style-detected">
                          <strong>✦ Estilo detectado pela IA:</strong>
                          {styleDesc}
                          {styleGuide && (
                            <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {styleGuide.bgColor && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: styleGuide.bgColor, border: "1px solid rgba(255,255,255,.2)", display: "inline-block" }} />{styleGuide.bgColor}</span>}
                              {styleGuide.textColor && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: styleGuide.textColor, border: "1px solid rgba(255,255,255,.2)", display: "inline-block" }} />{styleGuide.textColor}</span>}
                              {styleGuide.usesSerif !== undefined && <span style={{ fontSize: 11, background: "rgba(255,255,255,.08)", padding: "2px 6px", borderRadius: 4 }}>{styleGuide.usesSerif ? "Serif" : "Sans-serif"}</span>}
                              {styleGuide.textPosition && <span style={{ fontSize: 11, background: "rgba(255,255,255,.08)", padding: "2px 6px", borderRadius: 4 }}>Texto {styleGuide.textPosition === "top" ? "no topo" : styleGuide.textPosition === "middle" ? "no meio" : "embaixo"}</span>}
                            </div>
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
                      <textarea className="form-textarea" placeholder="Cole a copy completa aqui..." value={copy} onChange={e => setCopy(e.target.value)} style={{ minHeight: 120 }} />
                    </div>
                    <hr className="divider" />
                    <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleGenerate} disabled={generating}>
                      <I d={ic.zap} size={15} />{generating ? "Analisando e gerando..." : "Gerar 3 Criativos com IA"}
                    </button>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
                      A IA detecta o estilo das referências e replica nos criativos
                    </p>
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
                          key={i}
                          creative={creative}
                          index={i}
                          styleGuide={styleGuide}
                          onDownload={handleDownload}
                          onDelete={(idx) => {
                            setCreatives(prev => {
                              const c = { ...prev[0] };
                              c.variations = c.variations.filter((_, j) => j !== idx);
                              return [c];
                            });
                          }}
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
                  {library.map((c, i) => (
                    <div key={c.id || i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}
                      onClick={() => { setCreatives([c]); setTab("create"); }}>
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
