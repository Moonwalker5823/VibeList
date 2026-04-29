import { useState, useRef, useCallback } from 'react'

const TIMEOUT_MS = 15000

export function useMoodAnalysis() {
  const [state, setState] = useState('idle')
  const [moodResult, setMoodResult] = useState(null)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const analyze = useCallback(async (text) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    setState('analyzing')
    setError(null)
    setMoodResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setMoodResult(data)
      setState('done')
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        setError('Connection timed out. Try again?')
        setState('error')
        return
      }
      setError(err.message || 'Something went wrong reading your mood.')
      setState('error')
    }
  }, [])

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort()
    setState('idle')
    setMoodResult(null)
    setError(null)
  }, [])

  return { state, moodResult, error, analyze, reset }
}
