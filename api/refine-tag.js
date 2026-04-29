import { refineTag } from './_lib/claude.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { mood, genre } = req.body
  if (!mood || typeof mood !== 'string' || !mood.trim()) {
    return res.status(400).json({ error: 'mood is required and must be a non-empty string' })
  }
  if (!genre || typeof genre !== 'string' || !genre.trim()) {
    return res.status(400).json({ error: 'genre is required and must be a non-empty string' })
  }
  try {
    const result = await refineTag(mood.trim(), genre.trim())
    res.json({ lastfm_tag: result.lastfm_tag })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something went wrong refining your tag.' })
  }
}
