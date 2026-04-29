import { render, screen, fireEvent, act } from '@testing-library/react'
import { PromptRotator } from '../../src/components/PromptRotator'

const PROMPTS = ['First prompt', 'Second prompt', 'Third prompt']

describe('PromptRotator', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('renders the first prompt initially', () => {
    render(<PromptRotator prompts={PROMPTS} textLight={true} />)
    expect(screen.getByText('First prompt')).toBeInTheDocument()
  })

  it('advances to next prompt when Next button is clicked', async () => {
    render(<PromptRotator prompts={PROMPTS} textLight={true} />)
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    await act(async () => vi.advanceTimersByTime(400))
    expect(screen.getByText('Second prompt')).toBeInTheDocument()
  })

  it('wraps around to first prompt after the last', async () => {
    render(<PromptRotator prompts={PROMPTS} textLight={true} />)
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await act(async () => vi.advanceTimersByTime(400))
    }
    expect(screen.getByText('First prompt')).toBeInTheDocument()
  })

  it('renders null when prompts array is empty', () => {
    const { container } = render(<PromptRotator prompts={[]} textLight={true} />)
    expect(container.firstChild).toBeNull()
  })
})
