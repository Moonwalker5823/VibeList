import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GenreSelect } from '../../src/components/GenreSelect'

const genres = ['jazz', 'classical', 'indie folk']

describe('GenreSelect', () => {
  it('renders a chip for each genre', () => {
    render(
      <GenreSelect genres={genres} textLight={true}
        onSelect={() => {}} onSkip={() => {}} isLoading={false} />
    )
    expect(screen.getByText('jazz')).toBeInTheDocument()
    expect(screen.getByText('classical')).toBeInTheDocument()
    expect(screen.getByText('indie folk')).toBeInTheDocument()
  })

  it('renders a Skip button', () => {
    render(
      <GenreSelect genres={genres} textLight={true}
        onSelect={() => {}} onSkip={() => {}} isLoading={false} />
    )
    expect(screen.getByText(/skip/i)).toBeInTheDocument()
  })

  it('calls onSelect with the genre when a chip is clicked', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <GenreSelect genres={genres} textLight={true}
        onSelect={onSelect} onSkip={() => {}} isLoading={false} />
    )
    await user.click(screen.getByText('jazz'))
    expect(onSelect).toHaveBeenCalledWith('jazz')
  })

  it('calls onSkip when Skip is clicked', async () => {
    const onSkip = vi.fn()
    const user = userEvent.setup()
    render(
      <GenreSelect genres={genres} textLight={true}
        onSelect={() => {}} onSkip={onSkip} isLoading={false} />
    )
    await user.click(screen.getByText(/skip/i))
    expect(onSkip).toHaveBeenCalled()
  })

  it('disables all chips while loading', () => {
    render(
      <GenreSelect genres={genres} textLight={true}
        onSelect={() => {}} onSkip={() => {}} isLoading={true} />
    )
    const buttons = screen.getAllByRole('button')
    buttons.forEach(btn => expect(btn).toBeDisabled())
  })

  it('shows spinner on selected chip when isLoading becomes true', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <GenreSelect genres={genres} textLight={true}
        onSelect={() => {}} onSkip={() => {}} isLoading={false} />
    )
    await user.click(screen.getByText('jazz'))
    rerender(
      <GenreSelect genres={genres} textLight={true}
        onSelect={() => {}} onSkip={() => {}} isLoading={true} />
    )
    const jazzButton = screen.getByText('jazz').closest('button')
    expect(jazzButton.querySelector('svg')).toBeInTheDocument()
    const classicalButton = screen.getByText('classical').closest('button')
    expect(classicalButton.querySelector('svg')).toBeNull()
  })
})
