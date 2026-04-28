import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  "You are a customer service assistant for ARYO, a luxury clothing brand. The collection is called Pennicella | AF by ARYO. There is a Structure Jacket (£200, Noir and Ivory colourways, made to order) and an Essential Trouser (£100, Noir and Ivory colourways, only 100 made). Be helpful, concise, and professional. Answer questions about the products, sizing (XS–XL), shipping (worldwide), and returns (14-day window, unworn condition).";

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!messages?.length) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
