const CACHE = "conjita-v5";
const STATIC = ["/manifest.json", "/bunny-icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("/api/")) return;

  const url = new URL(e.request.url);

  if (url.pathname === "/" || e.request.headers.get("accept")?.includes("text/html")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// ─── Notificaciones ───────────────────────────────────────────────────────────
let notifTrees = [];
let notifDone = {};
let notifEnabled = false;
let notifTimer = null;
let notifFreqMs = 3 * 60 * 60 * 1000;

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === "ENABLE_NOTIFICATIONS") {
    notifTrees = data.trees || [];
    notifDone = data.done || {};
    notifEnabled = true;
    notifFreqMs = data.freqMs || 3 * 60 * 60 * 1000;
    startNotifTimer();
    return;
  }

  if (data.type === "UPDATE_TASKS") {
    notifTrees = data.trees || [];
    notifDone = data.done || {};
    return;
  }

  if (data.type === "DISABLE_NOTIFICATIONS") {
    notifEnabled = false;
    if (notifTimer) { clearInterval(notifTimer); notifTimer = null; }
    return;
  }
});

function hasPending(node, done) {
  if (!node.children || node.children.length === 0) return !done[node.id];
  return node.children.some((c) => hasPending(c, done));
}

function countPending(node, done) {
  if (!node.children || node.children.length === 0) return done[node.id] ? 0 : 1;
  return node.children.reduce((s, c) => s + countPending(c, done), 0);
}

function buildMessage(pending, done) {
  const names = pending.map((t) => `"${t.title}"`).join(", ");
  const total = pending.reduce((s, t) => s + countPending(t, done), 0);
  const plural = total !== 1;
  const useSpecial = Math.random() < 0.18;

  if (useSpecial) {
    return `💜 Recuerda hacer ${names}. Y recuerda: el que programó esto te ama 🐰`;
  }

  const opts = [
    `¡Ey! Tienes ${total} tarea${plural ? "s" : ""} pendiente${plural ? "s" : ""} en ${names}. ¡Tú puedes! 💪`,
    `✨ Pequeños pasos, grandes logros. Aún tienes ${names} por completar. ¡Vamos! 🌟`,
    `🌸 No olvides ${names}. ${total} cosa${plural ? "s" : ""} esperando por ti. ¡Sí se puede!`,
    `🎯 ${names} te espera${pending.length > 1 ? "n" : ""}. Solo ${total} tarea${plural ? "s" : ""} más. ¡Casi casi! 🚀`,
    `🐰 Oye, ${names} sigue${pending.length > 1 ? "n" : ""} esperando. ¡No te rajes! 💫`,
  ];

  return opts[Math.floor(Math.random() * opts.length)];
}

function sendNotification() {
  if (!notifEnabled) return;
  const pending = notifTrees.filter((t) => hasPending(t, notifDone));
  if (pending.length === 0) return;

  const body = buildMessage(pending, notifDone);

  self.registration.showNotification("Conjita's Dashboard 🐰", {
    body,
    icon: "/bunny-icon.svg",
    badge: "/bunny-icon.svg",
    tag: "conjita-reminder",
    renotify: true,
    vibrate: [200, 100, 200],
  });
}

function startNotifTimer() {
  if (notifTimer) clearInterval(notifTimer);
  notifTimer = setInterval(sendNotification, notifFreqMs);
}

// Push real desde el servidor
self.addEventListener("push", (event) => {
  let data = { title: "Conjita's Dashboard 🐰", body: "¡Tienes tareas pendientes! 💜" };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/bunny-icon.svg",
      badge: "/bunny-icon.svg",
      tag: "conjita-reminder",
      renotify: true,
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/");
    })
  );
});
