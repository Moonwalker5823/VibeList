jest.mock('../../src/services/claude');
process.env.ANTHROPIC_API_KEY = 'test-key';

const request = require('supertest');
const app = require('../../src/app');
const { refineTag } = require('../../src/services/claude');

describe('POST /api/refine-tag', () => {
  it('returns 200 with lastfm_tag', async () => {
    refineTag.mockResolvedValueOnce({ lastfm_tag: 'jazz blues' });
    const res = await request(app)
      .post('/api/refine-tag')
      .send({ mood: 'melancholic', genre: 'jazz' });
    expect(res.status).toBe(200);
    expect(res.body.lastfm_tag).toBe('jazz blues');
  });

  it('returns 400 when mood is missing', async () => {
    const res = await request(app)
      .post('/api/refine-tag')
      .send({ genre: 'jazz' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when genre is missing', async () => {
    const res = await request(app)
      .post('/api/refine-tag')
      .send({ mood: 'melancholic' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when mood is empty string', async () => {
    const res = await request(app)
      .post('/api/refine-tag')
      .send({ mood: '   ', genre: 'jazz' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when genre is empty string', async () => {
    const res = await request(app)
      .post('/api/refine-tag')
      .send({ mood: 'melancholic', genre: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 500 on Claude failure', async () => {
    refineTag.mockRejectedValueOnce(new Error('API error'));
    const res = await request(app)
      .post('/api/refine-tag')
      .send({ mood: 'melancholic', genre: 'jazz' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
