global.fetch = jest.fn();
const { getTracksByTag } = require('../../src/services/lastfm');

const TRACK_RESPONSE = {
  tracks: {
    track: [{
      name: 'The Night Will Always Win',
      artist: { name: 'Manchester Orchestra' },
      url: 'https://www.last.fm/music/Manchester+Orchestra/_/The+Night+Will+Always+Win',
      image: [{ '#text': '' }, { '#text': '' }, { '#text': 'https://img.example.com/art.jpg' }]
    }]
  }
};

const EMPTY_RESPONSE = { tracks: { track: [] } };

describe('getTracksByTag', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns normalized tracks for a valid tag', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => TRACK_RESPONSE });
    const tracks = await getTracksByTag('sad');
    expect(tracks).toHaveLength(1);
    expect(tracks[0]).toEqual({
      name: 'The Night Will Always Win',
      artist: 'Manchester Orchestra',
      url: 'https://www.last.fm/music/Manchester+Orchestra/_/The+Night+Will+Always+Win',
      image: 'https://img.example.com/art.jpg'
    });
  });

  it('returns empty string for image when no image url', async () => {
    const noImageResponse = {
      tracks: { track: [{ name: 'Song', artist: { name: 'Artist' }, url: 'https://last.fm', image: [{ '#text': '' }, { '#text': '' }, { '#text': '' }] }] }
    };
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => noImageResponse });
    const tracks = await getTracksByTag('sad');
    expect(tracks[0].image).toBe('');
  });

  it('retries with fallback tag when primary tag returns 0 tracks', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => EMPTY_RESPONSE })
      .mockResolvedValueOnce({ ok: true, json: async () => TRACK_RESPONSE });
    const tracks = await getTracksByTag('melancholy');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(tracks).toHaveLength(1);
  });

  it('throws NO_TRACKS when both primary and fallback return empty', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => EMPTY_RESPONSE })
      .mockResolvedValueOnce({ ok: true, json: async () => EMPTY_RESPONSE });
    await expect(getTracksByTag('melancholy')).rejects.toThrow('NO_TRACKS');
  });

  it('throws NO_TRACKS when tag has no fallback and returns empty', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => EMPTY_RESPONSE });
    await expect(getTracksByTag('unknowntag')).rejects.toThrow('NO_TRACKS');
  });

  it('throws LASTFM_ERROR on non-ok response', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(getTracksByTag('sad')).rejects.toThrow('LASTFM_ERROR');
  });
});
