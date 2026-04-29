import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MoodInput } from '../../src/components/MoodInput'

describe('MoodInput', () => {
  it('renders a textarea and submit button', () => {
    render(<MoodInput onSubmit={() => {}} isLoading={false} textLight={true} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onSubmit with trimmed text on submit', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<MoodInput onSubmit={onSubmit} isLoading={false} textLight={true} />)
    await user.type(screen.getByRole('textbox'), '  feeling tired  ')
    await user.click(screen.getByRole('button'))
    expect(onSubmit).toHaveBeenCalledWith('feeling tired')
  })

  it('does not call onSubmit when text is empty', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<MoodInput onSubmit={onSubmit} isLoading={false} textLight={true} />)
    await user.click(screen.getByRole('button'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('disables textarea and button when isLoading is true', () => {
    render(<MoodInput onSubmit={() => {}} isLoading={true} textLight={true} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('uses clarificationQuestion as textarea placeholder', () => {
    render(
      <MoodInput onSubmit={() => {}} isLoading={false} textLight={true}
        clarificationQuestion="Can you tell me more about what's going on?" />
    )
    expect(screen.getByPlaceholderText("Can you tell me more about what's going on?")).toBeInTheDocument()
  })
})
