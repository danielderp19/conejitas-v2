import { CONEJITA } from "@/lib/moodBunny";

export const MOOD_KEY = "conjita-mood-v2";

// ── 24 estados de ánimo de la conejita (compartido entre rinconcito y estadísticas) ──
export const MOODS: { key: string; label: string; color: string; cap: string }[] = [
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
export const MOOD_BY_KEY: Record<string, typeof MOODS[number]> = Object.fromEntries(MOODS.map(m => [m.key, m]));

export interface MoodDay { date: string; moods: string[]; title?: string; note?: string; msg?: string; }

// Figura de la conejita (cabeza + corona) según el ánimo
function bunnyFigure(expr: string) {
  return CONEJITA.svgWrap("8 14 224 252", CONEJITA.bunnyFront({ expr, crown: true, body: false }));
}
export function MoodBunny({ expr, size }: { expr: string; size: number }) {
  return (
    <span
      aria-hidden
      style={{ display: "inline-flex", width: size, height: size * 1.12, lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: bunnyFigure(expr) }}
    />
  );
}
