# VibeList

A mood-based playlist curator. Type how you're feeling — VibeList interprets your mood and generates a matching playlist via Last.fm.

## How it works

1. Type how you're feeling in your own words
2. VibeList reads your mood and shifts the background gradient to match
3. A curated playlist appears based on your emotional state

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Music data | Last.fm API |

## Project structure

```
vibelist/
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── hooks/            # useMoodAnalysis, usePlaylist
│   └── utils/            # Gradient mapping
├── server/               # Express API
│   ├── src/routes/       # /api/analyze, /api/playlist
│   └── src/services/     # AI + Last.fm integrations
└── test/                 # Frontend tests (Vitest)
```

## Getting started

### Prerequisites

- Node.js 18+
- Anthropic API key
- Last.fm API key (free at last.fm/api)

### Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install

# Configure backend environment
cp server/.env.example server/.env
# Fill in ANTHROPIC_API_KEY and LASTFM_API_KEY in server/.env
```

### Run locally

```bash
# Terminal 1 — backend
cd server && node src/index.js

# Terminal 2 — frontend
npm run dev
```

Open http://localhost:5173

### Run tests

```bash
# Frontend tests
npm test

# Backend tests
cd server && npm test
```
