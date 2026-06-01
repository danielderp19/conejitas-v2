"use client";
import { useState, useEffect, useCallback } from "react";
import { MascotBunnyIcon, HealthIcon, CompleteCelebrationIcon } from "@/components/icons";
import { CONEJITA } from "@/lib/moodBunny";

const P = {
  bg: "#0d0a1a", card: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)",
  borderHi: "rgba(168,85,247,0.6)", p1: "#9333ea", p3: "#db2777",
  txt: "#f0e6ff", muted: "rgba(240,230,255,0.5)",
};

const DATES_KEY = "conjita-dates-v1";
const MOOD_KEY  = "conjita-mood-v2";

// ── 24 estados de ánimo de la conejita ──
const MOODS: { key: string; label: string; color: string; cap: string }[] = [
  { key: "feliz",       label: "Feliz",       color: "#FFC94D", cap: "Todo fluye bonito hoy." },
  { key: "emocionada",  label: "Emocionada",  color: "#FF8FC6", cap: "¡No puedo con la emoción!" },
  { key: "amor",        label: "Enamorada",   color: "#FF6FA5", cap: "El corazón a mil, pura ternura." },
  { key: "orgullosa",   label: "Orgullosa",   color: "#C792FF", cap: "Lo logré — y se siente increíble." },
  { key: "agradecida",  label: "Agradecida",  color: "#FFB7C8", cap: "Gracias por tanto, hoy." },
  { key: "motivada",    label: "Motivada",    color: "#FFAE3D", cap: "¡A por todas! Con toda la energía." },
  { key: "guino",       label: "Juguetona",   color: "#9BE6C2", cap: "Con un poquito de picardía." },
  { key: "tranquila",   label: "Tranquila",   color: "#A6E3D8", cap: "En paz, respirando con calma." },
  { key: "concentrada", label: "Concentrada", color: "#7FC8FF", cap: "En modo enfoque total." },
  { key: "curiosa",     label: "Curiosa",     color: "#9ED8FF", cap: "¿Y esto qué será? Me intriga." },
  { key: "sorprendida", label: "Sorprendida", color: "#FFD98A", cap: "¡Vaya! No me lo esperaba." },
  { key: "timida",      label: "Tímida",      color: "#FFC4D6", cap: "Me da un poquito de vergüenza." },
  { key: "aburrida",    label: "Aburrida",    color: "#B0A8C8", cap: "No pasa nada interesante…" },
  { key: "preocupada",  label: "Preocupada",  color: "#C9B8F0", cap: "Algo me da vueltas en la cabeza." },
  { key: "ansiosa",     label: "Ansiosa",     color: "#F2C14E", cap: "Los nervios no me dejan en paz." },
  { key: "abrumada",    label: "Abrumada",    color: "#9A92AD", cap: "Es demasiado todo junto." },
  { key: "dormida",     label: "Cansada",     color: "#9B8FD6", cap: "Hora de bajar el ritmo y descansar." },
  { key: "enferma",     label: "Enferma",     color: "#9FCB7E", cap: "No me siento muy bien hoy." },
  { key: "hambre",      label: "Con hambre",  color: "#FFB05C", cap: "¡Me ruge la pancita!" },
  { key: "friolenta",   label: "Friolenta",   color: "#9FC6EC", cap: "Brr… qué frío hace." },
  { key: "triste",      label: "Triste",      color: "#8EC9F0", cap: "Hoy el corazón pesa un poquito." },
  { key: "llorando",    label: "Llorando",    color: "#7FC4F0", cap: "Necesito soltarlo y llorar un rato." },
  { key: "frustrada",   label: "Frustrada",   color: "#FF7E5F", cap: "¡Aagh! Nada me sale como quiero." },
  { key: "enojada",     label: "Molesta",     color: "#FF9A7B", cap: "Necesito un respiro… ya vuelvo." },
];
const MOOD_BY_KEY: Record<string, typeof MOODS[number]> = Object.fromEntries(MOODS.map(m => [m.key, m]));

interface CountdownItem { id: string; label: string; date: string; fixed?: boolean; }
interface MoodDay { date: string; moods: string[]; title?: string; note?: string; msg?: string; }

const todayStr = () => new Date().toISOString().split("T")[0];
const daysUntil = (iso: string) => {
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.ceil((new Date(iso + "T00:00:00").getTime() - now.getTime()) / 86400000);
};
const next26 = () => {
  const now = new Date(); now.setHours(0,0,0,0);
  let y = now.getFullYear(), m = now.getMonth();
  if (now.getDate() >= 26) { m += 1; if (m > 11) { m = 0; y += 1; } }
  return new Date(y, m, 26).toISOString().split("T")[0];
};
const nextBirthday = () => {
  const now = new Date(); now.setHours(0,0,0,0);
  let y = now.getFullYear();
  if (new Date(y, 9, 20).getTime() < now.getTime()) y += 1;
  return new Date(y, 9, 20).toISOString().split("T")[0];
};

// Figura de la conejita (cabeza + corona) según el ánimo
function bunnyFigure(expr: string) {
  return CONEJITA.svgWrap("8 14 224 252", CONEJITA.bunnyFront({ expr, crown: true, body: false }));
}
function MoodBunny({ expr, size }: { expr: string; size: number }) {
  return (
    <span
      aria-hidden
      style={{ display: "inline-flex", width: size, height: size * 1.12, lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: bunnyFigure(expr) }}
    />
  );
}

export default function LovePanel() {
  const [custom, setCustom]     = useState<CountdownItem[]>([]);
  const [showAdd, setShowAdd]   = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDate, setNewDate]   = useState("");
  const [history, setHistory]   = useState<MoodDay[]>([]);
  const [savedToday, setSavedToday] = useState<MoodDay | null>(null);
  const [selMoods, setSelMoods] = useState<string[]>([]);
  const [title, setTitle]       = useState("");
  const [note, setNote]         = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [desktop, setDesktop]   = useState(false);

  useEffect(() => {
    const c = () => setDesktop(window.innerWidth >= 768);
    c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DATES_KEY);
      if (raw) setCustom(JSON.parse(raw));
      const mh = localStorage.getItem(MOOD_KEY);
      if (mh) {
        const arr: MoodDay[] = JSON.parse(mh);
        setHistory(arr);
        const t = arr.find(e => e.date === todayStr());
        if (t) setSavedToday(t);
      }
    } catch { /* ok */ }
  }, []);

  const saveCustom = (arr: CountdownItem[]) => {
    setCustom(arr);
    try { localStorage.setItem(DATES_KEY, JSON.stringify(arr)); } catch { /* ok */ }
  };
  const addCountdown = () => {
    if (!newLabel.trim() || !newDate) return;
    saveCustom([...custom, { id: Math.random().toString(36).slice(2), label: newLabel.trim(), date: newDate }]);
    setNewLabel(""); setNewDate(""); setShowAdd(false);
  };
  const removeCountdown = (id: string) => saveCustom(custom.filter(c => c.id !== id));

  const allCountdowns: CountdownItem[] = [
    { id: "fixed-26", label: "Nuestro día 💜", date: next26(), fixed: true },
    { id: "fixed-bd", label: "Cumple de la reina 👑🎂", date: nextBirthday(), fixed: true },
    ...custom,
  ].sort((a, b) => daysUntil(a.date) - daysUntil(b.date));

  const toggleMood = (key: string) =>
    setSelMoods(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  // ── Guardar el día (se bloquea hasta mañana) ──
  const saveDay = useCallback(async () => {
    if (selMoods.length === 0) return;
    setAiLoading(true);
    const labels = selMoods.map(k => MOOD_BY_KEY[k]?.label || k).join(", ");
    const FALLBACKS = [
      "Gracias por contarme cómo te sientes hoy 💜 Recuerda que tus emociones son válidas, todas. Date un ratito para ti hoy, lo mereces 🐰",
      "Te leo y te entiendo 🌸 Hoy intenta hacer una cosa pequeña que te dé gustito — un té, tu canción favorita, lo que sea tuyo ✨",
      "Sea como sea tu día, estás haciéndolo increíble 🌟 Respira hondo y sé amable contigo misma, como lo eres con todos 💜",
      "Anotado, mi reina 👑 Permítete sentir sin juzgarte. Si algo te pesa, escríbelo o suéltalo; si algo te alegra, disfrútalo a fondo 💫",
      "Aquí estoy contigo siempre 🐰 Hoy regálate un momento de calma, aunque sea chiquito. Tú también necesitas cuidarte 🌿",
    ];
    let msg = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: `Eres Conejita 🐰, la mascota tierna de esta app personal. Te acaba de contar cómo se siente hoy (puede tener varios estados) y opcionalmente un título/nota de su día. Respóndele en español con un mensaje corto (2-3 frases), cálido y cercano, que valide lo que siente.

REGLAS IMPORTANTES:
- Incluye UNA sola recomendación concreta y que ENCAJE con el ánimo específico de hoy. VARÍA mucho la recomendación entre respuestas: no repitas siempre lo mismo. Elige según el momento entre ideas como: un placer pequeño (un té, su canción favorita, un dulce), descansar/dormir, salir a caminar o tomar aire, estirarse o respirar, escribir lo que siente, escuchar música o bailar, ver algo que le guste, celebrar un logro por pequeño que sea, ordenar una sola cosa, darse permiso de no hacer nada, un momento de sol, un baño rico, etc.
- NO recomiendes "abrazar" ni hablar de la familia en cada respuesta. La familia puede mencionarse muy de vez en cuando, pero NO debe ser el tema recurrente.
- NUNCA la llames "amiga", "amigui", "bestie" ni etiquetas parecidas. Háblale directo, o de vez en cuando como "mi reina" o "conejita" (sin abusar).
- Tono dulce y genuino, con 1 o 2 emojis. Nada de listas. Respuestas variadas y frescas, no acartonadas.`,
          messages: [{ role: "user", content: `Hoy me siento: ${labels}.${title.trim() ? ` Título de mi día: "${title.trim()}".` : ""}${note.trim() ? ` Nota: ${note.trim()}` : ""}` }],
          max_tokens: 170,
        }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text?.trim();
      if (text) msg = text;
    } catch { /* fallback */ }

    const entry: MoodDay = { date: todayStr(), moods: selMoods, title: title.trim() || undefined, note: note.trim() || undefined, msg };
    setSavedToday(entry);
    setHistory(prev => {
      const next = [entry, ...prev.filter(e => e.date !== entry.date)].slice(0, 60);
      try { localStorage.setItem(MOOD_KEY, JSON.stringify(next)); } catch { /* ok */ }
      return next;
    });
    setAiLoading(false);
  }, [selMoods, title, note]);

  const pad = desktop ? "20px 28px 60px" : "16px 16px 120px";
  const heroExpr = savedToday?.moods[0] || selMoods[0] || "feliz";
  const heroMood = MOOD_BY_KEY[heroExpr];

  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: pad }}>
      <style>{`@keyframes lpIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes lpBlink{0%,100%{opacity:1}50%{opacity:.25}} @keyframes lpBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
      {/* defs compartidas de la conejita (una vez) */}
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden dangerouslySetInnerHTML={{ __html: CONEJITA.defsMarkup() }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 22, animation: "lpIn 0.5s ease both" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><MascotBunnyIcon size={52} /></div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, background: `linear-gradient(135deg,${P.p1},${P.p3})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tu rinconcito 💛</div>
        <div style={{ fontSize: 12, color: P.muted, marginTop: 4 }}>Fechas especiales y cómo te sientes hoy</div>
      </div>

      {/* ── Cuenta regresiva ── */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: P.txt }}>⏳ Cuenta regresiva</span>
          <button onClick={() => setShowAdd(v => !v)} style={{ background: "rgba(168,85,247,0.18)", border: `1px solid ${P.border}`, borderRadius: 20, padding: "5px 12px", color: P.txt, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{showAdd ? "Cancelar" : "+ Agregar"}</button>
        </div>
        {showAdd && (
          <div style={{ background: "rgba(26,15,46,0.9)", border: `1px solid ${P.border}`, borderRadius: 14, padding: 12, marginBottom: 12, display: "flex", flexDirection: "column", gap: 8, animation: "lpIn 0.25s ease" }}>
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="¿Qué celebramos? (ej: Viaje a la playa)" style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${P.border}`, borderRadius: 10, padding: "10px 12px", color: P.txt, fontSize: 14, outline: "none", fontFamily: "Poppins" }} />
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${P.border}`, borderRadius: 10, padding: "10px 12px", color: P.txt, fontSize: 14, outline: "none", fontFamily: "Poppins" }} />
            <button onClick={addCountdown} style={{ background: `linear-gradient(135deg,${P.p1},${P.p3})`, border: "none", borderRadius: 10, padding: "10px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Guardar fecha 💜</button>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: desktop ? "1fr 1fr" : "1fr", gap: 10 }}>
          {allCountdowns.map((c, i) => {
            const d = daysUntil(c.date);
            const dateNice = new Date(c.date + "T00:00:00").toLocaleDateString("es", { day: "numeric", month: "long" });
            return (
              <div key={c.id} style={{ position: "relative", background: d === 0 ? "linear-gradient(135deg,rgba(219,39,119,0.25),rgba(147,51,234,0.18))" : "rgba(168,85,247,0.1)", border: `1px solid ${d === 0 ? P.borderHi : P.border}`, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, animation: `lpIn 0.5s ease ${i * 0.05}s both`, boxShadow: d === 0 ? "0 0 18px rgba(219,39,119,0.35)" : "none" }}>
                <div style={{ flexShrink: 0 }}>{d === 0 ? <CompleteCelebrationIcon size={40} /> : <HealthIcon size={36} />}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: P.txt, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: P.muted, marginTop: 1 }}>{dateNice}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: d === 0 ? 16 : 18, color: d === 0 ? "#fff" : "#f9a8d4", lineHeight: 1 }}>{d === 0 ? "🎉" : d}</div>
                  <div style={{ fontSize: 9, color: P.muted, marginTop: 2 }}>{d === 0 ? "" : d === 1 ? "día" : "días"}</div>
                </div>
                {!c.fixed && <button onClick={() => removeCountdown(c.id)} title="Quitar" style={{ position: "absolute", top: 6, right: 8, background: "none", border: "none", color: P.muted, fontSize: 14, cursor: "pointer", lineHeight: 1 }}>×</button>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mood del día ── */}
      <div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: P.txt, marginBottom: 14 }}>💭 ¿Cómo te sientes hoy?</div>

        {/* Hero: conejita con el ánimo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: "radial-gradient(circle at 22% 30%, rgba(162,75,240,0.18), transparent 60%), rgba(168,85,247,0.08)", border: `1px solid ${P.border}`, borderRadius: 22, padding: "16px 18px", marginBottom: 18 }}>
          <div style={{ flexShrink: 0, animation: "lpBob 3.4s ease-in-out infinite", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))" }}><MoodBunny expr={heroExpr} size={desktop ? 92 : 78} /></div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: P.muted, fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>Ánimo de hoy</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: heroMood?.color, boxShadow: `0 0 12px ${heroMood?.color}` }} />
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: P.txt }}>
                {savedToday ? (savedToday.moods.length > 1 ? `${heroMood?.label} +${savedToday.moods.length - 1}` : heroMood?.label) : (selMoods.length ? `${heroMood?.label}${selMoods.length > 1 ? ` +${selMoods.length - 1}` : ""}` : "Elige…")}
              </span>
            </div>
            <div style={{ fontSize: 13, color: P.muted, marginTop: 6, lineHeight: 1.5 }}>{savedToday?.title || heroMood?.cap}</div>
          </div>
        </div>

        {savedToday ? (
          // ── Vista bloqueada (ya guardó su día) ──
          <div style={{ animation: "lpIn 0.4s ease" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {savedToday.moods.map(k => {
                const m = MOOD_BY_KEY[k];
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: `1px solid ${m?.color}55`, borderRadius: 20, padding: "5px 12px 5px 6px" }}>
                    <MoodBunny expr={k} size={26} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: P.txt }}>{m?.label}</span>
                  </div>
                );
              })}
            </div>
            {savedToday.note && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${P.border}`, borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "rgba(240,230,255,0.8)", lineHeight: 1.6, fontStyle: "italic" }}>“{savedToday.note}”</div>
            )}
            {savedToday.msg && (
              <div style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.12),rgba(219,39,119,0.08))", border: `1px solid ${P.borderHi}`, borderRadius: 18, padding: "16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0 }}><MascotBunnyIcon size={44} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#f9a8d4", marginBottom: 4, fontFamily: "'Syne',sans-serif" }}>Conejita dice…</div>
                  <p style={{ margin: 0, fontSize: 13.5, color: P.txt, lineHeight: 1.6 }}>{savedToday.msg}</p>
                </div>
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: P.muted }}>🌙 Tu día ya está guardado. Vuelve mañana para registrar cómo te sientes 💜</div>
          </div>
        ) : (
          // ── Selector (puede elegir varios) ──
          <div>
            <div style={{ display: "grid", gridTemplateColumns: desktop ? "repeat(4,1fr)" : "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {MOODS.map(m => {
                const active = selMoods.includes(m.key);
                return (
                  <button key={m.key} onClick={() => toggleMood(m.key)} style={{ position: "relative", background: active ? "linear-gradient(160deg,rgba(162,75,240,0.22),rgba(224,70,140,0.14))" : "rgba(255,255,255,0.04)", border: `1px solid ${active ? "transparent" : P.border}`, boxShadow: active ? `0 0 0 2px ${P.p1}` : "none", borderRadius: 18, padding: "12px 6px 9px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, transition: "all 0.15s" }}>
                    {active && <span style={{ position: "absolute", top: 6, right: 7, width: 16, height: 16, borderRadius: "50%", background: `linear-gradient(135deg,${P.p1},${P.p3})`, color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>✓</span>}
                    <MoodBunny expr={m.key} size={52} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: active ? "#fff" : P.muted }}>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Título + nota */}
            <input value={title} onChange={e => setTitle(e.target.value)} maxLength={60} placeholder="Ponle un título a tu día… (ej: Mi día lindo)" style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${P.border}`, borderRadius: 12, padding: "12px 14px", color: P.txt, fontSize: 14, outline: "none", fontFamily: "Poppins", marginBottom: 8, boxSizing: "border-box" }} />
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="¿Quieres contarme algo más de tu día? (opcional)" style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${P.border}`, borderRadius: 12, padding: "12px 14px", color: P.txt, fontSize: 14, outline: "none", fontFamily: "Poppins", resize: "none", lineHeight: 1.5, marginBottom: 14, boxSizing: "border-box" }} />

            <button onClick={saveDay} disabled={selMoods.length === 0 || aiLoading} style={{ width: "100%", background: selMoods.length && !aiLoading ? `linear-gradient(135deg,${P.p1},${P.p3})` : "rgba(255,255,255,0.08)", border: "none", borderRadius: 16, padding: "15px", color: "#fff", fontSize: 14.5, fontWeight: 800, cursor: selMoods.length && !aiLoading ? "pointer" : "not-allowed", fontFamily: "'Syne',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {aiLoading
                ? <><span style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", animation: `lpBlink 1.1s ${i*0.2}s infinite` }} />)}</span> Guardando…</>
                : "Guardar mi día 💜"}
            </button>
            {selMoods.length === 0 && <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: P.muted }}>Elige al menos un ánimo (puedes marcar varios)</div>}
          </div>
        )}

        {/* ── Registro / historial ── */}
        {history.filter(e => e.date !== todayStr()).length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: P.txt, marginBottom: 12 }}>📖 Tu registro</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.filter(e => e.date !== todayStr()).slice(0, 14).map((e, i) => {
                const dd = new Date(e.date + "T00:00:00").toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${P.border}`, borderRadius: 14, padding: "8px 12px" }}>
                    <div style={{ display: "flex", flexShrink: 0 }}>
                      {e.moods.slice(0, 3).map((k, j) => <span key={j} style={{ marginLeft: j ? -8 : 0 }}><MoodBunny expr={k} size={30} /></span>)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: P.txt, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.title || e.moods.map(k => MOOD_BY_KEY[k]?.label).filter(Boolean).join(", ")}</div>
                      <div style={{ fontSize: 10, color: P.muted, textTransform: "capitalize" }}>{dd}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
