import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Fecha oficial (Bogotá) desde el servidor: cambiar el reloj del celular no adelanta ningún día.
export async function GET() {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  return NextResponse.json({ date }, { headers: { "cache-control": "no-store" } });
}
