import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import crypto from "crypto";

export const runtime = "nodejs";
export const maxDuration = 30;

// Hash del código → nombre de archivo (no se guarda el código en claro)
function codeHash(code: string): string {
  return crypto.createHash("sha256").update("conjita-sync::" + code.trim().toLowerCase()).digest("hex").slice(0, 32);
}

// ── Descargar (otro dispositivo trae los últimos datos) ──
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code || code.trim().length < 3) {
    return NextResponse.json({ error: "código inválido" }, { status: 400 });
  }
  try {
    const prefix = `conjita-sync/${codeHash(code)}.json`;
    const { blobs } = await list({ prefix });
    if (blobs.length === 0) return NextResponse.json({ data: null, updatedAt: 0 });
    const res = await fetch(blobs[0].url + `?t=${Date.now()}`); // evitar caché
    const json = await res.json();
    return NextResponse.json({ data: json.data ?? null, updatedAt: json.updatedAt ?? 0 });
  } catch (err) {
    console.error("sync GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// ── Subir (este dispositivo guarda sus datos en la nube) ──
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, data, updatedAt } = body || {};
    if (!code || String(code).trim().length < 3) {
      return NextResponse.json({ error: "código inválido (mínimo 3 caracteres)" }, { status: 400 });
    }
    await put(`conjita-sync/${codeHash(code)}.json`, JSON.stringify({ data: data || {}, updatedAt: updatedAt || Date.now() }), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("sync POST error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
