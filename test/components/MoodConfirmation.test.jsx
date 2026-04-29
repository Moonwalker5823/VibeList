import { render, screen } from '@testing-library/react'
import { MoodConfirmation } from '../../src/components/MoodConfirmation'

describe('MoodConfirmation', () => {
  it('renders the confirmation text', () => {
    render(<MoodConfirmation confirmation="Feeling nostalgic today." textLight={true} />)
    expect(screen.getByText('Feeling nostalgic today.')).toBeInTheDocument()
  })

  it('applies text-white when textLight is true', () => {
    const { container } = render(<MoodConfirmation confirmation="Hello" textLight={true} />)
    expect(container.firstChild.className).toContain('text-white')
  })

  it('applies text-gray-900 when textLight is false', () => {
    const { container } = render(<MoodConfirmation confirmation="Hello" textLight={false} />)
    expect(container.firstChild.className).toContain('text-gray-900')
  })
})
