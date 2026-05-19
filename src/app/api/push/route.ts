import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { put, list } from "@vercel/blob";

export const runtime = "nodejs";

interface TreeNode {
  id: string;
  title: string;
  children?: TreeNode[];
}

function hasPending(node: TreeNode, done: Record<string, boolean>): boolean {
  if (!node.children || node.children.length === 0) return !done[node.id];
  return node.children.some((c) => hasPending(c, done));
}

function countPending(node: TreeNode, done: Record<string, boolean>): number {
  if (!node.children || node.children.length === 0) return done[node.id] ? 0 : 1;
  return node.children.reduce((s, c) => s + countPending(c, done), 0);
}

function buildMessage(pending: TreeNode[], done: Record<string, boolean>): string {
  const names = pending.map((t) => `"${t.title}"`).join(", ");
  const total = pending.reduce((s, t) => s + countPending(t, done), 0);
  const pl = total !== 1;
  const special = Math.random() < 0.18;

  if (special) return `💜 Recuerda hacer ${names}. El que programó esto te ama 🐰`;

  const opts = [
    `¡Ey! Tienes ${total} tarea${pl ? "s" : ""} pendiente${pl ? "s" : ""} en ${names}. ¡Tú puedes! 💪`,
    `✨ Aún tienes ${names} por completar. ¡Pequeños pasos, grandes logros! 🌟`,
    `🌸 No olvides ${names}. ${total} cosa${pl ? "s" : ""} esperando. ¡Sí se puede!`,
    `🐰 Oye, ${names} sigue${pending.length > 1 ? "n" : ""} esperando. ¡No te rajes! 💫`,
    `🎯 ${names} te espera${pending.length > 1 ? "n" : ""}. ¡Casi casi! 🚀`,
  ];
  return opts[Math.floor(Math.random() * opts.length)];
}

export async function GET(req: NextRequest) {
  // Verificar que es el cron de Vercel
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Configurar VAPID aquí (no en el módulo) para evitar error en build
  const vapidPublic = process.env.VAPID_PUBLIC_KEY || "";
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY || "";
  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:conjita@app.com",
    vapidPublic,
    vapidPrivate
  );

  try {
    const { blobs } = await list({ prefix: "conjita-push-data" });
    if (blobs.length === 0) return NextResponse.json({ ok: false, reason: "no data" });

    const res = await fetch(blobs[0].url + `?t=${Date.now()}`); // evitar caché
    const data = await res.json();

    if (!data.subscription) return NextResponse.json({ ok: false, reason: "no subscription" });

    // Verificar frecuencia
    const freqMs = (data.freqHours || 3) * 60 * 60 * 1000;
    const last = data.lastNotifiedAt ? new Date(data.lastNotifiedAt).getTime() : 0;
    if (Date.now() - last < freqMs) {
      return NextResponse.json({ ok: false, reason: "too soon" });
    }

    // Verificar tareas pendientes
    const trees: TreeNode[] = data.trees || [];
    const done: Record<string, boolean> = data.done || {};
    const pending = trees.filter((t) => hasPending(t, done));
    if (pending.length === 0) return NextResponse.json({ ok: false, reason: "all done!" });

    // Enviar push
    const body = buildMessage(pending, done);
    await webpush.sendNotification(
      data.subscription,
      JSON.stringify({
        title: "Conjita's Dashboard 🐰",
        body,
        icon: "/bunny-icon.svg",
        badge: "/bunny-icon.svg",
        vibrate: [200, 100, 200],
      })
    );

    // Actualizar lastNotifiedAt
    await put("conjita-push-data.json", JSON.stringify({ ...data, lastNotifiedAt: new Date().toISOString() }), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    return NextResponse.json({ ok: true, sent: true, body });
  } catch (err: unknown) {
    console.error("Push error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
