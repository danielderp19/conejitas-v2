"use client";
import { useEffect } from "react";

export default function PWARegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then((reg) => {
      // Forzar búsqueda de actualización cada vez que se abre la app
      reg.update();

      // Cuando hay un nuevo SW instalado, activarlo inmediatamente
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // Nuevo SW listo — recargar para aplicarlo
            window.location.reload();
          }
        });
      });
    }).catch(() => {});

    // Si el SW cambia de controlador (por skipWaiting), recargar
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }, []);

  return null;
}
