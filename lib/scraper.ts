
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
];

/**
 * Simple web scraper utility for Deep Research.
 * Fetches HTML and extracts clean text content.
 */
export async function fetchPageContent(url: string): Promise<string> {
    try {

        
        // Randomized User-Agent for better anti-bot bypass
        const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

        const res = await fetch(url, {
            headers: {
                'User-Agent': randomUA,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            if (res.status !== 403 && res.status !== 404) {
                console.error(`Failed to fetch ${url}: ${res.status}`);
            }
            return "";
        }

        const html = await res.text();

        // Basic extraction: Remove script, style, and HTML tags
        const cleaned = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        // Limit to reasonable length (approx 10k chars) to avoid context bloat
        return cleaned.slice(0, 10000);
    } catch (e) {
        // Handle common fetch/DNS errors gracefully
        if (e instanceof Error) {
            if (e.name === 'AbortError') {
                console.warn(`Scraping timeout for ${url}`);
            } else {
                console.error(`Scraping error for ${url}:`, e.message);
            }
        }
        return "";
    }
}
