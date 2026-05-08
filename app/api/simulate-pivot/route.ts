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

        const { currentPath, targetRole } = await req.json();
        if (!currentPath || !targetRole) {
            return Response.json({ error: "Current path and target role are required" }, { status: 400 });
        }

        const prompt = `You are a world-class strategic Career Pivot Simulator.
Analyze the transition from the user's current career path ("${currentPath}") to their newly desired pivot role ("${targetRole}").

Calculate the exact Skill Delta:
1. Transferable Skills: What skills they currently possess that are fully applicable to the target role.
2. New Required Skills: What gaps they must bridge.
3. Comparative Match Score: How compatible they are with the pivot role based on a scale of 0-100%.
4. 3-Year Strategic Transition Roadmap: A concise 3-phase progression plan.
`;

        const result = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: z.object({
                compatibilityScore: z.number().min(0).max(100),
                transferableSkills: z.array(z.string()).describe("Skills from the current path that transfer directly."),
                newSkillsNeeded: z.array(z.string()).describe("Skills/technologies the user must acquire."),
                transitionPlan: z.array(z.object({
                    phase: z.string().describe("e.g. Phase 1: Skill Acquisition, Phase 2: Portfolio Building..."),
                    timeline: z.string().describe("e.g. Months 1-6"),
                    actions: z.array(z.string()).describe("Specific actionable steps during this phase.")
                })).describe("3-phase step-by-step transition roadmap.")
            }),
            prompt,
        });

        return Response.json({ success: true, ...result.object });
    } catch (error) {
        console.error("Simulate Pivot API Error:", error);
        return Response.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
