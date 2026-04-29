const LASTFM_DEFAULT_IMAGE = '2a96cbd8b46e442fc41c2b86b821562f';

function getImage(images) {
  const url = images?.[2]?.['#text'] || images?.[3]?.['#text'] || ''
  return url.includes(LASTFM_DEFAULT_IMAGE) ? '' : url
}

const FALLBACK_TAGS = {
  melancholy: 'sad',
  triumphant: 'epic',
  euphoric: 'happy',
  heartbroken: 'sad',
  peaceful: 'ambient',
  anxious: 'instrumental',
  focused: 'concentration',
  frustrated: 'rock',
};

async function fetchTagTracks(tag) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${encodeURIComponent(tag)}&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=15`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('LASTFM_ERROR');
  const data = await res.json();
  const trackList = data?.tracks?.track;
  if (!Array.isArray(trackList)) return [];
  return trackList.map((t) => ({
    name: t.name,
    artist: t.artist.name,
    url: t.url,
    image: getImage(t.image),
  }));
}

const MIN_TRACKS = 5;

async function getTracksByTag(tag, fallbackTag) {
  let tracks = await fetchTagTracks(tag);
  if (tracks.length >= MIN_TRACKS) return tracks;

  const next = fallbackTag || FALLBACK_TAGS[tag];
  if (next && next !== tag) {
    const fallbackTracks = await fetchTagTracks(next);
    if (fallbackTracks.length > tracks.length) tracks = fallbackTracks;
  }

  if (tracks.length === 0) throw new Error('NO_TRACKS');
  return tracks;
}

module.exports = { getTracksByTag };
