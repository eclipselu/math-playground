# Little Big Math

A child-friendly visual math playground with organized problem adventures, randomized stories and questions, step-by-step picture explanations, hints, answer checking, and saved stars.

## Open

Open `index.html` in your browser. No installation or build is needed. Optional Google Fonts improve typography; the website works offline with system fonts.

Or serve it locally:

```sh
cd /Users/danglu/Projects/math-playground
python3 -m http.server 8766 --bind 127.0.0.1
```

Then visit http://localhost:8766:

- **Home (`index.html`):** organized hub for every adventure, with direct links to each problem family.
- **Word Problems (`word-problems.html`):** nine story-problem families grouped into *Add and take away*, *Equal groups and sharing*, and *Compare with boxes*.
- **Chance Lab (`probability.html`):** six visual probability families grouped into *How likely is it?*, *Count the chances*, and *Play fair*, plus a live experiment simulator.
- **Shape Detective (`geometry.html`):** interactive 3D prisms and pyramids.

## Chance Lab: probability (`probability.html`)

Open `probability.html`, or choose **Chance Lab** from the home page. Designed for age eight using concrete pictures and “`__ out of __`” language:

- **Certain or impossible? (`#words`):** look inside a marble jar, count the matching marbles, and place the event on a 5-point chance line (*Impossible*, *Unlikely*, *Even chance*, *Likely*, *Certain*).
- **Pick a marble (`#likely`):** sort a mixed jar of marbles into color rows to see which color has the most (or fewest) chances.
- **Spin it (`#spinner`):** count equal spinner slices to find the chance of landing on a color (and, at the harder level, the chance of *not* landing on it).
- **Roll a die (`#dice`):** inspect all 6 faces of a die and highlight the faces that match rules like *an even number*, *bigger than 4*, or *a 2 or a 5*.
- **Flip coins (`#coins`):** build the complete list of ways 2 or 3 coins can land (`HH`, `HT`, `TH`, `TT`, …) to see why `HT` and `TH` are two separate outcomes.
- **Is it fair? (`#fair`):** compare two players’ winning slices on a spinner to decide whether a game is fair or who has the better chance.
- **Try it and see:** run 1 or 10 random trials at a time and watch the live tally bars grow toward the expected chance.

## Shape Detective: 3D geometry (`geometry.html`)

Open `geometry.html`, or choose **Shape Detective** from the home page. Explore prisms and pyramids with triangle, square, rectangle, pentagon, and hexagon bases.

- Drag, use arrow keys, or use the rotation buttons to turn the solid.
- Gold faces mark the bases. Dashed lines show hidden edges.
- Choose Faces, Edges, or Vertices and tap numbered parts to mark them as counted. The matching buttons also provide access to parts hidden behind others.
- Pull faces apart or see through the solid to discover hidden faces.
- Build, Faces, Edges, and Corners lessons explain counts using the current base, including why the pyramid tip counts only once.
- New mystery shape hides answers for practice. Check your counts or reveal the counting lessons.
- A hands-on activity suggests straws, play dough, and paper.

The models are right prisms and pyramids with convex polygon bases. Square and rectangle bases have the same topology and counts. No external 3D libraries are needed.

## Word problems (`word-problems.html`)

Grouped into three categories so children can pick the kind of thinking they want to practice:

### Add and take away
- **The missing piece (`#missing`):** subtract a known part from the total to find the other part.
- **First… then… (`#twoStep`):** add what you receive, then subtract what you give away.
- **Number hops (`#count`):** follow one counting rule, then change the hop size.

### Equal groups and sharing
- **Bags of treasures (`#groups`):** count equal groups, then add one more matching group.
- **Share fairly (`#sharing`):** divide treasures equally between children.

### Compare with boxes
- **A little more (`#difference`):** split a total into two amounts with a known difference.
- **Times as much (`#ratio`):** split a total into equal ratio parts.
- **A little extra (`#extra`):** set aside an extra amount, share equally, then add it back.
- **Little shop (`#shop`):** find item prices and the cost of a different order.

The default **At my level** setting uses small whole numbers, two or three times as much, and short stories. Shop prices are $2–$3, generated totals stay at or below 50, and there are no remainders or negative answers. **A little harder** and **Big challenge** are optional.

Stories rotate through stickers, marbles, toy cars, shells, blocks, cards, money, and four shop menus. **New problem** keeps the current topic; **Surprise me** changes to a different topic.

All generated answers are whole numbers. Each problem earns at most one star. Stars are saved in browser storage when available and shared across adventures. Ten stars trigger a celebration. No accounts or personal data are needed.
