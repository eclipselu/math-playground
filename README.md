# Little Big Math

A child-friendly math practice website with nine problem families, three difficulty levels, randomized stories and questions, visual solving steps, hints, answer checking, and saved stars.

## Open

Open `index.html` in your browser. No installation or build is needed. Optional Google Fonts improve typography; the website works offline with system fonts.

Or serve it locally:

```sh
cd /Users/ludang/Projects/math-playground
python3 -m http.server 8766 --bind 127.0.0.1
```

Then visit http://localhost:8766. The geometry section is at http://localhost:8766/geometry.html.

## Shape Detective: 3D geometry

Open `geometry.html`, or choose **Shape Detective** from the home page. Explore prisms and pyramids with triangle, square, rectangle, pentagon, and hexagon bases.

- Drag, use arrow keys, or use the rotation buttons to turn the solid.
- Gold faces mark the bases. Dashed lines show hidden edges.
- Choose Faces, Edges, or Vertices and tap numbered parts to mark them as counted. The matching buttons also provide access to parts hidden behind others.
- Pull faces apart or see through the solid to discover hidden faces.
- Build, Faces, Edges, and Corners lessons explain counts using the current base, including why the pyramid tip counts only once.
- New mystery shape hides answers for practice. Check your counts or reveal the counting lessons.
- A hands-on activity suggests straws, play dough, and paper.

The models are right prisms and pyramids with convex polygon bases. Square and rectangle bases have the same topology and counts. No external 3D libraries are needed.

## Word problems

- **A little more:** split a total into two amounts with a known difference.
- **Times as much:** split a total into equal ratio parts.
- **A little extra:** set aside an extra amount, share equally, then add it back.
- **Little shop:** find item prices and the cost of a different order.
- **Number hops:** follow one counting rule, then change the hop size.
- **Share fairly:** divide treasures equally between children.
- **The missing piece:** subtract a known part from the total to find the other part.
- **Bags of treasures:** count equal groups, then add one more matching group.
- **First… then…:** add what you receive, then subtract what you give away.

The default **At my level** setting uses small whole numbers, two or three times as much, and short stories suitable for practicing these ideas at age seven. Shop prices are $2–$3, generated totals stay at or below 50, and there are no remainders or negative answers. **A little harder** and **Big challenge** are optional.

Stories rotate through stickers, marbles, toy cars, shells, blocks, cards, money, and four shop menus. **New problem** keeps the current topic; **Surprise me** changes to a different topic. New topics use countable pictures, with crossed-out objects for subtraction and separate piles for equal sharing. For larger numbers, piles display counts instead of hundreds of pictures.

All generated answers are whole numbers. Each problem earns at most one star. Stars are saved in browser storage when available. Ten stars trigger a celebration. No accounts or personal data are needed.
