import { GoogleGenerativeAI } from "@google/generative-ai";

export interface VectorChunk {
  id: string;
  text: string;
  embedding: number[];
}

export interface SearchResult {
  text: string;
  score: number;
}

// In-memory vector store keyed by website URL
const vectorStore = new Map<string, VectorChunk[]>();

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dot / magnitude;
}

export function splitTextIntoChunks(
  text: string,
  chunkSize = 700,
  overlap = 120
): string[] {
  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    let end = i + chunkSize;

    if (end < text.length) {
      // Find natural break points (paragraphs, periods, spaces)
      const doubleNewline = text.lastIndexOf("\n\n", end);
      if (doubleNewline > i + 250) {
        end = doubleNewline + 2;
      } else {
        const sentenceEnd = text.lastIndexOf(". ", end);
        if (sentenceEnd > i + 250) {
          end = sentenceEnd + 2;
        } else {
          const space = text.lastIndexOf(" ", end);
          if (space > i + 250) {
            end = space + 1;
          }
        }
      }
    }

    const chunk = text.slice(i, end).trim();
    if (chunk.length > 20) {
      chunks.push(chunk);
    }

    i = Math.max(i + 1, end - overlap);
  }

  return chunks;
}

export async function indexWebsiteVectors(
  url: string,
  content: string,
  apiKey: string
): Promise<VectorChunk[]> {
  const existing = vectorStore.get(url);
  if (existing && existing.length > 0) {
    return existing;
  }

  const rawChunks = splitTextIntoChunks(content, 700, 120);
  if (rawChunks.length === 0) {
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const embeddingModel = genAI.getGenerativeModel({
    model: "gemini-embedding-001",
  });

  const indexedChunks: VectorChunk[] = [];
  const BATCH_SIZE = 40;

  for (let b = 0; b < rawChunks.length; b += BATCH_SIZE) {
    const batch = rawChunks.slice(b, b + BATCH_SIZE);

    try {
      const response = await embeddingModel.batchEmbedContents({
        requests: batch.map((text) => ({
          content: { role: "user", parts: [{ text }] },
        })),
      });

      response.embeddings.forEach((emb, idx) => {
        indexedChunks.push({
          id: `${b + idx}`,
          text: batch[idx],
          embedding: emb.values,
        });
      });
    } catch (batchErr) {
      console.warn("Failed to embed batch, falling back individually:", batchErr);
      for (let j = 0; j < batch.length; j++) {
        try {
          const single = await embeddingModel.embedContent(batch[j]);
          indexedChunks.push({
            id: `${b + j}`,
            text: batch[j],
            embedding: single.embedding.values,
          });
        } catch (singleErr) {
          console.error("Single embed error:", singleErr);
        }
      }
    }
  }

  vectorStore.set(url, indexedChunks);
  return indexedChunks;
}

export async function searchSimilarChunks(
  url: string,
  query: string,
  apiKey: string,
  topK = 5
): Promise<SearchResult[]> {
  const chunks = vectorStore.get(url);
  if (!chunks || chunks.length === 0) {
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const embeddingModel = genAI.getGenerativeModel({
    model: "gemini-embedding-001",
  });

  // Embed the user's query into the same vector space
  const queryEmbedResponse = await embeddingModel.embedContent(query);
  const queryVector = queryEmbedResponse.embedding.values;

  // Calculate cosine similarity for all indexed chunks
  const scored = chunks.map((chunk) => ({
    text: chunk.text,
    score: cosineSimilarity(queryVector, chunk.embedding),
  }));

  // Rank by similarity descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}
