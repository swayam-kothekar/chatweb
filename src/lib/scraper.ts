import * as cheerio from "cheerio";
import https from "https";
import http from "http";

interface ScrapedData {
  title: string;
  description: string;
  content: string;
  url: string;
  timestamp: number;
}

// In-memory cache to prevent re-fetching the same page across messages
const cache = new Map<string, ScrapedData>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

// Robust IPv4-first fetcher with redirection handling to avoid IPv6 timeouts
function fetchHtml(url: string, maxRedirects = 5): Promise<string> {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https:");
    const client = isHttps ? https : http;

    const req = client.get(
      url,
      {
        family: 4, // Force IPv4 to prevent undici/Node IPv6 ETIMEDOUT errors
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 12000,
      },
      (res) => {
        // Handle HTTP redirects (301, 302, 307, 308)
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location &&
          maxRedirects > 0
        ) {
          const nextUrl = new URL(res.headers.location, url).href;
          return resolve(fetchHtml(nextUrl, maxRedirects - 1));
        }

        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      }
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out after 12 seconds"));
    });
  });
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached;
  }

  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  // Remove clutter, scripts, styles, navigation, and advertisement elements
  $(
    "script, style, nav, footer, header, noscript, iframe, svg, aside, .ad, .ads, .advertisement, #cookie-banner, .cookie-banner"
  ).remove();

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim() ||
    url;

  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";

  // Add line breaks around block elements before extracting text
  $("h1, h2, h3, h4, h5, h6, p, li, tr, blockquote, pre, code").each(
    (_, el) => {
      $(el).append("\n\n");
    }
  );

  // Prefer article/main if present, otherwise body
  let rawText = "";
  if ($("main").length) {
    rawText = $("main").text();
  } else if ($("article").length) {
    rawText = $("article").text();
  } else {
    rawText = $("body").text();
  }

  // Normalize whitespace and blank lines
  const cleanContent = rawText
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();

  // Limit content to ~100,000 characters to comfortably stay within rate limits
  const content =
    cleanContent.length > 100000
      ? cleanContent.slice(0, 100000) + "\n\n[Content truncated for length...]"
      : cleanContent;

  const data: ScrapedData = {
    title,
    description,
    content: content || "No readable textual content could be extracted.",
    url,
    timestamp: Date.now(),
  };

  cache.set(url, data);
  return data;
}
