"use client";
import { useState } from "react";
import { CUMPLE_NAME, CUMPLE_LETTER, FINALE_PHOTOS, photoUrl } from "@/lib/cumple";

function loadImg(src: string): Promise<HTMLImageElement | null> {
  return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const out: string[] = []; let line = "";
  for (const w of text.split(" ")) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
  }
  if (line) out.push(line);
  return out;
}

async function buildRecuerdo(): Promise<Blob> {
  try { await document.fonts?.ready; } catch { /* sin fuentes */ }
  const W = 1080, PAD = 72, FONT = "'Poppins', 'Helvetica Neue', Arial, sans-serif";
  const photos = FINALE_PHOTOS.slice(0, 4);
  const imgs = await Promise.all(photos.map(p => loadImg(photoUrl(p.n))));
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `400 34px ${FONT}`;
  const TXT_W = W - PAD * 2 - 90;
  const paras = CUMPLE_LETTER.map(p => wrap(measure, p, TXT_W));
  const LH = 52, PGAP = 26;
  const letterH = 90 + paras.reduce((a, l) => a + l.length * LH + PGAP, 0);
  const rows = Math.ceil(photos.length / 2);
  const POL_H = 610;
  const H = 400 + rows * (POL_H + 30) + 60 + letterH + 230;

  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#241247"); bg.addColorStop(0.5, "#14102b"); bg.addColorStop(1, "#0d0a1a");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  const hearts = ["💜", "💗", "💖", "🩷", "💕"];
  const lyTop = 400 + rows * (POL_H + 30) + 60;
  ctx.globalAlpha = 0.5; ctx.font = `46px ${FONT}`;
  for (let i = 0; i < 16; i++) ctx.fillText(hearts[i % 5], (i * 211 + 60) % (W - 60) + 30, (i * 397 + 140) % (lyTop - 220) + 80);
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#ffffff"; ctx.font = `800 70px ${FONT}`; ctx.fillText("Feliz cumpleaños", W / 2, 170);
  const g = ctx.createLinearGradient(240, 0, 840, 0); g.addColorStop(0, "#fde68a"); g.addColorStop(0.5, "#f472b6"); g.addColorStop(1, "#c084fc");
  ctx.fillStyle = g; ctx.font = `800 150px ${FONT}`; ctx.fillText(CUMPLE_NAME + "!", W / 2, 330);

  photos.forEach((ph, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const w = 440, h = POL_H;
    const cx = col === 0 ? 300 : 780, cy = 400 + row * (h + 30) + h / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(([-3, 3, 2.5, -2.5][i % 4] * Math.PI) / 180);
    ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
    ctx.fillStyle = "#fff"; rr(ctx, -w / 2, -h / 2, w, h, 8); ctx.fill(); ctx.shadowColor = "transparent";
    const pw = w - 36, ph2 = 470, px = -w / 2 + 18, py = -h / 2 + 18;
    const im = imgs[i];
    ctx.save(); rr(ctx, px, py, pw, ph2, 4); ctx.clip();
    if (im) {
      const s = Math.max(pw / im.width, ph2 / im.height); const dw = im.width * s, dh = im.height * s;
      ctx.drawImage(im, px + (pw - dw) / 2, py + (ph2 - dh) * 0.3, dw, dh);
    } else { ctx.fillStyle = "#e5e5e5"; ctx.fillRect(px, py, pw, ph2); }
    ctx.restore();
    ctx.fillStyle = "#3b2a4d"; ctx.font = `600 26px ${FONT}`; ctx.fillText(ph.caption, 0, h / 2 - 34);
    ctx.restore();
  });

  const ly = 400 + rows * (POL_H + 30) + 60;
  ctx.fillStyle = "rgba(147,51,234,.22)"; rr(ctx, PAD, ly, W - PAD * 2, letterH, 40); ctx.fill();
  ctx.strokeStyle = "rgba(192,132,252,.5)"; ctx.lineWidth = 2; ctx.stroke();
  ctx.textAlign = "left"; ctx.fillStyle = "#f0e6ff"; ctx.font = `400 34px ${FONT}`;
  let y = ly + 90;
  paras.forEach((lines, pi) => {
    ctx.font = `${pi === paras.length - 1 ? 700 : 400} 34px ${FONT}`;
    lines.forEach(l => { ctx.fillText(l, PAD + 45, y); y += LH; });
    y += PGAP;
  });
  ctx.textAlign = "center"; ctx.fillStyle = "rgba(240,230,255,.7)"; ctx.font = `600 32px ${FONT}`;
  ctx.fillText("Con todo mi amor 💜 · 20 de octubre", W / 2, H - 100);

  return await new Promise<Blob>((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error("canvas"))), "image/png"));
}

export default function CumpleSaveButton({ style }: { style?: React.CSSProperties }) {
  const [state, setState] = useState<"idle" | "work" | "done" | "err">("idle");
  const [fallback, setFallback] = useState<string | null>(null);

  const go = async () => {
    setState("work");
    try {
      const blob = await buildRecuerdo();
      const file = new File([blob], "cumpleanos-cata.png", { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title: "Mi regalo de cumpleaños" }); setState("done"); return; }
        catch (e) { if ((e as Error)?.name === "AbortError") { setState("idle"); return; } }
      }
      setFallback(URL.createObjectURL(blob)); setState("done");
    } catch { setState("err"); }
  };

  return (
    <>
      <button onClick={go} disabled={state === "work"} style={{ fontSize: 14, fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#f59e0b,#db2777)", border: "none", borderRadius: 24, padding: "12px 22px", cursor: "pointer", opacity: state === "work" ? 0.7 : 1, ...style }}>
        {state === "work" ? "Preparando tu recuerdo…" : state === "err" ? "No se pudo, intenta de nuevo" : "📲 Guardar en mi celular"}
      </button>
      {fallback && (
        <div onClick={() => setFallback(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.9)", overflowY: "auto", padding: "calc(20px + env(safe-area-inset-top)) 16px 30px", textAlign: "center" }}>
          <div style={{ color: "#fde68a", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Mantén presionada la imagen y elige «Guardar imagen» 💜</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fallback} alt="Recuerdo de cumpleaños" style={{ width: "100%", maxWidth: 420, borderRadius: 14 }} onClick={e => e.stopPropagation()} />
          <div style={{ marginTop: 14 }}>
            <a href={fallback} download="cumpleanos-cata.png" onClick={e => e.stopPropagation()} style={{ color: "#fff", background: "linear-gradient(135deg,#9333ea,#db2777)", borderRadius: 20, padding: "10px 20px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Descargar</a>
          </div>
          <div style={{ color: "rgba(240,230,255,.5)", fontSize: 12, marginTop: 14 }}>Toca fuera de la imagen para cerrar</div>
        </div>
      )}
    </>
  );
}
