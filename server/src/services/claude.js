const Anthropic = require('@anthropic-ai/sdk');

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You are a mood analyst for a music app. Given text describing how someone feels, return ONLY a raw JSON object — no markdown, no code fences, no explanation.

If the mood is clear, return exactly 3 genres in genre_suggestions:
{
  "mood": "<specific mood word>",
  "mood_category": "<one of: happy, euphoric, sad, heartbroken, melancholic, nostalgic, energetic, triumphant, peaceful, calm, angry, frustrated, anxious, nervous, focused, determined>",
  "confirmation": "<1-2 empathetic sentences acknowledging their mood>",
  "lastfm_tag": "<last.fm music tag that fits this mood>",
  "genre_suggestions": ["<genre 1 that complements this mood>", "<genre 2>", "<genre 3>"],
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

const REFINE_TAG_PROMPT = `You are a music tag selector. Given a mood and a genre, return ONLY a raw JSON object — no markdown, no code fences, no explanation.

Return: { "lastfm_tag": "<best single Last.fm tag for this mood and genre combination>" }

Pick a tag that is likely to exist as a real Last.fm tag (e.g. "jazz blues", "sad indie", "classical ambient").`;

async function refineTag(mood, genre) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    system: REFINE_TAG_PROMPT,
    messages: [{ role: 'user', content: `mood: ${mood}, genre: ${genre}` }],
  });
  const raw = message?.content?.[0]?.text;
  if (!raw) throw new Error('Unexpected response shape from Claude API');
  const parsed = JSON.parse(raw);
  if (!parsed.lastfm_tag || typeof parsed.lastfm_tag !== 'string' || !parsed.lastfm_tag.trim()) {
    throw new Error('Claude returned an invalid or empty lastfm_tag');
  }
  return parsed;
}

module.exports = { analyzeMood, refineTag };
