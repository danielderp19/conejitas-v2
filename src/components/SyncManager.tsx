"use client";
import { useEffect, useRef } from "react";

// Datos reales a sincronizar (no banderas de UI ni el token OAuth del dispositivo)
const SYNC_KEYS = [
  "conejitas-state-v1",     // tareas
  "conjita-mood-v2",        // ánimos
  "conjita-dates-v1",       // cuenta regresiva
  "conjita-visionboard-v1", // vision board
  "conjita-story-v1",       // nuestra historia
  "conjita-gcal-clientid",  // client id de calendar
  "conjita-completions-v1", // historial de completados (estadísticas)
];
const CODE_KEY = "conjita-sync-code";
const REV_KEY  = "conjita-sync-rev";  // updatedAt de los datos que tenemos
const HASH_KEY = "conjita-sync-hash"; // hash de la última sincronización

function snapshot(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of SYNC_KEYS) {
    const v = localStorage.getItem(k);
    if (v != null) out[k] = v;
  }
  return out;
}
const hashOf = (s: Record<string, string>) => JSON.stringify(s);

export default function SyncManager() {
  const busy = useRef(false);
  const lastPointerActivity = useRef(0);

  useEffect(() => {
    const code = (localStorage.getItem(CODE_KEY) || "").trim();
    if (!code) return;

    // Marca cualquier interacción táctil/mouse reciente (drag en Vision Board,
    // sliders, etc.) para no pisar cambios locales en pleno gesto.
    const markActivity = () => { lastPointerActivity.current = Date.now(); };
    window.addEventListener("mousedown", markActivity, true);
    window.addEventListener("touchstart", markActivity, true);

    const sync = async () => {
      if (busy.current) return;
      busy.current = true;
      try {
        const localSnap = snapshot();
        const localHash = hashOf(localSnap);
        const lastHash  = localStorage.getItem(HASH_KEY) || "";
        const rev       = Number(localStorage.getItem(REV_KEY) || "0");

        // 1) DESCARGAR: si la nube es más nueva (la subió el otro dispositivo) → aplicar
        const res = await fetch(`/api/sync?code=${encodeURIComponent(code)}`);
        const remote = await res.json();
        if (remote && remote.data && Number(remote.updatedAt) > rev) {
          // Si está escribiendo o interactuando (arrastrando algo, un slider…),
          // no pisamos nada todavía; reintenta en el próximo ciclo (5s)
          const active = document.activeElement as HTMLElement | null;
          const typing = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");
          const midGesture = Date.now() - lastPointerActivity.current < 1500;
          if (typing || midGesture) return;
          for (const k of SYNC_KEYS) {
            if (remote.data[k] != null) localStorage.setItem(k, remote.data[k]);
            else localStorage.removeItem(k);
          }
          localStorage.setItem(REV_KEY, String(remote.updatedAt));
          localStorage.setItem(HASH_KEY, hashOf(remote.data));
          // Aplica en vivo (sin recargar) avisando a las pantallas
          window.dispatchEvent(new Event("conjita-sync-applied"));
          return;
        }

        // 2) SUBIR: solo si los datos locales cambiaron desde la última sincronización
        if (localHash !== lastHash) {
          const updatedAt = Date.now();
          const r = await fetch("/api/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, data: localSnap, updatedAt }),
          });
          if (r.ok) {
            localStorage.setItem(REV_KEY, String(updatedAt));
            localStorage.setItem(HASH_KEY, localHash);
          }
        }
      } catch { /* sin red — se reintenta luego */ }
      finally { busy.current = false; }
    };

    sync();
    const interval = setInterval(sync, 5000);
    const onVis = () => { if (document.visibilityState === "visible") sync(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", sync);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", sync);
      window.removeEventListener("mousedown", markActivity, true);
      window.removeEventListener("touchstart", markActivity, true);
    };
  }, []);

  return null;
}
