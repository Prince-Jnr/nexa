import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const runtime = 'nodejs';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Map Nexa model IDs to Groq model names
const MODEL_MAP: Record<string, string> = {
  'nexa-fast':     'openai/gpt-oss-20b',
  'nexa-pro':      'openai/gpt-oss-20b',
  'nexa-vision':   'openai/gpt-oss-20b',
  'nexa-research': 'openai/gpt-oss-20b',
  'nexa-code':     'openai/gpt-oss-20b',
  'nexa-creative': 'openai/gpt-oss-20b',
};

const SYSTEM_PROMPT = `You are Nexa, an advanced AI assistant built into a premium AI workspace.
You are knowledgeable, helpful, and concise. You respond with well-structured markdown when appropriate.
You excel at research, coding, analysis, writing, and creative tasks.`;

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return new Response(
      JSON.stringify({
        error: 'GROQ_API_KEY is not configured. Add your key to .env.local and restart the dev server.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { messages, model = 'nexa-pro' } = await req.json();
    const groqModel = MODEL_MAP[model] ?? 'llama-3.3-70b-versatile';

    const result = streamText({
      model: groq(groqModel),
      system: SYSTEM_PROMPT,
      messages,
    });

    // Use plain text stream — easiest to consume manually on the client
    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error('[/api/chat] stream error:', error);
        return error instanceof Error ? error.message : 'The AI provider returned an error.';
      },
    });
  } catch (error) {
    console.error('[/api/chat] error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
