import { useState, useEffect, useCallback } from 'react'

export function PromptRotator({ prompts, textLight }) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  const advance = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setIndex((i) => (i + 1) % prompts.length)
      setVisible(true)
    }, 350)
  }, [prompts.length])

  useEffect(() => {
    if (prompts.length === 0) return
    const id = setInterval(advance, 9000)
    return () => clearInterval(id)
  }, [advance, prompts.length])

  if (prompts.length === 0) return null

  const textColor = textLight ? 'text-white/75' : 'text-gray-600'
  const btnColor = textLight ? 'text-white/45 hover:text-white/75' : 'text-gray-400 hover:text-gray-600'

  return (
    <div className="flex items-center justify-center gap-3 min-h-[2rem]">
      <p
        className={`text-base sm:text-lg italic transition-opacity duration-300 text-center ${textColor}`}
        style={{ opacity: visible ? 1 : 0 }}
      >
        {prompts[index]}
      </p>
    </div>
  )
}
