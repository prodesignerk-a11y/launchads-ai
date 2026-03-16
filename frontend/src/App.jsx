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

  .sidebar {
    width: 230px; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 24px 0;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
  }
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
  .btn:disabled { opacity: .4; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

  .content { padding: 28px; flex: 1; }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px; }
  .card-title { font-family: 'Clash Display', sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; color: var(--text); }
  .card-title .num { color: var(--accent); }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }

  .upload-zone { border: 2px dashed var(--border); border-radius: 10px; padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all .2s; color: var(--muted); font-size: 12px; text-align: center; position: relative; overflow: hidden; min-height: 120px; justify-content: center; }
  .upload-zone:hover { border-color: var(--accent); background: rgba(255,92,40,.04); }
  .upload-zone.has-file { border-color: var(--success); border-style: solid; }
  .upload-zone img { width: 100%; max-height: 180px; object-fit: contain; border-radius: 6px; }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }

  .refs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
  .ref-thumb { aspect-ratio: 1; border-radius: 8px; overflow: hidden; position: relative; border: 1px solid var(--border); }
  .ref-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .ref-thumb .remove-btn { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; background: rgba(0,0,0,.7); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 11px; color: white; opacity: 0; transition: opacity .2s; }
  .ref-thumb:hover .remove-btn { opacity: 1; }
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
  .format-preview { margin: 0 auto 6px; background: var(--border); border-radius: 3px; transition: background .2s; }
  .format-item.active .format-preview { background: var(--accent); }

  .style-analysis {
    background: rgba(255,92,40,.06);
    border: 1px solid rgba(255,92,40,.2);
    border-radius: 10px;
    padding: 14px;
    margin-top: 10px;
    font-size: 12px;
    color: var(--muted);
    line-height: 1.6;
  }
  .style-analysis strong { color: var(--accent); }

  .generate-bar { background: linear-gradient(135deg, var(--surface), rgba(255,92,40,.05)); border: 1px solid var(--border); border-radius: 14px; padding: 22px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 16px; }
  .generate-bar h3 { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .generate-bar p { color: var(--muted); font-size: 12px; }

  .creatives-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

  .creative-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: all .25s; }
  .creative-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.5); }
  .creative-canvas-wrap { position: relative; }
  .creative-canvas-wrap canvas { display: block; width: 100%; height: auto; }
  .variation-badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.75); backdrop-filter: blur(6px); border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: white; }
  .creative-footer { padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); }
  .creative-name { font-size: 12px; font-weight: 700; }
  .creative-tags { display: flex; gap: 5px; margin-top: 3px; }
  .tag { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 700; background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
  .creative-actions { display: flex; gap: 5px; }
  .icon-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 7px; cursor: pointer; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); transition: all .2s; font-size: 13px; }
  .icon-btn:hover { color: var(--text); border-color: #555; }
  .icon-btn.danger:hover { color: #f87171; border-color: #f87171; }

  .overlay { position: fixed; inset: 0; background: rgba(10,10,15,.94); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999; gap: 16px; backdrop-filter: blur(10px); }
  .overlay-logo { font-family: 'Clash Display', sans-serif; font-size: 28px; font-weight: 700; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .progress-bar { width: 300px; height: 3px; background: var(--border); border-radius: 99px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 99px; transition: width .5s ease; }
  .overlay-step { font-size: 12px; color: var(--muted); animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }

  .toast { position: fixed; bottom: 20px; right: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; gap: 9px; font-size: 12px; z-index: 1000; box-shadow: 0 8px 30px rgba(0,0,0,.5); animation: slideIn .3s ease; }
  .toast.success { border-color: var(--success); }
  .toast.error { border-color: #f87171; }
  @keyframes slideIn { from { transform: translateX(80px); opacity:0 } to { transform: translateX(0); opacity:1 } }

  .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-state h3 { font-family: 'Clash Display', sans-serif; font-size: 18px; color: var(--text); margin-bottom: 8px; }

  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

  .chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; background: rgba(255,92,40,.1); color: var(--accent); border: 1px solid rgba(255,92,40,.2); }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

const FORMATS = [
  { id: "feed",   label: "Feed 4:5",   w: 4, h: 5 },
  { id: "story",  label: "Story 9:16", w: 9, h: 16 },
  { id: "square", label: "Quad 1:1",   w: 1, h: 1 },
];

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Draw creative on canvas based on AI style analysis
function drawCreativeFromStyle(canvas, data, styleGuide, variationIndex) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const s = styleGuide;
  const bg = s.backgrounds?.[variationIndex % (s.backgrounds?.length || 1)] || "#f5f5f0";
  const textColor = s.textColors?.[0] || "#111111";
  const accentColor = s.accentColors?.[0] || "#ff5c28";
  const layout = s.layouts?.[variationIndex % (s.layouts?.length || 1)] || "centered";
  const typography = s.typography || "serif-bold";

  // BG
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Expert image
  const drawTexts = () => {
    const headline = data.variations?.[variationIndex]?.headline || data.headline || "";
    const sub = data.variations?.[variationIndex]?.subheadline || data.subheadline || "";
    const cta = data.variations?.[variationIndex]?.cta || data.cta || "SAIBA MAIS";
    const handle = s.handle || "";
    const credential = s.credential || "";

    const pad = W * 0.08;
    const isLight = isLightColor(bg);

    // Handle top left
    if (handle) {
      ctx.font = `600 ${W * 0.028}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
      ctx.textAlign = "left";
      ctx.fillText(handle, pad, W * 0.07);
    }
    if (credential) {
      ctx.font = `600 ${W * 0.028}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
      ctx.textAlign = "right";
      ctx.fillText(credential, W - pad, W * 0.07);
    }

    if (layout === "editorial-top" || layout === "centered") {
      // Big editorial headline in upper portion
      const headlineY = H * 0.28;
      drawEditorialHeadline(ctx, headline, W, H, headlineY, pad, textColor, accentColor, typography, s);

      // Subheadline
      if (sub) {
        ctx.font = `${W * 0.038}px Cabinet Grotesk, sans-serif`;
        ctx.fillStyle = isLight ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.65)";
        ctx.textAlign = "left";
        wrapText(ctx, sub, pad, H * 0.72, W - pad * 2, W * 0.048);
      }

      // Repeating text watermark (like reference)
      if (s.hasTextWatermark) {
        drawTextWatermark(ctx, headline, W, H, isLight);
      }

      // CTA at bottom
      ctx.font = `700 ${W * 0.03}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)";
      ctx.textAlign = "center";
      ctx.fillText(cta.toUpperCase(), W / 2, H * 0.92);

    } else if (layout === "bottom-heavy") {
      // Image fills top, text at bottom with overlay
      const overlayGrad = ctx.createLinearGradient(0, H * 0.4, 0, H);
      overlayGrad.addColorStop(0, "rgba(0,0,0,0)");
      overlayGrad.addColorStop(0.6, `${hexToRgba(bg, 0.9)}`);
      overlayGrad.addColorStop(1, `${hexToRgba(bg, 1)}`);
      ctx.fillStyle = overlayGrad;
      ctx.fillRect(0, H * 0.4, W, H * 0.6);

      drawEditorialHeadline(ctx, headline, W, H, H * 0.62, pad, textColor, accentColor, typography, s);

      if (sub) {
        ctx.font = `${W * 0.034}px Cabinet Grotesk, sans-serif`;
        ctx.fillStyle = isLight ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)";
        ctx.textAlign = "left";
        ctx.fillText(sub.slice(0, 60), pad, H * 0.82);
      }

      ctx.font = `700 ${W * 0.028}px Cabinet Grotesk, sans-serif`;
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)";
      ctx.textAlign = "center";
      ctx.fillText(cta.toUpperCase(), W / 2, H * 0.93);
    }
  };

  if (data.expertImage) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw expert photo integrated naturally
      if (layout === "bottom-heavy" || layout === "editorial-top") {
        // Fill upper portion
        const iRatio = img.width / img.height;
        const targetH = H * 0.65;
        const targetW = W;
        const scale = Math.max(targetW / img.width, targetH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (W - dw) / 2, 0, dw, Math.min(dh, targetH));
      } else {
        // Centered, covering
        const iRatio = img.width / img.height;
        const cRatio = W / H;
        let dw, dh, dx, dy;
        if (iRatio > cRatio) { dh = H; dw = dh * iRatio; dx = (W - dw) / 2; dy = 0; }
        else { dw = W; dh = dw / iRatio; dx = 0; dy = (H - dh) / 2; }
        ctx.drawImage(img, dx, dy, dw, dh);
      }
      drawTexts();
    };
    img.onerror = drawTexts;
    img.src = data.expertImage;
  } else {
    // Subtle texture bg
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, bg);
    grad.addColorStop(1, shadeColor(bg, -15));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    drawTexts();
  }
}

function drawEditorialHeadline(ctx, headline, W, H, startY, pad, textColor, accentColor, typography, styleGuide) {
  const words = headline.split(" ");
  const isSerif = typography.includes("serif");
  const isMixed = typography.includes("mixed");
  const isBold = typography.includes("bold");
  const fontSize = W * (headline.length < 20 ? 0.11 : headline.length < 35 ? 0.082 : 0.065);

  // Mixed typography like reference (some words serif italic, others sans bold)
  if (isMixed && words.length > 2) {
    ctx.textAlign = "left";
    let currentX = pad;
    let currentY = startY;
    const lineHeight = fontSize * 1.15;
    const maxW = W - pad * 2;

    // First smaller line
    const firstPart = words.slice(0, Math.min(4, Math.floor(words.length / 2))).join(" ");
    ctx.font = `400 ${fontSize * 0.5}px Cabinet Grotesk, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.fillText(firstPart, pad, currentY);
    currentY += fontSize * 0.65;

    // Big serif line
    const bigPart = words.slice(Math.min(4, Math.floor(words.length / 2))).join(" ");
    const bigFontSize = fontSize * 1.1;
    const lines = splitIntoLines(ctx, bigPart, `bold ${bigFontSize}px Playfair Display, Georgia, serif`, maxW);
    lines.forEach((line, i) => {
      // Alternate: first line normal, second italic
      if (i % 2 === 1) {
        ctx.font = `italic bold ${bigFontSize}px Playfair Display, Georgia, serif`;
      } else {
        ctx.font = `bold ${bigFontSize}px Playfair Display, Georgia, serif`;
      }
      ctx.fillStyle = textColor;
      ctx.fillText(line, pad, currentY + i * (bigFontSize * 1.1));
    });
  } else {
    // Clean big headline
    ctx.textAlign = "left";
    const fontStr = isSerif
      ? `bold ${fontSize}px Playfair Display, Georgia, serif`
      : `700 ${fontSize}px Clash Display, sans-serif`;
    const lines = splitIntoLines(ctx, headline, fontStr, W - pad * 2);
    lines.slice(0, 4).forEach((line, i) => {
      if (isSerif && i % 2 === 1) {
        ctx.font = `italic bold ${fontSize}px Playfair Display, Georgia, serif`;
      } else {
        ctx.font = fontStr;
      }
      ctx.fillStyle = textColor;
      ctx.fillText(line, pad, startY + i * (fontSize * 1.15));
    });
  }

  // Decorative dot element (like reference)
  if (styleGuide?.hasDecorativeDot) {
    ctx.beginPath();
    ctx.arc(W * 0.62, startY - fontSize * 0.3, W * 0.015, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.fill();
  }
}

function drawTextWatermark(ctx, text, W, H, isLight) {
  const wText = (text || "").toUpperCase();
  ctx.save();
  ctx.font = `700 ${W * 0.022}px Cabinet Grotesk, sans-serif`;
  ctx.fillStyle = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
  ctx.textAlign = "left";

  // Left column watermark
  const lineH = W * 0.03;
  let y = H * 0.45;
  for (let i = 0; i < 8; i++) {
    ctx.fillText(wText, -W * 0.02, y + i * lineH);
  }

  // Right column watermark
  ctx.textAlign = "right";
  for (let i = 0; i < 8; i++) {
    ctx.fillText(wText, W + W * 0.02, y + i * lineH + lineH * 0.5);
  }
  ctx.restore();
}

function splitIntoLines(ctx, text, font, maxWidth) {
  ctx.font = font;
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const w of words) {
    const test = current + w + " ";
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current.trim());
      current = w + " ";
    } else current = test;
  }
  if (current) lines.push(current.trim());
  return lines;
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const lines = [];
  const words = text.split(" ");
  let line = "";
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxW && line) { lines.push(line.trim()); line = w + " "; }
    else line = test;
  }
  if (line) lines.push(line.trim());
  lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
}

function isLightColor(hex) {
  if (!hex || !hex.startsWith("#")) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function hexToRgba(hex, alpha) {
  if (!hex || !hex.startsWith("#")) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function shadeColor(hex, percent) {
  if (!hex || !hex.startsWith("#")) return hex;
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ICONS
const Ico = {
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  dl: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  copy: "M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  sparkle: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  layout: "M3 3h18v18H3zM3 9h18M9 21V9",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
};

const I = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// UPLOAD ZONE
function UploadZone({ label, preview, onFile, accept = "image/*" }) {
  const ref = useRef();
  return (
    <div className={`upload-zone ${preview ? "has-file" : ""}`} onClick={() => ref.current.click()}>
      <input ref={ref} type="file" accept={accept} onChange={e => e.target.files[0] && onFile(e.target.files[0])} onClick={e => e.stopPropagation()} />
      {preview ? <img src={preview} alt="preview" /> : (
        <>
          <I d={Ico.upload} size={24} />
          <strong style={{ fontSize: 12, color: "var(--text)" }}>{label}</strong>
          <span>Clique ou arraste</span>
        </>
      )}
    </div>
  );
}

// CREATIVE CARD
function CreativeCard({ creative, index, styleGuide, onDownload, onDelete, onDuplicate }) {
  const canvasRef = useRef();
  const format = FORMATS.find(f => f.id === creative.format) || FORMATS[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !styleGuide) return;
    const SCALE = 2;
    const BASE = 380;
    canvas.width = BASE * SCALE;
    canvas.height = BASE * (format.h / format.w) * SCALE;
    const ctx = canvas.getContext("2d");
    ctx.scale(SCALE, SCALE);
    drawCreativeFromStyle(canvas, creative, styleGuide, index);
  }, [creative, styleGuide, format, index]);

  return (
    <div className="creative-card">
      <div className="creative-canvas-wrap">
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
        <div className="variation-badge">Variação {index + 1}</div>
      </div>
      <div className="creative-footer">
        <div>
          <div className="creative-name">{creative.variations?.[index]?.name || `Criativo ${index + 1}`}</div>
          <div className="creative-tags">
            <span className="tag">{format.label}</span>
            <span className="tag">{creative.variations?.[index]?.angle || "copy"}</span>
          </div>
        </div>
        <div className="creative-actions">
          <div className="icon-btn" title="Duplicar" onClick={() => onDuplicate(creative)}>
            <I d={Ico.copy} size={13} />
          </div>
          <div className="icon-btn" title="Download PNG" onClick={() => onDownload(canvasRef.current, `criativo-${index + 1}`)}>
            <I d={Ico.dl} size={13} />
          </div>
          <div className="icon-btn danger" title="Excluir" onClick={() => onDelete(index)}>
            <I d={Ico.trash} size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}

// MAIN
export default function LaunchAdsAI() {
  const [tab, setTab] = useState("create");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const [toast, setToast] = useState(null);

  const [expertFile, setExpertFile] = useState(null);
  const [expertPreview, setExpertPreview] = useState(null);
  const [references, setReferences] = useState([]); // [{file, preview, base64}]
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cta, setCta] = useState("");
  const [copy, setCopy] = useState("");
  const [format, setFormat] = useState("feed");

  const [styleGuide, setStyleGuide] = useState(null);
  const [styleAnalysis, setStyleAnalysis] = useState("");
  const [creatives, setCreatives] = useState([]);
  const [library, setLibrary] = useState([]);

  const addRefRef = useRef();

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleExpertFile = async (file) => {
    const preview = await fileToDataURL(file);
    setExpertFile(file);
    setExpertPreview(preview);
    showToast("Foto carregada!");
  };

  const handleAddRef = async (files) => {
    const newRefs = await Promise.all(Array.from(files).map(async (file) => ({
      file,
      preview: await fileToDataURL(file),
      base64: await fileToBase64(file),
    })));
    setReferences(prev => [...prev, ...newRefs].slice(0, 6));
    showToast(`${files.length} referência(s) adicionada(s)!`);
  };

  const removeRef = (idx) => setReferences(prev => prev.filter((_, i) => i !== idx));

  const analyzeReferences = async () => {
    if (references.length === 0) return null;

    const imageContents = references.slice(0, 3).map(ref => ({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: ref.base64 }
    }));

    const res = await fetch("https://scintillating-nourishment-production-db0b.up.railway.app/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            ...imageContents,
            {
              type: "text",
              text: `Você é um especialista em design gráfico e criativos para tráfego pago.
Analise DETALHADAMENTE o estilo visual dessas referências e extraia um guia de estilo.

Responda SOMENTE em JSON válido, sem texto extra, sem markdown:
{
  "backgrounds": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
  "textColors": ["#hexcolor"],
  "accentColors": ["#hexcolor"],
  "typography": "serif-bold|sans-bold|mixed-editorial|minimal",
  "layouts": ["editorial-top|centered|bottom-heavy"],
  "hasTextWatermark": true|false,
  "hasDecorativeDot": true|false,
  "handle": "@usuario se visível na imagem, senão vazio string",
  "credential": "credencial/título se visível, senão vazio string",
  "styleDescription": "descrição curta do estilo em português, máx 80 chars"
}`
            }
          ]
        }]
      })
    });

    const data = await res.json();
    const text = data.content?.find(b => b.type === "text")?.text || "{}";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  };

  const generateCopyVariations = async (guide) => {
    const res = await fetch("https://scintillating-nourishment-production-db0b.up.railway.app/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Você é expert em copywriting para lançamentos digitais no Brasil.

COPY BASE:
Headline: ${headline}
Subheadline: ${subheadline || "(não informado)"}
CTA: ${cta || "(não informado)"}
Copy completa: ${copy || "(não informada)"}
Formato: ${format}
Estilo visual: ${guide?.styleDescription || "editorial clean"}

Gere 3 variações de copy otimizadas para conversão, adaptadas ao estilo visual.
Responda SOMENTE em JSON válido:
{
  "variations": [
    { "name": "string", "headline": "string máx 55 chars", "subheadline": "string máx 70 chars", "cta": "string máx 22 chars MAIÚSCULAS", "angle": "urgência|benefício|prova social|curiosidade" },
    { "name": "string", "headline": "string máx 55 chars", "subheadline": "string máx 70 chars", "cta": "string máx 22 chars MAIÚSCULAS", "angle": "urgência|benefício|prova social|curiosidade" },
    { "name": "string", "headline": "string máx 55 chars", "subheadline": "string máx 70 chars", "cta": "string máx 22 chars MAIÚSCULAS", "angle": "urgência|benefício|prova social|curiosidade" }
  ]
}`
        }]
      })
    });

    const data = await res.json();
    const text = data.content?.find(b => b.type === "text")?.text || "{}";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  };

  const handleGenerate = async () => {
    if (!headline) return showToast("Preencha a headline!", "error");

    setGenerating(true);
    setProgress(0);

    try {
      const steps = [
        [15, "Analisando referências visuais com IA..."],
        [35, "Extraindo paleta de cores e tipografia..."],
        [55, "Gerando variações de copy..."],
        [70, "Construindo layout do criativo 1..."],
        [82, "Construindo layout do criativo 2..."],
        [92, "Construindo layout do criativo 3..."],
        [100, "Finalizando criativos..."],
      ];

      let guide = null;
      let copyData = null;

      for (let i = 0; i < steps.length; i++) {
        const [p, s] = steps[i];

        // Real API calls at right moments
        if (i === 0 && references.length > 0) {
          setStep(s); setProgress(p);
          guide = await analyzeReferences();
          setStyleGuide(guide);
          setStyleAnalysis(guide?.styleDescription || "");
        } else if (i === 2) {
          setStep(s); setProgress(p);
          copyData = await generateCopyVariations(guide || {});
        } else {
          await new Promise(r => setTimeout(r, 400 + Math.random() * 200));
          setProgress(p); setStep(s);
        }
      }

      // Fallback style if no references
      if (!guide) {
        guide = {
          backgrounds: ["#f5f5f0", "#1a1a2e", "#fff8f0"],
          textColors: ["#111111"],
          accentColors: ["#ff5c28"],
          typography: "mixed-editorial",
          layouts: ["editorial-top"],
          hasTextWatermark: true,
          hasDecorativeDot: true,
          handle: "",
          credential: "",
          styleDescription: "Editorial clean com tipografia mista",
        };
        setStyleGuide(guide);
      }

      const newCreatives = [{
        headline,
        subheadline,
        cta,
        format,
        expertImage: expertPreview,
        variations: copyData?.variations || [
          { name: "Urgência", headline, subheadline, cta: cta || "QUERO PARTICIPAR", angle: "urgência" },
          { name: "Benefício", headline, subheadline: subheadline || "Transforme sua vida", cta: cta || "SAIBA MAIS", angle: "benefício" },
          { name: "Prova Social", headline, subheadline: "Já ajudei mais de 10 mil pessoas", cta: cta || "VER DEPOIMENTOS", angle: "prova social" },
        ],
        id: Date.now(),
        createdAt: new Date().toLocaleString("pt-BR"),
      }];

      setCreatives(newCreatives);
      setLibrary(prev => [...newCreatives, ...prev]);
      showToast("3 criativos gerados com sucesso! 🎉");

    } catch (err) {
      console.error(err);
      showToast("Erro ao gerar criativos. Tente novamente.", "error");
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
      const updated = [...prev];
      if (updated[0]?.variations) {
        updated[0].variations = updated[0].variations.filter((_, i) => i !== idx);
      }
      return updated;
    });
    showToast("Criativo removido.");
  };

  const handleDuplicate = (creative) => {
    const dup = { ...creative, id: Date.now() };
    setCreatives(prev => [...prev, dup]);
    showToast("Criativo duplicado!");
  };

  const currentCreative = creatives[0];
  const variations = currentCreative?.variations || [];

  return (
    <>
      <style>{style}</style>

      {generating && (
        <div className="overlay">
          <div className="overlay-logo">LaunchAds AI</div>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Analisando referências e gerando criativos...</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="overlay-step">{step}</div>
          <div style={{ fontSize: 11, color: "var(--border)" }}>{progress}%</div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          <I d={toast.type === "success" ? Ico.check : Ico.x} size={14} />
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
            { id: "create",  icon: Ico.sparkle, label: "Criar Criativo" },
            { id: "library", icon: Ico.grid,    label: "Biblioteca" },
          ].map(item => (
            <div key={item.id} className={`nav-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
              <I d={item.icon} size={15} />{item.label}
            </div>
          ))}
          <div className="sidebar-footer">
            <div style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))", borderRadius: 10, padding: "12px", fontSize: 12, fontWeight: 700, color: "white" }}>
              <div style={{ fontSize: 10, opacity: .8, marginBottom: 2 }}>PLANO PRO</div>
              Criativos ilimitados
            </div>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <div className="topbar-title">
              {tab === "create" ? "Criar Criativo" : "Biblioteca"}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {tab === "create" && (
                <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                  <I d={Ico.zap} size={15} />
                  {generating ? "Gerando..." : "Gerar Criativos"}
                </button>
              )}
            </div>
          </div>

          <div className="content">

            {tab === "create" && (
              <>
                <div className="generate-bar">
                  <div>
                    <h3>✦ Gerador com Análise de Referências</h3>
                    <p>Suba suas referências — a IA analisa o estilo e gera criativos similares automaticamente</p>
                  </div>
                  <div className="chip"><I d={Ico.sparkle} size={12} /> Powered by Claude Vision</div>
                </div>

                <div className="grid-2">
                  {/* LEFT */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    <div className="card">
                      <div className="card-title"><span className="num">01</span> Foto do Expert</div>
                      <UploadZone label="Upload da foto do expert" preview={expertPreview} onFile={handleExpertFile} />
                    </div>

                    <div className="card">
                      <div className="card-title"><span className="num">02</span> Referências de Design</div>
                      <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 }}>
                        Suba exemplos de criativos que você gosta — a IA vai analisar cores, tipografia e layout para replicar o estilo.
                      </p>
                      <div className="refs-grid">
                        {references.map((ref, i) => (
                          <div className="ref-thumb" key={i}>
                            <img src={ref.preview} alt="ref" />
                            <div className="remove-btn" onClick={() => removeRef(i)}>✕</div>
                          </div>
                        ))}
                        {references.length < 6 && (
                          <div className="add-ref" onClick={() => addRefRef.current.click()}>
                            <input ref={addRefRef} type="file" accept="image/*" multiple style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} onChange={e => handleAddRef(e.target.files)} />
                            +
                          </div>
                        )}
                      </div>

                      {styleAnalysis && (
                        <div className="style-analysis">
                          <strong>✦ Estilo detectado:</strong> {styleAnalysis}
                        </div>
                      )}
                    </div>

                    <div className="card">
                      <div className="card-title"><span className="num">03</span> Formato</div>
                      <div className="format-grid">
                        {FORMATS.map(f => (
                          <div key={f.id} className={`format-item ${format === f.id ? "active" : ""}`} onClick={() => setFormat(f.id)}>
                            <div className="format-preview" style={{ width: f.w > f.h ? 36 : 24, height: f.w > f.h ? 24 : f.w === f.h ? 24 : 42 }} />
                            {f.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="card">
                    <div className="card-title"><span className="num">04</span> Copy do Anúncio</div>

                    <div className="form-group">
                      <label className="form-label">Headline *</label>
                      <input className="form-input" placeholder="Ex: Você já percebeu como sempre normalizamos a dor?" value={headline} onChange={e => setHeadline(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subheadline</label>
                      <input className="form-input" placeholder="Ex: Fisioterapeuta revela o método que mudou tudo" value={subheadline} onChange={e => setSubheadline(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CTA</label>
                      <input className="form-input" placeholder="Ex: LEIA A LEGENDA" value={cta} onChange={e => setCta(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Copy Completa</label>
                      <textarea className="form-textarea" placeholder="Cole a copy completa aqui. Quanto mais contexto, melhor o resultado..." value={copy} onChange={e => setCopy(e.target.value)} style={{ minHeight: 120 }} />
                    </div>

                    <hr className="divider" />

                    <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleGenerate} disabled={generating}>
                      <I d={Ico.zap} size={15} />
                      {generating ? "Analisando e gerando..." : "Gerar 3 Criativos com IA"}
                    </button>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center", lineHeight: 1.5 }}>
                      A IA analisa suas referências e gera criativos no mesmo estilo
                    </p>
                  </div>
                </div>

                {/* RESULTS */}
                {variations.length > 0 && styleGuide && (
                  <>
                    <hr className="divider" />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <h2 style={{ fontFamily: "Clash Display", fontSize: 18, fontWeight: 700 }}>Criativos Gerados</h2>
                        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>3 variações no estilo das suas referências</p>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-ghost" onClick={handleGenerate}>
                          <I d={Ico.refresh} size={13} />Regerar
                        </button>
                      </div>
                    </div>
                    <div className="creatives-grid">
                      {variations.map((_, i) => (
                        <CreativeCard
                          key={i}
                          creative={currentCreative}
                          index={i}
                          styleGuide={styleGuide}
                          onDownload={handleDownload}
                          onDelete={handleDelete}
                          onDuplicate={handleDuplicate}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {tab === "library" && (
              library.length === 0 ? (
                <div className="empty-state">
                  <I d={Ico.grid} size={40} />
                  <h3 style={{ marginTop: 16 }}>Nenhum criativo ainda</h3>
                  <p>Crie seu primeiro criativo para aparecer aqui</p>
                  <button className="btn btn-primary" style={{ margin: "20px auto 0", display: "flex" }} onClick={() => setTab("create")}>
                    Criar Agora
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                  {library.map((c, i) => (
                    <div key={c.id || i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
                      <div style={{ aspectRatio: "4/5", background: c.expertImage ? "none" : "var(--surface2)", position: "relative", overflow: "hidden" }}>
                        {c.expertImage && <img src={c.expertImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .7 }} />}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent,rgba(0,0,0,.85))", display: "flex", alignItems: "flex-end", padding: 12 }}>
                          <div style={{ fontFamily: "Clash Display", fontSize: 13, fontWeight: 700, color: "white", lineHeight: 1.3 }}>
                            {(c.headline || "").slice(0, 40)}
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
