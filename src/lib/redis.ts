import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  url && token
    ? new Redis({ url, token })
    : new Redis({
        url: "https://placeholder-redis.upstash.io",
        token: "placeholder-token",
      });