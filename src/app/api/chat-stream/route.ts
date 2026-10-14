import { scrapeWebsite } from "@/lib/scraper";
import {
  indexWebsiteVectors,
  searchSimilarChunks,
} from "@/lib/vector-store";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.warn("Rejected chat request: empty or invalid messages array", body);
      return NextResponse.json(
        { error: "Invalid request: messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    // 1. Resolve and clean target website URL from body or referer fallback
    let rawTargetUrl: string | undefined = body.websiteUrl || body.url || body.source;

    if (!rawTargetUrl) {
      const referer = req.headers.get("referer");
      if (referer) {
        try {
          const parsed = new URL(referer);
          rawTargetUrl = parsed.pathname.replace(/^\/+/, "");
        } catch {
          // ignore referer parse failure
        }
      }
    }

    if (!rawTargetUrl) {
      console.warn("Rejected chat request: missing target website URL", body);
      return NextResponse.json(
        {
          error:
            "Invalid request: websiteUrl is required and could not be detected from referer",
        },
        { status: 400 }
      );
    }

    // Canonicalize target URL and strip any nested/duplicate protocols
    const cleanUrlPart = rawTargetUrl.replace(/^(?:https?:\/?\/)+/gi, "");
    const targetUrl = `https://${cleanUrlPart}`;

    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!geminiKey) {
      console.error("Missing GEMINI_API_KEY in environment");
      return NextResponse.json(
        {
          error:
            "Missing GEMINI_API_KEY. Please add GEMINI_API_KEY to your .env file. (Get a free key from https://aistudio.google.com)",
        },
        { status: 500 }
      );
    }

    // 2. Extract website content
    let siteTitle = targetUrl;
    let siteContent = "";
    try {
      const scraped = await scrapeWebsite(targetUrl);
      siteTitle = scraped.title;
      siteContent = scraped.content;
    } catch (scrapeErr: unknown) {
      const msg = scrapeErr instanceof Error ? scrapeErr.message : "Fetch failed";
      console.warn(`Extraction warning for ${targetUrl}:`, msg);
      siteContent = `Website extraction note: ${msg}`;
    }

    // 3. TRUE RAG: Index chunks into in-memory vector store with embeddings
    const latestUserMessage =
      messages[messages.length - 1]?.content || "Summarize this page";

    let retrievedContext = "";
    try {
      await indexWebsiteVectors(targetUrl, siteContent, geminiKey);
      const topChunks = await searchSimilarChunks(
        targetUrl,
        latestUserMessage,
        geminiKey,
        5
      );

      if (topChunks.length > 0) {
        console.log(
          `[True Vector RAG] Retrieved ${topChunks.length} chunks (best score: ${topChunks[0].score.toFixed(3)}) for query: "${latestUserMessage}"`
        );
        retrievedContext = topChunks
          .map(
            (c, i) =>
              `[Retrieved Chunk ${i + 1} | Cosine Similarity: ${c.score.toFixed(3)}]\n${c.text}`
          )
          .join("\n\n---\n\n");
      } else {
        retrievedContext = siteContent.slice(0, 5000);
      }
    } catch (ragErr) {
      console.warn("Vector RAG retrieval fallback:", ragErr);
      retrievedContext = siteContent.slice(0, 10000);
    }

    // 4. Augment Prompt with Retrieved Vector Chunks
    const systemPrompt = `You are an expert AI assistant answering questions about the webpage:
Title: "${siteTitle}"
URL: ${targetUrl}

Below are the most relevant context snippets retrieved from the vector database using semantic similarity search:
==================================================
${retrievedContext}
==================================================

RAG Instructions:
1. Answer the user's question accurately using ONLY the information available in the retrieved vector context snippets above.
2. If the user asks for a summary, synthesize the main topics and takeaways from the retrieved information.
3. If the answer is not mentioned in the retrieved context, politely clarify that it is not covered in the page content.
4. Format your responses with clean Markdown (bullet points, bold text, headers, and code blocks).`;

    // 5. Generate and Stream Answer with Gemini 3.5 Flash Lite
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      systemInstruction: systemPrompt,
    });

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await model.generateContentStream({ contents });
    const stream = GoogleGenerativeAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Chat API error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};