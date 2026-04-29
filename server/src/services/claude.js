const Anthropic = require('@anthropic-ai/sdk');

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You are a mood analyst for a music app. Given text describing how someone feels, return ONLY a raw JSON object — no markdown, no code fences, no explanation.

If the mood is clear, return:
{
  "mood": "<specific mood word>",
  "mood_category": "<one of: happy, euphoric, sad, heartbroken, melancholic, nostalgic, energetic, triumphant, peaceful, calm, angry, frustrated, anxious, nervous, focused, determined>",
  "confirmation": "<1-2 empathetic sentences acknowledging their mood>",
  "lastfm_tag": "<last.fm music tag that fits this mood>",
  "gradient": ["#hex1", "#hex2"],
  "needs_clarification": false,
  "prompts": ["<5 short phrases under 10 words each that resonate with this emotional state>"]
}

If the mood is too ambiguous, return:
{
  "needs_clarification": true,
  "clarification_question": "<one short follow-up question>"
}`;

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}

async function analyzeMood(text) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: text }],
  });
  const raw = message?.content?.[0]?.text;
  if (!raw) throw new Error('Unexpected response shape from Claude API');
  return JSON.parse(raw);
}

module.exports = { analyzeMood };
