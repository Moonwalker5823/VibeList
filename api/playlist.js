import { getTracksByTag } from './_lib/lastfm.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { tag, fallbackTag } = req.query
  if (!tag || typeof tag !== 'string' || !tag.trim()) {
    return res.status(400).json({ error: 'tag query parameter is required' })
  }
  try {
    const tracks = await getTracksByTag(tag.trim(), fallbackTag?.trim() || undefined)
    res.json({ tracks })
  } catch (err) {
    if (err.message === 'NO_TRACKS') {
      return res.status(404).json({ error: "We couldn't find tracks for this mood. Try describing it differently?" })
    }
    res.status(500).json({ error: err.message || 'Something went wrong loading the playlist.' })
  }
}
