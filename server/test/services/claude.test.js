jest.mock('@anthropic-ai/sdk');
const Anthropic = require('@anthropic-ai/sdk');

process.env.ANTHROPIC_API_KEY = 'test-key';

const { analyzeMood, refineTag } = require('../../src/services/claude');

const CLEAR_MOOD_RESPONSE = {
  content: [{
    text: JSON.stringify({
      mood: 'sad',
      mood_category: 'sad',
      confirmation: "It sounds like you're carrying something heavy.",
      lastfm_tag: 'sad',
      genre_suggestions: ['indie folk', 'post-rock', 'classical'],
      gradient: ['#141E30', '#243B55'],
      needs_clarification: false,
      prompts: [
        "It's okay to sit with this feeling.",
        "Some days the music just gets it.",
        "You don't have to be okay right now.",
        "There's no timeline on feeling better.",
        "Let it out. That's what this is for."
      ]
    })
  }]
};

const CLARIFICATION_RESPONSE = {
  content: [{
    text: JSON.stringify({
      needs_clarification: true,
      clarification_question: "Can you tell me a bit more about what's going on?"
    })
  }]
};

describe('analyzeMood', () => {
  it('returns parsed mood result for clear mood text', async () => {
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockResolvedValue(CLEAR_MOOD_RESPONSE) }
    }));
    const result = await analyzeMood('I feel really sad today');
    expect(result.needs_clarification).toBe(false);
    expect(result.mood_category).toBe('sad');
    expect(result.lastfm_tag).toBe('sad');
    expect(Array.isArray(result.prompts)).toBe(true);
    expect(result.prompts).toHaveLength(5);
    expect(Array.isArray(result.gradient)).toBe(true);
    expect(result.gradient).toHaveLength(2);
    expect(typeof result.confirmation).toBe('string');
    expect(Array.isArray(result.genre_suggestions)).toBe(true);
    expect(result.genre_suggestions.every(g => typeof g === 'string' && g.length > 0)).toBe(true);
  });

  it('returns needs_clarification when mood is ambiguous', async () => {
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockResolvedValue(CLARIFICATION_RESPONSE) }
    }));
    const result = await analyzeMood('eh');
    expect(result.needs_clarification).toBe(true);
    expect(typeof result.clarification_question).toBe('string');
    expect(result.genre_suggestions).toBeUndefined();
  });

  it('throws when Claude returns malformed JSON', async () => {
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockResolvedValue({ content: [{ text: 'not json' }] }) }
    }));
    await expect(analyzeMood('hello')).rejects.toThrow();
  });

  it('throws when Anthropic SDK rejects', async () => {
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockRejectedValue(new Error('Network error')) }
    }));
    await expect(analyzeMood('hello')).rejects.toThrow('Network error');
  });

  it('throws on empty content response', async () => {
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockResolvedValue({ content: [] }) }
    }));
    await expect(analyzeMood('hello')).rejects.toThrow('Unexpected response shape');
  });

});

const REFINE_TAG_RESPONSE = {
  content: [{ text: JSON.stringify({ lastfm_tag: 'jazz blues' }) }]
};

describe('refineTag', () => {
  it('returns a lastfm_tag for mood + genre combination', async () => {
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockResolvedValue(REFINE_TAG_RESPONSE) }
    }));
    const result = await refineTag('melancholic', 'jazz');
    expect(typeof result.lastfm_tag).toBe('string');
    expect(result.lastfm_tag.length).toBeGreaterThan(0);
  });

  it('throws when Claude returns malformed JSON', async () => {
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockResolvedValue({ content: [{ text: 'not json' }] }) }
    }));
    await expect(refineTag('sad', 'jazz')).rejects.toThrow();
  });

  it('throws on empty content response', async () => {
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockResolvedValue({ content: [] }) }
    }));
    await expect(refineTag('sad', 'jazz')).rejects.toThrow('Unexpected response shape');
  });

  it('throws when Anthropic SDK rejects', async () => {
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockRejectedValue(new Error('Network error')) }
    }));
    await expect(refineTag('melancholic', 'jazz')).rejects.toThrow('Network error');
  });

  it('throws when lastfm_tag is empty string', async () => {
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockResolvedValue({ content: [{ text: '{"lastfm_tag":""}' }] }) }
    }));
    await expect(refineTag('melancholic', 'jazz')).rejects.toThrow('invalid or empty lastfm_tag');
  });
});
