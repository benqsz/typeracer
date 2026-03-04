# Typeracer

Real time multiplayer typing competition

## Features

### Core Features

- **Real-Time Multiplayer Competitions** - Multiple players join and compete simultaneously with live-updated
  leaderboard
- **Live Player Stats** - Words per minute (WPM) and accuracy metrics updated in real-time as players type
- **Fixed-Time Rounds** - All players compete in synchronized rounds with automatic sentence rotation
- **Player Progress Display** - Table shows live typing progress for each player character-by-character
- **Session Persistence** - Player stats are saved and loaded when rejoining
- **Responsive UI** - Clean, minimalist interface with real-time updates
- **Session Management** - Automatic user tracking with session IDs
- **Sentence Fetching** - Dynamic sentence retrieval from Quotable.io API

## TechStack

- Nextjs
- Typescript
- Convex
- Tailwind CSS
- shadcn/ui

## Getting Started

### Prerequisites

- Node.js
- pnpm or npm
- Convex account

### Installation

1. Install dependencies
   ```bash
   pnpm install
   ```

2. Set up Convex
   ```bash
   pnpm dlx convex dev
   ```
3. Start Convex development server
   ```bash
   pnpm run dev:convex
   ```
   
4. Start Next.js development server
   ```bash
    pnpm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing Strategy

### Manual Testing (Current)

- Test locally with multiple browser windows
- Verify metrics calculation with known inputs
- Test edge cases: mid-round join, timeout, page refresh

### Recommended Tests (To Implement)

Unit Tests (Jest + React Testing Library)

- WPM & accuracy calculation
- Round state transitions
- Player timeout logic

Integration Tests

- Full game round from start to finish
- Multiple concurrent players
- Late player join

E2E Tests (Playwright)

- Complete user journey
- Real-time leaderboard updates
- Cross-browser compatibility

## Current Limitations

1. **Single Game Instance** - Only one active round at a time globally
    - *Fix:* Add room/tournament concept to support multiple parallel games

2. **No Persistent Leaderboard** - Only current round stats shown
    - *Fix:* Archive game results, add all-time stats page

3. **No Player Authentication** - Anonymous session-based
    - *Fix:* Add user accounts, profile pages

4. **Limited Sentence Variety** - Depends on Quotable.io availability
    - *Fix:* Pre-populate database with curated sentences, fallback cache

