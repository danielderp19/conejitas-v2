// Fecha en formato YYYY-MM-DD usando la ZONA HORARIA LOCAL del dispositivo.
// OJO: nunca usar `date.toISOString().split("T")[0]` para "el día de hoy" —
// toISOString() devuelve la fecha en UTC, así que en zonas horarias negativas
// (ej. Colombia, UTC-5) el día cambiaría varias horas antes de la medianoche
// local, desincronizando el mood del día, la cuenta regresiva y las estadísticas.
export function localDateStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
