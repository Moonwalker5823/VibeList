import { useEffect } from 'react'
import { useMoodAnalysis } from './hooks/useMoodAnalysis'
import { usePlaylist } from './hooks/usePlaylist'
import { getGradient } from './utils/gradients'
import { MoodInput } from './components/MoodInput'
import { MoodConfirmation } from './components/MoodConfirmation'
import { PromptRotator } from './components/PromptRotator'
import { PlaylistGrid } from './components/PlaylistGrid'

export default function App() {
  const { state, moodResult, error: moodError, analyze, reset: resetMood } = useMoodAnalysis()
  const {
    status: playlistStatus, tracks, error: playlistError,
    fetchPlaylist, reset: resetPlaylist
  } = usePlaylist()

  const gradientConfig = moodResult?.mood_category
    ? getGradient(moodResult.mood_category)
    : { gradient: ['#1a1a2e', '#16213e'], textLight: true }

  const bgStyle = {
    background: `linear-gradient(135deg, ${gradientConfig.gradient[0]}, ${gradientConfig.gradient[1]})`,
    transition: 'background 1s ease',
  }

  useEffect(() => {
    if (moodResult && !moodResult.needs_clarification) {
      fetchPlaylist(moodResult.lastfm_tag)
    }
  }, [moodResult])

  function handleReset() {
    resetMood()
    resetPlaylist()
  }

  const { textLight } = gradientConfig
  const isAnalyzing = state === 'analyzing'
  const showResults = moodResult && !moodResult.needs_clarification
  const showClarification = moodResult?.needs_clarification === true
  const idle = !showResults && state !== 'error'

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ padding: '16px', ...bgStyle }}>

      <header className="text-center pt-4 pb-2">
        <h1 className={`text-4xl font-bold tracking-tight ${textLight ? 'text-white' : 'text-gray-900'}`}>
          VibeList
        </h1>
        <p className={`mt-2 text-2xl ${textLight ? 'text-white/55' : 'text-black-400'}`}>
          What's your vibe. I'll find the music.
        </p>
      </header>

      <div className={`flex flex-col items-center gap-6 w-full ${idle ? 'flex-1 justify-center' : 'mt-8'}`}>
        {!showResults && (
          <div className="w-full max-w-xl">
            <MoodInput
              onSubmit={analyze}
              isLoading={isAnalyzing}
              textLight={textLight}
              clarificationQuestion={showClarification ? moodResult.clarification_question : undefined}
            />
          </div>
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
              className={`text-xl underline transition-colors ${textLight ? 'text-white/45 hover:text-white/70' : 'text-black-400 hover:text-blue-600'}`}
            >
              Try a different mood
            </button>
          </>
        )}
      </div>
    </div>
  )
}
