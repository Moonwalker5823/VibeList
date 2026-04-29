const express = require('express');
const { getTracksByTag } = require('../services/lastfm');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { tag } = req.query;
  if (!tag || typeof tag !== 'string' || !tag.trim()) {
    return res.status(400).json({ error: 'tag query parameter is required' });
  }
  try {
    const tracks = await getTracksByTag(tag.trim());
    res.json({ tracks });
  } catch (err) {
    if (err.message === 'NO_TRACKS') {
      return res.status(404).json({ error: "We couldn't find tracks for this mood. Try describing it differently?" });
    }
    next(err);
  }
});

module.exports = router;
