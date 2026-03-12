# Plant Game — UI

An interactive generative art application that breeds procedurally-generated plants and flowers using genetic algorithms. Drag plants onto each other to breed or swap them.

## Tech Stack

- **Vue 3** — UI framework
- **Vite** — build tool and dev server
- **Snap.svg** — SVG rendering
- **Vitest** — unit testing
- **ESLint 9** — linting (flat config)

## Prerequisites

- Node.js v25+ (see `.nvmrc`)
- npm

## Development

```bash
npm install
npm run dev       # dev server at http://localhost:8000
```

## Testing

```bash
npm test          # run all tests
npm run test:ui   # run tests with the Vitest UI dashboard
```

## Linting

```bash
npm run lint
```

## Building

```bash
npm run build     # outputs to ../server/dist/js/app.js
npm run preview   # preview the production build
```

## Project Structure

```
src/
  app.js              # Vue 3 app entry point
  plant.js            # Plant drawing (recursive SVG stems)
  flower.js           # Flower drawing (petals, center)
  gene.js             # Genetic algorithm (Gene, GeneSet)
  breedableDrawing.js # Base class for drawable/breedable objects
  colors.js           # RGBA/HSL color utilities
  math2d.js           # 2D geometry (Point, Line)
  util.js             # randomInt, seedrandom helpers
test/
  gene-spec.js        # Gene and GeneSet tests
  plant-spec.js       # Plant tests
  colors-spec.js      # Color conversion tests
  math2d-spec.js      # Geometry tests
```

## How Breeding Works

Each plant/flower has a `GeneSet` — a collection of typed genes (integers, arrays, colors). Dragging one plant onto another breeds their gene sets using crossover and optional mutation. Dragging to the right half swaps genes instead.
