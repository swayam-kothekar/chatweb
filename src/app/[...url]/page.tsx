import { ChatWrapper } from "@/components/ChatWrapper";
import { scrapeWebsite } from "@/lib/scraper";
import { indexWebsiteVectors } from "@/lib/vector-store";

interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

function reconstructUrl({ url }: { url: string[] | string }): string {
  if (!url) return "";
  const rawParts = Array.isArray(url) ? url : [url];
  const decoded = rawParts.map((part) => decodeURIComponent(part)).join("/");
  const cleanPart = decoded.replace(/^(?:https?:\/?\/)+/gi, "");
  return `https://${cleanPart}`;
}

const Page = async ({ params }: PageProps) => {
  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });

  let siteTitle = reconstructedUrl;
  let indexingError: string | null = null;

  try {
    const scraped = await scrapeWebsite(reconstructedUrl);
    siteTitle = scraped.title;

    // Pre-index vectors in the background so query retrieval is instantaneous
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (geminiKey && scraped.content) {
      indexWebsiteVectors(reconstructedUrl, scraped.content, geminiKey).catch(
        (err) => console.warn("Background vector indexing warning:", err)
      );
    }
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Failed to load website content";
    console.warn("Could not pre-fetch website:", errorMsg);
    indexingError =
      "Could not directly extract text from this URL. You can still ask general questions about it.";
  }

  return (
    <ChatWrapper
      websiteUrl={reconstructedUrl}
      websiteTitle={siteTitle}
      indexingError={indexingError}
    />
  );
};

export default Page;