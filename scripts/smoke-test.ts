import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    console.log('Testing models...');
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro', 'models/gemini-1.5-flash'];
    
    for (const m of models) {
        try {
            console.log(`\n--- Testing ${m} ---`);
            const { text } = await generateText({
                model: google(m),
                prompt: 'Say hello',
            });
            console.log(`✅ Success with ${m}: ${text}`);
        } catch (err: any) {
            console.log(`❌ Failed with ${m}: ${err.message}`);
        }
    }
}

test();
