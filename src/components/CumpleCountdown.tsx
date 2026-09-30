"use client";
import { useState } from "react";
import { MoodBunny } from "@/lib/moods";
import { CONEJITA } from "@/lib/moodBunny";
import { CUMPLE_DAYS, CUMPLE_NAME, getCumpleNow, cumpleYear } from "@/lib/cumple";

const P = { bg: "#0d0a1a", border: "rgba(168,85,247,0.25)", p1: "#9333ea", p3: "#db2777", txt: "#f0e6ff", muted: "rgba(240,230,255,0.5)" };

export default function CumpleCountdown({ onClose, onFinale }: { onClose: () => void; onFinale: () => void }) {
  const now = getCumpleNow();
  const unlockedTo = now.phase === "active" ? now.day : now.phase === "before" ? 0 : 20;
  const [sel, setSel] = useState(Math.min(Math.max(unlockedTo, 1), 20));
  const [shake, setShake] = useState(0);
  const card = CUMPLE_DAYS[sel - 1];
  const isBday = sel === 20;
  const year = cumpleYear();

  const pick = (d: number) => {
    if (d > unlockedTo) { setShake(d); setTimeout(() => setShake(0), 500); return; }
    setSel(d);
  };

  const big = now.phase === "birthday" ? "¡HOY!" : now.phase === "after" ? "💜" : String(now.daysLeft);
  const sub = now.phase === "birthday" ? `Es el cumpleaños de ${CUMPLE_NAME}` : now.phase === "after" ? "Gracias por dejarme celebrarte" : now.daysLeft === 1 ? "día para tu cumpleaños" : "días para tu cumpleaños";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 700, background: P.bg, color: P.txt, fontFamily: "'Poppins',sans-serif", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <style>{`
        @keyframes ccShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
        @keyframes ccIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes ccPulse{0%,100%{box-shadow:0 0 0 0 rgba(244,114,182,.6)}50%{box-shadow:0 0 0 8px rgba(244,114,182,0)}}
      `}</style>
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden dangerouslySetInnerHTML={{ __html: CONEJITA.defsMarkup() }} />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "calc(14px + env(safe-area-inset-top)) 16px calc(40px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16 }}>Camino a tu cumple 🎂</div>
          <button onClick={onClose} aria-label="Cerrar" style={{ background: "rgba(255,255,255,.08)", border: "none", color: P.txt, width: 36, height: 36, borderRadius: 18, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ textAlign: "center", margin: "14px 0 6px" }}>
          <MoodBunny expr={now.phase === "birthday" ? "emocionada" : "amor"} size={78} />
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 64, lineHeight: 1, background: `linear-gradient(135deg,#fde68a,#f472b6,${P.p1})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{big}</div>
          <div style={{ fontSize: 13, color: P.muted, marginTop: 4 }}>{sub}</div>
          {now.preview && <div style={{ display: "inline-block", marginTop: 8, fontSize: 10, fontWeight: 700, background: "rgba(251,191,36,.2)", color: "#fde68a", padding: "3px 9px", borderRadius: 10 }}>VISTA PREVIA · {year}</div>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, margin: "18px 0" }}>
          {CUMPLE_DAYS.map(cd => {
            const open = cd.day <= unlockedTo;
            const active = sel === cd.day;
            const today = now.phase === "active" && cd.day === now.day;
            return (
              <button key={cd.day} onClick={() => pick(cd.day)} aria-label={`Día ${cd.day}`} style={{
                aspectRatio: "1", borderRadius: 14, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
                border: active ? "2px solid #f472b6" : `1px solid ${P.border}`,
                background: cd.day === 20 ? "linear-gradient(135deg,rgba(251,191,36,.25),rgba(219,39,119,.3))" : open ? "linear-gradient(135deg,rgba(147,51,234,.3),rgba(219,39,119,.2))" : "rgba(255,255,255,.04)",
                color: P.txt, opacity: open ? 1 : 0.55,
                animation: shake === cd.day ? "ccShake .4s" : today ? "ccPulse 1.8s infinite" : undefined,
              }}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>{cd.day === 20 ? "🎁" : open ? cd.emoji : "🔒"}</span>
                <span style={{ fontSize: 11, fontWeight: 800 }}>{cd.day}</span>
              </button>
            );
          })}
        </div>

        {shake > 0 && <div style={{ textAlign: "center", fontSize: 12, color: "#fde68a", marginBottom: 8 }}>Todavía no, mi amor 🤭 Ese día se abre el {shake} de octubre.</div>}

        {unlockedTo === 0 ? (
          <div style={{ textAlign: "center", color: P.muted, fontSize: 13, padding: 20 }}>La primera sorpresa se abre el 1 de octubre 💜</div>
        ) : (
          <div key={sel} style={{ background: "linear-gradient(135deg,rgba(147,51,234,.16),rgba(219,39,119,.1))", border: `1px solid ${P.border}`, borderRadius: 20, padding: "20px 18px", animation: "ccIn .45s ease both" }}>
            <div style={{ fontSize: 34, lineHeight: 1 }}>{card.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#f0abfc", marginTop: 10, letterSpacing: ".04em" }}>{sel} DE OCTUBRE · {card.year.toUpperCase()}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: "4px 0 10px" }}>{card.title}</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 12px", color: "rgba(240,230,255,.88)" }}>{card.fact}</p>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, fontWeight: 600, color: "#fbcfe8" }}>{card.love}</p>
            {isBday && (
              <button onClick={onFinale} style={{ width: "100%", marginTop: 18, fontSize: 16, fontWeight: 800, color: "#fff", background: `linear-gradient(135deg,${P.p1},${P.p3})`, border: "none", borderRadius: 26, padding: "15px", cursor: "pointer", boxShadow: "0 0 30px rgba(219,39,119,.5)" }}>
                {now.phase === "birthday" ? "Abrir mi regalo 🎁" : "Ver la sorpresa otra vez 🎆"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
