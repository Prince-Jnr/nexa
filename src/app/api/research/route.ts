import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export const runtime = 'nodejs';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    return Response.json({ error: 'GROQ_API_KEY is not configured.' }, { status: 500 });
  }

  try {
    const { query } = await request.json();
    if (typeof query !== 'string' || !query.trim()) {
      return Response.json({ error: 'A research query is required.' }, { status: 400 });
    }

    const result = await generateText({
      model: groq('openai/gpt-oss-20b'),
      system: 'You are Sad Deep Research. Produce a thorough, well-structured research report in Markdown. State uncertainty clearly and do not invent citations or sources. Use headings, concise paragraphs, and bullet points.',
      prompt: query.trim(),
    });

    return Response.json({ report: result.text });
  } catch (error) {
    console.error('[/api/research] error:', error);
    return Response.json({ error: error instanceof Error ? error.message : 'Research failed.' }, { status: 500 });
  }
}
