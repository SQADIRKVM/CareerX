import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { auth } from '@/lib/auth/server';

export async function POST(req: Request) {
    try {
        const { data: session } = await auth.getSession();
        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { resumeContent, missingKeywords } = await req.json();
        if (!resumeContent) {
            return Response.json({ error: "Resume content is required" }, { status: 400 });
        }

        const prompt = `You are an expert ATS (Applicant Tracking System) Resume Optimizer.
Your job is to rewrite the provided resume content to naturally and seamlessly incorporate the missing keywords listed below.

CRITICAL RULES:
1. Preserve the user's actual experiences, job titles, and academic qualifications. Do NOT invent fake jobs, degrees, or companies.
2. Weave the missing keywords smoothly and organically into existing resume bullet points or skills sections. Avoid simply listing them at the end.
3. Keep the overall professional, premium tone.
4. Highlight exactly what changes you made so the user can see.

MISSING KEYWORDS TO INCORPORATE:
${JSON.stringify(missingKeywords)}

ORIGINAL RESUME CONTENT:
${resumeContent}
`;

        const result = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: z.object({
                optimizedResume: z.string().describe("The fully optimized, rewritten resume content in clean, professional markdown."),
                changesMade: z.array(z.string()).describe("A list of specific bullet points and modifications made to incorporate the keywords.")
            }),
            prompt,
        });

        return Response.json({ success: true, ...result.object });
    } catch (error) {
        console.error("Optimize Resume API Error:", error);
        return Response.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
