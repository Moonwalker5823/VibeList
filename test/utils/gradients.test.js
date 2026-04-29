import { getGradient } from '../../src/utils/gradients'

describe('getGradient', () => {
  it('returns correct gradient and textLight for happy', () => {
    const result = getGradient('happy')
    expect(result.gradient).toEqual(['#F7971E', '#FFD200'])
    expect(result.textLight).toBe(false)
  })

  it('returns correct gradient and textLight for sad', () => {
    const result = getGradient('sad')
    expect(result.gradient).toEqual(['#141E30', '#243B55'])
    expect(result.textLight).toBe(true)
  })

  it('returns default gradient for unknown mood category', () => {
    const result = getGradient('unknown_xyz')
    expect(result).toBeDefined()
    expect(result.gradient).toHaveLength(2)
    expect(typeof result.textLight).toBe('boolean')
  })

  it('returns gradient for all 16 defined mood categories', () => {
    const categories = [
      'happy', 'euphoric', 'sad', 'heartbroken',
      'melancholic', 'nostalgic', 'energetic', 'triumphant',
      'peaceful', 'calm', 'angry', 'frustrated',
      'anxious', 'nervous', 'focused', 'determined'
    ]
    categories.forEach(cat => {
      const result = getGradient(cat)
      expect(result.gradient).toHaveLength(2)
      expect(typeof result.textLight).toBe('boolean')
    })
  })
})
