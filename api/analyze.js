import { analyzeMood } from './_lib/claude.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { text } = req.body
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required and must be a non-empty string' })
  }
  try {
    const result = await analyzeMood(text.trim())
    res.json(result)
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(502).json({ error: 'Failed to parse mood analysis response.' })
    }
    res.status(500).json({ error: err.message || 'Something went wrong analyzing your mood.' })
  }
}
