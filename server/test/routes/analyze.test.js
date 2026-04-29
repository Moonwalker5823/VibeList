jest.mock('../../src/services/claude');
process.env.ANTHROPIC_API_KEY = 'test-key';

const request = require('supertest');
const app = require('../../src/app');
const { analyzeMood } = require('../../src/services/claude');

const MOOD_RESULT = {
  mood: 'sad', mood_category: 'sad',
  confirmation: 'Feeling down.',
  lastfm_tag: 'sad',
  gradient: ['#141E30', '#243B55'],
  needs_clarification: false,
  prompts: ["It's okay."]
};

describe('POST /api/analyze', () => {
  it('returns 200 with mood result', async () => {
    analyzeMood.mockResolvedValueOnce(MOOD_RESULT);
    const res = await request(app).post('/api/analyze').send({ text: 'I feel sad' });
    expect(res.status).toBe(200);
    expect(res.body.mood_category).toBe('sad');
    expect(res.body.needs_clarification).toBe(false);
  });

  it('returns 200 with needs_clarification response', async () => {
    analyzeMood.mockResolvedValueOnce({ needs_clarification: true, clarification_question: 'Tell me more?' });
    const res = await request(app).post('/api/analyze').send({ text: 'eh' });
    expect(res.status).toBe(200);
    expect(res.body.needs_clarification).toBe(true);
  });

  it('returns 400 when text is missing', async () => {
    const res = await request(app).post('/api/analyze').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when text is empty string', async () => {
    const res = await request(app).post('/api/analyze').send({ text: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 500 on Claude failure', async () => {
    analyzeMood.mockRejectedValueOnce(new Error('API error'));
    const res = await request(app).post('/api/analyze').send({ text: 'hello' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
