# Cues — Decide with Ease

A lightweight iOS-inspired mobile web app that helps you break decision paralysis. List your options, narrow them down, and let randomness help you commit to a choice.

## Overview

Cues simplifies decision-making into three steps:
1. **List** — Enter your options
2. **Reduce** — Eliminate options you don't want
3. **Decide** — Get a random selection from what's left

With reroll limits, a decision history log, and quick feedback collection, Cues turns indecision into action in seconds.

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **bun** (npm is included with Node; bun is optional and faster)

## Installation

1. **Clone or extract the project**
   ```bash
   cd new\ cues\ prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   Or with bun:
   ```bash
   bun install
   ```

## Running the App

### Development Server

Start the local development server:

```bash
npm run dev
```

Or with bun:
```bash
bun run dev
```

The app will be available at: **http://localhost:8080/**

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run build:dev` — Build in development mode
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint to check code quality
- `npm run test` — Run tests once
- `npm run test:watch` — Run tests in watch mode

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Fast bundler
- **Tailwind CSS** — Styling
- **Shadcn/ui** — Component library
- **React Router** — Navigation
- **date-fns** — Date utilities
- **Lucide React** — Icons

## Features

### MVP (Core)
- ✅ Option input with validation
- ✅ Option elimination with visual feedback
- ✅ Random decision generator with animated shuffle
- ✅ Decision result screen with reroll + accept options
- ✅ Decision history (all decisions logged with timestamps)
- ✅ Persistent data storage (localStorage)
- ✅ Regret check feedback collection
- ✅ Calendar week view with day filtering
- ✅ Saved decisions bookmark system

### Pages
- **Home** — Welcome screen with quick start button
- **Create** — Enter your decision title and options
- **Eliminate** — Remove options with reflective prompts
- **Result** — View chosen option with reroll/accept/start over
- **Log** — View all decisions with calendar navigation
- **History** — View and manage saved decisions

## API Setup

No external APIs required. All data is stored locally in your browser using localStorage.

## Browser Support

Works best on modern browsers (Chrome, Safari, Firefox, Edge). Designed for mobile viewing.

## Project Structure

```
src/
├── pages/           # Main page components
├── components/      # Reusable UI components
├── context/         # React context (DecisionContext)
├── hooks/           # Custom React hooks
├── assets/          # Images and static files
└── lib/             # Utility functions
```

## Notes

- Decisions are stored in localStorage and persist across sessions
- Maximum 100 decisions kept in history
- Reroll limit: 3 (or 1 if fewer than 3 options remain)
- All decisions must have at least 2 options to proceed
