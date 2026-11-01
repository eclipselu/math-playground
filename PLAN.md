# Little Big Math — Master Curriculum Plan (`PLAN.md`)

This plan tracks the complete Grade 3 math curriculum union across **China (PEP 三年级上/下册 + 数学广角/浅奥)**, **Bellevue, WA (Grade 3 Illustrative Mathematics + Advanced Learning Grade 4 bridge)**, and **Ontario (Grade 3 2020 Curriculum)**, aimed at the **hardest ceiling**.

---

## Completed Baseline
- [x] **Home Hub (`index.html` & `styles.css`):** Shared star counter, celebration bar, adventure cards, and deep-linked topic chips.
- [x] **Word Problems Core (`word-problems.html` & `app.js`):**
  - [x] `#missing` — The missing piece (Missing addend / subtrahend)
  - [x] `#twoStep` — First… then… (2-step addition & subtraction)
  - [x] `#count` — Number hops (Changing step-size sequences)
  - [x] `#groups` — Bags of treasures (Equal groups + 1 more group)
  - [x] `#sharing` — Share fairly (Exact partitive division)
  - [x] `#difference` — A little more (Sum & Difference / 和差问题)
  - [x] `#ratio` — Times as much (Sum & Multiple / 和倍问题)
  - [x] `#extra` — A little extra (Equal parts after setting aside extra / 多退少补)
  - [x] `#shop` — Little shop (Simultaneous item substitution / 等量代换)
- [x] **Chance Lab: Probability (`probability.html`, `probability.css`, `probability.js`):**
  - [x] `#words` — Certain or impossible? (5-point likelihood scale)
  - [x] `#likely` — Pick a marble (Sorting frequency rows, most/least likely)
  - [x] `#spinner` — Spin it (Equal sectors & complement events)
  - [x] `#dice` — Roll a die (6-face rule matching)
  - [x] `#coins` — Flip coins (2- and 3-coin ordered sample spaces)
  - [x] `#fair` — Is the game fair? (Comparing player odds + live 1x/10x trial simulator)
- [x] **Shape Detective: 3D Solids (`geometry.html`, `geometry.css`, `geometry-model.js`, `geometry.js`):**
  - [x] `#prism` & `#pyramid` — Interactive 3D right prisms and pyramids (triangle, square, rectangle, pentagon, hexagon bases) with face, edge, and vertex counting & explode/see-through sliders.

---

## Phase 1: Expand Word Problems with China Grade 3 Olympiad & Logic (`word-problems.html` & `app.js`)
Completes the classic Chinese Grade 3 "Math Wide Angle" (数学广角) and bar-model suite:
- [x] **`#diffRatio` — Difference & Multiple (差倍问题):** Given how many *times* ($k\times$) and the *difference* between two amounts, find each amount using $(k - 1)$ equal boxes.
- [x] **`#age` — Age Puzzles (年龄问题):** Constant age-difference bar model (*"In how many years will Mom be $k$ times as old as Leo?"* or *"How many years ago?"*).
- [x] **`#venn` — Overlapping Circles / Venn Diagrams (集合问题 / 容斥原理):** Two overlapping sets with optional "neither" count ($|A \cup B| = |A| + |B| - |A \cap B|$).
- [x] **`#combo` — Outfit, Digit & Handshake Combinations (搭配问题):** Product rule ($A \times B$), forming 2- or 3-digit numbers with a zero restriction, and round-robin handshakes/games $\frac{n(n-1)}{2}$.
- [x] **`#planting` — Trees, Cuts & Stairs Intervals (植树与爬楼问题):** Open path (both ends, one end, neither end), closed loop, sawing logs, and climbing stairs between floors.
- [x] **`#backwards` — Work Backwards (还原问题 / 逆推法):** Reverse flow-chart chains where amounts are halved/doubled and added/subtracted step by step.
- [x] **`#chickenRabbit` — Chickens & Rabbits (鸡兔同笼):** Classic head-and-leg assumption method (假设法) visualized by lifting/adding legs on animal cards.

---

## Phase 2: Multiplication, Division & Remainders Lab (`multiply-divide.html`)
Covers Bellevue IM Units 1 & 4, Bellevue AL multi-digit models, and China 3A/3B division with remainders:
- [x] **`#splitArray` — Break-Apart Array (Distributive Property):** Interactive dot/tile array splitter showing $a \times (b + c) = (a \times b) + (a \times c)$.
- [x] **`#boxMult` — 2-Digit × 2-Digit Area Box Model:** 4-region place-value box multiplication ($20+4) \times (10+6)$ with partial products.
- [x] **`#remainders` — Division with Remainders: Round Up vs. Round Down (进一法与去尾法):** Boats/tents (round up), ribbons/boxes (round down), and reverse remainder theorem ($\text{Dividend} = \text{Divisor} \times \text{Quotient} + \text{Remainder}$, max remainder $d - 1$).
- [x] **`#cycles` — Repeating Remainder Cycles (周期问题):** Find the $N\text{th}$ shape/bead/day of the week and count how many of a specific item appear in the first $N$ items.
- [x] **`#cryptarithm` — Missing Digit Puzzles (竖式谜):** Deduce hidden digits in multi-digit addition, subtraction, multiplication, and division vertical setups.

---

## Phase 3: Area & Perimeter Studio (`area-perimeter.html`)
Covers Bellevue IM Units 2 & 7, Ontario Strand E, and China 3A/3B geometry tricks:
- [x] **`#rectilinear` — L- & U-Shape Splitter:** Deduce missing side lengths on stepped polygons and split into rectangles to find total area and perimeter.
- [x] **`#staircase` — Staircase Perimeter Translation (平移法巧求周长):** Slide indented segments outward to bounding rectangles (plus U-indent traps that add $2 \times \text{depth}$).
- [x] **`#maxMin` — Same Perimeter vs. Same Area Explorer:** Compare rectangles with fixed perimeter (max area near a square) or fixed area (min perimeter near a square).
- [x] **`#wallFence` — Wall-Hugger Garden (靠墙围篱笆):** 3-sided fence against a wall ($L + 2W$ or $2L + W$) to maximize or calculate area/perimeter.
- [x] **`#cutPaste` — Cut & Paste Shapes (剪拼问题):** Cut the largest square from a rectangle, or glue two rectangles together along long vs. short edges and track perimeter loss.
- [x] **`#paving` — Tile Paving & Border Paths (铺砖与小路问题):** Tile a room with unit conversions and find the area of a walkway around a rectangular garden.

---

## Phase 4: Fractions & Decimals Lab (`fractions.html`)
Covers Bellevue IM Unit 5 (deep number-line & equivalence rigor), Ontario fair-sharing, and China 3A/3B fractions & decimals:
- [x] **`#fairShare` — Fair-Share Division into Fractions:** Share $a$ items equally among $b$ kids ($a/b$ and mixed numbers).
- [x] **`#numberLine` — Fractions on the Number Line ($0$ to $3$):** Place proper fractions, unit fractions, and improper fractions ($>1$, e.g., $7/4$) on partitioned number lines.
- [x] **`#equivalent` — Equivalent Fraction Bars & Hops:** Visual bar alignment and subdivision showing $\frac{1}{2} = \frac{2}{4} = \frac{4}{8}$ and $\frac{2}{3} = \frac{4}{6}$.
- [x] **`#compare` — Fraction Comparison Duel:** Compare same-denominator, same-numerator, benchmark to $\frac{1}{2}$, and complement to $1$ ($\frac{4}{5}$ vs. $\frac{7}{8}$).
- [x] **`#ofWhole` — Fraction of a Collection (求一个数的几分之几):** Split $N$ items into $b$ equal groups and take $a$ groups (plus complement $1 - \frac{a}{b}$).
- [x] **`#fracAddSub` — Fraction Addition & Subtraction:** Add/subtract like-denominator fractions and whole minus fraction ($1 - \frac{3}{7}$ or $2 - \frac{5}{6}$).
- [x] **`#decimals` — Decimal Tenths, Hundredths & Money Bridge:** Connect fractions ($\frac{3}{10}, \frac{25}{100}$) to decimals ($0.3, 0.25$) on 10-bars, 100-grids, and decimal addition/subtraction.

---

## Phase 5: Expand Shape Detective with 2D Polygons, 3D Views, Nets & Symmetry (`geometry.html`)
Expands `geometry.html` to cover Bellevue 2D classification, China 3A Unit 1 block projections, and Ontario spatial sense:
- [x] **`#quads` — 2D Polygon & Quadrilateral Detective:** Classify squares, rectangles, rhombuses, parallelograms, and trapezoids by parallel sides, equal sides, and right angles.
- [x] **`#views` — 3D Cube Block Views (三视图 / 观察物体):** Inspect a 3D unit-cube structure and match/draw its Front, Top, and Right-Side 2D views (plus count hidden cubes).
- [x] **`#nets` — Unfold the Solid (3D Nets / 展开图):** Fold and unfold cube, prism, and pyramid nets and identify opposite faces on a cube net.
- [x] **`#symmetry` — Symmetry & Grid Reflections:** Identify lines of symmetry and reflect/translate shapes on a coordinate grid.

---

## Phase 6: Time, Calendar, Money & Scales Lab (`measurement.html`)
Covers Bellevue IM Unit 6, China 3A/3B time/calendar/mass, and Ontario Strand F Financial Literacy:
- [x] **`#elapsedTime` — Clock & Timeline Jumper:** Analog/digital clocks, 24-hour time, and elapsed-time hops across the hour mark (start time, end time, or duration).
- [x] **`#calendar` — Calendar Detective (年月日):** Days in each month, leap year rules, and day-of-week modular arithmetic across month boundaries.
- [x] **`#scalesBeakers` — Balance Scales, Beakers & Ruler Plots:** Read $mL/L$ cylinders, balance $g/kg/t$ weights, and measure objects to $\frac{1}{4}$ inch / $mm$ with unit conversion puzzles.
- [x] **`#changeMaker` — Coin & Bill Change Maker:** Calculate total cost, change from $20/$50/$100, and make exact change with the fewest bills and coins.

---

## Phase 7: Data Tables, Scaled Graphs & Grid Coding Lab (`data-coding.html`)
Covers China 3B two-way tables, Bellevue scaled graphs, and Ontario Strands C & D (Coding & Data):
- [x] **`#scaledGraph` — Scaled Bar Graphs & Pictographs:** Interpret and solve comparison problems where 1 grid step or 1 symbol = $2, 5, 10,$ or $25$ items.
- [x] **`#twoWayTable` — Two-Way Summary Tables (复式统计表):** Deduce missing interior and total cells across multi-row, multi-column data tables.
- [x] **`#compassGrid` — 8-Point Compass & Grid Map (位置与方向):** Navigate relative directions (N, S, E, W, NE, NW, SE, SW) between landmarks.
- [x] **`#codingBot` — Grid Robot & Loop Coding:** Trace and debug step-by-step arrow commands with `repeat N` loops and `if` tiles on a grid.
