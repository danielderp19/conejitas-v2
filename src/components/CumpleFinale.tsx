"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MoodBunny } from "@/lib/moods";
import { CONEJITA } from "@/lib/moodBunny";
import { CUMPLE_NAME, CUMPLE_LETTER, CUMPLE_REASONS, FINALE_PHOTOS } from "@/lib/cumple";

const P = { bg: "#0d0a1a", p1: "#9333ea", p3: "#db2777", txt: "#f0e6ff", muted: "rgba(240,230,255,0.55)" };
const COLORS = ["#c084fc", "#f472b6", "#fbbf24", "#f0abfc", "#fde68a", "#93c5fd", "#ffffff", "#fb7185"];

// ── Cumpleaños feliz, sintetizado ──────────────────────────────
const N: Record<string, number> = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
const LINES: { n: string; b: number; s: string }[][] = [
  [{ n: "G4", b: 0.75, s: "Cum" }, { n: "G4", b: 0.25, s: "ple" }, { n: "A4", b: 1, s: "a" }, { n: "G4", b: 1, s: "ños" }, { n: "C5", b: 1, s: "fe" }, { n: "B4", b: 2, s: "liz" }],
  [{ n: "G4", b: 0.75, s: "Te" }, { n: "G4", b: 0.25, s: "de" }, { n: "A4", b: 1, s: "se" }, { n: "G4", b: 1, s: "a" }, { n: "D5", b: 1, s: "mos" }, { n: "C5", b: 2, s: "a ti" }],
  [{ n: "G4", b: 0.75, s: "Cum" }, { n: "G4", b: 0.25, s: "ple" }, { n: "G5", b: 1, s: "a" }, { n: "E5", b: 1, s: "ños" }, { n: "C5", b: 1, s: "mi" }, { n: "B4", b: 1, s: "Ca" }, { n: "A4", b: 1.5, s: "ta" }],
  [{ n: "F5", b: 0.75, s: "Cum" }, { n: "F5", b: 0.25, s: "ple" }, { n: "E5", b: 1, s: "a" }, { n: "C5", b: 1, s: "ños" }, { n: "D5", b: 1, s: "fe" }, { n: "C5", b: 2, s: "liz" }],
];
const BEAT = 0.62;
interface Syl { line: number; idx: number; t: number; d: number; f: number; s: string }
const SONG: Syl[] = [];
let songEnd = 0;
{
  let t = 0;
  LINES.forEach((ln, li) => {
    ln.forEach((nt, i) => { SONG.push({ line: li, idx: i, t, d: nt.b * BEAT, f: N[nt.n], s: nt.s }); t += nt.b * BEAT; });
    t += 0.5 * BEAT;
  });
  songEnd = t;
}

type Pt = { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; sz: number; kind: 0 | 1; rot: number; vr: number };
type Rk = { x: number; y: number; vx: number; vy: number; ty: number; c: string };

export default function CumpleFinale({ onClose, preview }: { onClose: () => void; preview: boolean }) {
  const [stage, setStage] = useState<"gift" | "count" | "show" | "letter">("gift");
  const [count, setCount] = useState(3);
  const [cur, setCur] = useState<[number, number]>([-1, -1]);
  const [songDone, setSongDone] = useState(false);
  const [flash, setFlash] = useState(false);
  const cvs = useRef<HTMLCanvasElement>(null);
  const pts = useRef<Pt[]>([]);
  const rks = useRef<Rk[]>([]);
  const actx = useRef<AudioContext | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const songStart = useRef(0);
  const reduced = useRef(false);
  const stageRef = useRef(stage);
  stageRef.current = stage;

  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  // ── audio ──
  const audio = () => {
    if (actx.current) return actx.current;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      actx.current = new AC();
    } catch { /* sin audio */ }
    return actx.current;
  };
  const tone = (f: number, at: number, dur: number, vol = 0.18) => {
    const a = actx.current; if (!a) return;
    const t = a.currentTime + at;
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.98 + 0.25);
    g.connect(a.destination);
    for (const [mul, v, type] of [[1, 1, "triangle"], [2, 0.25, "sine"], [3, 0.08, "sine"]] as const) {
      const o = a.createOscillator();
      const og = a.createGain(); og.gain.value = v;
      o.type = type; o.frequency.value = f * mul;
      o.connect(og); og.connect(g);
      o.start(t); o.stop(t + dur + 0.3);
    }
  };
  const boom = useCallback((big = false) => {
    const a = actx.current; if (!a) return;
    const len = Math.floor(a.sampleRate * (big ? 0.9 : 0.45));
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, big ? 2.2 : 3);
    const s = a.createBufferSource(); s.buffer = buf;
    const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = big ? 500 : 900;
    const g = a.createGain(); g.gain.value = big ? 0.55 : 0.22;
    s.connect(lp); lp.connect(g); g.connect(a.destination); s.start();
  }, []);

  // ── fuegos artificiales ──
  const burst = useCallback((x: number, y: number, n = 70, sound = true) => {
    const base = COLORS[Math.floor(Math.random() * COLORS.length)];
    const alt = COLORS[Math.floor(Math.random() * COLORS.length)];
    const count = reduced.current ? Math.floor(n / 3) : n;
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.2;
      const sp = 1.5 + Math.random() * 4.2;
      pts.current.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0, max: 55 + Math.random() * 35, c: i % 3 === 0 ? alt : base, sz: 1.6 + Math.random() * 1.6, kind: 0, rot: 0, vr: 0 });
    }
    if (sound) boom(false);
  }, [boom]);
  const launch = useCallback((tx?: number, ty?: number) => {
    const w = window.innerWidth, h = window.innerHeight;
    const x = tx ?? w * (0.12 + Math.random() * 0.76);
    const target = ty ?? h * (0.12 + Math.random() * 0.38);
    rks.current.push({ x: tx ?? x, y: h, vx: (Math.random() - 0.5) * 0.8, vy: -(9 + Math.random() * 3), ty: target, c: COLORS[Math.floor(Math.random() * COLORS.length)] });
  }, []);
  const confetti = useCallback((n = 90) => {
    const w = window.innerWidth;
    for (let i = 0; i < n; i++) {
      pts.current.push({ x: Math.random() * w, y: -20 - Math.random() * 200, vx: (Math.random() - 0.5) * 2, vy: 1.5 + Math.random() * 2.5, life: 0, max: 400, c: COLORS[Math.floor(Math.random() * COLORS.length)], sz: 5 + Math.random() * 5, kind: 1, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.25 });
    }
  }, []);
  const volley = useCallback((n = 8) => {
    for (let i = 0; i < n; i++) later(() => launch(), i * 180);
  }, [launch]);

  useEffect(() => {
    reduced.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const c = cvs.current!;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      c.width = window.innerWidth * dpr; c.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    };
    size();
    window.addEventListener("resize", size);
    let raf = 0, last = performance.now();
    const frame = (now: number) => {
      const k = Math.min((now - last) / 16.67, 3); last = now;
      const w = window.innerWidth, h = window.innerHeight;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(13,10,26,0.24)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const rs = rks.current;
      for (let i = rs.length - 1; i >= 0; i--) {
        const r = rs[i];
        r.x += r.vx * k; r.y += r.vy * k; r.vy += 0.12 * k;
        ctx.fillStyle = r.c; ctx.beginPath(); ctx.arc(r.x, r.y, 2.2, 0, 6.3); ctx.fill();
        if (r.y <= r.ty || r.vy >= -1) { burst(r.x, r.y, 70 + Math.floor(Math.random() * 40)); rs.splice(i, 1); }
      }
      const ps = pts.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life += k;
        if (p.life > p.max || p.y > h + 30) { ps.splice(i, 1); continue; }
        if (p.kind === 0) {
          p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.05 * k;
          p.x += p.vx * k; p.y += p.vy * k;
          ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
          ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, 6.3); ctx.fill();
        } else {
          p.x += p.vx * k + Math.sin(p.life / 12 + p.rot) * 0.6; p.y += p.vy * k; p.rot += p.vr * k;
          ctx.globalAlpha = 0.9; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillStyle = p.c; ctx.fillRect(-p.sz / 2, -p.sz / 4, p.sz, p.sz / 2); ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      timers.current.forEach(clearTimeout);
      const a = actx.current; actx.current = null; a?.close().catch(() => {});
    };
  }, [burst]);

  // ── karaoke ──
  useEffect(() => {
    if (stage !== "show") return;
    const iv = setInterval(() => {
      if (!songStart.current) return;
      const t = (performance.now() - songStart.current) / 1000;
      let idx = -1;
      for (let i = 0; i < SONG.length; i++) if (t >= SONG[i].t) idx = i;
      const s = idx >= 0 ? SONG[idx] : null;
      setCur(prev => (s && (prev[0] !== s.line || prev[1] !== s.idx) ? [s.line, s.idx] : prev));
    }, 40);
    return () => clearInterval(iv);
  }, [stage]);

  // ── secuencia ──
  const start = () => {
    audio();
    actx.current?.resume?.();
    setStage("count"); setCount(3);
    tone(440, 0, 0.25, 0.12);
    navigator.vibrate?.(40);
    later(() => { setCount(2); tone(554, 0, 0.25, 0.12); navigator.vibrate?.(40); }, 1000);
    later(() => { setCount(1); tone(659, 0, 0.25, 0.14); navigator.vibrate?.(60); }, 2000);
    later(explode, 3000);
  };
  const explode = () => {
    setStage("show"); setFlash(true); later(() => setFlash(false), 500);
    boom(true);
    navigator.vibrate?.([120, 60, 120, 60, 260]);
    const w = window.innerWidth, h = window.innerHeight;
    burst(w / 2, h * 0.35, 140, false);
    confetti(reduced.current ? 30 : 110);
    volley(reduced.current ? 2 : 7);
    later(() => {
      songStart.current = performance.now();
      SONG.forEach(s => tone(s.f, s.t, s.d));
      // acompañamiento suave: bajo en cada línea
      LINES.forEach((_, li) => {
        const first = SONG.find(s => s.line === li)!;
        tone(196, first.t, 3, 0.07);
        tone(262, first.t + 1.4, 1.6, 0.05);
      });
    }, 900);
    const rate = reduced.current ? 2600 : 520;
    const iv = setInterval(() => { if (stageRef.current === "show" || stageRef.current === "letter") launch(); }, rate);
    timers.current.push(iv as unknown as ReturnType<typeof setTimeout>);
    later(() => {
      setSongDone(true);
      boom(true); volley(10); confetti(80);
      navigator.vibrate?.([200, 80, 200]);
    }, 900 + songEnd * 1000 + 300);
  };

  const onCanvasTap = (e: React.PointerEvent) => {
    if (stage !== "show" && stage !== "letter") return;
    launch(e.clientX, e.clientY);
  };

  const wrap: React.CSSProperties = { position: "fixed", inset: 0, zIndex: 900, background: P.bg, color: P.txt, fontFamily: "'Poppins',sans-serif", overflow: "hidden", animation: "cfIn 0.5s ease both" };

  return (
    <div style={wrap}>
      <style>{`
        @keyframes cfIn{from{opacity:0}to{opacity:1}}
        @keyframes cfPop{0%{transform:scale(0) rotate(-12deg);opacity:0}60%{transform:scale(1.25) rotate(4deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes cfFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes cfGlow{0%,100%{filter:drop-shadow(0 0 12px rgba(244,114,182,.6))}50%{filter:drop-shadow(0 0 28px rgba(251,191,36,.9))}}
        @keyframes cfCount{0%{transform:scale(2.4);opacity:0}30%{transform:scale(1);opacity:1}100%{transform:scale(.85);opacity:.2}}
        @keyframes cfFlash{0%{opacity:.95}100%{opacity:0}}
        @keyframes cfShake{0%,100%{transform:translate(0)}20%{transform:translate(-6px,3px)}40%{transform:translate(5px,-4px)}60%{transform:translate(-4px,-2px)}80%{transform:translate(3px,4px)}}
        @keyframes cfLine{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes cfPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @media (prefers-reduced-motion: reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important}}
      `}</style>

      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden dangerouslySetInnerHTML={{ __html: CONEJITA.defsMarkup() }} />
      <canvas ref={cvs} onPointerDown={onCanvasTap} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "manipulation" }} />

      {preview && <div style={{ position: "absolute", top: "calc(10px + env(safe-area-inset-top))", left: 12, zIndex: 5, fontSize: 10, fontWeight: 700, background: "rgba(251,191,36,.2)", color: "#fde68a", padding: "3px 9px", borderRadius: 10 }}>VISTA PREVIA</div>}
      <button onClick={onClose} aria-label="Cerrar" style={{ position: "absolute", top: "calc(8px + env(safe-area-inset-top))", right: 12, zIndex: 6, background: "rgba(255,255,255,.1)", border: "none", color: P.txt, width: 36, height: 36, borderRadius: 18, fontSize: 16, cursor: "pointer" }}>✕</button>

      {stage === "gift" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", gap: 14, pointerEvents: "none" }}>
          <div style={{ animation: "cfFloat 3s ease-in-out infinite" }}><MoodBunny expr="emocionada" size={110} /></div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, background: `linear-gradient(135deg,#f0abfc,${P.p3})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{CUMPLE_NAME}, tengo algo para ti…</div>
          <div style={{ fontSize: 13, color: P.muted, maxWidth: 300, lineHeight: 1.6 }}>Sube el volumen 🔊 y prepárate.<br />Este es el momento por el que llevamos 20 días contando.</div>
          <button onClick={start} style={{ pointerEvents: "auto", marginTop: 10, fontSize: 18, fontWeight: 800, color: "#fff", background: `linear-gradient(135deg,${P.p1},${P.p3})`, border: "none", borderRadius: 30, padding: "16px 34px", cursor: "pointer", boxShadow: "0 0 40px rgba(219,39,119,.55)", animation: "cfPulse 1.6s ease-in-out infinite" }}>Abrir mi regalo 🎁</button>
        </div>
      )}

      {stage === "count" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div key={count} style={{ fontFamily: "'Syne',sans-serif", fontSize: 180, fontWeight: 800, color: "#fff", textShadow: `0 0 60px ${P.p3}`, animation: "cfCount 1s ease-out both" }}>{count}</div>
        </div>
      )}

      {flash && <div style={{ position: "absolute", inset: 0, background: "#fff", pointerEvents: "none", animation: "cfFlash .5s ease-out forwards", zIndex: 4 }} />}

      {stage === "show" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", textAlign: "center", pointerEvents: "none", animation: reduced.current ? undefined : "cfShake .5s ease 1" }}>
          <div style={{ animation: "cfFloat 2.4s ease-in-out infinite" }}><MoodBunny expr="emocionada" size={96} /></div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(22px,6.6vw,40px)", lineHeight: 1.05, marginTop: 6, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 .3em" }}>
            {["¡FELIZ", "CUMPLEAÑOS,"].map((wd, wi) => (
              <span key={wd} style={{ display: "inline-flex" }}>
                {wd.split("").map((ch, i) => (
                  <span key={i} style={{ display: "inline-block", opacity: 0, animation: `cfPop .6s ${wi * 0.5 + i * 0.05}s cubic-bezier(.34,1.56,.64,1) forwards`, color: "#fff", textShadow: `0 0 18px ${P.p3}` }}>{ch}</span>
                ))}
              </span>
            ))}
          </div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(54px,18vw,120px)", lineHeight: 1, opacity: 0, animation: "cfPop .8s 1.1s cubic-bezier(.34,1.56,.64,1) forwards, cfGlow 2s 2s ease-in-out infinite", background: "linear-gradient(135deg,#fde68a,#f472b6,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{CUMPLE_NAME.toUpperCase()}!</div>
          <div style={{ marginTop: 18, minHeight: 84 }}>
            {LINES.map((ln, li) => (
              <div key={li} style={{ display: cur[0] === li ? "block" : "none", fontSize: "clamp(20px,6vw,28px)", fontWeight: 700, letterSpacing: ".02em" }}>
                {ln.map((sy, i) => {
                  const on = cur[0] === li && i <= cur[1];
                  const now = cur[0] === li && i === cur[1];
                  return <span key={i} style={{ display: "inline-block", margin: "0 .12em", color: on ? "#fde68a" : "rgba(255,255,255,.3)", transform: now ? "scale(1.25)" : "scale(1)", textShadow: on ? "0 0 14px rgba(251,191,36,.8)" : "none", transition: "all .15s" }}>{sy.s}</span>;
                })}
              </div>
            ))}
          </div>
          {songDone && (
            <button onClick={() => setStage("letter")} style={{ pointerEvents: "auto", marginTop: 18, fontSize: 16, fontWeight: 800, color: "#fff", background: `linear-gradient(135deg,${P.p1},${P.p3})`, border: "none", borderRadius: 26, padding: "14px 28px", cursor: "pointer", boxShadow: "0 0 30px rgba(219,39,119,.5)", animation: "cfPop .5s both, cfPulse 1.6s .5s ease-in-out infinite" }}>Ahora lee esto 💌</button>
          )}
          <div style={{ position: "absolute", bottom: "calc(14px + env(safe-area-inset-bottom))", fontSize: 11, color: P.muted }}>Toca la pantalla para lanzar fuegos artificiales ✨</div>
          {!songDone && <button onClick={() => setStage("letter")} style={{ pointerEvents: "auto", position: "absolute", bottom: "calc(38px + env(safe-area-inset-bottom))", background: "none", border: "none", color: P.muted, fontSize: 11, textDecoration: "underline", cursor: "pointer" }}>Saltar a la carta</button>}
        </div>
      )}

      {stage === "letter" && (
        <div style={{ position: "absolute", inset: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", background: "rgba(13,10,26,.72)", padding: "calc(56px + env(safe-area-inset-top)) 18px calc(40px + env(safe-area-inset-bottom))" }} onPointerDown={e => { if (e.target === e.currentTarget) launch(e.clientX, e.clientY); }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <div style={{ textAlign: "center", animation: "cfFloat 3s ease-in-out infinite" }}><MoodBunny expr="amor" size={90} /></div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, textAlign: "center", margin: "6px 0 18px" }}><span style={{ background: "linear-gradient(135deg,#fde68a,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Para ti, {CUMPLE_NAME}</span> 💌</div>

            {FINALE_PHOTOS.length > 0 && (
              <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "4px 2px 14px", marginBottom: 6 }}>
                {FINALE_PHOTOS.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt="" style={{ height: 190, borderRadius: 16, border: "2px solid rgba(244,114,182,.5)", flexShrink: 0, transform: `rotate(${i % 2 ? 2 : -2}deg)`, boxShadow: "0 6px 24px rgba(0,0,0,.5)" }} />
                ))}
              </div>
            )}

            <div style={{ background: "rgba(147,51,234,.14)", border: "1px solid rgba(168,85,247,.35)", borderRadius: 20, padding: "22px 20px", lineHeight: 1.75, fontSize: 15 }}>
              {CUMPLE_LETTER.map((ln, i) => (
                <p key={i} style={{ margin: "0 0 12px", opacity: 0, animation: `cfLine .8s ${0.4 + i * 1.1}s ease forwards`, fontWeight: i === CUMPLE_LETTER.length - 1 ? 700 : 400 }}>{ln}</p>
              ))}
            </div>

            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, textAlign: "center", margin: "30px 0 14px" }}>20 razones para el 20 de octubre 👑</div>
            <div style={{ display: "grid", gap: 9 }}>
              {CUMPLE_REASONS.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(255,255,255,.05)", border: "1px solid rgba(168,85,247,.22)", borderRadius: 14, padding: "11px 14px", opacity: 0, animation: `cfLine .6s ${0.3 + i * 0.12}s ease forwards` }}>
                  <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 15, background: `linear-gradient(135deg,${P.p1},${P.p3})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{i + 1}</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.45 }}>{r}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: 28, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { volley(10); confetti(100); boom(true); navigator.vibrate?.([100, 50, 100]); }} style={{ fontSize: 14, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg,${P.p1},${P.p3})`, border: "none", borderRadius: 24, padding: "12px 22px", cursor: "pointer" }}>🎆 Más fuegos artificiales</button>
              <button onClick={onClose} style={{ fontSize: 14, fontWeight: 700, color: P.txt, background: "rgba(255,255,255,.08)", border: "1px solid rgba(168,85,247,.3)", borderRadius: 24, padding: "12px 22px", cursor: "pointer" }}>Cerrar 💜</button>
            </div>
            <div style={{ textAlign: "center", fontSize: 12, color: P.muted, marginTop: 22 }}>Con todo mi amor, feliz cumpleaños 🎂</div>
          </div>
        </div>
      )}
    </div>
  );
}
