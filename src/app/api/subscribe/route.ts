import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, trees, done, freqHours } = body;

    if (!subscription) {
      return NextResponse.json({ error: "No subscription" }, { status: 400 });
    }

    // Leer datos existentes para no perder lastNotifiedAt
    let lastNotifiedAt: string | null = null;
    try {
      const { blobs } = await list({ prefix: "conjita-push-data" });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url);
        const existing = await res.json();
        lastNotifiedAt = existing.lastNotifiedAt || null;
      }
    } catch { /* primera vez */ }

    const data = {
      subscription,
      trees: trees || [],
      done: done || {},
      freqHours: freqHours || 3,
      lastNotifiedAt,
      subscribedAt: new Date().toISOString(),
    };

    await put("conjita-push-data.json", JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
