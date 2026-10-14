# 🗨️ ChatWeb – Chat with Any Website (True In-Memory Vector RAG)

ChatWeb is an AI-powered conversational chatbot that enables users to interact with any **website, article, or documentation page** in real-time using **Retrieval-Augmented Generation (RAG)**.

By simply entering a target URL, ChatWeb extracts the page content, chunks it into semantic paragraphs, generates high-dimensional vector embeddings, indexes them into an in-memory vector store, and streams factual answers using Google's **Gemini 3.5 Flash Lite**.

---

## 🚀 Key Highlights

- 🧠 **True Vector RAG Architecture**:
  1. **Chunking**: Breaks extracted webpage text into overlapping semantic blocks.
  2. **Vector Embeddings**: Generates 3,072-dimensional vector embeddings using Google's `gemini-embedding-001`.
  3. **Cosine Similarity Search**: Performs real-time mathematical vector similarity ranking to retrieve the Top-K most relevant chunks for every question.
  4. **Grounding & Generation**: Augments the model's prompt with retrieved vector snippets and streams answers.
- ⚡ **Zero Database Setup**: Runs an in-memory vector store directly in server memory. **No Pinecone, Upstash, or external databases to configure or maintain.**
- 🔒 **Never Gets Deleted or Paused**: Because there is no external database tier, your application will **never expire or pause due to inactivity**.
- 🌐 **Always Live & Fresh**: Pulls current live website content dynamically on demand.
- 💬 **Multi-Turn Chat**: Natural conversational interface with suggested prompt chips and rich Markdown rendering.
- 🎨 **Modern Dark UI**: Ambient glassmorphism, responsive mobile-ready layout, code block syntax, and 1-click copy actions.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, Tailwind CSS, NextUI, Lucide Icons, React Markdown
- **Scraping Engine**: Cheerio (fast HTML parsing & structural text extraction)
- **Embedding Model**: Google `gemini-embedding-001` (3,072 dimensions)
- **Vector Search Engine**: In-memory Cosine Similarity Vector Index
- **Generation LLM**: Google `gemini-3.5-flash-lite`
- **Streaming**: Vercel AI SDK (`useChat`, `GoogleGenerativeAIStream`)

---

## ⚙️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Get your **free API key** at [aistudio.google.com](https://aistudio.google.com) (no credit card required) and add it to `.env`:
```bash
cp .env.example .env
```

Inside `.env`:
```env
# Free Google Gemini API Key
GEMINI_API_KEY="AIzaSy..."
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 How the True RAG Pipeline Works

```
  [User enters URL] 
         │
         ▼
  [Cheerio HTML Scraper] ──► Strips headers, navigation, ads, & scripts
         │
         ▼
  [Text Splitter] ─────────► Splits text into 700-character overlapping chunks
         │
         ▼
  [Gemini Embedding-001] ──► Generates 3,072-dim vectors for each chunk
         │
         ▼
  [In-Memory Vector Store] ─► Stores { chunk_id, text, vector } in server memory
         │
  [User asks question]
         │
         ▼
  [Vector Search] ─────────► Computes cosine similarity, retrieves Top-5 relevant chunks
         │
         ▼
  [Prompt Augmentation] ───► Stuffs Top-5 retrieved chunks into context
         │
         ▼
  [Gemini 3.5 Flash Lite] ──► Streams grounded, factual answer back to the UI
```
