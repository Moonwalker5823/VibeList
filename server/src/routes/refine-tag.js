const express = require('express');
const { refineTag } = require('../services/claude');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { mood, genre } = req.body;
  if (!mood || typeof mood !== 'string' || !mood.trim()) {
    return res.status(400).json({ error: 'mood is required and must be a non-empty string' });
  }
  if (!genre || typeof genre !== 'string' || !genre.trim()) {
    return res.status(400).json({ error: 'genre is required and must be a non-empty string' });
  }
  try {
    const result = await refineTag(mood.trim(), genre.trim());
    res.json({ lastfm_tag: result.lastfm_tag });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
