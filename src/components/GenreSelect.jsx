import { useState } from 'react'

export function GenreSelect({ genres, textLight, onSelect, onSkip, isLoading }) {
  const [selectedGenre, setSelectedGenre] = useState(null)

  const chipBase = 'px-4 py-2 rounded-full text-sm font-medium transition-all border min-h-[44px] flex items-center gap-2'
  const chipActive = textLight
    ? 'border-white/40 text-white hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed'
    : 'border-gray-300 text-gray-800 hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed'
  const skipColor = textLight
    ? 'text-white/45 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed'
    : 'text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed'

  function handleChipClick(genre) {
    setSelectedGenre(genre)
    onSelect(genre)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto">
      <div className="flex flex-wrap justify-center gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleChipClick(genre)}
            disabled={isLoading}
            aria-busy={isLoading && selectedGenre === genre ? true : undefined}
            className={`${chipBase} ${chipActive}`}
          >
            {isLoading && selectedGenre === genre && (
              <svg aria-hidden="true" className="animate-spin h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {genre}
          </button>
        ))}
      </div>
      <button
        onClick={onSkip}
        disabled={isLoading}
        className={`text-sm transition-colors ${skipColor}`}
      >
        Skip →
      </button>
    </div>
  )
}
