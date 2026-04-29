const AVATAR_COLORS = [
  'from-violet-500 to-purple-700',
  'from-blue-500 to-indigo-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-amber-500 to-orange-700',
  'from-cyan-500 to-sky-700',
]

function avatarColor(artist) {
  let hash = 0
  for (let i = 0; i < artist.length; i++) hash = artist.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function TrackCard({ track, textLight }) {
  const cardBg = textLight ? 'bg-white/10 border-white/15' : 'bg-black/10 border-black/10'
  const nameColor = textLight ? 'text-white' : 'text-gray-900'
  const artistColor = textLight ? 'text-white/65' : 'text-gray-500'
  const linkColor = textLight ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
  const initial = track.artist?.charAt(0).toUpperCase() || '?'
  const gradient = avatarColor(track.artist || '')

  return (
    <div className={`rounded-2xl border overflow-hidden flex flex-col ${cardBg}`}>
      {track.image ? (
        <img
          src={track.image}
          alt={`${track.name} album art`}
          className="w-full aspect-square object-cover"
        />
      ) : (
        <div
          data-testid="art-placeholder"
          className={`w-full aspect-square bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <span className="text-white text-5xl font-bold opacity-90 select-none">{initial}</span>
        </div>
      )}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <p className={`font-semibold text-sm leading-snug line-clamp-2 ${nameColor}`}>{track.name}</p>
        <p className={`text-xs ${artistColor}`}>{track.artist}</p>
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto pt-3 text-xs font-medium transition-colors ${linkColor}`}
        >
          Listen →
        </a>
      </div>
    </div>
  )
}
