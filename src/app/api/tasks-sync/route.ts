import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trees, done, freqHours } = body;

    // Leer datos existentes
    let existing: Record<string, unknown> = {};
    try {
      const { blobs } = await list({ prefix: "conjita-push-data" });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url);
        existing = await res.json();
      }
    } catch { /* sin datos */ }

    if (!existing.subscription) {
      return NextResponse.json({ ok: false, reason: "no subscription" });
    }

    const updated = {
      ...existing,
      trees: trees || [],
      done: done || {},
      freqHours: freqHours ?? existing.freqHours ?? 3,
    };

    await put("conjita-push-data.json", JSON.stringify(updated), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Tasks sync error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
