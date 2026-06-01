"use client";
import { useState, useEffect, useCallback } from "react";
import { MascotBunnyIcon, HealthIcon, CompleteCelebrationIcon } from "@/components/icons";

const P = {
  bg: "#0d0a1a", card: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)",
  borderHi: "rgba(168,85,247,0.6)", p1: "#9333ea", p3: "#db2777",
  txt: "#f0e6ff", muted: "rgba(240,230,255,0.5)",
};

const DATES_KEY = "conjita-dates-v1";
const MOOD_KEY  = "conjita-mood-v1";

// ── Estados de ánimo (emojis bonitos; luego se cambian por los de la conejita) ──
const MOODS = [
  { key: "feliz",     emoji: "😊", label: "Feliz",     color: "#fbbf24" },
  { key: "tranquila", emoji: "🌿", label: "Tranquila", color: "#34d399" },
  { key: "amada",     emoji: "🥰", label: "Amada",     color: "#fb7185" },
  { key: "motivada",  emoji: "💪", label: "Motivada",  color: "#a855f7" },
  { key: "cansada",   emoji: "😴", label: "Cansada",   color: "#818cf8" },
  { key: "estresada", emoji: "😣", label: "Estresada", color: "#f97316" },
  { key: "triste",    emoji: "🥺", label: "Triste",    color: "#60a5fa" },
  { key: "enojada",   emoji: "😤", label: "Enojada",   color: "#ef4444" },
];

// Respuestas de respaldo (si la IA no responde) — tono amoroso y familiar
const FALLBACK: Record<string, string> = {
  feliz: "¡Me encanta verte así de radiante! 🌟 Comparte hoy esa alegría con quienes amas, una llamadita o un abrazo a tu familia lo hará aún más bonito 💜",
  tranquila: "Qué paz tan linda 🌿 Aprovecha para disfrutar un momento sencillo con los tuyos; esos ratitos tranquilos en familia son tesoros 💜",
  amada: "¡Y eres inmensamente amada! 🥰 Devuélvele un poquito de ese amor a tu gente hoy, verás cómo se multiplica 💕",
  motivada: "¡Esa energía es tuya, reina! 💪 Canalízala en algo que te acerque a tus seres queridos o a tus metas. ¡Vas con todo! ✨",
  cansada: "Descansar también es cuidarte, mi amor 😴 Date permiso de parar, acurrúcate con los tuyos y recarga. Mañana será otro lindo día 💜",
  estresada: "Respira hondo, conejita 🌸 No tienes que con todo sola. Apóyate en tu familia, un abrazo de los que quieres calma el alma 💗",
  triste: "Está bien sentirse así 🥺 No estás sola: busca a alguien de tu familia que te haga sentir segura. Te mando un abrazo enorme 🤍",
  enojada: "Suéltalo, está bien enojarse 😤 Tómate un respiro, y cuando estés lista, hablarlo con alguien que amas suele aligerar el corazón 💜",
};

interface CountdownItem { id: string; label: string; date: string; fixed?: boolean; }
interface MoodEntry { date: string; mood: string; emoji: string; msg: string; }

const todayStr = () => new Date().toISOString().split("T")[0];
const daysUntil = (iso: string) => {
  const now = new Date(); now.setHours(0,0,0,0);
  const d = new Date(iso + "T00:00:00");
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
};
// próximo día 26
const next26 = () => {
  const now = new Date(); now.setHours(0,0,0,0);
  let y = now.getFullYear(), m = now.getMonth();
  if (now.getDate() >= 26) { m += 1; if (m > 11) { m = 0; y += 1; } }
  return new Date(y, m, 26).toISOString().split("T")[0];
};
// próximo cumpleaños (20 oct)
const nextBirthday = () => {
  const now = new Date(); now.setHours(0,0,0,0);
  let y = now.getFullYear();
  const bd = new Date(y, 9, 20);
  if (bd.getTime() < now.getTime()) y += 1;
  return new Date(y, 9, 20).toISOString().split("T")[0];
};

export default function LovePanel() {
  const [custom, setCustom]     = useState<CountdownItem[]>([]);
  const [showAdd, setShowAdd]   = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDate, setNewDate]   = useState("");
  const [history, setHistory]   = useState<MoodEntry[]>([]);
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [desktop, setDesktop]   = useState(false);

  useEffect(() => {
    const c = () => setDesktop(window.innerWidth >= 768);
    c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c);
  }, []);

  // cargar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DATES_KEY);
      if (raw) setCustom(JSON.parse(raw));
      const mh = localStorage.getItem(MOOD_KEY);
      if (mh) {
        const arr: MoodEntry[] = JSON.parse(mh);
        setHistory(arr);
        const t = arr.find(e => e.date === todayStr());
        if (t) setTodayMood(t);
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

  // fijas + custom, ordenadas por cercanía
  const allCountdowns: CountdownItem[] = [
    { id: "fixed-26", label: "Nuestro día 💜", date: next26(), fixed: true },
    { id: "fixed-bd", label: "Cumple de la reina 👑🎂", date: nextBirthday(), fixed: true },
    ...custom,
  ].sort((a, b) => daysUntil(a.date) - daysUntil(b.date));

  // ── Elegir ánimo → respuesta IA de la conejita ──
  const pickMood = useCallback(async (mood: typeof MOODS[number]) => {
    setAiLoading(true);
    let msg = FALLBACK[mood.key];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "Eres Conejita 🐰, la mascota tierna y amorosa de esta app, hecha con amor para una chica increíble. Ella es muy amorosa y está muy enfocada en su familia. Te acaba de decir cómo se siente hoy. Respóndele en español con un mensaje corto (máximo 3 frases), cálido y cercano, que la haga sentir acompañada y querida. Incluye UNA recomendación concreta y suave orientada al amor propio y a la familia (un gesto con sus seres queridos, una llamada, un abrazo, descansar con los suyos, etc.). Tono dulce, con 1 o 2 emojis. No uses listas; habla como la conejita.",
          messages: [{ role: "user", content: `Hoy me siento: ${mood.label} ${mood.emoji}` }],
          max_tokens: 160,
        }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text?.trim();
      if (text) msg = text;
    } catch { /* usa fallback */ }

    const entry: MoodEntry = { date: todayStr(), mood: mood.key, emoji: mood.emoji, msg };
    setTodayMood(entry);
    setHistory(prev => {
      const filtered = prev.filter(e => e.date !== entry.date);
      const next = [entry, ...filtered].slice(0, 30);
      try { localStorage.setItem(MOOD_KEY, JSON.stringify(next)); } catch { /* ok */ }
      return next;
    });
    setAiLoading(false);
  }, []);

  const pad = desktop ? "20px 28px 60px" : "16px 16px 120px";

  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: pad }}>
      <style>{`@keyframes lpIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes lpBlink{0%,100%{opacity:1}50%{opacity:.25}}`}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 22, animation: "lpIn 0.5s ease both" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><MascotBunnyIcon size={56} /></div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, background: `linear-gradient(135deg,${P.p1},${P.p3})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Tu rinconcito 💛
        </div>
        <div style={{ fontSize: 12, color: P.muted, marginTop: 4 }}>Fechas especiales y cómo te sientes hoy</div>
      </div>

      {/* ── Cuenta regresiva ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: P.txt }}>⏳ Cuenta regresiva</span>
          <button onClick={() => setShowAdd(v => !v)} style={{ background: "rgba(168,85,247,0.18)", border: `1px solid ${P.border}`, borderRadius: 20, padding: "5px 12px", color: P.txt, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {showAdd ? "Cancelar" : "+ Agregar"}
          </button>
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
            const label = d === 0 ? "¡HOY!" : d === 1 ? "1 día" : `${d} días`;
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
                  <div style={{ fontSize: 9, color: P.muted, marginTop: 2 }}>{d === 0 ? "" : label.replace(/^\d+\s/, "")}</div>
                </div>
                {!c.fixed && (
                  <button onClick={() => removeCountdown(c.id)} title="Quitar" style={{ position: "absolute", top: 6, right: 8, background: "none", border: "none", color: P.muted, fontSize: 14, cursor: "pointer", lineHeight: 1 }}>×</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mood del día ── */}
      <div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: P.txt, marginBottom: 12 }}>💭 ¿Cómo te sientes hoy?</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
          {MOODS.map(m => {
            const active = todayMood?.mood === m.key;
            return (
              <button key={m.key} onClick={() => pickMood(m)} disabled={aiLoading} style={{ background: active ? `linear-gradient(135deg,${m.color}, rgba(0,0,0,0.1))` : "rgba(255,255,255,0.05)", border: `1.5px solid ${active ? m.color : P.border}`, borderRadius: 14, padding: "10px 4px", cursor: aiLoading ? "wait" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.2s", transform: active ? "scale(1.05)" : "scale(1)" }}>
                <span style={{ fontSize: 26 }}>{m.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: active ? "#fff" : P.muted }}>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Respuesta de la conejita */}
        {(aiLoading || todayMood) && (
          <div style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.12),rgba(219,39,119,0.08))", border: `1px solid ${P.borderHi}`, borderRadius: 18, padding: "16px 16px", display: "flex", gap: 12, alignItems: "flex-start", animation: "lpIn 0.4s ease" }}>
            <div style={{ flexShrink: 0 }}><MascotBunnyIcon size={44} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#f9a8d4", marginBottom: 4, fontFamily: "'Syne',sans-serif" }}>Conejita dice…</div>
              {aiLoading
                ? <div style={{ display: "flex", gap: 5, padding: "4px 0" }}>{[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: P.p1, animation: `lpBlink 1.1s ${i*0.2}s infinite` }} />)}</div>
                : <p style={{ margin: 0, fontSize: 13.5, color: P.txt, lineHeight: 1.6 }}>{todayMood?.msg}</p>}
            </div>
          </div>
        )}

        {/* Historial */}
        {history.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: P.muted, marginBottom: 10 }}>Tus últimos días</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {history.slice(0, 10).map((e, i) => {
                const dd = new Date(e.date + "T00:00:00").toLocaleDateString("es", { day: "numeric", month: "short" });
                return (
                  <div key={i} title={e.msg} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${P.border}`, borderRadius: 12, padding: "8px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 54 }}>
                    <span style={{ fontSize: 22 }}>{e.emoji}</span>
                    <span style={{ fontSize: 9, color: P.muted }}>{dd}</span>
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
