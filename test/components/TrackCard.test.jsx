import { render, screen } from '@testing-library/react'
import { TrackCard } from '../../src/components/TrackCard'

const TRACK = {
  name: 'The Night Will Always Win',
  artist: 'Manchester Orchestra',
  url: 'https://www.last.fm/music/Manchester+Orchestra',
  image: 'https://img.example.com/art.jpg'
}

describe('TrackCard', () => {
  it('renders track name and artist', () => {
    render(<TrackCard track={TRACK} textLight={true} />)
    expect(screen.getByText('The Night Will Always Win')).toBeInTheDocument()
    expect(screen.getByText('Manchester Orchestra')).toBeInTheDocument()
  })

  it('renders Listen link with correct href and target="_blank"', () => {
    render(<TrackCard track={TRACK} textLight={true} />)
    const link = screen.getByRole('link', { name: /listen/i })
    expect(link).toHaveAttribute('href', 'https://www.last.fm/music/Manchester+Orchestra')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders album art img when image url is provided', () => {
    render(<TrackCard track={TRACK} textLight={true} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://img.example.com/art.jpg')
  })

  it('renders art placeholder when image is empty string', () => {
    const { container } = render(<TrackCard track={{ ...TRACK, image: '' }} textLight={true} />)
    expect(container.querySelector('[data-testid="art-placeholder"]')).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
