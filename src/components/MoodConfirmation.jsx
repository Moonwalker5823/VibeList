export function MoodConfirmation({ confirmation, textLight }) {
  const textColor = textLight ? 'text-white' : 'text-gray-900'
  const cardBg = textLight ?? 'bg-transparant'

  return (
    <div className={`rounded-2xl px-4 py-3 sm:px-6 sm:py-4 max-w-xl mx-auto text-center ${textColor} ${cardBg}`}>
      <p className="text-base sm:text-lg leading-relaxed">{confirmation}</p>
    </div>
  )
}
