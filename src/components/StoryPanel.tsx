"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { MascotBunnyIcon } from "@/components/icons";

const P = {
  bg: "#0d0a1a", border: "rgba(168,85,247,0.25)", borderHi: "rgba(168,85,247,0.6)",
  p1: "#9333ea", p3: "#db2777", txt: "#f0e6ff", muted: "rgba(240,230,255,0.5)",
};
const STORY_KEY = "conjita-story-v1";

interface Milestone { id: string; date: string; title: string; text: string; photo?: string; }
interface StoryData { intro: string; milestones: Milestone[]; music: string; closing: string; }

const uid = () => Math.random().toString(36).slice(2);
const DEFAULT: StoryData = {
  intro: "Nuestra historia 💞",
  closing: "…y lo mejor todavía está por venir 💍✨",
  music: "",
  milestones: [
    { id: uid(), date: "El día que te conocí", title: "Todo empezó aquí", text: "Y desde ese momento, nada volvió a ser igual para mí. (Edita este momento con tu foto y tus palabras 💜)", photo: "" },
  ],
};

// Redimensiona la foto a máx 900px y la comprime (para que quepa en el dispositivo)
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const max = 900;
        let { width, height } = img;
        if (width > max || height > max) {
          if (width > height) { height = Math.round(height * max / width); width = max; }
          else { width = Math.round(width * max / height); height = max; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject();
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StoryPanel({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<StoryData>(DEFAULT);
  const [edit, setEdit] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const c = () => setDesktop(window.innerWidth >= 768);
    c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORY_KEY);
      if (raw) setData({ ...DEFAULT, ...JSON.parse(raw) });
      else setEdit(true); // primera vez → modo edición para llenarla
    } catch { /* ok */ }
  }, []);

  const save = useCallback((d: StoryData) => {
    setData(d);
    try { localStorage.setItem(STORY_KEY, JSON.stringify(d)); }
    catch { alert("No hay espacio para guardar tantas fotos. Usa menos o más livianas 💜"); }
  }, []);

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a || !data.music) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => alert("No se pudo reproducir. Revisa el enlace de la canción 🎵")); }
  };

  // ── Edición ──
  const updateMs = (id: string, patch: Partial<Milestone>) =>
    save({ ...data, milestones: data.milestones.map(m => m.id === id ? { ...m, ...patch } : m) });
  const addMs = () =>
    save({ ...data, milestones: [...data.milestones, { id: uid(), date: "", title: "", text: "", photo: "" }] });
  const removeMs = (id: string) =>
    save({ ...data, milestones: data.milestones.filter(m => m.id !== id) });
  const onPhoto = async (id: string, file: File) => {
    if (file.size > 12_000_000) { alert("Foto muy grande (máx 12MB)."); return; }
    try { updateMs(id, { photo: await compressImage(file) }); } catch { alert("No se pudo procesar la foto."); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 700, background: "radial-gradient(circle at 20% 8%, rgba(147,51,234,0.25), transparent 45%), radial-gradient(circle at 85% 95%, rgba(219,39,119,0.22), transparent 45%), #0d0a1a", overflowY: "auto", WebkitOverflowScrolling: "touch", fontFamily: "'Poppins',sans-serif" }}>
      <style>{`
        @keyframes stFloat{0%{transform:translateY(0) rotate(0);opacity:.5}50%{opacity:.9}100%{transform:translateY(-40px) rotate(20deg);opacity:0}}
        @keyframes stIn{from{opacity:0;transform:translateY(30px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes stHeart{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
        .st-ms{animation:stIn .7s cubic-bezier(.34,1.56,.64,1) both}
      `}</style>

      {/* corazones flotantes */}
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {["10%","28%","50%","72%","88%"].map((l, i) => (
          <div key={i} style={{ position: "absolute", left: l, bottom: -20, fontSize: 14 + i * 3, animation: `stFloat ${7 + i}s ${i * 1.4}s ease-in infinite`, opacity: .5 }}>{i % 2 ? "💜" : "🌸"}</div>
        ))}
      </div>

      {/* barra superior */}
      <div style={{ position: "sticky", top: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `calc(12px + env(safe-area-inset-top)) 16px 12px`, background: "linear-gradient(180deg,rgba(13,10,26,0.95),transparent)" }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${P.border}`, borderRadius: 12, padding: "8px 14px", color: P.txt, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>← Volver</button>
        <div style={{ display: "flex", gap: 8 }}>
          {data.music && (
            <button onClick={toggleMusic} title="Música" style={{ background: playing ? `linear-gradient(135deg,${P.p1},${P.p3})` : "rgba(255,255,255,0.08)", border: `1px solid ${P.border}`, borderRadius: 12, padding: "8px 12px", color: P.txt, fontSize: 14, cursor: "pointer" }}>{playing ? "⏸ 🎵" : "▶ 🎵"}</button>
          )}
          <button onClick={() => setEdit(e => !e)} style={{ background: edit ? `linear-gradient(135deg,${P.p1},${P.p3})` : "rgba(255,255,255,0.08)", border: `1px solid ${P.border}`, borderRadius: 12, padding: "8px 14px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{edit ? "✓ Listo" : "✏️ Editar"}</button>
        </div>
      </div>

      {data.music && <audio ref={audioRef} src={data.music} loop onEnded={() => setPlaying(false)} />}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: desktop ? "10px 28px 80px" : "6px 18px 90px" }}>

        {/* Intro */}
        <div style={{ textAlign: "center", padding: "30px 0 36px", animation: "stIn .8s ease both" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, animation: "stHeart 2.6s ease-in-out infinite" }}><MascotBunnyIcon size={96} /></div>
          {edit
            ? <input value={data.intro} onChange={e => save({ ...data, intro: e.target.value })} style={inStyle} />
            : <h1 style={{ margin: 0, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: desktop ? 40 : 30, lineHeight: 1.1, background: `linear-gradient(120deg,#C792FF,#FF8FC6)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{data.intro}</h1>}
        </div>

        {/* Editor: música */}
        {edit && (
          <div style={{ background: "rgba(168,85,247,0.08)", border: `1px solid ${P.border}`, borderRadius: 14, padding: 12, marginBottom: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: P.txt, marginBottom: 6 }}>🎵 Canción de fondo (URL)</div>
            <input value={data.music} onChange={e => save({ ...data, music: e.target.value })} placeholder="Pega el enlace .mp3 de la canción" style={inStyle} />
            <div style={{ fontSize: 10.5, color: P.muted, marginTop: 6, lineHeight: 1.4 }}>Usa un enlace directo a un archivo de audio (.mp3) que tú controles. (Por derechos de autor, no puedo alojar canciones por ti.)</div>
          </div>
        )}

        {/* Línea de tiempo */}
        <div style={{ position: "relative" }}>
          {/* línea vertical */}
          {!edit && data.milestones.length > 0 && (
            <div style={{ position: "absolute", left: desktop ? 18 : 14, top: 8, bottom: 8, width: 2, background: `linear-gradient(to bottom,${P.p1},${P.p3})`, opacity: .4 }} />
          )}

          {data.milestones.map((m, i) => edit ? (
            // ── Tarjeta de edición ──
            <div key={m.id} style={{ background: "rgba(26,15,46,0.9)", border: `1px solid ${P.border}`, borderRadius: 16, padding: 14, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: P.muted }}>Momento {i + 1}</span>
                <button onClick={() => removeMs(m.id)} style={{ background: "rgba(239,68,68,0.25)", border: "none", borderRadius: 8, padding: "4px 10px", color: "#fca5a5", fontSize: 12, cursor: "pointer" }}>Quitar</button>
              </div>
              <label style={{ display: "block", marginBottom: 8 }}>
                <PhotoBox photo={m.photo} onPick={f => onPhoto(m.id, f)} />
              </label>
              <input value={m.date} onChange={e => updateMs(m.id, { date: e.target.value })} placeholder="Fecha o momento (ej: 14 feb 2023)" style={{ ...inStyle, marginBottom: 8 }} />
              <input value={m.title} onChange={e => updateMs(m.id, { title: e.target.value })} placeholder="Título del momento" style={{ ...inStyle, marginBottom: 8 }} />
              <textarea value={m.text} onChange={e => updateMs(m.id, { text: e.target.value })} rows={3} placeholder="Cuenta este momento…" style={{ ...inStyle, resize: "none", lineHeight: 1.5 }} />
            </div>
          ) : (
            // ── Tarjeta de historia ──
            <div key={m.id} className="st-ms" style={{ position: "relative", paddingLeft: desktop ? 48 : 36, marginBottom: 30, animationDelay: `${i * 0.05}s` }}>
              <div style={{ position: "absolute", left: desktop ? 11 : 7, top: 6, width: 16, height: 16, borderRadius: "50%", background: `linear-gradient(135deg,${P.p1},${P.p3})`, border: "3px solid #0d0a1a", boxShadow: `0 0 10px ${P.p1}` }} />
              {m.date && <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#f9a8d4", fontWeight: 700, marginBottom: 6 }}>{m.date}</div>}
              <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${P.border}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.3)" }}>
                {m.photo && <img src={m.photo} alt="" style={{ width: "100%", display: "block", maxHeight: 420, objectFit: "cover" }} />}
                <div style={{ padding: "14px 16px" }}>
                  {m.title && <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: P.txt, marginBottom: m.text ? 6 : 0 }}>{m.title}</div>}
                  {m.text && <p style={{ margin: 0, fontSize: 14, color: "rgba(240,230,255,0.85)", lineHeight: 1.65 }}>{m.text}</p>}
                </div>
              </div>
            </div>
          ))}

          {edit && (
            <button onClick={addMs} style={{ width: "100%", background: "rgba(168,85,247,0.15)", border: `1.5px dashed ${P.borderHi}`, borderRadius: 14, padding: "14px", color: P.txt, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>＋ Agregar un momento</button>
          )}
        </div>

        {/* Cierre */}
        {!edit && (
          <div style={{ textAlign: "center", padding: "20px 10px 0", animation: "stIn .8s ease both" }}>
            <div style={{ fontSize: 30, marginBottom: 10, animation: "stHeart 2.4s ease-in-out infinite" }}>💞</div>
            <p style={{ margin: 0, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: desktop ? 22 : 18, color: "#f9a8d4", lineHeight: 1.4 }}>{data.closing}</p>
          </div>
        )}
        {edit && (
          <input value={data.closing} onChange={e => save({ ...data, closing: e.target.value })} placeholder="Frase de cierre" style={{ ...inStyle, marginTop: 8 }} />
        )}
      </div>
    </div>
  );
}

const inStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.25)",
  borderRadius: 10, padding: "11px 13px", color: "#f0e6ff", fontSize: 16, outline: "none",
  fontFamily: "Poppins", boxSizing: "border-box",
};

function PhotoBox({ photo, onPick }: { photo?: string; onPick: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div onClick={() => ref.current?.click()} style={{ position: "relative", width: "100%", height: 150, borderRadius: 12, border: "1.5px dashed rgba(168,85,247,0.5)", background: photo ? `url(${photo}) center/cover` : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) onPick(f); e.target.value = ""; }} />
      {!photo && <span style={{ fontSize: 13, color: "rgba(240,230,255,0.6)", fontWeight: 600 }}>📷 Toca para subir foto</span>}
    </div>
  );
}
