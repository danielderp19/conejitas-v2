import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ content: [{ type: "text", text: "API key no configurada." }] });
    }

    const body = await req.json();
    const { system, messages, max_tokens } = body;

    if (!Array.isArray(messages)) {
      return NextResponse.json({ content: [{ type: "text", text: "Formato inválido." }] });
    }

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: max_tokens ?? 1500,
      messages: [
        { role: "system", content: system ?? "" },
        ...messages,
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ content: [{ type: "text", text }] });

  } catch (err) {
    console.error("Error en /api/chat:", err);
    return NextResponse.json({ content: [{ type: "text", text: "Error al procesar la solicitud." }] });
  }
}
