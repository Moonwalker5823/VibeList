import { useState } from 'react'

export function MoodInput({ onSubmit, isLoading, textLight, clarificationQuestion }) {
  const [text, setText] = useState('')

  const textColor = textLight ? 'text-white placeholder-white/50' : 'text-gray-900 placeholder-gray-400'
  const borderColor = textLight ? 'border-white/30 focus:border-white/60' : 'border-gray-300 focus:border-gray-500'
  const bgColor = textLight ? 'bg-white/10' : 'bg-black/10'
  const btnBase = 'self-end px-6 py-2.5 rounded-full font-semibold text-sm transition-all'
  const btnColor = textLight
    ? 'bg-white text-gray-900 hover:bg-white/90 disabled:bg-white/25 disabled:cursor-not-allowed'
    : 'bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed'

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-xl mx-auto">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
        placeholder={clarificationQuestion || 'How are you feeling right now?'}
        rows={3}
        className={`w-full rounded-xl p-4 text-base resize-none border outline-none transition-colors ${textColor} ${borderColor} ${bgColor}`}
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className={`${btnBase} ${btnColor}`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Reading your vibe…
          </span>
        ) : (
          'Find my playlist →'
        )}
      </button>
    </form>
  )
}
