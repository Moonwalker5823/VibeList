const express = require('express');
const { analyzeMood } = require('../services/claude');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required and must be a non-empty string' });
  }
  try {
    const result = await analyzeMood(text.trim());
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
