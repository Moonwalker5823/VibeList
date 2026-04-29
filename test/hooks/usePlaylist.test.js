import { renderHook, act } from '@testing-library/react'
import { usePlaylist } from '../../src/hooks/usePlaylist'

const TRACKS = [{ name: 'Song', artist: 'Artist', url: 'https://last.fm', image: '' }]

describe('usePlaylist', () => {
  beforeEach(() => { global.fetch = vi.fn() })

  it('starts with idle status and empty tracks', () => {
    const { result } = renderHook(() => usePlaylist())
    expect(result.current.status).toBe('idle')
    expect(result.current.tracks).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('fetches and returns tracks on success', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ tracks: TRACKS }) })
    const { result } = renderHook(() => usePlaylist())
    await act(async () => { await result.current.fetchPlaylist('sad') })
    expect(result.current.status).toBe('done')
    expect(result.current.tracks).toEqual(TRACKS)
  })

  it('sets error state with message from 404 response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false, status: 404,
      json: async () => ({ error: 'No tracks found for this mood.' })
    })
    const { result } = renderHook(() => usePlaylist())
    await act(async () => { await result.current.fetchPlaylist('xyz') })
    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('No tracks found for this mood.')
  })

  it('sets timeout error on AbortError', async () => {
    global.fetch.mockRejectedValueOnce(Object.assign(new Error('aborted'), { name: 'AbortError' }))
    const { result } = renderHook(() => usePlaylist())
    await act(async () => { await result.current.fetchPlaylist('sad') })
    expect(result.current.status).toBe('error')
    expect(result.current.error).toMatch(/timed out/i)
  })

  it('reset clears tracks and status', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ tracks: TRACKS }) })
    const { result } = renderHook(() => usePlaylist())
    await act(async () => { await result.current.fetchPlaylist('sad') })
    act(() => result.current.reset())
    expect(result.current.status).toBe('idle')
    expect(result.current.tracks).toEqual([])
    expect(result.current.error).toBeNull()
  })
})
