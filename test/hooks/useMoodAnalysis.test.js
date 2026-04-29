import { renderHook, act } from '@testing-library/react'
import { useMoodAnalysis } from '../../src/hooks/useMoodAnalysis'

const MOOD_RESULT = {
  mood: 'sad', mood_category: 'sad',
  confirmation: "It sounds like you're carrying something heavy.",
  lastfm_tag: 'sad',
  gradient: ['#141E30', '#243B55'],
  needs_clarification: false,
  prompts: ["It's okay to sit with this."]
}

describe('useMoodAnalysis', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('starts with idle state and null result', () => {
    const { result } = renderHook(() => useMoodAnalysis())
    expect(result.current.state).toBe('idle')
    expect(result.current.moodResult).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('transitions to done with result on success', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => MOOD_RESULT })
    const { result } = renderHook(() => useMoodAnalysis())
    await act(async () => { await result.current.analyze('I feel sad today') })
    expect(result.current.state).toBe('done')
    expect(result.current.moodResult).toEqual(MOOD_RESULT)
    expect(result.current.error).toBeNull()
  })

  it('sets error state when server returns non-ok', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 })
    const { result } = renderHook(() => useMoodAnalysis())
    await act(async () => { await result.current.analyze('hello') })
    expect(result.current.state).toBe('error')
    expect(result.current.error).toBeDefined()
  })

  it('sets timeout error message on AbortError', async () => {
    global.fetch.mockRejectedValueOnce(Object.assign(new Error('aborted'), { name: 'AbortError' }))
    const { result } = renderHook(() => useMoodAnalysis())
    await act(async () => { await result.current.analyze('hello') })
    expect(result.current.state).toBe('error')
    expect(result.current.error).toMatch(/timed out/i)
  })

  it('reset clears all state back to idle', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => MOOD_RESULT })
    const { result } = renderHook(() => useMoodAnalysis())
    await act(async () => { await result.current.analyze('I feel sad') })
    act(() => result.current.reset())
    expect(result.current.state).toBe('idle')
    expect(result.current.moodResult).toBeNull()
    expect(result.current.error).toBeNull()
  })
})
