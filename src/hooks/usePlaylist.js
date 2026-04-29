import { useState, useRef, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const TIMEOUT_MS = 15000

export function usePlaylist() {
  const [status, setStatus] = useState('idle')
  const [tracks, setTracks] = useState([])
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const fetchPlaylist = useCallback(async (tag, fallbackTag) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    setStatus('loading')
    setError(null)
    setTracks([])

    try {
      const params = new URLSearchParams({ tag })
      if (fallbackTag && fallbackTag !== tag) params.set('fallbackTag', fallbackTag)
      const res = await fetch(`${API_URL}/api/playlist?${params}`, {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Server error ${res.status}`)
      }
      const data = await res.json()
      setTracks(data.tracks)
      setStatus('done')
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        setError('Connection timed out. Try again?')
        setStatus('error')
        return
      }
      setError(err.message || 'Something went wrong loading the playlist.')
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort()
    setStatus('idle')
    setTracks([])
    setError(null)
  }, [])

  return { status, tracks, error, fetchPlaylist, reset }
}
