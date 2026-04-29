const GRADIENTS = {
  happy:       { gradient: ['#F7971E', '#FFD200'], textLight: false },
  euphoric:    { gradient: ['#F7971E', '#FFD200'], textLight: false },
  sad:         { gradient: ['#141E30', '#243B55'], textLight: true },
  heartbroken: { gradient: ['#141E30', '#243B55'], textLight: true },
  melancholic: { gradient: ['#2C3E50', '#4A235A'], textLight: true },
  nostalgic:   { gradient: ['#2C3E50', '#4A235A'], textLight: true },
  energetic:   { gradient: ['#1D976C', '#93F9B9'], textLight: false },
  triumphant:  { gradient: ['#1D976C', '#93F9B9'], textLight: false },
  peaceful:    { gradient: ['#A8EDEA', '#FED6E3'], textLight: false },
  calm:        { gradient: ['#A8EDEA', '#FED6E3'], textLight: false },
  angry:       { gradient: ['#B22222', '#232526'], textLight: true },
  frustrated:  { gradient: ['#B22222', '#232526'], textLight: true },
  anxious:     { gradient: ['#373B44', '#4286F4'], textLight: true },
  nervous:     { gradient: ['#373B44', '#4286F4'], textLight: true },
  focused:     { gradient: ['#0F2027', '#2C5364'], textLight: true },
  determined:  { gradient: ['#0F2027', '#2C5364'], textLight: true },
}

const DEFAULT = { gradient: ['#1a1a2e', '#16213e'], textLight: true }

export function getGradient(moodCategory) {
  return GRADIENTS[moodCategory] ?? DEFAULT
}
