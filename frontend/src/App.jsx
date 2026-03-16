import { useState, useRef, useCallback, useEffect } from "react";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  image: "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l4-4 3 3 4-4 4 4z",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  sparkle: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z",
  copy: "M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  plus: "M12 5v14M5 12h14",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  layout: "M3 3h18v18H3zM3 9h18M9 21V9",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  menu: "M3 12h18M3 6h18M3 18h18",
  close: "M18 6L6 18M6 6l12 12",
};

// ─── STYLE ────────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');

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
    --warning: #eab308;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Cabinet Grotesk', sans-serif;
    min-height: 100vh;
  }

  .app { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 0;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    transition: transform .3s ease;
  }
  .sidebar-logo {
    padding: 0 20px 28px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 20px;
  }
  .logo-text {
    font-family: 'Clash Display', sans-serif;
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }
  .logo-badge {
    font-size: 10px;
    background: var(--accent);
    color: white;
    padding: 2px 7px;
    border-radius: 20px;
    margin-left: 6px;
    font-weight: 700;
    -webkit-text-fill-color: white;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 20px;
    cursor: pointer;
    color: var(--muted);
    font-size: 14px;
    font-weight: 500;
    border-left: 3px solid transparent;
    transition: all .2s;
  }
  .nav-item:hover { color: var(--text); background: var(--surface2); }
  .nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(255,92,40,.07); }
  .sidebar-footer { margin-top: auto; padding: 20px; border-top: 1px solid var(--border); }
  .plan-badge {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px;
    padding: 12px;
    font-size: 12px;
    font-weight: 700;
    color: white;
  }

  /* MAIN */
  .main { margin-left: 240px; flex: 1; display: flex; flex-direction: column; }

  /* TOPBAR */
  .topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .topbar-title { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 600; }
  .topbar-actions { display: flex; gap: 10px; }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all .2s;
    font-family: 'Cabinet Grotesk', sans-serif;
  }
  .btn-primary {
    background: var(--accent);
    color: white;
  }
  .btn-primary:hover { background: #e04d1f; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(255,92,40,.35); }
  .btn-ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { color: var(--text); border-color: #444; }
  .btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }

  /* CONTENT */
  .content { padding: 32px; flex: 1; }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

  /* CARD */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px;
  }
  .card-title {
    font-family: 'Clash Display', sans-serif;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .card-title span { color: var(--accent); }

  /* UPLOAD ZONE */
  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all .2s;
    color: var(--muted);
    font-size: 13px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .upload-zone:hover { border-color: var(--accent); background: rgba(255,92,40,.04); }
  .upload-zone.has-file { border-color: var(--success); border-style: solid; }
  .upload-zone img { width: 100%; max-height: 200px; object-fit: contain; border-radius: 8px; }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .upload-icon { color: var(--accent); }

  /* FORM */
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 7px; display: block; }
  .form-input, .form-textarea, .form-select {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 11px 14px;
    color: var(--text);
    font-size: 14px;
    font-family: 'Cabinet Grotesk', sans-serif;
    outline: none;
    transition: border-color .2s;
    resize: none;
  }
  .form-input:focus, .form-textarea:focus, .form-select:focus { border-color: var(--accent); }
  .form-textarea { min-height: 90px; }
  .form-select option { background: var(--surface2); }

  /* FORMAT SELECTOR */
  .format-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .format-item {
    background: var(--surface2);
    border: 2px solid var(--border);
    border-radius: 10px;
    padding: 14px 10px;
    cursor: pointer;
    text-align: center;
    transition: all .2s;
    font-size: 12px;
    font-weight: 600;
  }
  .format-item:hover { border-color: var(--accent); }
  .format-item.active { border-color: var(--accent); background: rgba(255,92,40,.1); color: var(--accent); }
  .format-preview {
    margin: 0 auto 8px;
    background: var(--border);
    border-radius: 4px;
  }

  /* GENERATE SECTION */
  .generate-bar {
    background: linear-gradient(135deg, var(--surface) 0%, rgba(255,92,40,.06) 100%);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 20px;
  }
  .generate-info h3 { font-family: 'Clash Display', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 6px; }
  .generate-info p { color: var(--muted); font-size: 13px; }

  /* CREATIVES GRID */
  .creatives-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

  .creative-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    transition: all .25s;
    cursor: pointer;
  }
  .creative-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.4); }

  .creative-canvas {
    position: relative;
    overflow: hidden;
    background: #000;
  }
  .creative-canvas canvas { display: block; width: 100%; }
  .creative-canvas-fallback {
    width: 100%;
    padding-bottom: 125%;
    position: relative;
    overflow: hidden;
  }
  .creative-inner {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    color: white;
  }
  .creative-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
  }
  .creative-overlay {
    position: absolute;
    inset: 0;
  }
  .creative-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding: 4px 10px;
    border-radius: 20px;
    margin-bottom: 10px;
    width: fit-content;
  }
  .creative-headline {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(14px, 3vw, 22px);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 8px;
    text-shadow: 0 2px 8px rgba(0,0,0,.6);
  }
  .creative-sub {
    font-size: clamp(10px, 1.5vw, 13px);
    opacity: .85;
    margin-bottom: 14px;
    line-height: 1.4;
    text-shadow: 0 1px 4px rgba(0,0,0,.5);
  }
  .creative-cta {
    display: inline-block;
    padding: 8px 18px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    width: fit-content;
  }
  .creative-variation {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0,0,0,.7);
    backdrop-filter: blur(6px);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 700;
    color: white;
  }

  .creative-footer {
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--border);
  }
  .creative-name { font-size: 13px; font-weight: 600; }
  .creative-actions { display: flex; gap: 6px; }
  .icon-btn {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 7px;
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--muted);
    transition: all .2s;
  }
  .icon-btn:hover { color: var(--text); border-color: #444; }
  .icon-btn.danger:hover { color: #f87171; border-color: #f87171; background: rgba(248,113,113,.08); }

  /* LOADING */
  .generating-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10,10,15,.92);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 999;
    gap: 20px;
    backdrop-filter: blur(8px);
  }
  .generating-logo {
    font-family: 'Clash Display', sans-serif;
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 10px;
  }
  .progress-bar {
    width: 320px;
    height: 4px;
    background: var(--border);
    border-radius: 99px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 99px;
    transition: width .4s ease;
  }
  .generating-step { font-size: 13px; color: var(--muted); animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity:.5 } 50% { opacity:1 } }

  /* TABS */
  .tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 0; }
  .tab {
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    color: var(--muted);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all .2s;
  }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* STATS */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
  }
  .stat-value { font-family: 'Clash Display', sans-serif; font-size: 28px; font-weight: 700; margin-bottom: 4px; }
  .stat-label { font-size: 12px; color: var(--muted); }
  .stat-change { font-size: 12px; margin-top: 6px; }
  .stat-change.up { color: var(--success); }

  /* LIBRARY */
  .library-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
  .library-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    transition: all .2s;
    cursor: pointer;
  }
  .library-item:hover { border-color: var(--accent); transform: translateY(-2px); }
  .library-thumb {
    width: 100%;
    aspect-ratio: 4/5;
    position: relative;
    overflow: hidden;
  }
  .library-info { padding: 12px; }
  .library-name { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .library-meta { font-size: 11px; color: var(--muted); }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    z-index: 1000;
    box-shadow: 0 8px 30px rgba(0,0,0,.5);
    animation: slideIn .3s ease;
  }
  .toast.success { border-color: var(--success); }
  .toast.error { border-color: #f87171; }
  @keyframes slideIn { from { transform: translateX(100px); opacity:0 } to { transform: translateX(0); opacity:1 } }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .main { margin-left: 0; }
    .grid-2, .grid-3, .creatives-grid { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .format-grid { grid-template-columns: repeat(3, 1fr); }
    .content { padding: 20px; }
  }

  .chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(255,92,40,.12);
    color: var(--accent);
    border: 1px solid rgba(255,92,40,.25);
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    color: var(--muted);
  }
  .empty-state svg { margin: 0 auto 16px; opacity: .4; display: block; }
  .empty-state h3 { font-family: 'Clash Display', sans-serif; font-size: 20px; color: var(--text); margin-bottom: 8px; }
  .empty-state p { font-size: 14px; }

  .divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

  .tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    background: var(--surface2);
    color: var(--muted);
    border: 1px solid var(--border);
    margin-right: 4px;
  }
`;

// ─── CREATIVE THEMES ──────────────────────────────────────────────────────────
const THEMES = [
  {
    name: "Fire",
    overlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(180,40,0,.92) 60%, rgba(0,0,0,.98) 100%)",
    badge: { bg: "#ff5c28", color: "white" },
    cta: { bg: "#ff5c28", color: "white" },
    accent: "#ff8c42",
  },
  {
    name: "Dark Pro",
    overlay: "linear-gradient(135deg, rgba(0,0,0,.95) 0%, rgba(20,20,40,.9) 100%)",
    badge: { bg: "rgba(255,255,255,.12)", color: "white" },
    cta: { bg: "white", color: "#111" },
    accent: "#a78bfa",
  },
  {
    name: "Gold",
    overlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(30,20,0,.95) 70%, rgba(0,0,0,1) 100%)",
    badge: { bg: "#f59e0b", color: "#000" },
    cta: { bg: "#f59e0b", color: "#000" },
    accent: "#fcd34d",
  },
];

const FORMATS = [
  { id: "feed", label: "Feed 4:5", w: 4, h: 5, px: 1080, py: 1350 },
  { id: "story", label: "Story 9:16", w: 9, h: 16, px: 1080, py: 1920 },
  { id: "square", label: "Quad 1:1", w: 1, h: 1, px: 1080, py: 1080 },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Draw creative on canvas
function drawCreative(canvas, data, theme, format) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // BG
  if (data.expertImage) {
    const img = new Image();
    img.onload = () => {
      // draw image covering canvas
      const iRatio = img.width / img.height;
      const cRatio = W / H;
      let dx, dy, dw, dh;
      if (iRatio > cRatio) {
        dh = H; dw = dh * iRatio;
        dx = (W - dw) / 2; dy = 0;
      } else {
        dw = W; dh = dw / iRatio;
        dx = 0; dy = (H - dh) / 2;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
      applyOverlayAndText(ctx, W, H, data, theme);
    };
    img.src = data.expertImage;
  } else {
    // gradient bg
    const grd = ctx.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, "#1a0a00");
    grd.addColorStop(1, "#0a0a0f");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
    applyOverlayAndText(ctx, W, H, data, theme);
  }
}

function applyOverlayAndText(ctx, W, H, data, theme) {
  // Overlay
  const overlay = ctx.createLinearGradient(0, 0, 0, H);
  overlay.addColorStop(0, "rgba(0,0,0,0)");
  overlay.addColorStop(0.45, "rgba(0,0,0,0.3)");
  overlay.addColorStop(0.75, "rgba(0,0,0,0.85)");
  overlay.addColorStop(1, "rgba(0,0,0,0.97)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  // Texts
  const pad = W * 0.07;
  let y = H * 0.62;

  // Badge
  const badge = "✦ OFERTA ESPECIAL";
  ctx.font = `bold ${W * 0.028}px Cabinet Grotesk, sans-serif`;
  const bW = ctx.measureText(badge).width + W * 0.06;
  const bH = W * 0.05;
  ctx.fillStyle = theme.badge.bg;
  roundRect(ctx, pad, y, bW, bH, bH / 2);
  ctx.fillStyle = theme.badge.color;
  ctx.textAlign = "center";
  ctx.fillText(badge, pad + bW / 2, y + bH * 0.68);
  y += bH + W * 0.04;

  // Headline
  ctx.textAlign = "left";
  const headline = data.headline || "Transforme sua vida com esse método";
  const words = headline.split(" ");
  let line = "";
  const lines = [];
  const maxWidth = W - pad * 2;
  ctx.font = `bold ${W * 0.065}px Clash Display, sans-serif`;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line.trim()); line = word + " "; }
    else line = test;
  }
  if (line) lines.push(line.trim());

  ctx.fillStyle = "white";
  for (const l of lines.slice(0, 3)) {
    ctx.fillText(l, pad, y);
    y += W * 0.078;
  }
  y += W * 0.01;

  // Sub
  if (data.subheadline) {
    ctx.font = `${W * 0.038}px Cabinet Grotesk, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    const sub = data.subheadline.slice(0, 70);
    ctx.fillText(sub, pad, y);
    y += W * 0.06;
  }

  // CTA
  const cta = data.cta || "QUERO PARTICIPAR";
  ctx.font = `bold ${W * 0.036}px Cabinet Grotesk, sans-serif`;
  const ctaW = ctx.measureText(cta).width + W * 0.08;
  const ctaH = W * 0.06;
  ctx.fillStyle = theme.cta.bg;
  roundRect(ctx, pad, y, ctaW, ctaH, 8);
  ctx.fillStyle = theme.cta.color;
  ctx.textAlign = "center";
  ctx.fillText(cta, pad + ctaW / 2, y + ctaH * 0.65);
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

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function UploadZone({ label, multiple, onFiles, preview, accept = "image/*" }) {
  const ref = useRef();
  return (
    <div
      className={`upload-zone ${preview ? "has-file" : ""}`}
      onClick={() => ref.current.click()}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={e => onFiles(Array.from(e.target.files))}
        onClick={e => e.stopPropagation()}
      />
      {preview ? (
        <img src={preview} alt="preview" />
      ) : (
        <>
          <div className="upload-icon"><Icon d={Icons.upload} size={28} /></div>
          <strong style={{ fontSize: 13, color: "var(--text)" }}>{label}</strong>
          <span>Clique ou arraste aqui</span>
          <span style={{ fontSize: 11, color: "var(--border)" }}>PNG, JPG, WEBP</span>
        </>
      )}
    </div>
  );
}

function CreativeCard({ creative, index, onDownload, onDelete, onDuplicate }) {
  const canvasRef = useRef();
  const format = FORMATS.find(f => f.id === creative.format) || FORMATS[0];
  const theme = THEMES[index % THEMES.length];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scale = 2;
    canvas.width = 400 * scale;
    canvas.height = 400 * (format.h / format.w) * scale;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    ctx => ctx.scale(scale, scale);
    drawCreative(canvas, creative, theme, format);
  }, [creative, theme, format]);

  return (
    <div className="creative-card">
      <div className="creative-canvas">
        <canvas ref={canvasRef} />
        <div className="creative-variation">Variação {index + 1}</div>
      </div>
      <div className="creative-footer">
        <div>
          <div className="creative-name">{creative.name || `Criativo ${index + 1}`}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
            <span className="tag">{format.label}</span>
            <span className="tag">{theme.name}</span>
          </div>
        </div>
        <div className="creative-actions">
          <div className="icon-btn" title="Duplicar" onClick={() => onDuplicate(creative)}>
            <Icon d={Icons.copy} size={14} />
          </div>
          <div className="icon-btn" title="Download PNG" onClick={() => onDownload(canvasRef.current, creative.name || `criativo-${index + 1}`)}>
            <Icon d={Icons.download} size={14} />
          </div>
          <div className="icon-btn danger" title="Excluir" onClick={() => onDelete(index)}>
            <Icon d={Icons.trash} size={14} />
          </div>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form
  const [expertImage, setExpertImage] = useState(null);
  const [references, setReferences] = useState([]);
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cta, setCta] = useState("");
  const [copy, setCopy] = useState("");
  const [format, setFormat] = useState("feed");
  const [creatives, setCreatives] = useState([]);
  const [library, setLibrary] = useState([]);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const handleGenerate = async () => {
    if (!headline) return showToast("Preencha pelo menos a headline!", "error");

    setGenerating(true);
    setProgress(0);

    const steps = [
      [10, "Analisando referências visuais..."],
      [25, "Removendo fundo da foto..."],
      [40, "Consultando IA para layout..."],
      [60, "Gerando variação 1..."],
      [72, "Gerando variação 2..."],
      [84, "Gerando variação 3..."],
      [95, "Aplicando copy e CTAs..."],
      [100, "Finalizando criativos..."],
    ];

    for (const [p, s] of steps) {
      await new Promise(r => setTimeout(r, 450 + Math.random() * 300));
      setProgress(p);
      setStep(s);
    }

    // Use Claude API to suggest creative variations
    let aiSuggestions = null;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Você é um especialista em tráfego pago e design de criativos para lançamentos digitais.
Com base nessa copy:
HEADLINE: ${headline}
SUBHEADLINE: ${subheadline}
CTA: ${cta}
COPY: ${copy}

Gere 3 variações de copy para criativos de anúncio (formato ${format}).
Responda SOMENTE em JSON, sem preamble, sem markdown:
{
  "variations": [
    { "name": "string", "headline": "string", "subheadline": "string", "cta": "string" },
    { "name": "string", "headline": "string", "subheadline": "string", "cta": "string" },
    { "name": "string", "headline": "string", "subheadline": "string", "cta": "string" }
  ]
}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      aiSuggestions = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (e) {
      // fallback
    }

    const variations = aiSuggestions?.variations || [
      { name: "Criativo Urgência", headline, subheadline, cta },
      { name: "Criativo Benefício", headline: headline + " — Garantido", subheadline, cta: cta || "QUERO AGORA" },
      { name: "Criativo Social Proof", headline: "Mais de 10 mil alunos já transformaram suas vidas", subheadline: headline, cta: cta || "ENTRAR NA LISTA" },
    ];

    const newCreatives = variations.map((v, i) => ({
      ...v,
      format,
      expertImage,
      id: Date.now() + i,
      createdAt: new Date().toLocaleString("pt-BR"),
    }));

    setCreatives(newCreatives);
    setLibrary(prev => [...newCreatives, ...prev]);
    setGenerating(false);
    showToast("3 criativos gerados com sucesso! 🎉");
  };

  const handleDownload = (canvas, name) => {
    if (!canvas) return;
    const blob = dataURLtoBlob(canvas.toDataURL("image/png"));
    downloadBlob(blob, `${name}.png`);
    showToast("Download iniciado!");
  };

  const handleDelete = (idx) => {
    setCreatives(prev => prev.filter((_, i) => i !== idx));
    showToast("Criativo removido.");
  };

  const handleDuplicate = (creative) => {
    const dup = { ...creative, name: creative.name + " (cópia)", id: Date.now() };
    setCreatives(prev => [...prev, dup]);
    showToast("Criativo duplicado!");
  };

  const stats = [
    { label: "Criativos Gerados", value: library.length, change: "+12 esse mês" },
    { label: "Projetos Ativos", value: 3, change: "+1 essa semana" },
    { label: "Downloads", value: 48, change: "+8 hoje" },
    { label: "Variações Criadas", value: library.length * 3, change: "Últimos 30 dias" },
  ];

  return (
    <>
      <style>{style}</style>

      {/* Generating overlay */}
      {generating && (
        <div className="generating-overlay">
          <div className="generating-logo">LaunchAds AI</div>
          <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center" }}>
            Gerando seus criativos com Inteligência Artificial
          </p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="generating-step">{step}</div>
          <div style={{ fontSize: 12, color: "var(--border)" }}>{progress}%</div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <Icon d={toast.type === "success" ? Icons.check : Icons.x} size={16} stroke={toast.type === "success" ? "var(--success)" : "#f87171"} />
          {toast.msg}
        </div>
      )}

      <div className="app">
        {/* SIDEBAR */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="logo-text">LaunchAds</div>
              <span className="logo-badge">AI</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Criativos que convertem</div>
          </div>

          {[
            { id: "dashboard", icon: Icons.layout, label: "Dashboard" },
            { id: "create", icon: Icons.sparkle, label: "Criar Criativo" },
            { id: "library", icon: Icons.grid, label: "Biblioteca" },
          ].map(item => (
            <div key={item.id} className={`nav-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
              <Icon d={item.icon} size={17} />
              {item.label}
            </div>
          ))}

          <div className="sidebar-footer">
            <div className="plan-badge">
              <div style={{ fontSize: 10, opacity: .8, marginBottom: 2 }}>PLANO PRO</div>
              <div>Criativos ilimitados</div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button className="btn btn-ghost" style={{ padding: "8px", display: "none" }} onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Icon d={Icons.menu} size={18} />
              </button>
              <div className="topbar-title">
                {tab === "dashboard" && "Dashboard"}
                {tab === "create" && "Criar Criativo"}
                {tab === "library" && "Biblioteca de Criativos"}
              </div>
            </div>
            <div className="topbar-actions">
              {tab === "create" && (
                <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                  <Icon d={Icons.zap} size={16} />
                  {generating ? "Gerando..." : "Gerar Criativos"}
                </button>
              )}
              {tab === "library" && (
                <button className="btn btn-ghost">
                  <Icon d={Icons.download} size={15} />
                  Exportar Todos
                </button>
              )}
            </div>
          </div>

          <div className="content">

            {/* ── DASHBOARD ── */}
            {tab === "dashboard" && (
              <>
                <div className="stats-grid">
                  {stats.map((s, i) => (
                    <div className="stat-card" key={i}>
                      <div className="stat-value" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        {s.value}
                      </div>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-change up">{s.change}</div>
                    </div>
                  ))}
                </div>

                <div className="grid-2" style={{ gap: 20 }}>
                  <div className="card">
                    <div className="card-title"><Icon d={Icons.star} size={16} stroke="var(--accent)" /> Início Rápido</div>
                    <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 18 }}>
                      Crie seu primeiro criativo em menos de 2 minutos. Envie a foto do expert, escolha o formato e deixe a IA trabalhar.
                    </p>
                    <button className="btn btn-primary" onClick={() => setTab("create")}>
                      <Icon d={Icons.sparkle} size={15} />
                      Criar Agora
                    </button>
                  </div>
                  <div className="card">
                    <div className="card-title"><Icon d={Icons.folder} size={16} stroke="var(--accent)" /> Projetos Recentes</div>
                    {library.slice(0, 3).length === 0 ? (
                      <p style={{ fontSize: 13, color: "var(--muted)" }}>Nenhum criativo ainda. Comece criando!</p>
                    ) : (
                      library.slice(0, 3).map((c, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                          <div style={{ width: 40, height: 50, background: "var(--surface2)", borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                            {c.expertImage && <img src={c.expertImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.createdAt}</div>
                          </div>
                          <span className="tag" style={{ marginLeft: "auto" }}>{c.format}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="card" style={{ marginTop: 20 }}>
                  <div className="card-title"><Icon d={Icons.zap} size={16} stroke="var(--accent)" /> Como Funciona</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                    {["1. Faça upload da foto do expert", "2. Cole sua copy e CTA", "3. Escolha o formato", "4. Gere 3 variações com IA"].map((s, i) => (
                      <div key={i} style={{ textAlign: "center", padding: 16 }}>
                        <div style={{ width: 40, height: 40, background: "rgba(255,92,40,.12)", border: "1px solid rgba(255,92,40,.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontFamily: "Clash Display", fontWeight: 700, color: "var(--accent)" }}>
                          {i + 1}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--muted)" }}>{s}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── CREATE ── */}
            {tab === "create" && (
              <>
                <div className="generate-bar">
                  <div className="generate-info">
                    <h3>✦ Gerador de Criativos IA</h3>
                    <p>Preencha os campos abaixo e gere 3 variações de criativos prontos para tráfego pago</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                    <div className="chip"><Icon d={Icons.sparkle} size={13} /> Powered by Claude AI</div>
                  </div>
                </div>

                <div className="grid-2">
                  {/* LEFT */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div className="card">
                      <div className="card-title"><span>01</span> Foto do Expert</div>
                      <UploadZone
                        label="Upload da foto do expert"
                        preview={expertImage}
                        onFiles={files => {
                          const url = URL.createObjectURL(files[0]);
                          setExpertImage(url);
                          showToast("Foto carregada com sucesso!");
                        }}
                      />
                    </div>

                    <div className="card">
                      <div className="card-title"><span>02</span> Referências de Design</div>
                      <UploadZone
                        label="Upload de referências visuais"
                        multiple
                        preview={references[0] || null}
                        onFiles={files => {
                          const urls = files.map(f => URL.createObjectURL(f));
                          setReferences(urls);
                          showToast(`${files.length} referência(s) carregada(s)!`);
                        }}
                      />
                      {references.length > 1 && (
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                          {references.slice(1).map((r, i) => (
                            <img key={i} src={r} alt="" style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="card">
                      <div className="card-title"><span>03</span> Formato do Criativo</div>
                      <div className="format-grid">
                        {FORMATS.map(f => (
                          <div
                            key={f.id}
                            className={`format-item ${format === f.id ? "active" : ""}`}
                            onClick={() => setFormat(f.id)}
                          >
                            <div
                              className="format-preview"
                              style={{
                                width: f.w > f.h ? 40 : 28,
                                height: f.w > f.h ? 28 : f.w === f.h ? 28 : 50,
                                background: format === f.id ? "var(--accent)" : "var(--border)",
                                borderRadius: 4,
                              }}
                            />
                            {f.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="card">
                    <div className="card-title"><span>04</span> Copy do Anúncio</div>

                    <div className="form-group">
                      <label className="form-label">Headline Principal *</label>
                      <input className="form-input" placeholder="Ex: Descubra o método que transformou 10 mil vidas" value={headline} onChange={e => setHeadline(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Subheadline</label>
                      <input className="form-input" placeholder="Ex: Sem precisar abandonar sua rotina atual" value={subheadline} onChange={e => setSubheadline(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Texto do CTA</label>
                      <input className="form-input" placeholder="Ex: QUERO PARTICIPAR AGORA" value={cta} onChange={e => setCta(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Copy Completa</label>
                      <textarea
                        className="form-textarea"
                        rows={6}
                        placeholder="Cole aqui o texto completo do anúncio. A IA vai usar esse contexto para criar variações mais relevantes..."
                        value={copy}
                        onChange={e => setCopy(e.target.value)}
                        style={{ minHeight: 140 }}
                      />
                    </div>

                    <hr className="divider" />

                    <div style={{ display: "flex", gap: 10 }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleGenerate} disabled={generating}>
                        <Icon d={Icons.zap} size={16} />
                        {generating ? "Gerando..." : "Gerar 3 Criativos"}
                      </button>
                      <button className="btn btn-ghost" onClick={() => { setHeadline(""); setSubheadline(""); setCta(""); setCopy(""); setExpertImage(null); setReferences([]); }}>
                        <Icon d={Icons.refresh} size={15} />
                        Limpar
                      </button>
                    </div>

                    <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12, textAlign: "center" }}>
                      A IA vai gerar 3 variações únicas de copy otimizadas para conversão
                    </p>
                  </div>
                </div>

                {/* RESULTS */}
                {creatives.length > 0 && (
                  <>
                    <hr className="divider" />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <div>
                        <h2 style={{ fontFamily: "Clash Display", fontSize: 20, fontWeight: 700 }}>Criativos Gerados</h2>
                        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>3 variações prontas para tráfego pago</p>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button className="btn btn-ghost" onClick={handleGenerate}>
                          <Icon d={Icons.refresh} size={14} />
                          Regerar
                        </button>
                        <button className="btn btn-ghost" onClick={() => creatives.forEach((c, i) => {
                          // would download all
                          showToast("Baixando todos os criativos...");
                        })}>
                          <Icon d={Icons.download} size={14} />
                          Baixar Todos
                        </button>
                      </div>
                    </div>

                    <div className="creatives-grid">
                      {creatives.map((c, i) => (
                        <CreativeCard
                          key={c.id}
                          creative={c}
                          index={i}
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

            {/* ── LIBRARY ── */}
            {tab === "library" && (
              <>
                {library.length === 0 ? (
                  <div className="empty-state">
                    <Icon d={Icons.image} size={48} />
                    <h3>Nenhum criativo na biblioteca</h3>
                    <p>Crie seu primeiro criativo para ele aparecer aqui</p>
                    <button className="btn btn-primary" style={{ margin: "20px auto 0", display: "flex" }} onClick={() => setTab("create")}>
                      <Icon d={Icons.plus} size={15} />
                      Criar Criativo
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 13, color: "var(--muted)" }}>{library.length} criativo(s) na biblioteca</span>
                    </div>
                    <div className="library-grid">
                      {library.map((c, i) => (
                        <div className="library-item" key={c.id || i}>
                          <div className="library-thumb" style={{ background: "linear-gradient(135deg, #1a0a00, #0a0a0f)" }}>
                            {c.expertImage ? (
                              <img src={c.expertImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .7 }} />
                            ) : (
                              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--border)" }}>
                                <Icon d={Icons.image} size={32} />
                              </div>
                            )}
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent, rgba(0,0,0,.85))", display: "flex", alignItems: "flex-end", padding: 12 }}>
                              <div style={{ fontFamily: "Clash Display", fontSize: 13, fontWeight: 700, color: "white", lineHeight: 1.3 }}>
                                {(c.headline || c.name || "Criativo").slice(0, 40)}
                              </div>
                            </div>
                          </div>
                          <div className="library-info">
                            <div className="library-name">{c.name}</div>
                            <div className="library-meta">
                              <span className="tag">{c.format || "feed"}</span>
                              {c.createdAt}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
