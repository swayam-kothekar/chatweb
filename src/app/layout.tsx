import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatWeb — Chat with Any Website",
  description:
    "Transform any webpage, article, or documentation into an interactive AI conversation powered by Retrieval-Augmented Generation (RAG).",
  keywords: ["RAG", "AI Chatbot", "Chat with Website", "Next.js", "Upstash"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-gray-950 text-gray-100 antialiased")}>
        <Providers>
          <main className="min-h-screen dark text-foreground bg-background">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
