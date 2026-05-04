# AI-Based Career Guidance System (Wizard Edition)

A production-ready Next.js 15 application that provides personalized career guidance using an AI-led questionnaire and live internet search.

## Features
- **Dynamic Wizard UI**: No chat history. Focused, single-question interface tailored to the user.
- **AI-Led Logic**: The AI (GPT-4o) decides whether to ask another question or perform a search based on user answers.
- **Live Search Integration**: Uses self-hosted SearxNG to validate career paths with real-time college/course data.
- **Structured Output**: Uses `generateObject` for deterministic UI control.

## Setup

1. **Start SearxNG (Search Engine)**
   ```bash
   # Ensure Docker Desktop is running!
   docker compose up -d
   ```

2. **Environment Variables**
   Ensure `.env.local` has your API key:
   ```env
   OPENAI_API_KEY=sk-your-key
   SEARXNG_URL=http://127.0.0.1:8080
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Architecture
- **`app/page.tsx`**: The main Wizard UI state machine (`IDLE` -> `QUESTIONING` -> `SEARCHING` -> `COMPLETE`).
- **`app/api/guidance/route.ts`**: The brain. Uses `generateObject` to output strictly typed JSON for the UI.
- **`lib/schemas.ts`**: Zod definitions for the AI protocol.

## Troubleshooting
- **Docker**: If search hangs, ensure `docker compose` is running and port 8080 is accessible.
