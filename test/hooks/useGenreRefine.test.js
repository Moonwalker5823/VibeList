import { renderHook, act } from '@testing-library/react'
import { useGenreRefine } from '../../src/hooks/useGenreRefine'

describe('useGenreRefine', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts in idle state', () => {
    const { result } = renderHook(() => useGenreRefine())
    expect(result.current.state).toBe('idle')
    expect(result.current.refinedTag).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('transitions to done and sets refinedTag on success', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ lastfm_tag: 'jazz blues' }),
    })
    const { result } = renderHook(() => useGenreRefine())
    await act(async () => {
      await result.current.refine('melancholic', 'jazz')
    })
    expect(result.current.state).toBe('done')
    expect(result.current.refinedTag).toBe('jazz blues')
    expect(result.current.error).toBeNull()
  })

  it('transitions to error state on non-ok response', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 })
    const { result } = renderHook(() => useGenreRefine())
    await act(async () => {
      await result.current.refine('melancholic', 'jazz')
    })
    expect(result.current.state).toBe('error')
    expect(result.current.refinedTag).toBeNull()
    expect(typeof result.current.error).toBe('string')
  })

  it('skip() transitions to done with null refinedTag', () => {
    const { result } = renderHook(() => useGenreRefine())
    act(() => {
      result.current.skip()
    })
    expect(result.current.state).toBe('done')
    expect(result.current.refinedTag).toBeNull()
  })

  it('skip() during in-flight refine lands in done, not error', async () => {
    let resolveFetch
    fetch.mockReturnValueOnce(new Promise(r => { resolveFetch = r }))
    const { result } = renderHook(() => useGenreRefine())
    act(() => { result.current.refine('melancholic', 'jazz') })
    act(() => { result.current.skip() })
    expect(result.current.state).toBe('done')
    expect(result.current.refinedTag).toBeNull()
    // Resolve the pending fetch to avoid unhandled promise rejection
    resolveFetch({ ok: false, status: 499 })
  })

  it('reset() returns to idle state', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ lastfm_tag: 'jazz blues' }),
    })
    const { result } = renderHook(() => useGenreRefine())
    await act(async () => {
      await result.current.refine('melancholic', 'jazz')
    })
    act(() => {
      result.current.reset()
    })
    expect(result.current.state).toBe('idle')
    expect(result.current.refinedTag).toBeNull()
  })
})
