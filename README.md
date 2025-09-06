# 🗨️ ChatWeb – Chat with Any Website!  

ChatWeb is an **AI-powered chatbot** that enables users to interact with any **website or article** by simply **https://chatweb.swayamk.dev/**. The system extracts, vectorizes, and stores the website content in a **Pinecone vector database**, allowing seamless conversations.  

## 🚀 Features  

### 🔹 **Chat with Any Website**  
Transform static websites into interactive conversations. Extracts **text content** from any article or webpage and makes it **queryable** through an AI chatbot.  

### 🔹 **Retrieval-Augmented Generation (RAG)**  
Enhances chatbot responses by retrieving relevant information from **pre-stored website vectors**, ensuring **context-aware and factually grounded answers**.  

### 🔹 **Vector Database for Storage & Retrieval**  
Utilizes **Pinecone** to efficiently store and retrieve high-dimensional text embeddings, optimizing response accuracy and speed.  

### 🔹 **LLM-Powered Conversations**  
Integrates with **Large Language Models (LLMs)** to generate responses based on website content.  

### 🔹 **Persistent Chat History**  
Saves user interactions for previously visited websites, allowing users to **resume conversations** with past articles.  

## 🛠️ Tech Stack  

- **Frontend:** React, Next.js  
- **Backend:** Node.js, Express.js  
- **Database:** Pinecone (Vector Storage)  
- **Infrastructure:** AWS (Lambda, S3, API Gateway), Docker  

## 🔧 How It Works  

1. **User prepends the ChatWeb URL** to any article or website link.  
2. **Backend extracts, vectorizes, and stores** the website content in Pinecone.  
3. **Chatbot loads**, allowing users to ask questions about the page content.  
4. **LLM processes queries** and provides contextually relevant responses.  
5. **Chat history is saved**, enabling users to continue discussions from previous sessions.  


