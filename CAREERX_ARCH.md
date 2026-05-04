# CareerX: The Cognitive Career Discovery Engine

CareerX is a high-fidelity, data-driven platform designed to provide hyper-personalized career trajectories. Unlike traditional "career tests," it combines **Real-Time Market Research** with **Generative Synthesis** to build an immersive professional dashboard.

## 1. Core Architecture

The system is built on a modern, decentralized tech stack:

- **Frontend**: Next.js 15+ (App Router) with Tailwind CSS.
- **Intelligence**: Google Gemini 1.5 Flash (via Vercel AI SDK).
- **Search Infrastructure**: Self-hosted **SearXNG** running in **Docker**.
- **Animations**: Framer Motion for cinematic UI transitions.
- **Validation**: Zod for strictly typed data schemas.

---

## 2. The Multi-Stage Intelligence Flow

The "Intelligence Engine" follows a three-stage protocol to ensure zero hallucination and maximum relevance:

### Stage 1: Dimensional Assessment (The Questionnaire)
The user completes a structured questionnaire. These answers aren't just stored; they are mapped to professional schemas (e.g., studentType, location, specific career ambitions).

### Stage 2: The Research Strategist (Planning)
An AI strategist analyzes the profile and generates **6–8 diverse search queries**. These queries are designed to sweep for:
- **Market Reality**: Real salary data and industry demand trends.
- **Community Pulse**: Opinions from Reddit and professional forums via specialized site-searches.
- **Institutional Mapping**: Next-level academic programs (e.g., if you have a B.Tech, it finds M.Tech/MS/MBA options).

### Stage 3: Decentralized Synthesis (RAG)
CareerX fetches up to **100+ raw data nodes** from SearXNG. The system luego applies a **Retrieval-Augmented Generation (RAG)** algorithm to synthesize:
- **Personalized Path Hub**: Dynamic "Visual Explorer" with interactive career nodes.
- **Execution Roadmaps**: A 5-year strategic plan for skill acquisition.
- **Job Market Analysis**: Real-time roles with pre-filled portal links (LinkedIn, Wellfound, etc.).
- **Institutional Network**: Top universities and scholarships matching the user's velocity.

---

## 3. Why Docker? (The SearXNG Protocol)

We use Docker to host our own search gateway for the following reasons:

1.  **Privacy & Independence**: By self-hosting SearXNG, we eliminate dependency on expensive third-party search APIs and prevent user data from being tracked by major advertisers.
2.  **Raw Data Access**: We disable search rate-limiters in the Docker environment (`SEARXNG_DISABLE_LIMITER=1`), allowing the AI to scrape massive amounts of data in seconds.
3.  **Engine Customization**: We customize the search engines to include niche tech forums, scientific journals, and specialized regional databases that are often hidden by Google's algorithms.

---

## 4. Premium Design Philosophy

CareerX is designed to feel like a "Command Center," not a website:

- **Glassmorphism**: Use of subtle blurs, radial gradients, and noise overlays for depth.
- **Non-Linear Navigation**: A fluidity-first top-tab system instead of traditional sidebars.
- **Empty State Fidelity**: Even when data is missing, the system uses custom-crafted "EmptyState" components to maintain professional consistency.
- **Visual Storytelling**: The "Visual Explorer" allows users to discover pathways as an interconnected web rather than a boring list.

---

## 5. Development Setup

1.  **Initialize Infrastructure**:
    ```bash
    docker compose up -d
    ```
2.  **Environment Sync**:
    Create `.env.local` with `GOOGLE_GENERATIVE_AI_API_KEY` and `SEARXNG_URL`.
3.  **Launch Dashboard**:
    ```bash
    npm run dev
    ```
