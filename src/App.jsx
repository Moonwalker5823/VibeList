import { useEffect } from 'react'
import { useMoodAnalysis } from './hooks/useMoodAnalysis'
import { usePlaylist } from './hooks/usePlaylist'
import { useGenreRefine } from './hooks/useGenreRefine'
import { GenreSelect } from './components/GenreSelect'
import { getGradient } from './utils/gradients'
import { MoodInput } from './components/MoodInput'
import { MoodConfirmation } from './components/MoodConfirmation'
import { PromptRotator } from './components/PromptRotator'
import { PlaylistGrid } from './components/PlaylistGrid'

const DEFAULT_GRADIENT = { gradient: ['#0f0c29', '#302b63'], textLight: true }

function Logo({ textLight, size = 'md', showSubheading = true }) {
  const textSize = size === 'lg' ? 'text-4xl' : 'text-xl'
  const iconSize = size === 'lg' ? 'w-9 h-9' : 'w-5 h-5'
  const color = textLight ? 'text-white' : 'text-gray-900'
  const accent = textLight ? 'text-white/70' : 'text-gray-500'

  return (
    <div className='flex flex-col items-center justify-center'>
    <div className={`flex items-center gap-2.5 ${color}`}>
      <div className={`${iconSize} relative flex items-center justify-center`}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="18" cy="18" r="18" className={textLight ? 'fill-white/15' : 'fill-black/10'} />
          <path d="M14 25V13l12-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="11" cy="25" r="3" stroke="currentColor" strokeWidth="2"/>
          <circle cx="23" cy="22" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      <span className={`${textSize} font-bold tracking-tight`}>
        Vibe<span className={accent}>List</span>
      </span>
    </div>
    {showSubheading && (
      <div className="flex flex-col items-center mt-1 gap-0.5">
        <span className={`text-2xl font-normal tracking-wide text-center ${accent}`}>Every feeling has a frequency. What's yours?</span>
      </div>
    )}
    </div>
  )
}

export default function App() {
  const { state, moodResult, error: moodError, analyze, reset: resetMood } = useMoodAnalysis()
  const {
    status: playlistStatus, tracks, error: playlistError,
    fetchPlaylist, reset: resetPlaylist
  } = usePlaylist()
  const {
    state: genreState, refinedTag, error: genreError,
    refine, skip: skipGenre, reset: resetGenre,
  } = useGenreRefine()

  const gradientConfig = moodResult?.mood_category
    ? getGradient(moodResult.mood_category)
    : DEFAULT_GRADIENT

  const [c1, c2] = gradientConfig.gradient
  const bgStyle = {
    background: `radial-gradient(ellipse at 20% 60%, ${c1} 0%, ${c2} 100%)`,
    transition: 'background 1.2s ease',
  }

  // No genre suggestions: fetch playlist immediately after mood analysis
  useEffect(() => {
    if (moodResult && !moodResult.needs_clarification && !moodResult.genre_suggestions?.length) {
      fetchPlaylist(moodResult.lastfm_tag)
    }
  }, [moodResult, fetchPlaylist])

  // After genre step completes (select or skip): fetch with refined or original tag
  useEffect(() => {
    if (genreState === 'done' && moodResult) {
      const tag = refinedTag ?? moodResult.lastfm_tag
      const fallback = refinedTag ? moodResult.lastfm_tag : undefined
      fetchPlaylist(tag, fallback)
    }
  }, [genreState, refinedTag, moodResult, fetchPlaylist])

  function handleReset() {
    resetMood()
    resetPlaylist()
    resetGenre()
  }

  const { textLight } = gradientConfig
  const isAnalyzing = state === 'analyzing'
  const showClarification = moodResult?.needs_clarification === true
  const showGenreSelect = moodResult && !moodResult.needs_clarification &&
    moodResult.genre_suggestions?.length > 0 &&
    (genreState === 'idle' || genreState === 'refining' || genreState === 'error')
  const showResults = moodResult && !moodResult.needs_clarification &&
    (!moodResult.genre_suggestions?.length || genreState === 'done')
  const idle = !showResults && !showGenreSelect && state !== 'error'

  return (
    <div className="min-h-screen w-full flex flex-col overflow-x-hidden px-4 sm:px-6 lg:px-8" style={bgStyle}>

      <header className="flex items-center justify-center pt-4 pb-2">
        <Logo textLight={textLight} size="lg" />
      </header>

      <div className={`flex flex-col items-center gap-6 w-full ${idle ? 'flex-1 justify-center' : 'mt-8'}`}>
        {!showResults && !showGenreSelect && (
          <div className="w-full max-w-xl">
            <MoodInput
              onSubmit={analyze}
              isLoading={isAnalyzing}
              textLight={textLight}
              clarificationQuestion={showClarification ? moodResult.clarification_question : undefined}
            />
          </div>
        )}

        {showGenreSelect && (
          <>
            <MoodConfirmation confirmation={moodResult.confirmation} textLight={textLight} />
            <GenreSelect
              genres={moodResult.genre_suggestions}
              textLight={textLight}
              onSelect={(genre) => refine(moodResult.mood, genre)}
              onSkip={skipGenre}
              isLoading={genreState === 'refining'}
            />
            {genreState === 'error' && (
              <p className={`text-sm text-center ${textLight ? 'text-white/65' : 'text-gray-500'}`}>
                {genreError}{' '}
                <button onClick={skipGenre} className="underline font-medium">Skip instead?</button>
              </p>
            )}
          </>
        )}

        {state === 'error' && (
          <p className={`text-sm text-center ${textLight ? 'text-white/65' : 'text-gray-500'}`}>
            {moodError}{' '}
            <button onClick={handleReset} className="underline font-medium">Try again?</button>
          </p>
        )}

        {showResults && (
          <>
            <MoodConfirmation confirmation={moodResult.confirmation} textLight={textLight} />
            <PromptRotator prompts={moodResult.prompts || []} textLight={textLight} />
            <div className="w-full max-w-5xl">
              <PlaylistGrid
                status={playlistStatus}
                tracks={tracks}
                textLight={textLight}
                error={playlistError}
              />
            </div>
            <button
              onClick={handleReset}
              className={`text-xl underline transition-colors ${textLight ? 'text-white/45 hover:text-white/70' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Try a different mood
            </button>
          </>
        )}
      </div>

      <footer className="flex flex-col items-center justify-center gap-1 py-6 mt-8">
        <Logo textLight={textLight} size="sm" showSubheading={false} />
        <span className={`text-sm font-normal tracking-wide text-center ${textLight ? 'text-white/70' : 'text-gray-500'}`}>What's your vibe</span>
      </footer>

    </div>
  )
}
