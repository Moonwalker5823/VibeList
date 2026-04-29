import { render, screen } from '@testing-library/react'
import { PlaylistGrid } from '../../src/components/PlaylistGrid'

const TRACKS = [
  { name: 'Track One', artist: 'Artist A', url: 'https://last.fm/1', image: '' },
  { name: 'Track Two', artist: 'Artist B', url: 'https://last.fm/2', image: '' },
]

describe('PlaylistGrid', () => {
  it('renders null when status is idle', () => {
    const { container } = render(<PlaylistGrid status="idle" tracks={[]} textLight={true} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders skeleton cards when status is loading', () => {
    const { container } = render(<PlaylistGrid status="loading" tracks={[]} textLight={true} />)
    expect(container.querySelectorAll('[data-testid="skeleton-card"]').length).toBeGreaterThan(0)
  })

  it('renders TrackCards when status is done', () => {
    render(<PlaylistGrid status="done" tracks={TRACKS} textLight={true} />)
    expect(screen.getByText('Track One')).toBeInTheDocument()
    expect(screen.getByText('Track Two')).toBeInTheDocument()
  })

  it('renders error message when status is error', () => {
    render(<PlaylistGrid status="error" tracks={[]} textLight={true} error="No tracks found for this mood." />)
    expect(screen.getByText('No tracks found for this mood.')).toBeInTheDocument()
  })
})
