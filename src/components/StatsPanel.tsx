"use client";
import { useEffect, useState } from "react";
import { MascotBunnyIcon, CompleteCelebrationIcon } from "@/components/icons";
import { MOODS, MOOD_BY_KEY, MOOD_KEY, MoodBunny, type MoodDay } from "@/lib/moods";
import { localDateStr } from "@/lib/date";

const P = {
  border: "rgba(168,85,247,0.25)", borderHi: "rgba(168,85,247,0.6)",
  p1: "#9333ea", p3: "#db2777", txt: "#f0e6ff", muted: "rgba(240,230,255,0.5)",
};
const STATS_KEY = "conjita-completions-v1";

interface CompletionEntry { date: string; ts: number; title: string; category: string; categoryIcon?: string; }

const DOW = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

function last7Days(): { date: string; label: string }[] {
  const out: { date: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    out.push({ date: localDateStr(d), label: DOW[d.getDay()] });
  }
  return out;
}

export default function StatsPanel({ onClose }: { onClose: () => void }) {
  const [completions, setCompletions] = useState<CompletionEntry[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodDay[]>([]);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const c = () => setDesktop(window.innerWidth >= 768);
    c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c);
  }, []);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STATS_KEY);
        setCompletions(raw ? JSON.parse(raw) : []);
        const mh = localStorage.getItem(MOOD_KEY);
        setMoodHistory(mh ? JSON.parse(mh) : []);
      } catch { /* ok */ }
    };
    load();
    window.addEventListener("conjita-sync-applied", load);
    return () => window.removeEventListener("conjita-sync-applied", load);
  }, []);

  const days = last7Days();
  const countByDay: Record<string, number> = {};
  for (const c of completions) countByDay[c.date] = (countByDay[c.date] || 0) + 1;
  const weekCounts = days.map(d => ({ ...d, count: countByDay[d.date] || 0 }));
  const maxDay = Math.max(1, ...weekCounts.map(d => d.count));
  const weekTotal = weekCounts.reduce((s, d) => s + d.count, 0);
  const activeDays = weekCounts.filter(d => d.count > 0).length;

  // Categorías (histórico completo que tenemos guardado)
  const catMap: Record<string, { icon?: string; count: number }> = {};
  for (const c of completions) {
    if (!catMap[c.category]) catMap[c.category] = { icon: c.categoryIcon, count: 0 };
    catMap[c.category].count++;
  }
  const catList = Object.entries(catMap).map(([title, v]) => ({ title, ...v })).sort((a, b) => b.count - a.count).slice(0, 6);
  const maxCat = Math.max(1, ...catList.map(c => c.count));

  // Ánimos de los últimos 30 días
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = localDateStr(cutoff);
  const moodCount: Record<string, number> = {};
  for (const day of moodHistory) {
    if (day.date < cutoffStr) continue;
    for (const m of day.moods) moodCount[m] = (moodCount[m] || 0) + 1;
  }
  const moodList = Object.entries(moodCount).map(([key, count]) => ({ key, count, meta: MOOD_BY_KEY[key] })).filter(m => m.meta).sort((a, b) => b.count - a.count).slice(0, 6);
  const maxMood = Math.max(1, ...moodList.map(m => m.count));
  const topMood = moodList[0];

  const totalAll = completions.length;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 700, background: "radial-gradient(circle at 15% 6%, rgba(147,51,234,0.22), transparent 42%), radial-gradient(circle at 88% 92%, rgba(219,39,119,0.2), transparent 42%), #0d0a1a", overflowY: "auto", WebkitOverflowScrolling: "touch", fontFamily: "'Poppins',sans-serif" }}>
      <style>{`@keyframes stpIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes stpBar{from{transform:scaleY(0)}to{transform:scaleY(1)}}`}</style>

      {/* barra superior */}
      <div style={{ position: "sticky", top: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `calc(12px + env(safe-area-inset-top)) 16px 12px`, background: "linear-gradient(180deg,rgba(13,10,26,0.95),transparent)" }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${P.border}`, borderRadius: 12, padding: "8px 14px", color: P.txt, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>← Volver</button>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: desktop ? "10px 28px 60px" : "6px 18px 70px" }}>
        {/* Intro */}
        <div style={{ textAlign: "center", padding: "16px 0 28px", animation: "stpIn .6s ease both" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><MascotBunnyIcon size={72} /></div>
          <h1 style={{ margin: 0, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: desktop ? 30 : 24, background: `linear-gradient(120deg,#C792FF,#FF8FC6)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tus estadísticas 📊</h1>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, color: P.muted }}>Cada tarea y cada ánimo cuentan tu historia, mi reina 💜</p>
        </div>

        {/* Resumen de la semana */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 26, animation: "stpIn .6s ease .05s both" }}>
          {[
            { n: weekTotal, l: "esta semana" },
            { n: activeDays, l: "días activa" },
            { n: totalAll, l: "en total" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(168,85,247,0.1)", border: `1px solid ${P.border}`, borderRadius: 16, padding: "14px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: "#f9a8d4" }}>{s.n}</div>
              <div style={{ fontSize: 10, color: P.muted, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {totalAll === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 16px", color: P.muted, fontSize: 13, lineHeight: 1.7, animation: "stpIn .6s ease .1s both" }}>
            Aún no has completado ninguna tarea 🌱<br />Cuando lo hagas, aquí verás tu progreso brillar ✨
          </div>
        ) : (
          <>
            {/* Gráfica: últimos 7 días */}
            <div style={{ marginBottom: 28, animation: "stpIn .6s ease .1s both" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: P.txt, marginBottom: 14 }}>📅 Últimos 7 días</div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, height: 120, background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}`, borderRadius: 16, padding: "16px 14px 10px" }}>
                {weekCounts.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: d.count ? "#f9a8d4" : P.muted }}>{d.count || ""}</span>
                    <div style={{
                      width: "100%", maxWidth: 22,
                      height: `${Math.max(4, (d.count / maxDay) * 70)}px`,
                      borderRadius: 6,
                      background: d.count ? `linear-gradient(180deg,${P.p1},${P.p3})` : "rgba(255,255,255,0.08)",
                      transformOrigin: "bottom", animation: `stpBar .5s ${i * 0.05}s cubic-bezier(.34,1.56,.64,1) both`,
                    }} />
                    <span style={{ fontSize: 9.5, color: P.muted, textTransform: "uppercase" }}>{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorías más productivas */}
            {catList.length > 0 && (
              <div style={{ marginBottom: 28, animation: "stpIn .6s ease .15s both" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: P.txt, marginBottom: 14 }}>🏆 Donde más avanzas</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {catList.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18, flexShrink: 0, width: 24, textAlign: "center" }}>{c.icon || "🌱"}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, color: P.txt, fontWeight: 600, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                        <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
                          <div style={{ width: `${(c.count / maxCat) * 100}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg,${P.p1},${P.p3})` }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#f9a8d4", flexShrink: 0, minWidth: 18, textAlign: "right" }}>{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Ánimos del mes */}
        <div style={{ animation: "stpIn .6s ease .2s both" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: P.txt, marginBottom: 14 }}>💭 Tus ánimos (30 días)</div>
          {moodList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 16px", color: P.muted, fontSize: 12.5 }}>Aún no has registrado cómo te sientes 🌸</div>
          ) : (
            <>
              {topMood && (
                <div style={{ display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(135deg,rgba(168,85,247,0.14),rgba(219,39,119,0.1))", border: `1px solid ${P.borderHi}`, borderRadius: 18, padding: "14px 16px", marginBottom: 16 }}>
                  <MoodBunny expr={topMood.key} size={54} />
                  <div>
                    <div style={{ fontSize: 10.5, color: P.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Tu ánimo más frecuente</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: P.txt, marginTop: 2 }}>{topMood.meta?.label}</div>
                  </div>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {moodList.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <MoodBunny expr={m.key} size={30} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, color: P.txt, fontWeight: 600, marginBottom: 4 }}>{m.meta?.label}</div>
                      <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
                        <div style={{ width: `${(m.count / maxMood) * 100}%`, height: "100%", borderRadius: 6, background: m.meta?.color }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: P.muted, flexShrink: 0, minWidth: 14, textAlign: "right" }}>{m.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Cierre */}
        <div style={{ textAlign: "center", padding: "32px 10px 0", animation: "stpIn .6s ease .25s both" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><CompleteCelebrationIcon size={46} /></div>
          <p style={{ margin: 0, fontSize: 12.5, color: P.muted, lineHeight: 1.6 }}>Cada pasito cuenta. Estoy muy orgullosa de ti 💜</p>
        </div>
      </div>
    </div>
  );
}
