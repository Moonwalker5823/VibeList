jest.mock('../../src/services/lastfm');
process.env.ANTHROPIC_API_KEY = 'test-key';

const request = require('supertest');
const app = require('../../src/app');
const { getTracksByTag } = require('../../src/services/lastfm');

const TRACKS = [{ name: 'Song', artist: 'Artist', url: 'https://last.fm', image: '' }];

describe('GET /api/playlist', () => {
  it('returns 200 with tracks', async () => {
    getTracksByTag.mockResolvedValueOnce(TRACKS);
    const res = await request(app).get('/api/playlist').query({ tag: 'sad' });
    expect(res.status).toBe(200);
    expect(res.body.tracks).toHaveLength(1);
    expect(res.body.tracks[0].name).toBe('Song');
  });

  it('returns 400 when tag query param is missing', async () => {
    const res = await request(app).get('/api/playlist');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 404 when NO_TRACKS error is thrown', async () => {
    getTracksByTag.mockRejectedValueOnce(new Error('NO_TRACKS'));
    const res = await request(app).get('/api/playlist').query({ tag: 'xyz' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('returns 500 on LASTFM_ERROR', async () => {
    getTracksByTag.mockRejectedValueOnce(new Error('LASTFM_ERROR'));
    const res = await request(app).get('/api/playlist').query({ tag: 'sad' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
