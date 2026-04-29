import { useState, useRef, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const TIMEOUT_MS = 15000

export function useGenreRefine() {
  const [state, setState] = useState('idle')
  const [refinedTag, setRefinedTag] = useState(null)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const abortedByUserRef = useRef(false)

  const refine = useCallback(async (mood, genre) => {
    abortedByUserRef.current = false
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    setState('refining')
    setError(null)
    setRefinedTag(null)

    try {
      const res = await fetch(`${API_URL}/api/refine-tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, genre }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setRefinedTag(data.lastfm_tag)
      setState('done')
    } catch (err) {
      clearTimeout(timeoutId)
      if (abortedByUserRef.current) return
      if (err.name === 'AbortError') {
        setError('Connection timed out. Try again?')
        setState('error')
        return
      }
      setError(err.message || 'Something went wrong refining your tag.')
      setState('error')
    }
  }, [])

  const skip = useCallback(() => {
    abortedByUserRef.current = true
    if (abortRef.current) abortRef.current.abort()
    setState('done')
    setRefinedTag(null)
    setError(null)
  }, [])

  const reset = useCallback(() => {
    abortedByUserRef.current = true
    if (abortRef.current) abortRef.current.abort()
    setState('idle')
    setRefinedTag(null)
    setError(null)
  }, [])

  return { state, refinedTag, error, refine, skip, reset }
}
