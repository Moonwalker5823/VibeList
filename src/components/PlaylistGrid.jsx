import { TrackCard } from './TrackCard'
import { LoadingState } from './LoadingState'

export function PlaylistGrid({ status, tracks, textLight, error }) {
  if (status === 'idle') return null

  if (status === 'loading') return <LoadingState />

  if (status === 'error') {
    return (
      <p className={`text-center text-sm ${textLight ? 'text-white/65' : 'text-gray-500'}`}>
        {error || 'Something went wrong loading the playlist.'}
      </p>
    )
  }

  return (
    <div className="overflow-y-auto max-h-[70vh] w-full [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track, i) => (
          <TrackCard key={`${track.artist}-${track.name}-${i}`} track={track} textLight={textLight} />
        ))}
      </div>
    </div>
  )
}
