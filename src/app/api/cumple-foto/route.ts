import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { PREVIEW_TOKEN } from "@/lib/cumple";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Las fotos viven en un Blob privado y solo se entregan el 20 de octubre (hora de Bogotá).
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const n = Number(sp.get("n"));
  if (!Number.isInteger(n) || n < 1 || n > 20) return new NextResponse("no", { status: 404 });

  const bogota = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  const open = bogota.slice(5) === "10-20";
  if (!open && sp.get("k") !== PREVIEW_TOKEN) return new NextResponse("todavía no", { status: 403 });

  try {
    const { blobs } = await list({ prefix: `cumple/foto-${n}.jpg` });
    if (!blobs.length) return new NextResponse("no", { status: 404 });
    const token = process.env.BLOB_READ_WRITE_TOKEN || "";
    const res = await fetch(blobs[0].url, { headers: token ? { authorization: `Bearer ${token}` } : undefined });
    if (!res.ok) return new NextResponse("no", { status: 404 });
    return new NextResponse(res.body, { headers: { "content-type": "image/jpeg", "cache-control": "private, max-age=3600" } });
  } catch {
    return new NextResponse("error", { status: 500 });
  }
}
