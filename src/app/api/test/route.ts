import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  const keyPreview = apiKey ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}` : "NO CONFIGURADA";

  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });
    const data = await res.json();
    return NextResponse.json({
      key: keyPreview,
      status: res.status,
      ok: res.ok,
      error: data.error ?? null,
      modelos: res.ok ? data.data?.slice(0, 3).map((m: {id: string}) => m.id) : null,
    });
  } catch (err) {
    return NextResponse.json({
      key: keyPreview,
      errorTipo: err instanceof Error ? err.constructor.name : typeof err,
      errorMsg: err instanceof Error ? err.message : String(err),
    });
  }
}
