# 🎙️ News Perspective Podcast

**Live Demo:** [Insert Your Vercel Link Here]

News Perspective Podcast is a full-stack, AI-powered web application that revolutionizes how users consume daily news. It transforms traditional text-based news into an interactive, personalized, and accessible audio-visual experience. By leveraging artificial intelligence for article summarization and native browser APIs for Text-to-Speech (TTS), users can listen to concise news briefings on the go.

## ✨ Key Features

### 🤖 AI-Powered Summarization
- Automatically scrapes full-length article content across various news domains using **Cheerio**.
- Integrates with the **Hugging Face API (BART-large-CNN)** to dynamically generate accurate, digestible summaries of long-form articles, calculating optimal summary lengths based on the original text volume.

### 🎧 Multilingual Audio Playback (TTS)
- Incorporates the **Web Speech API** to transform AI summaries into podcast-style audio.
- Features dynamic playback speed controls (0.5x to 2.0x) and supports multiple synthesized languages mapped directly to user preferences.

### 👤 Robust Personalization & Authentication
- Secure **JWT-based authentication** with password encryption via bcrypt.
- **Reading History & Bookmarks:** Automatically tracks read articles and allows users to save articles for later.
- **Personalized Notes:** Users can attach and manage custom, persistent notes directly on their saved articles.

### 🎨 Dynamic User Interface & Theming
- Fully responsive, glassmorphism-inspired UI built with **React**, **Vite**, and **Tailwind CSS**.
- Fluid micro-animations and page transitions powered by **Framer Motion**.
- Global preference engine allowing users to customize their experience in real-time, including:
  - System Theme (Light/Dark mode)
  - UI Font Size scaling
  - Content Language localization (i18n capable)
  - Default Podcast Playback Speed

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)** – Fast, modern frontend framework.
- **Tailwind CSS** – Utility-first frame for rapid, responsive styling.
- **Framer Motion** – Production-ready animations.
- **Axios** – HTTP client for API interactions.
- **React Router DOM** – declarative routing for single-page applications.

### Backend
- **Node.js & Express.js** – RESTful API architecture.
- **MongoDB & Mongoose** – NoSQL database for flexible, scalable data storage.
- **JSON Web Tokens (JWT)** – Secure, stateless user sessions.
- **Cheerio** – Server-side DOM manipulation for web scraping.

### Third-Party Integrations
- **NewsAPI** – Real-time global news aggregation.
- **Hugging Face Inference API** – NLP models for text summarization.
- **Web Speech API** – Native browser text-to-speech synthesis.

## 🚀 Local Development Setup

To run this project locally, you will need Node.js and MongoDB installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/Risika-25/News-Perpective-.git
cd News-Perpective-
