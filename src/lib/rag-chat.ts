import { RAGChat, upstash, openai } from "@upstash/rag-chat";
import { Index } from "@upstash/vector";
import { redis } from "./redis";

const vectorUrl = process.env.UPSTASH_VECTOR_REST_URL;
const vectorToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

const vector =
  vectorUrl && vectorToken
    ? new Index({ url: vectorUrl, token: vectorToken })
    : new Index({
        url: "https://placeholder-vector.upstash.io",
        token: "placeholder-token",
      });

const getModel = () => {
  if (process.env.OPENAI_API_KEY) {
    return openai("gpt-4o-mini");
  }
  return upstash("mistralai/Mistral-7B-Instruct-v0.2", {
    apiKey: process.env.QSTASH_TOKEN || "placeholder-token",
  });
};

export const ragChat = new RAGChat({
  model: getModel(),
  redis: redis,
  vector: vector,
});