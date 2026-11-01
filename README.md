# Little Big Math

A child-friendly visual math playground with organized problem adventures, randomized stories and questions, step-by-step picture explanations, hints, answer checking, and saved stars.

Designed to cover the complete Grade 3 math curriculum union across **Bellevue, WA (Illustrative Mathematics Grade 3 + Advanced Learning bridge)**, **China (PEP 三年级上/下册 + 数学广角 / Olympiad logic)**, and **Ontario (Grade 3 Curriculum)**.

## Open

Open `index.html` in your browser. No installation or build is needed. Optional Google Fonts improve typography; the website works offline with system fonts.

Or serve it locally:

```sh
cd /Users/danglu/Projects/math-playground
python3 -m http.server 8766 --bind 127.0.0.1
```

Then visit http://localhost:8766:

- **Home (`index.html`):** organized hub for all 8 adventures, with direct deep-links to every problem family.
- **Word Problems & Olympiad Logic (`word-problems.html`):** 16 story-problem families grouped into *Add and take away*, *Equal groups and sharing*, *Compare with boxes*, and *Logic & Olympiad puzzles*.
- **Multiply, Divide & Remainders (`multiply-divide.html`):** 5 visual models covering break-apart arrays, 2-digit × 2-digit box multiplication, division remainders (round up vs. round down), repeating remainder cycles, and vertical cryptarithms.
- **Area & Perimeter Studio (`area-perimeter.html`):** 6 geometric measurement families covering L-shape splitting, staircase perimeter translation, fixed-perimeter vs. fixed-area optimization, wall-hugger fences, cut-and-paste shapes, and tile/walkway paving.
- **Fractions & Decimals Lab (`fractions.html`):** 7 visual models covering fair-share division, fractions on a number line ($0$ to $3$), equivalent fraction bars, fraction comparison rules, fraction of a group, fraction addition/subtraction, and decimal tenths/hundredths.
- **Shape Detective (`geometry.html`):** interactive 3D prisms and pyramids explorer plus 4 spatial challenge families (*2D Polygon Detective*, *3D Cube Block Views / 三视图*, *Unfold the Solid / 3D Nets*, and *Mirror & Grid Symmetry*).
- **Time, Calendar, Money & Scales (`measurement.html`):** 4 practical measurement families covering elapsed time across hours, calendar & leap-year puzzles, balance scales & graduated beakers, and making change with fewest bills/coins.
- **Data, Compass & Robot Coding (`data-coding.html`):** 4 data and algorithmic families covering scaled bar graphs, two-way summary tables (复式统计表), 8-point compass grid navigation, and robot repeat-loop coding.
- **Chance Lab (`probability.html`):** 6 visual probability families plus a live random trial simulator.

---

## Adventures Overview

### 1. Word Problems & Olympiad Logic (`word-problems.html`)
- **Add and take away:** *The missing piece (`#missing`)*, *First… then… (`#twoStep`)*, *Number hops (`#count`)*.
- **Equal groups and sharing:** *Bags of treasures (`#groups`)*, *Share fairly (`#sharing`)*.
- **Compare with boxes:** *A little more / 和差 (`#difference`)*, *Times as much / 和倍 (`#ratio`)*, *Difference & times / 差倍 (`#diffRatio`)*, *A little extra / 多退少补 (`#extra`)*, *Little shop / 等量代换 (`#shop`)*, *Age puzzle / 年龄问题 (`#age`)*.
- **Logic & Olympiad puzzles:** *Overlapping circles / 集合容斥 (`#venn`)*, *Clever combinations / 搭配问题 (`#combo`)*, *Gaps & markers / 植树爬楼 (`#planting`)*, *Work backwards / 还原问题 (`#backwards`)*, *Chickens & rabbits / 鸡兔同笼 (`#chickenRabbit`)*.

### 2. Multiply, Divide & Remainders (`multiply-divide.html`)
- **Break-apart array (`#splitArray`):** split a grid into two friendly rectangles to see the distributive property.
- **Box multiplication (`#boxMult`):** 4-room place-value area model for 2-digit × 2-digit multiplication.
- **Leftovers matter (`#remainders`):** round-up boats (进一法), round-down ribbons (去尾法), and largest possible remainder/dividend.
- **Repeating patterns (`#cycles`):** use remainders to find the $N\text{th}$ item and count symbols across repeating cycles (周期问题).
- **Hidden digits (`#cryptarithm`):** deduce missing `★` and `▲` digits in vertical arithmetic (竖式谜).

### 3. Area & Perimeter Studio (`area-perimeter.html`)
- **L-shape splitter (`#rectilinear`):** deduce missing sides and split stepped figures into rectangles.
- **Slide the edges (`#staircase`):** push indented staircase edges outward to a bounding rectangle (平移法巧求周长) and spot U-indent traps.
- **Biggest & smallest (`#maxMin`):** explore why square-like rectangles maximize area for a fixed fence and minimize fence for a fixed area.
- **Against the wall (`#wallFence`):** build a 3-sided garden using a brick wall for one side (靠墙围篱笆).
- **Cut and join (`#cutPaste`):** slice the largest square from a rectangle or glue two rectangles together (剪拼问题).
- **Tiles and paths (`#paving`):** pave floors with square tiles and find the area of border walkways around pools (铺砖与小路).

### 4. Fractions & Decimals Lab (`fractions.html`)
- **Fair shares (`#fairShare`):** slice pizzas equally among children to see why $a \div b = \frac{a}{b}$.
- **Fraction number line (`#numberLine`):** hop by unit fractions from $0$ to $3$, including improper fractions and mixed numbers.
- **Same-size fractions (`#equivalent`):** align fraction bars to see equivalent fractions.
- **Which is bigger? (`#compare`):** compare fractions with the same denominator, same numerator, or benchmarks ($\frac{1}{2}$ and $1$).
- **Part of a group (`#ofWhole`):** divide a basket into equal trays to find $\frac{a}{b}$ of a whole number.
- **Add & take away parts (`#fracAddSub`):** add and subtract like-denominator fractions and whole numbers minus fractions.
- **Tenths & hundredths (`#decimals`):** connect fractions to decimal tenths/hundredths and add/subtract decimals.

### 5. Shape Detective (`geometry.html`)
- **3D Prisms & Pyramids (`#prism`, `#pyramid`):** rotate solids, pull faces apart, and count faces, edges, and vertices.
- **2D Polygon Detective (`#quads`):** classify quadrilaterals and polygons by parallel sides, right angles, and equal sides.
- **Block views (`#views`):** match 3D unit-cube stacks to their Front, Top, and Right-Side 2D views (三视图) and count hidden cubes.
- **Unfold the solid (`#nets`):** fold 2D nets into 3D cubes and find opposite faces.
- **Mirror & grid (`#symmetry`):** count symmetry lines and reflect shapes across mirror lines.

### 6. Time, Calendar, Money & Scales (`measurement.html`)
- **Time jumper (`#elapsedTime`):** analog/digital clocks, 24-hour time, and timeline hops across hour marks.
- **Calendar detective (`#calendar`):** month lengths, leap years, and day-of-the-week modular counting across months.
- **Scales & beakers (`#scalesBeakers`):** read graduated cylinders ($mL/L$) and solve two-pan balance scale puzzles ($g/kg$).
- **Change maker (`#changeMaker`):** calculate receipts, change from bills, and fewest bills/coins.

### 7. Data, Compass & Robot Coding (`data-coding.html`)
- **Scaled graphs (`#scaledGraph`):** read scaled bar graphs (including half-marks) and solve multi-step comparisons.
- **Two-way table (`#twoWayTable`):** deduce missing interior and total cells in two-way summary tables (复式统计表).
- **Compass & grid map (`#compassGrid`):** navigate 8-point compass directions (`N, S, E, W, NE, NW, SE, SW`) on a coordinate grid.
- **Robot coding (`#codingBot`):** trace `repeat K` code loops and extra moves on a grid.

### 8. Chance Lab (`probability.html`)
- **How likely is it? (`#words`, `#likely`):** 5-point likelihood line and marble sorting.
- **Count the chances (`#spinner`, `#dice`, `#coins`):** spinner slices, die faces, and 2–3 coin sample spaces.
- **Play fair (`#fair`):** compare player odds and run live 1× / 10× random trials.
