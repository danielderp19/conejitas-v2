import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PREVIEW_TOKEN } from "@/lib/cumple";
import { FOTOS_ENC } from "@/lib/cumpleFotos.enc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Las fotos están cifradas en el repo y solo se descifran aquí, desde el 20 de octubre hasta el 20 de noviembre (hora de Bogotá).
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const n = Number(sp.get("n"));
  const data = FOTOS_ENC[n];
  if (!data) return new NextResponse("no", { status: 404 });

  const bogota = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  const y = bogota.slice(0, 4);
  const open = bogota >= `${y}-10-20` && bogota <= `${y}-11-20`;
  if (!open && sp.get("k") !== PREVIEW_TOKEN) return new NextResponse("todavía no", { status: 403 });

  const hex = process.env.CUMPLE_FOTO_KEY;
  if (!hex) return new NextResponse("error", { status: 500 });
  try {
    const buf = Buffer.from(data, "base64");
    const d = crypto.createDecipheriv("aes-256-gcm", Buffer.from(hex, "hex"), buf.subarray(0, 12));
    d.setAuthTag(buf.subarray(12, 28));
    const img = Buffer.concat([d.update(buf.subarray(28)), d.final()]);
    return new NextResponse(img, { headers: { "content-type": "image/jpeg", "cache-control": "private, max-age=3600" } });
  } catch {
    return new NextResponse("error", { status: 500 });
  }
}
