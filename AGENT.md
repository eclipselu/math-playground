# AGENT.md — Little Big Math

## Project Overview
**Little Big Math** is a zero-dependency, offline-capable, child-friendly visual math playground designed for 8–9 year olds (Grade 3 ceiling across **China PEP + Olympiad/数学广角**, **Bellevue WA Illustrative Math + Advanced Learning**, and **Ontario Grade 3**).

Every problem turns into an interactive picture or multi-step visual model—helping children *see* the mathematical structure before calculating.

---

## Core Principles & Pedagogy
1. **Picture First, Formula Second:** Every problem family must have a concrete visual diagram (bar models, area grids, number lines, Venn circles, balance scales, 3D/2D SVGs, etc.) broken into 3–4 digestible step-by-step reveals (`See the story` → `Transform/Isolate` → `Find one part` → `Solve & Verify`).
2. **Three Difficulty Tiers:**
   - `easy` (**At my level**): Small friendly whole numbers, 2–3× multipliers, minimal arithmetic friction so focus stays on the concept.
   - `medium` (**A little harder**): Standard Grade 3 exam numbers, 3–4× multipliers, multi-step reasoning.
   - `large` (**Big challenge**): China Grade 3 Olympiad / Bellevue Advanced Learning ceiling with larger numbers or deeper twists.
3. **Whole-Number / Exact Answers:** Generated problems must always construct backward from clean answers so division, fractions, or unit splits never produce unintended floating-point mess.
4. **Shared Star Economy:**
   - Stored in `localStorage` under key `'little-big-math-stars'`.
   - Earning a star requires solving all inputs of the current problem instance (`solved` flag prevents farming the same generated instance).
   - Every 10th star triggers a celebration toast (`#celebration`).

---

## Technical Architecture & Conventions
- **Zero Build / Vanilla Stack:** Pure HTML5, CSS3, and ES6+ JavaScript wrapped in an IIFE `(() => { 'use strict'; ... })()`. No bundlers, frameworks, or external runtime dependencies required.
- **Offline-Ready:** Google Fonts (`DM Sans`, `Manrope`) are optional enhancements; layout and math symbols must render cleanly with system fonts offline.
- **Shared Styles (`styles.css`):**
  - Color palette variables: `--bg: #f7f5ec`, `--paper: #fffef9`, `--ink: #263f37`, `--muted: #66746a`, `--line: #dedfd3`, `--green: #315b48`, `--peach: #f5d2b7`, `--yellow: #f0cd65`, `--soft: #edf0e3`.
  - Card accent classes: `.peach-card`, `.lilac-card`, `.green-card`, `.yellow`, `.blue`, `.peach`, `.green`, `.lilac`.
  - Adventure-specific styles go in dedicated stylesheets (e.g., `probability.css`, `geometry.css`) layered on top of `styles.css`.
- **Deep Linking via URL Hash:**
  - Every problem family within an adventure page is addressable via `page.html#topicKey` (e.g., `word-problems.html#difference`, `probability.html#spinner`).
  - Listen to `hashchange` and sync `history.replaceState(null, '', '#' + topic)` when switching topics.
  - Link every new adventure and sub-topic chip from `index.html`.
- **Accessibility & Keyboard Support:**
  - Use `aria-pressed="true|false"` on topic selector buttons.
  - Use `aria-current="step"` on step indicator dots.
  - Mark invalid inputs with `aria-invalid="true"` on check failure.
  - Support `Enter` key inside answer inputs to trigger answer checking.
  - Respect `prefers-reduced-motion: reduce`.

---

## File Structure
- `index.html` — Home hub linking to every adventure and deep-linked topic chip.
- `styles.css` — Shared design system, layout, typography, bar-model components, and responsive rules.
- `word-problems.html` + `app.js` — Bar-model, arithmetic, and logic/Olympiad word-problem families.
- `probability.html` + `probability.css` + `probability.js` — Chance Lab (likelihood, marbles, spinners, dice, coins, fair games, live trial simulator).
- `geometry.html` + `geometry.css` + `geometry-model.js` + `geometry.js` — Shape Detective (3D solids, 2D polygons, block views, nets, symmetry).
- Planned adventure pages (see `PLAN.md`):
  - `multiply-divide.html` + `multiply-divide.css` + `multiply-divide.js` — Multiplication, Division & Remainders Lab
  - `fractions.html` + `fractions.css` + `fractions.js` — Fractions & Decimals Lab
  - `area-perimeter.html` + `area-perimeter.css` + `area-perimeter.js` — Area & Perimeter Studio
  - `measurement.html` + `measurement.css` + `measurement.js` — Time, Calendar, Money & Scales Lab
  - `data-coding.html` + `data-coding.css` + `data-coding.js` — Data Tables, Graphs & Grid Coding Lab

---

## Adding or Updating Features
1. Check `PLAN.md` for the target phase and topic specifications.
2. Implement randomized problem generators (`generate(kind, difficulty, original)`), step-by-step visual diagram builders (`stepsFor(p)`), hints, and answer validation.
3. Add deep-link chips to `index.html` and update `README.md` + `PLAN.md` checkboxes as items are completed.
4. Verify in a local server (`python3 -m http.server 8766 --bind 127.0.0.1`) that all difficulty levels, step controls, hints, answer checks, and star counters work without console errors.
