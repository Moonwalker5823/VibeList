import { render } from '@testing-library/react'
import { LoadingState } from '../../src/components/LoadingState'

describe('LoadingState', () => {
  it('renders exactly 10 skeleton cards', () => {
    const { container } = render(<LoadingState />)
    expect(container.querySelectorAll('[data-testid="skeleton-card"]')).toHaveLength(10)
  })
})
