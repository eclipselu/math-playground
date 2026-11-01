(() => {
  'use strict';

  // ---------- Utilities & Helpers ----------
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = list => list[rand(0, list.length - 1)];
  const fmt = n => Number(n).toLocaleString('en-US');

  const topics = {
    rectilinear: {
      caption: 'L-SHAPE SPLITTER',
      icon: '📐',
      title: 'Split a stepped room into rectangles',
      badge: 'Break into simpler rectangles'
    },
    staircase: {
      caption: 'SLIDE THE EDGES',
      icon: '🪜',
      title: 'Push the stairs out to a rectangle',
      badge: 'Slide edges to the outside'
    },
    maxMin: {
      caption: 'BIGGEST & SMALLEST',
      icon: '🏆',
      title: 'Same fence, different rooms',
      badge: 'Square shapes hold more'
    },
    wallFence: {
      caption: 'AGAINST THE WALL',
      icon: '🧱',
      title: 'One wall is free!',
      badge: 'Count only 3 fenced sides'
    },
    cutPaste: {
      caption: 'CUT AND JOIN',
      icon: '✂️',
      title: 'Slice a square or glue two shapes',
      badge: 'Cut lines and hidden seams'
    },
    paving: {
      caption: 'TILES AND PATHS',
      icon: '🟧',
      title: 'Pave the floor or build a walkway',
      badge: 'Count tiles or wrap with a border'
    }
  };

  // ---------- Problem Generator ----------
  function generate(kind, level = 'easy') {
    if (!topics[kind]) throw new Error('Unknown topic: ' + kind);
    const p = { kind, level };

    // --- 1. RECTILINEAR (L-shape splitter) ---
    if (kind === 'rectilinear') {
      let W, H, w1, h2;
      if (level === 'easy') {
        W = rand(6, 10);
        H = rand(6, 10);
        w1 = rand(2, W - 2);
        h2 = rand(2, H - 2);
      } else if (level === 'medium') {
        W = rand(10, 16);
        H = rand(8, 14);
        w1 = rand(3, W - 3);
        h2 = rand(3, H - 3);
      } else {
        // large
        W = rand(16, 26);
        H = rand(14, 22);
        w1 = rand(5, W - 4);
        h2 = rand(4, H - 4);
      }
      const w2 = W - w1;
      const h1 = H - h2;
      // Missing side can be horizontal cutout w2 or vertical cutout h1
      const missingHorizontal = Math.random() < 0.5;
      const missingName = missingHorizontal ? 'inner step width (w)' : 'inner step height (h)';
      const missingVal = missingHorizontal ? w2 : h1;

      // Area split: vertical split Rectangle A (w1 × H) + Rectangle B (w2 × h2)
      const areaA = w1 * H;
      const areaB = w2 * h2;
      const totalArea = areaA + areaB;

      p.W = W;
      p.H = H;
      p.w1 = w1;
      p.w2 = w2;
      p.h1 = h1;
      p.h2 = h2;
      p.missingHorizontal = missingHorizontal;
      p.missingVal = missingVal;
      p.areaA = areaA;
      p.areaB = areaB;
      p.totalArea = totalArea;

      p.story = `An L-shaped patio has an outer width of <strong>${W} m</strong> and an outer height of <strong>${H} m</strong>. The top edge is <strong>${w1} m</strong> wide, and the right edge is <strong>${h2} m</strong> high. One inner side length is marked with a <strong>?</strong>. Find the missing side length, then find the total area of the patio.`;
      p.answers = [
        { label: `Missing side length (${missingHorizontal ? 'horizontal ?' : 'vertical ?'})`, value: missingVal, unit: 'm' },
        { label: 'Total area of the L-shape', value: totalArea, unit: 'sq m' }
      ];
      p.hint = missingHorizontal
        ? `The bottom edge is ${W} m. The top horizontal part is ${w1} m. The missing horizontal part is the difference: ${W} − ${w1}. Then slice the shape into two rectangles to find the total area.`
        : `The left outer wall is ${H} m tall. The right wall is ${h2} m tall. The missing vertical step is ${H} − ${h2}. Then slice the shape into two rectangles to find the total area.`;
    }

    // --- 2. STAIRCASE (Staircase Perimeter Translation) ---
    else if (kind === 'staircase') {
      // Rotate between pure staircase and U-indent pocket
      const isUIndent = level !== 'easy' && (level === 'large' || Math.random() < 0.5);
      p.isUIndent = isUIndent;

      if (!isUIndent) {
        // Pure staircase
        let W, H, stepsCount;
        if (level === 'easy') {
          W = rand(6, 12);
          H = rand(5, 10);
          stepsCount = 3;
        } else if (level === 'medium') {
          W = rand(12, 20);
          H = rand(10, 16);
          stepsCount = 4;
        } else {
          W = rand(20, 36);
          H = rand(16, 28);
          stepsCount = 5;
        }
        const boundP = 2 * (W + H);
        const totalP = boundP; // staircase slides outward to bounding box!

        p.W = W;
        p.H = H;
        p.stepsCount = stepsCount;
        p.boundP = boundP;
        p.totalP = totalP;

        p.story = `A terrace garden has a staircase outline that fits inside a bounding box of <strong>${W} m wide by ${H} m high</strong>. Instead of measuring every single step, imagine sliding all horizontal steps up and vertical steps right! Find the perimeter of the bounding rectangle, and the total perimeter of the staircase terrace.`;
        p.answers = [
          { label: 'Bounding rectangle perimeter', value: boundP, unit: 'm' },
          { label: 'Total perimeter of the shape', value: totalP, unit: 'm' }
        ];
        p.hint = `All horizontal step edges slide up to make the top edge (${W} m). All vertical step edges slide right to make the outer height (${H} m). So the staircase has the exact same perimeter as a ${W} × ${H} rectangle: 2 × (${W} + ${H})!`;
      } else {
        // U-indent pocket (凹字形)
        let W, H, d, pocketW;
        if (level === 'medium') {
          W = rand(10, 18);
          H = rand(8, 14);
          d = rand(2, Math.floor(H / 2));
          pocketW = rand(3, W - 4);
        } else {
          // large
          W = rand(18, 32);
          H = rand(14, 24);
          d = rand(4, Math.floor(H * 0.65));
          pocketW = rand(4, W - 6);
        }
        const boundP = 2 * (W + H);
        const totalP = boundP + 2 * d; // sliding pocket bottom up leaves the 2 vertical side walls!

        p.W = W;
        p.H = H;
        p.d = d;
        p.pocketW = pocketW;
        p.boundP = boundP;
        p.totalP = totalP;

        p.story = `A swimming pool has a rectangular outer boundary of <strong>${W} m by ${H} m</strong>, but has a rectangular pocket <strong>${d} m deep</strong> cut into its top edge. Sliding the bottom of the pocket up completes the bounding rectangle, but the two vertical pocket walls still need to be walked along! Find the bounding perimeter and the total perimeter.`;
        p.answers = [
          { label: 'Bounding rectangle perimeter', value: boundP, unit: 'm' },
          { label: 'Total perimeter of the shape', value: totalP, unit: 'm' }
        ];
        p.hint = `The bounding rectangle has perimeter 2 × (${W} + ${H}) = ${boundP} m. Sliding the bottom of the pocket up finishes the top edge, but you must still count the two inner vertical pocket walls: + (2 × ${d} m).`;
      }
    }

    // --- 3. MAXMIN (Same Perimeter vs Same Area Explorer) ---
    else if (kind === 'maxMin') {
      const isFixedPerimeter = Math.random() < 0.5;
      p.isFixedPerimeter = isFixedPerimeter;

      if (isFixedPerimeter) {
        // Fixed Perimeter P = 2(L + W), with half-perimeter S = 2s even
        let s;
        if (level === 'easy') s = pick([4, 5, 6]);
        else if (level === 'medium') s = pick([7, 8, 9, 10]);
        else s = pick([11, 12, 14, 15]);

        const P = 4 * s;
        const S = 2 * s;
        const maxArea = s * s;
        // Compare with a skinny rectangle: 1 × (S - 1)
        const skinnyL = S - 1;
        const skinnyW = 1;
        const skinnyArea = skinnyL * skinnyW;

        p.s = s;
        p.P = P;
        p.S = S;
        p.maxArea = maxArea;
        p.skinnyL = skinnyL;
        p.skinnyW = skinnyW;
        p.skinnyArea = skinnyArea;

        p.story = `You have <strong>${P} meters of wire fence</strong> to build a whole-number rectangular rabbit run. Compare different rooms you can build with the same fence: a long skinny run (1 m × ${skinnyL} m) has an area of only ${skinnyArea} sq m. What is the side length of the square rabbit run, and what is the <strong>largest possible area</strong> you can enclose?`;
        p.answers = [
          { label: 'Side of the best square', value: s, unit: 'm' },
          { label: 'Largest possible area', value: maxArea, unit: 'sq m' }
        ];
        p.hint = `Half the fence is length + width: ${P} ÷ 2 = ${S} m. To get the biggest area, make the room as square as possible: ${S} ÷ 2 = ${s} m for each side. The square's area is ${s} × ${s}.`;
      } else {
        // Fixed Area A
        let A, factorPairs;
        if (level === 'easy') {
          A = pick([12, 16, 18, 20]);
        } else if (level === 'medium') {
          A = pick([24, 30, 36, 40]);
        } else {
          A = pick([48, 60, 64, 72, 100]);
        }

        // Find all integer factor pairs
        factorPairs = [];
        for (let w = 1; w * w <= A; w++) {
          if (A % w === 0) {
            const l = A / w;
            factorPairs.push({ l, w, p: 2 * (l + w) });
          }
        }
        // Skinny is (A × 1)
        const skinnyP = 2 * (A + 1);
        // Best is the last factor pair (closest to square)
        const bestPair = factorPairs[factorPairs.length - 1];
        const minP = bestPair.p;

        p.A = A;
        p.factorPairs = factorPairs;
        p.skinnyP = skinnyP;
        p.bestPair = bestPair;
        p.minP = minP;

        p.story = `You have <strong>${A} square stone tiles</strong> to build a rectangular courtyard. A long skinny patio of 1 × ${A} tiles needs <strong>${skinnyP} units of edging</strong>. Find the perimeter of the skinny patio (1 × ${A}), and find the <strong>smallest possible perimeter</strong> among all whole-number rectangular layouts for these ${A} tiles.`;
        p.answers = [
          { label: `Perimeter of the skinny rectangle (1 × ${A})`, value: skinnyP, unit: 'units' },
          { label: 'Smallest possible perimeter', value: minP, unit: 'units' }
        ];
        p.hint = `List factor pairs that multiply to ${A}. For each pair (Length × Width), calculate Perimeter = 2 × (Length + Width). The pair where Length and Width are closest together (most like a square) gives the smallest perimeter!`;
      }
    }

    // --- 4. WALLFENCE (Wall-Hugger Garden) ---
    else if (kind === 'wallFence') {
      let L, W, givenDimensions;
      if (level === 'easy') {
        L = rand(6, 12);
        W = rand(3, 6);
        givenDimensions = Math.random() < 0.6;
      } else if (level === 'medium') {
        L = rand(12, 22);
        W = rand(5, 11);
        givenDimensions = Math.random() < 0.5;
      } else {
        // large
        L = rand(20, 36);
        W = rand(8, 16);
        givenDimensions = false; // more reverse reasoning at large level
      }

      const totalFence = L + 2 * W;
      const area = L * W;

      p.L = L;
      p.W = W;
      p.totalFence = totalFence;
      p.area = area;
      p.givenDimensions = givenDimensions;

      if (givenDimensions) {
        p.story = `Farmer Lin wants to build a rectangular vegetable garden against a brick wall. The wall covers one long side of <strong>${L} m</strong>, so fence is only needed for the other <strong>3 sides</strong> (two short sides of <strong>${W} m</strong> each, and one long side facing the wall). How much fence is needed in total, and what is the area of the garden?`;
        p.answers = [
          { label: 'Total fence needed (3 sides)', value: totalFence, unit: 'm' },
          { label: 'Area of the garden', value: area, unit: 'sq m' }
        ];
        p.hint = `The brick wall takes care of 1 long side (${L} m) for free! You only need fence for: ${W} + ${L} + ${W} = ${totalFence} m. The area inside is still Length × Width: ${L} × ${W}.`;
      } else {
        p.story = `Farmer Lin has <strong>${totalFence} meters of fence</strong> to enclose a rectangular garden against a brick wall. The wall covers one long side (0 m fence needed). The two sides coming out from the wall are each <strong>${W} m long</strong>. What is the length of the long side facing the wall, and what is the area of the garden?`;
        p.answers = [
          { label: 'Long side along the wall', value: L, unit: 'm' },
          { label: 'Area of the garden', value: area, unit: 'sq m' }
        ];
        p.hint = `Out of the ${totalFence} m of fence, two short sides use ${W} + ${W} = ${2 * W} m. The rest is the long side: ${totalFence} − ${2 * W} = ${L} m. Then find Area = Length × Width.`;
      }
    }

    // --- 5. CUTPASTE (Cut & Paste Shapes) ---
    else if (kind === 'cutPaste') {
      const isCutSquare = Math.random() < 0.5;
      p.isCutSquare = isCutSquare;

      let L, W;
      if (level === 'easy') {
        W = rand(3, 6);
        L = W + rand(2, 5);
      } else if (level === 'medium') {
        W = rand(5, 10);
        L = W + rand(4, 9);
      } else {
        // large
        W = rand(8, 16);
        L = W + rand(6, 16);
      }

      p.L = L;
      p.W = W;

      if (isCutSquare) {
        // Cut the largest possible square from an L × W rectangle
        const squareSide = W;
        const squareArea = squareSide * squareSide;
        const leftoverLength = L - W;
        const leftoverWidth = W;
        // Perimeter of leftover is 2 * ((L - W) + W) = 2 * L!
        const leftoverPerimeter = 2 * L;

        p.squareSide = squareSide;
        p.squareArea = squareArea;
        p.leftoverLength = leftoverLength;
        p.leftoverWidth = leftoverWidth;
        p.leftoverPerimeter = leftoverPerimeter;

        p.story = `You have a rectangular piece of craft paper <strong>${L} cm long and ${W} cm wide</strong>. You cut out the <strong>largest possible square</strong> from one end. What is the area of the square you cut out, and what is the perimeter of the leftover paper strip?`;
        p.answers = [
          { label: 'Area of the square cut out', value: squareArea, unit: 'sq cm' },
          { label: 'Perimeter of the leftover rectangle', value: leftoverPerimeter, unit: 'cm' }
        ];
        p.hint = `The largest square that fits in the rectangle has side length equal to the rectangle's width: ${W} cm. Its area is ${W} × ${W}. The leftover strip has dimensions (${L} − ${W}) cm by ${W} cm. Notice how its perimeter is 2 × ((${L} − ${W}) + ${W}) = 2 × ${L}!`;
      } else {
        // Glue two identical rectangles along their long edge
        const totalArea = 2 * L * W;
        const newPerimeter = 2 * (L + 2 * W);
        const lostSeam = 2 * L;

        p.totalArea = totalArea;
        p.newPerimeter = newPerimeter;
        p.lostSeam = lostSeam;

        p.story = `You have two identical rectangles, each <strong>${L} cm long and ${W} cm wide</strong>. You glue them together along their <strong>long edges (${L} cm)</strong> to make one bigger rectangle. What is the total area of the new shape, and what is its new perimeter?`;
        p.answers = [
          { label: 'Total area of the joined shape', value: totalArea, unit: 'sq cm' },
          { label: 'New perimeter of the joined shape', value: newPerimeter, unit: 'cm' }
        ];
        p.hint = `The two rectangles have area ${L} × ${W} each, so joined together the area is 2 × (${L} × ${W}) = ${totalArea} sq cm. For the perimeter, the new shape has length ${L} cm and width ${2 * W} cm. Notice that the two glued edges (${L} + ${L} = ${lostSeam} cm) disappeared inside as a hidden seam!`;
      }
    }

    // --- 6. PAVING (Tile Paving & Border Paths) ---
    else if (kind === 'paving') {
      const isTilePaving = Math.random() < 0.5;
      p.isTilePaving = isTilePaving;

      if (isTilePaving) {
        // Paving with square tiles of side s
        let s, multL, multW;
        if (level === 'easy') {
          s = 2;
          multL = rand(3, 6);
          multW = rand(2, 4);
        } else if (level === 'medium') {
          s = pick([2, 3]);
          multL = rand(4, 8);
          multW = rand(3, 6);
        } else {
          // large
          s = pick([3, 4, 5]);
          multL = rand(5, 10);
          multW = rand(4, 8);
        }
        const L = multL * s;
        const W = multW * s;
        const tilesInRow = multL;
        const numRows = multW;
        const totalTiles = tilesInRow * numRows;

        p.s = s;
        p.L = L;
        p.W = W;
        p.tilesInRow = tilesInRow;
        p.numRows = numRows;
        p.totalTiles = totalTiles;

        p.story = `A community hall floor is <strong>${L} m long and ${W} m wide</strong>. The floor will be paved with square tiles that are <strong>${s} m on each side</strong>. How many tiles fit in one row along the length, and how many tiles are needed in total to cover the floor?`;
        p.answers = [
          { label: 'Tiles in one row along the length', value: tilesInRow, unit: 'tiles' },
          { label: 'Total tiles needed to pave the floor', value: totalTiles, unit: 'tiles' }
        ];
        p.hint = `Along the length: ${L} m ÷ ${s} m = ${tilesInRow} tiles in one row. Along the width: ${W} m ÷ ${s} m = ${numRows} rows. Total tiles = rows × columns: ${tilesInRow} × ${numRows}.`;
      } else {
        // Border path around pool
        let L, W, d;
        if (level === 'easy') {
          L = rand(5, 8);
          W = rand(4, 6);
          d = 1;
        } else if (level === 'medium') {
          L = rand(8, 14);
          W = rand(6, 10);
          d = pick([1, 2]);
        } else {
          // large
          L = rand(12, 22);
          W = rand(8, 16);
          d = pick([2, 3]);
        }

        const outerL = L + 2 * d;
        const outerW = W + 2 * d;
        const innerArea = L * W;
        const outerArea = outerL * outerW;
        const pathArea = outerArea - innerArea;

        p.L = L;
        p.W = W;
        p.d = d;
        p.outerL = outerL;
        p.outerW = outerW;
        p.innerArea = innerArea;
        p.outerArea = outerArea;
        p.pathArea = pathArea;

        p.story = `A rectangular swimming pool is <strong>${L} m long and ${W} m wide</strong>. A stone walkway <strong>${d} m wide</strong> is built all the way around the pool. What is the area of the outer rectangle (pool plus walkway), and what is the area of the walkway alone?`;
        p.answers = [
          { label: 'Outer rectangle area (pool + walkway)', value: outerArea, unit: 'sq m' },
          { label: 'Area of the walkway alone', value: pathArea, unit: 'sq m' }
        ];
        p.hint = `The walkway adds ${d} m on the left AND ${d} m on the right: outer length is ${L} + 2 × ${d} = ${outerL} m. It also adds ${d} m top and bottom: outer width is ${W} + 2 × ${d} = ${outerW} m. Outer Area = ${outerL} × ${outerW}. Then subtract the pool (${L} × ${W}) to find the walkway alone!`;
      }
    }

    return p;
  }

  // ---------- SVG Diagrams & Steps Builder ----------
  function svgWrap(content, viewBox = '0 0 360 220') {
    return `<svg class="area-svg" viewBox="${viewBox}" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#2e6c4a" />
        </marker>
        <marker id="arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#ba4722" />
        </marker>
        <pattern id="brick-pat" width="20" height="10" patternUnits="userSpaceOnUse">
          <rect width="20" height="10" fill="#c4644a"/>
          <line x1="0" y1="5" x2="20" y2="5" stroke="#f6ece3" stroke-width="1.2"/>
          <line x1="10" y1="0" x2="10" y2="5" stroke="#f6ece3" stroke-width="1.2"/>
          <line x1="0" y1="5" x2="0" y2="10" stroke="#f6ece3" stroke-width="1.2"/>
          <line x1="20" y1="5" x2="20" y2="10" stroke="#f6ece3" stroke-width="1.2"/>
        </pattern>
        <pattern id="tile-pat" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#fbe8d5" stroke="#caa27b" stroke-width="1"/>
        </pattern>
      </defs>
      ${content}
    </svg>`;
  }

  function stepsFor(p) {
    // --- 1. RECTILINEAR ---
    if (p.kind === 'rectilinear') {
      const { W, H, w1, w2, h1, h2, missingHorizontal, missingVal, areaA, areaB, totalArea } = p;
      // Dimensions mapping onto SVG coordinates
      const padX = 55, padY = 35;
      const svgW = 250, svgH = 150;
      const scaleX = svgW / W;
      const scaleY = svgH / H;

      const x0 = padX;
      const y0 = padY;
      const x1 = x0 + w1 * scaleX;
      const x2 = x0 + W * scaleX;
      const y1 = y0 + h1 * scaleY;
      const y2 = y0 + H * scaleY;

      // Base polygon path: top-left (x0, y0) -> (x1, y0) -> (x1, y1) -> (x2, y1) -> (x2, y2) -> (x0, y2) -> close
      const polyPath = `M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2} L ${x0} ${y2} Z`;

      const drawBase = (fill = '#e2ebd8', stroke = '#315b48') =>
        `<path d="${polyPath}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round" />`;

      const drawLabels = (stepNum) => {
        const missIsFound = stepNum >= 1;
        const textH = missingHorizontal
          ? (missIsFound ? `<text x="${(x1 + x2) / 2}" y="${y1 - 10}" class="dim-found">${w2} m</text>` : `<text x="${(x1 + x2) / 2}" y="${y1 - 10}" class="dim-missing">? m</text>`)
          : `<text x="${(x1 + x2) / 2}" y="${y1 - 10}" class="dim-text">${w2} m</text>`;

        const textV = !missingHorizontal
          ? (missIsFound ? `<text x="${x1 + 12}" y="${(y0 + y1) / 2}" class="dim-found">${h1} m</text>` : `<text x="${x1 + 12}" y="${(y0 + y1) / 2}" class="dim-missing">? m</text>`)
          : `<text x="${x1 + 12}" y="${(y0 + y1) / 2}" class="dim-text">${h1} m</text>`;

        return `
          <!-- Top edge -->
          <text x="${(x0 + x1) / 2}" y="${y0 - 10}" class="dim-text">${w1} m</text>
          <!-- Bottom edge -->
          <text x="${(x0 + x2) / 2}" y="${y2 + 18}" class="dim-text">${W} m</text>
          <!-- Left edge -->
          <text x="${x0 - 18}" y="${(y0 + y2) / 2}" class="dim-text">${H} m</text>
          <!-- Right step edge -->
          <text x="${x2 + 18}" y="${(y1 + y2) / 2}" class="dim-text">${h2} m</text>
          <!-- Inner step edges -->
          ${textH}
          ${textV}
        `;
      };

      // Step 0: Initial shape & unknown side
      const svg0 = svgWrap(`
        ${drawBase()}
        ${drawLabels(0)}
      `);

      // Step 1: Reveal the missing side with parallel guides
      const guides = missingHorizontal
        ? `<line x1="${x0}" y1="${y2 + 6}" x2="${x2}" y2="${y2 + 6}" stroke="#276e4b" stroke-width="2"/>
           <line x1="${x0}" y1="${y0 - 4}" x2="${x1}" y2="${y0 - 4}" stroke="#276e4b" stroke-width="2"/>
           <line x1="${x1}" y1="${y1 - 3}" x2="${x2}" y2="${y1 - 3}" stroke="#ba4722" stroke-width="2"/>`
        : `<line x1="${x0 - 6}" y1="${y0}" x2="${x0 - 6}" y2="${y2}" stroke="#276e4b" stroke-width="2"/>
           <line x1="${x2 + 6}" y1="${y1}" x2="${x2 + 6}" y2="${y2}" stroke="#276e4b" stroke-width="2"/>
           <line x1="${x1 + 4}" y1="${y0}" x2="${x1 + 4}" y2="${y1}" stroke="#ba4722" stroke-width="2"/>`;

      const svg1 = svgWrap(`
        ${drawBase()}
        ${guides}
        ${drawLabels(1)}
      `);

      // Step 2: Slice into Rectangle A + Rectangle B
      const svg2 = svgWrap(`
        <!-- Rectangle A -->
        <rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y2 - y0}" fill="#dbe8d1" stroke="#315b48" stroke-width="2"/>
        <!-- Rectangle B -->
        <rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="#fae5cd" stroke="#c97e3f" stroke-width="2"/>
        <!-- Slice dashed line -->
        <line x1="${x1}" y1="${y0}" x2="${x1}" y2="${y2}" class="slice-line"/>
        ${drawLabels(2)}
        <text x="${(x0 + x1) / 2}" y="${(y0 + y2) / 2}" class="part-label">Part A</text>
        <text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2}" class="part-label">Part B</text>
      `);

      // Step 3: Area sum
      const svg3 = svgWrap(`
        <rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y2 - y0}" fill="#dbe8d1" stroke="#315b48" stroke-width="2"/>
        <rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="#fae5cd" stroke="#c97e3f" stroke-width="2"/>
        <line x1="${x1}" y1="${y0}" x2="${x1}" y2="${y2}" class="slice-line"/>
        ${drawLabels(3)}
        <text x="${(x0 + x1) / 2}" y="${(y0 + y2) / 2 - 8}" class="part-label">Area A</text>
        <text x="${(x0 + x1) / 2}" y="${(y0 + y2) / 2 + 10}" class="part-label" style="font-size:11px">${w1} × ${H} = ${areaA}</text>
        <text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 8}" class="part-label">Area B</text>
        <text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 + 10}" class="part-label" style="font-size:11px">${w2} × ${h2} = ${areaB}</text>
      `);

      return [
        {
          title: 'See the shape & sides',
          description: `The patio has outer width ${W} m and outer height ${H} m. Look at the parallel lines to find the missing ${missingHorizontal ? 'width' : 'height'}.`,
          diagram: svg0,
          equation: 'Parallel sides must add up to the total width & height.'
        },
        {
          title: `Find the missing side (?)`,
          description: missingHorizontal
            ? `Total bottom width is ${W} m. Top width is ${w1} m. The missing inner width is ${W} − ${w1} = ${w2} m.`
            : `Total left height is ${H} m. Right wall is ${h2} m. The missing vertical step is ${H} − ${h2} = ${h1} m.`,
          diagram: svg1,
          equation: missingHorizontal ? `${W} − ${w1} = ${w2} m` : `${H} − ${h2} = ${h1} m`
        },
        {
          title: 'Slice into two rectangles',
          description: `Slice down along the inner corner. Now you have Rectangle A (${w1} m × ${H} m) and Rectangle B (${w2} m × ${h2} m).`,
          diagram: svg2,
          equation: `Total Area = Area of Part A + Area of Part B`
        },
        {
          title: 'Add the areas together',
          description: `Area A = ${w1} × ${H} = ${areaA} sq m. Area B = ${w2} × ${h2} = ${areaB} sq m. Total patio area = ${areaA} + ${areaB} = ${totalArea} sq m.`,
          diagram: svg3,
          equation: `${areaA} + ${areaB} = ${totalArea} sq m ✓`
        }
      ];
    }

    // --- 2. STAIRCASE ---
    else if (p.kind === 'staircase') {
      const { W, H, isUIndent, boundP, totalP } = p;
      const padX = 60, padY = 35;
      const boxW = 240, boxH = 150;

      if (!isUIndent) {
        // Pure staircase
        const stepsCount = p.stepsCount || 3;
        const dx = boxW / stepsCount;
        const dy = boxH / stepsCount;

        // Path of staircase: (padX, padY + boxH) -> (padX, padY) -> (padX + dx, padY) -> (padX + dx, padY + dy) -> ... -> (padX + boxW, padY + boxH) -> close
        let stairPath = `M ${padX} ${padY + boxH} L ${padX} ${padY}`;
        for (let i = 0; i < stepsCount; i++) {
          const curX = padX + (i + 1) * dx;
          const curY = padY + i * dy;
          const nextY = padY + (i + 1) * dy;
          stairPath += ` L ${curX} ${curY} L ${curX} ${nextY}`;
        }
        stairPath += ` L ${padX} ${padY + boxH} Z`;

        // SVG 0: Shape & bounding box
        const svg0 = svgWrap(`
          <!-- Bounding box -->
          <rect x="${padX}" y="${padY}" width="${boxW}" height="${boxH}" fill="none" stroke="#90a89a" stroke-width="1.8" stroke-dasharray="5 4"/>
          <!-- Staircase shape -->
          <path d="${stairPath}" fill="#e3ebd9" stroke="#315b48" stroke-width="2.5" stroke-linejoin="round"/>
          <text x="${padX + boxW / 2}" y="${padY - 10}" class="dim-text">Width = ${W} m</text>
          <text x="${padX - 24}" y="${padY + boxH / 2}" class="dim-text">Height = ${H} m</text>
        `);

        // SVG 1: Sliding edges outward
        let arrows = '';
        for (let i = 1; i < stepsCount; i++) {
          // Horizontal step sliding up to top
          const stepMidX = padX + (i - 0.5) * dx;
          const stepY = padY + (i - 1) * dy;
          arrows += `<line x1="${stepMidX}" y1="${stepY}" x2="${stepMidX}" y2="${padY}" class="slide-arrow"/>`;
          // Vertical step sliding right to outer edge
          const stepX = padX + i * dx;
          const stepMidY = padY + (i - 0.5) * dy;
          arrows += `<line x1="${stepX}" y1="${stepMidY}" x2="${padX + boxW}" y2="${stepMidY}" class="slide-arrow"/>`;
        }

        const svg1 = svgWrap(`
          <rect x="${padX}" y="${padY}" width="${boxW}" height="${boxH}" fill="none" stroke="#2e6c4a" stroke-width="2" stroke-dasharray="5 4"/>
          <path d="${stairPath}" fill="#e3ebd9" stroke="#315b48" stroke-width="2"/>
          ${arrows}
          <text x="${padX + boxW / 2}" y="${padY - 10}" class="dim-text">Width = ${W} m</text>
          <text x="${padX - 24}" y="${padY + boxH / 2}" class="dim-text">Height = ${H} m</text>
        `);

        // SVG 2 & 3: Completed bounding rectangle
        const svg2 = svgWrap(`
          <rect x="${padX}" y="${padY}" width="${boxW}" height="${boxH}" fill="#eaf3e3" stroke="#2e6c4a" stroke-width="3"/>
          <path d="${stairPath}" fill="none" stroke="#9bb1a1" stroke-width="1.5" stroke-dasharray="4 3"/>
          <text x="${padX + boxW / 2}" y="${padY - 10}" class="dim-text">Top = ${W} m</text>
          <text x="${padX + boxW / 2}" y="${padY + boxH + 18}" class="dim-text">Bottom = ${W} m</text>
          <text x="${padX - 24}" y="${padY + boxH / 2}" class="dim-text">${H} m</text>
          <text x="${padX + boxW + 24}" y="${padY + boxH / 2}" class="dim-text">${H} m</text>
        `);

        return [
          {
            title: 'See the staircase shape',
            description: `The shape fits snugly inside a bounding rectangle of width ${W} m and height ${H} m.`,
            diagram: svg0,
            equation: `Bounding box: ${W} m wide × ${H} m high`
          },
          {
            title: 'Slide the edges outward (平移法)',
            description: `Push all the horizontal stair treads UP to the top edge, and push all vertical stair risers RIGHT to the outer edge!`,
            diagram: svg1,
            equation: `All treads make ${W} m · All risers make ${H} m`
          },
          {
            title: 'Perimeter of the bounding rectangle',
            description: `A rectangle has 2 lengths and 2 heights: 2 × (${W} + ${H}) = ${boundP} m.`,
            diagram: svg2,
            equation: `2 × (${W} + ${H}) = ${boundP} m`
          },
          {
            title: 'Total staircase perimeter',
            description: `Because every step translated cleanly to the outer edge without overlapping or missing, the total perimeter is exactly ${totalP} m!`,
            diagram: svg2,
            equation: `Total perimeter = ${totalP} m ✓`
          }
        ];
      } else {
        // U-indent pocket
        const { d, pocketW } = p;
        const scaleX = boxW / W;
        const scaleY = boxH / H;

        const leftW = (W - pocketW) / 2;
        const x0 = padX;
        const x1 = padX + leftW * scaleX;
        const x2 = x1 + pocketW * scaleX;
        const x3 = padX + boxW;
        const yTop = padY;
        const yPocket = padY + d * scaleY;
        const yBottom = padY + boxH;

        const uPath = `M ${x0} ${yBottom} L ${x0} ${yTop} L ${x1} ${yTop} L ${x1} ${yPocket} L ${x2} ${yPocket} L ${x2} ${yTop} L ${x3} ${yTop} L ${x3} ${yBottom} Z`;

        const svg0 = svgWrap(`
          <rect x="${padX}" y="${padY}" width="${boxW}" height="${boxH}" fill="none" stroke="#90a89a" stroke-width="1.8" stroke-dasharray="5 4"/>
          <path d="${uPath}" fill="#e3ebd9" stroke="#315b48" stroke-width="2.5" stroke-linejoin="round"/>
          <text x="${padX + boxW / 2}" y="${padY - 10}" class="dim-text">Width = ${W} m</text>
          <text x="${padX - 24}" y="${padY + boxH / 2}" class="dim-text">Height = ${H} m</text>
          <text x="${(x1 + x2) / 2}" y="${yPocket + 14}" class="dim-text">pocket</text>
        `);

        const svg1 = svgWrap(`
          <rect x="${padX}" y="${padY}" width="${boxW}" height="${boxH}" fill="none" stroke="#2e6c4a" stroke-width="1.8" stroke-dasharray="5 4"/>
          <path d="${uPath}" fill="#e3ebd9" stroke="#315b48" stroke-width="2"/>
          <!-- Sliding bottom of pocket up -->
          <line x1="${(x1 + x2) / 2}" y1="${yPocket}" x2="${(x1 + x2) / 2}" y2="${yTop}" class="slide-arrow"/>
          <!-- Highlight inner vertical walls that do NOT push out -->
          <line x1="${x1}" y1="${yTop}" x2="${x1}" y2="${yPocket}" stroke="#ba4722" stroke-width="3.5"/>
          <line x1="${x2}" y1="${yTop}" x2="${x2}" y2="${yPocket}" stroke="#ba4722" stroke-width="3.5"/>
          <text x="${x1 - 14}" y="${(yTop + yPocket) / 2}" class="dim-missing">+${d}</text>
          <text x="${x2 + 14}" y="${(yTop + yPocket) / 2}" class="dim-missing">+${d}</text>
        `);

        const svg2 = svgWrap(`
          <rect x="${padX}" y="${padY}" width="${boxW}" height="${boxH}" fill="#eaf3e3" stroke="#2e6c4a" stroke-width="2.5"/>
          <line x1="${x1}" y1="${yTop}" x2="${x1}" y2="${yPocket}" stroke="#ba4722" stroke-width="3.5"/>
          <line x1="${x2}" y1="${yTop}" x2="${x2}" y2="${yPocket}" stroke="#ba4722" stroke-width="3.5"/>
          <text x="${padX + boxW / 2}" y="${padY + boxH / 2}" class="part-label" style="font-size:14px">Outer box: ${boundP} m</text>
          <text x="${(x1 + x2) / 2}" y="${yPocket + 16}" class="dim-missing">+ 2 × ${d} m walls</text>
        `);

        return [
          {
            title: 'See the U-indent shape (凹字形)',
            description: `A rectangular pool ${W} m × ${H} m has a pocket ${d} m deep cut into the top edge.`,
            diagram: svg0,
            equation: `Outer bounds: ${W} m × ${H} m · Pocket depth = ${d} m`
          },
          {
            title: 'Slide the pocket floor up',
            description: `Sliding the bottom of the pocket up completes the top outer line. But look closely: the TWO vertical pocket walls (${d} m each) are extra inner edges!`,
            diagram: svg1,
            equation: `Bottom slides up, but 2 walls of ${d} m remain inside!`
          },
          {
            title: 'Bounding rectangle perimeter',
            description: `The complete outer rectangle perimeter is 2 × (${W} + ${H}) = ${boundP} m.`,
            diagram: svg2,
            equation: `Bounding perimeter = 2 × (${W} + ${H}) = ${boundP} m`
          },
          {
            title: 'Total perimeter: Add the 2 pocket walls',
            description: `Total perimeter = Bounding Box (${boundP} m) + 2 × depth (${2 * d} m) = ${totalP} m. Don’t fall into the U-shape trap!`,
            diagram: svg2,
            equation: `${boundP} + (2 × ${d}) = ${totalP} m ✓`
          }
        ];
      }
    }

    // --- 3. MAXMIN ---
    else if (p.kind === 'maxMin') {
      const { isFixedPerimeter } = p;
      if (isFixedPerimeter) {
        const { s, P, S, maxArea, skinnyL, skinnyW, skinnyArea } = p;
        // Visual comparison: skinny rectangle vs square
        const midL = Math.round(s * 1.4);
        const midW = S - midL;
        const midArea = midL * midW;

        const tableHtml = `
          <div class="compare-container">
            <table class="compare-table" aria-label="Rectangle comparison">
              <thead>
                <tr><th>Shape</th><th>Length × Width</th><th>Fence (Perimeter)</th><th>Area</th></tr>
              </thead>
              <tbody>
                <tr><td>Skinny Run</td><td>${skinnyL} m × ${skinnyW} m</td><td>${P} m</td><td>${skinnyArea} sq m</td></tr>
                <tr><td>Middle Run</td><td>${midL} m × ${midW} m</td><td>${P} m</td><td>${midArea} sq m</td></tr>
                <tr class="winner"><td>Square Run</td><td>${s} m × ${s} m</td><td>${P} m</td><td><strong>${maxArea} sq m</strong></td></tr>
              </tbody>
            </table>
          </div>
        `;

        const svgDuo = svgWrap(`
          <!-- Skinny rectangle -->
          <rect x="25" y="80" width="130" height="20" fill="#fae4cd" stroke="#c97e3f" stroke-width="2"/>
          <text x="90" y="70" class="dim-text">Skinny: ${skinnyL} × ${skinnyW}</text>
          <text x="90" y="94" class="part-label" style="font-size:11px">Area: ${skinnyArea}</text>
          <!-- Square -->
          <rect x="200" y="30" width="120" height="120" fill="#dcefd6" stroke="#2e6c4a" stroke-width="2.5"/>
          <text x="260" y="20" class="dim-text">Square: ${s} × ${s}</text>
          <text x="260" y="95" class="part-label" style="font-size:15px;font-weight:800">Area: ${maxArea}</text>
        `, '0 0 360 170');

        return [
          {
            title: 'The fence budget',
            description: `You have ${P} meters of fence. Half of the fence covers Length + Width: ${P} ÷ 2 = ${S} meters.`,
            diagram: svgDuo,
            equation: `Length + Width = ${S} meters`
          },
          {
            title: 'Compare different rooms',
            description: `A 1 m × ${skinnyL} m rectangle uses all ${P} m of fence, but has an area of only ${skinnyArea} sq m. Pulling the sides closer together makes the room swell!`,
            diagram: svgDuo,
            equation: `1 × ${skinnyL} = ${skinnyArea} sq m`
          },
          {
            title: 'Compare the candidates in a table',
            description: `Notice how the area grows as Length and Width get closer together. When they are equal, the area is largest!`,
            diagram: tableHtml,
            equation: `Closer dimensions = bigger area`
          },
          {
            title: 'The square wins! (Largest Area)',
            description: `The best square has sides of ${S} ÷ 2 = ${s} m. Its area is ${s} × ${s} = ${maxArea} sq m!`,
            diagram: tableHtml,
            equation: `Side = ${s} m · Max Area = ${maxArea} sq m ✓`
          }
        ];
      } else {
        // Fixed Area
        const { A, factorPairs, skinnyP, bestPair, minP } = p;
        const rows = factorPairs.map(fp => `
          <tr class="${fp.p === minP ? 'winner' : ''}">
            <td>${fp.l} × ${fp.w}</td>
            <td>${A} tiles</td>
            <td>2 × (${fp.l} + ${fp.w}) = <strong>${fp.p}</strong> units</td>
          </tr>
        `).join('');

        const tableHtml = `
          <div class="compare-container">
            <table class="compare-table" aria-label="Tile perimeter comparison">
              <thead><tr><th>Dimensions</th><th>Area</th><th>Perimeter (Edging needed)</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `;

        const svgDuo = svgWrap(`
          <!-- Skinny -->
          <rect x="25" y="80" width="130" height="20" fill="#fae4cd" stroke="#c97e3f" stroke-width="2"/>
          <text x="90" y="70" class="dim-text">1 × ${A} tiles</text>
          <text x="90" y="94" class="part-label" style="font-size:11px">P = ${skinnyP}</text>
          <!-- Best -->
          <rect x="210" y="45" width="105" height="90" fill="#dcefd6" stroke="#2e6c4a" stroke-width="2.5"/>
          <text x="262" y="35" class="dim-text">${bestPair.l} × ${bestPair.w} tiles</text>
          <text x="262" y="95" class="part-label" style="font-size:14px;font-weight:800">P = ${minP}</text>
        `, '0 0 360 170');

        return [
          {
            title: 'Arrange the tiles',
            description: `You have ${A} square tiles. Different factor pairs (Length × Width) make different rectangular patios with the exact same area.`,
            diagram: svgDuo,
            equation: `Total Area = ${A} square tiles`
          },
          {
            title: 'Skinny patio takes the most edging',
            description: `A 1 × ${A} strip needs 2 × (1 + ${A}) = ${skinnyP} units of border edging. Long skinny shapes have huge perimeters!`,
            diagram: svgDuo,
            equation: `Skinny Perimeter = 2 × (1 + ${A}) = ${skinnyP} units`
          },
          {
            title: 'Compare factor pairs',
            description: `List all integer factor pairs that multiply to ${A}. Compute the perimeter for each pair: 2 × (Length + Width).`,
            diagram: tableHtml,
            equation: `Check each factor pair of ${A}`
          },
          {
            title: 'Smallest perimeter wins',
            description: `The layout closest to a square is ${bestPair.l} × ${bestPair.w}, requiring only ${minP} units of edging!`,
            diagram: tableHtml,
            equation: `Min Perimeter = 2 × (${bestPair.l} + ${bestPair.w}) = ${minP} units ✓`
          }
        ];
      }
    }

    // --- 4. WALLFENCE ---
    else if (p.kind === 'wallFence') {
      const { L, W, totalFence, area, givenDimensions } = p;
      const padX = 55, padY = 40;
      const boxW = 250, boxH = 140;

      const drawGarden = (showMath = false) => svgWrap(`
        <!-- Brick Wall at top -->
        <rect x="${padX - 20}" y="${padY - 22}" width="${boxW + 40}" height="22" fill="url(#brick-pat)" stroke="#873622" stroke-width="2"/>
        <text x="${padX + boxW / 2}" y="${padY - 30}" class="part-label" style="fill:#873622;font-size:11px">BRICK WALL (0 m fence needed)</text>
        <!-- Garden interior -->
        <rect x="${padX}" y="${padY}" width="${boxW}" height="${boxH}" fill="#e8f2e2" stroke="none"/>
        <!-- 3-side fence lines -->
        <!-- Left fence -->
        <line x1="${padX}" y1="${padY}" x2="${padX}" y2="${padY + boxH}" class="fence-wire"/>
        <!-- Bottom fence -->
        <line x1="${padX}" y1="${padY + boxH}" x2="${padX + boxW}" y2="${padY + boxH}" class="fence-wire"/>
        <!-- Right fence -->
        <line x1="${padX + boxW}" y1="${padY}" x2="${padX + boxW}" y2="${padY + boxH}" class="fence-wire"/>
        <!-- Fence posts -->
        <circle cx="${padX}" cy="${padY}" r="4" class="fence-post"/>
        <circle cx="${padX}" cy="${padY + boxH}" r="4" class="fence-post"/>
        <circle cx="${padX + boxW}" cy="${padY + boxH}" r="4" class="fence-post"/>
        <circle cx="${padX + boxW}" cy="${padY}" r="4" class="fence-post"/>
        <!-- Labels -->
        <text x="${padX - 22}" y="${padY + boxH / 2}" class="dim-text">${W} m</text>
        <text x="${padX + boxW + 22}" y="${padY + boxH / 2}" class="dim-text">${W} m</text>
        <text x="${padX + boxW / 2}" y="${padY + boxH + 18}" class="dim-text">${L} m</text>
        <text x="${padX + boxW / 2}" y="${padY + boxH / 2}" class="part-label" style="font-size:${showMath ? '13px' : '14px'}">
          ${showMath ? `${L} × ${W} = ${area} sq m` : 'Garden'}
        </text>
      `);

      return [
        {
          title: 'The garden against the wall',
          description: `The brick wall serves as one long side (${L} m) for free! You only need fence for the other 3 sides.`,
          diagram: drawGarden(false),
          equation: `1 wall side (free!) + 3 fenced sides`
        },
        {
          title: 'Count only the 3 fenced sides',
          description: `The 3 fenced sides are: Left (${W} m) + Bottom (${L} m) + Right (${W} m).`,
          diagram: drawGarden(false),
          equation: `${W} + ${L} + ${W} = ${totalFence} m`
        },
        {
          title: givenDimensions ? 'Total fence needed' : 'Find the missing long side',
          description: givenDimensions
            ? `Total fence = ${L} + 2 × ${W} = ${totalFence} meters.`
            : `Subtract the two short sides from the total fence: ${totalFence} − (2 × ${W}) = ${L} meters.`,
          diagram: drawGarden(false),
          equation: givenDimensions ? `${L} + 2 × ${W} = ${totalFence} m` : `${totalFence} − ${2 * W} = ${L} m`
        },
        {
          title: 'Calculate the garden area',
          description: `Even though one side is a brick wall, the garden is still a rectangle! Area = Length × Width = ${L} × ${W} = ${area} sq m.`,
          diagram: drawGarden(true),
          equation: `Area = ${L} × ${W} = ${area} sq m ✓`
        }
      ];
    }

    // --- 5. CUTPASTE ---
    else if (p.kind === 'cutPaste') {
      const { L, W, isCutSquare } = p;
      const padX = 40, padY = 40;
      const totalW = 280;
      const totalH = Math.min(130, Math.round((W / L) * totalW));

      if (isCutSquare) {
        const { squareSide, squareArea, leftoverLength, leftoverWidth, leftoverPerimeter } = p;
        const squareW = Math.round((W / L) * totalW);
        const leftoverW = totalW - squareW;

        const svg0 = svgWrap(`
          <rect x="${padX}" y="${padY}" width="${totalW}" height="${totalH}" fill="#fbe8d5" stroke="#315b48" stroke-width="2.5"/>
          <text x="${padX + totalW / 2}" y="${padY - 12}" class="dim-text">Length = ${L} cm</text>
          <text x="${padX - 22}" y="${padY + totalH / 2}" class="dim-text">${W} cm</text>
        `);

        const svg1 = svgWrap(`
          <!-- Square part -->
          <rect x="${padX}" y="${padY}" width="${squareW}" height="${totalH}" fill="#e8f3de" stroke="#315b48" stroke-width="2"/>
          <!-- Leftover part -->
          <rect x="${padX + squareW}" y="${padY}" width="${leftoverW}" height="${totalH}" fill="#fae2cd" stroke="#c97e3f" stroke-width="2"/>
          <!-- Scissors cut line -->
          <line x1="${padX + squareW}" y1="${padY}" x2="${padX + squareW}" y2="${padY + totalH}" class="slice-line"/>
          <text x="${padX + squareW}" y="${padY - 8}" class="part-label" style="font-size:16px">✂️</text>
          <text x="${padX + squareW / 2}" y="${padY + totalH / 2}" class="part-label">Square (${W} × ${W})</text>
          <text x="${padX + squareW + leftoverW / 2}" y="${padY + totalH / 2}" class="part-label" style="font-size:11px">Leftover (${leftoverLength} × ${W})</text>
        `);

        return [
          {
            title: 'The starting paper rectangle',
            description: `You have a rectangle of length ${L} cm and width ${W} cm. To cut the largest possible square, its side must equal the narrower width (${W} cm).`,
            diagram: svg0,
            equation: `Largest square side = width = ${W} cm`
          },
          {
            title: 'Slice the square (✂️)',
            description: `Cut along the dashed line at distance ${W} cm. The square piece has dimensions ${W} cm × ${W} cm.`,
            diagram: svg1,
            equation: `Square Area = ${W} × ${W} = ${squareArea} sq cm`
          },
          {
            title: 'Examine the leftover strip',
            description: `The leftover strip has length ${L} − ${W} = ${leftoverLength} cm, and width ${W} cm.`,
            diagram: svg1,
            equation: `Leftover dimensions: ${leftoverLength} cm by ${W} cm`
          },
          {
            title: 'Perimeter of the leftover rectangle',
            description: `Perimeter = 2 × ((${L} − ${W}) + ${W}) = 2 × ${L} = ${leftoverPerimeter} cm. Notice how the width and cut cancel out, leaving exactly 2 × original length!`,
            diagram: svg1,
            equation: `Perimeter = 2 × ${L} = ${leftoverPerimeter} cm ✓`
          }
        ];
      } else {
        // Glue two rectangles
        const { totalArea, newPerimeter, lostSeam } = p;
        const singleW = 130;
        const singleH = 130;

        const svg0 = svgWrap(`
          <!-- Two separate rectangles -->
          <rect x="35" y="45" width="${singleW}" height="${singleH / 2}" fill="#dcefd6" stroke="#2e6c4a" stroke-width="2"/>
          <rect x="195" y="45" width="${singleW}" height="${singleH / 2}" fill="#dcefd6" stroke="#2e6c4a" stroke-width="2"/>
          <text x="100" y="32" class="dim-text">Rectangle 1: ${L} × ${W}</text>
          <text x="260" y="32" class="dim-text">Rectangle 2: ${L} × ${W}</text>
        `, '0 0 360 160');

        const svg1 = svgWrap(`
          <!-- Glued rectangle (stacked along long edge) -->
          <rect x="70" y="30" width="220" height="110" fill="#dcefd6" stroke="#2e6c4a" stroke-width="2.5"/>
          <line x1="70" y1="85" x2="290" y2="85" class="seam-line"/>
          <text x="180" y="20" class="dim-text">Length = ${L} cm</text>
          <text x="45" y="57" class="dim-text">${W} cm</text>
          <text x="45" y="112" class="dim-text">${W} cm</text>
          <text x="180" y="80" class="part-label" style="fill:#32549a;font-size:11px">Hidden seam (${L} cm glued)</text>
          <text x="180" y="120" class="part-label">Total Width = 2 × ${W} = ${2 * W} cm</text>
        `, '0 0 360 165');

        return [
          {
            title: 'Two matching rectangles',
            description: `You have two identical rectangles, each ${L} cm long and ${W} cm wide.`,
            diagram: svg0,
            equation: `Each rectangle Area = ${L} × ${W} = ${L * W} sq cm`
          },
          {
            title: 'Glue along the long edges',
            description: `Joining them along their ${L} cm edges creates a new rectangle of dimensions ${L} cm by ${2 * W} cm.`,
            diagram: svg1,
            equation: `New shape: ${L} cm × ${2 * W} cm`
          },
          {
            title: 'Total area doubles',
            description: `Area is simply the two rectangles combined: 2 × (${L} × ${W}) = ${totalArea} sq cm.`,
            diagram: svg1,
            equation: `Total Area = ${totalArea} sq cm`
          },
          {
            title: 'New perimeter (Hidden seam loss)',
            description: `The new perimeter is 2 × (${L} + ${2 * W}) = ${newPerimeter} cm. Notice that 2 × ${L} = ${lostSeam} cm of outer edge disappeared inside as a hidden seam!`,
            diagram: svg1,
            equation: `Perimeter = 2 × (${L} + ${2 * W}) = ${newPerimeter} cm ✓`
          }
        ];
      }
    }

    // --- 6. PAVING ---
    else if (p.kind === 'paving') {
      const { isTilePaving } = p;
      if (isTilePaving) {
        const { s, L, W, tilesInRow, numRows, totalTiles } = p;
        const padX = 50, padY = 35;
        const boxW = 260, boxH = 140;
        const cellW = boxW / tilesInRow;
        const cellH = boxH / numRows;

        // Draw tile grid with first row highlighted
        let gridLines = '';
        for (let i = 1; i < tilesInRow; i++) {
          gridLines += `<line x1="${padX + i * cellW}" y1="${padY}" x2="${padX + i * cellW}" y2="${padY + boxH}" class="tile-item"/>`;
        }
        for (let j = 1; j < numRows; j++) {
          gridLines += `<line x1="${padX}" y1="${padY + j * cellH}" x2="${padX + boxW}" y2="${padY + j * cellH}" class="tile-item"/>`;
        }

        const svg0 = svgWrap(`
          <rect x="${padX}" y="${padY}" width="${boxW}" height="${boxH}" fill="#fbe8d5" stroke="#315b48" stroke-width="2.5"/>
          <text x="${padX + boxW / 2}" y="${padY - 12}" class="dim-text">Floor Length = ${L} m</text>
          <text x="${padX - 25}" y="${padY + boxH / 2}" class="dim-text">${W} m</text>
          <rect x="20" y="185" width="20" height="20" fill="#fad1ab" stroke="#c97e3f" stroke-width="1.5"/>
          <text x="120" y="198" class="dim-text">1 tile = ${s} m × ${s} m</text>
        `, '0 0 360 215');

        const svg1 = svgWrap(`
          <rect x="${padX}" y="${padY}" width="${boxW}" height="${boxH}" fill="#fbe8d5" stroke="#315b48" stroke-width="2"/>
          <!-- Highlight first row -->
          <rect x="${padX}" y="${padY}" width="${boxW}" height="${cellH}" fill="#fad1ab" stroke="#c97e3f" stroke-width="2"/>
          ${gridLines}
          <text x="${padX + boxW / 2}" y="${padY - 12}" class="dim-text">1 row: ${L} ÷ ${s} = ${tilesInRow} tiles</text>
          <text x="${padX + boxW + 24}" y="${padY + boxH / 2}" class="dim-text">${numRows} rows</text>
        `, '0 0 360 195');

        return [
          {
            title: 'Floor dimensions & tile size',
            description: `The floor is ${L} m long and ${W} m wide. Each tile is a square measuring ${s} m on each side.`,
            diagram: svg0,
            equation: `Floor: ${L} m × ${W} m · Tile: ${s} m × ${s} m`
          },
          {
            title: 'Tiles in one row along the length',
            description: `Divide the length by the tile side: ${L} ÷ ${s} = ${tilesInRow} tiles fit along one row.`,
            diagram: svg1,
            equation: `${L} ÷ ${s} = ${tilesInRow} tiles in each row`
          },
          {
            title: 'Number of rows along the width',
            description: `Divide the width by the tile side: ${W} ÷ ${s} = ${numRows} rows of tiles fit along the width.`,
            diagram: svg1,
            equation: `${W} ÷ ${s} = ${numRows} rows of tiles`
          },
          {
            title: 'Total tiles needed',
            description: `Multiply rows by columns: ${tilesInRow} tiles per row × ${numRows} rows = ${totalTiles} tiles altogether!`,
            diagram: svg1,
            equation: `${tilesInRow} × ${numRows} = ${totalTiles} tiles ✓`
          }
        ];
      } else {
        // Border path around pool
        const { L, W, d, outerL, outerW, innerArea, outerArea, pathArea } = p;
        const padX = 40, padY = 30;
        const outW = 280, outH = 150;
        const borderX = Math.max(18, Math.round((d / outerL) * outW));
        const borderY = Math.max(16, Math.round((d / outerW) * outH));

        const svg0 = svgWrap(`
          <!-- Outer border walkway -->
          <rect x="${padX}" y="${padY}" width="${outW}" height="${outH}" fill="#e8ded0" stroke="#baa684" stroke-width="2.5"/>
          <!-- Inner pool -->
          <rect x="${padX + borderX}" y="${padY + borderY}" width="${outW - 2 * borderX}" height="${outH - 2 * borderY}" fill="#6bb8db" stroke="#3782a6" stroke-width="2"/>
          <text x="${padX + outW / 2}" y="${padY + outH / 2}" class="part-label" style="fill:#1a526e;font-weight:800">Pool: ${L} m × ${W} m</text>
          <!-- Border markings -->
          <text x="${padX + borderX / 2}" y="${padY + outH / 2}" class="dim-missing" style="font-size:12px">${d} m</text>
          <text x="${padX + outW - borderX / 2}" y="${padY + outH / 2}" class="dim-missing" style="font-size:12px">${d} m</text>
          <text x="${padX + outW / 2}" y="${padY + borderY / 2 + 3}" class="dim-missing" style="font-size:12px">${d} m</text>
          <text x="${padX + outW / 2}" y="${padY + outH - borderY / 2 + 3}" class="dim-missing" style="font-size:12px">${d} m</text>
        `, '0 0 360 200');

        const svg1 = svgWrap(`
          <rect x="${padX}" y="${padY}" width="${outW}" height="${outH}" fill="#e8ded0" stroke="#2e6c4a" stroke-width="3"/>
          <rect x="${padX + borderX}" y="${padY + borderY}" width="${outW - 2 * borderX}" height="${outH - 2 * borderY}" fill="#6bb8db" stroke="#3782a6" stroke-width="1.8"/>
          <text x="${padX + outW / 2}" y="${padY - 10}" class="dim-text">Outer Length: ${L} + 2×${d} = ${outerL} m</text>
          <text x="${padX - 22}" y="${padY + outH / 2}" class="dim-text">${outerW} m</text>
          <text x="${padX + outW / 2}" y="${padY + outH / 2}" class="part-label" style="fill:#1a526e">Pool Area: ${innerArea} sq m</text>
        `, '0 0 360 205');

        return [
          {
            title: 'The pool and its border walkway',
            description: `The pool is ${L} m by ${W} m. A walkway of width ${d} m wraps completely around the outside.`,
            diagram: svg0,
            equation: `Pool: ${L} m × ${W} m · Walkway width: ${d} m`
          },
          {
            title: 'Add width on BOTH sides (Left & Right, Top & Bottom)',
            description: `The walkway adds ${d} m on the left AND ${d} m on the right: outer length = ${L} + 2 × ${d} = ${outerL} m. It also adds ${d} m top and bottom: outer width = ${W} + 2 × ${d} = ${outerW} m.`,
            diagram: svg1,
            equation: `Outer: ${outerL} m × ${outerW} m`
          },
          {
            title: 'Calculate the outer rectangle area',
            description: `The outer rectangle includes both the pool and walkway: ${outerL} × ${outerW} = ${outerArea} sq m.`,
            diagram: svg1,
            equation: `Outer Area = ${outerL} × ${outerW} = ${outerArea} sq m`
          },
          {
            title: 'Subtract the pool to find the walkway alone',
            description: `Walkway Area = Outer Area (${outerArea} sq m) − Pool Area (${L} × ${W} = ${innerArea} sq m) = ${pathArea} sq m!`,
            diagram: svg1,
            equation: `${outerArea} − ${innerArea} = ${pathArea} sq m ✓`
          }
        ];
      }
    }

    return [];
  }

  // ---------- Browser UI & State Controller ----------
  let topic = 'rectilinear';
  let level = 'easy';
  let problem = null;
  let step = 0;
  let solved = false;
  let stars = 0;

  function getState() {
    return { topic, level, problem, step, solved, stars };
  }

  // Pure functions for Node testing and API
  const api = {
    generate,
    stepsFor,
    getState,
    topics
  };

  if (typeof window !== 'undefined') {
    window.AreaPerimeterStudio = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  // If in browser DOM environment, wire up the interactive UI
  if (typeof document !== 'undefined') {
    const $ = id => document.getElementById(id);

    try {
      stars = Math.max(0, Number(localStorage.getItem('little-big-math-stars')) || 0);
    } catch (_) {}

    function updateStars() {
      const starEl = $('star-count');
      if (starEl) starEl.textContent = fmt(stars);
      const progress = stars && stars % 10 === 0 ? 10 : stars % 10;
      const progressFill = $('progress-fill');
      if (progressFill) progressFill.style.width = progress * 10 + '%';
      const track = document.querySelector('.progress-track');
      if (track) track.setAttribute('aria-label', `${progress} of 10 stars toward a celebration`);
    }

    function renderStep() {
      if (!problem) return;
      const steps = stepsFor(problem);
      if (!steps || !steps.length) return;
      const current = steps[step];

      const vTitle = $('visual-title');
      if (vTitle) vTitle.textContent = current.title;

      const sDesc = $('step-description');
      if (sDesc) sDesc.textContent = current.description;

      const diagram = $('diagram');
      if (diagram) diagram.innerHTML = current.diagram;

      const eq = $('equation');
      if (eq) eq.textContent = current.equation;

      const stepDots = $('step-dots');
      if (stepDots) {
        stepDots.innerHTML = steps.map((_, i) =>
          `<button class="step-dot" data-step="${i}" aria-label="Step ${i + 1}: ${steps[i].title}" ${i === step ? 'aria-current="step"' : ''}></button>`
        ).join('');
      }

      const prevBtn = $('previous-step');
      if (prevBtn) prevBtn.disabled = step === 0;

      const nextBtn = $('next-step');
      if (nextBtn) {
        nextBtn.textContent = step === steps.length - 1 ? 'Try a new problem ↻' : 'Show the next step →';
      }

      const vNote = $('visual-note');
      if (vNote) {
        vNote.textContent = `Step ${step + 1} of ${steps.length} · ${
          step === steps.length - 1 ? 'Try the answers, or start another adventure.' : 'Take your time. Try an answer whenever you’re ready.'
        }`;
      }

      const badge = $('picture-badge');
      if (badge) {
        badge.textContent = topics[problem.kind]?.badge || 'Visual guide';
      }
    }

    function renderProblem() {
      step = 0;
      solved = false;
      const meta = topics[topic];

      const cap = $('topic-caption');
      if (cap) cap.textContent = meta.caption;

      const sIcon = $('story-icon');
      if (sIcon) sIcon.textContent = meta.icon;

      const pTitle = $('problem-title');
      if (pTitle) pTitle.textContent = meta.title;

      const storyEl = $('story');
      if (storyEl) storyEl.innerHTML = problem.story;

      const fieldsEl = $('answer-fields');
      if (fieldsEl) {
        fieldsEl.innerHTML = problem.answers.map((a, i) => `
          <div class="answer-row">
            <label for="answer-${i}">${a.label}</label>
            <div class="input-wrap">
              <input id="answer-${i}" name="answer-${i}" type="text" inputmode="numeric" autocomplete="off" placeholder="?" aria-describedby="feedback" aria-invalid="false">
              <span>${a.unit || ''}</span>
            </div>
          </div>
        `).join('');
      }

      const fb = $('feedback');
      if (fb) {
        fb.textContent = '';
        fb.className = 'feedback';
      }

      const hintEl = $('hint');
      if (hintEl) {
        hintEl.hidden = true;
        hintEl.textContent = problem.hint;
      }
      const hintBtn = $('hint-button');
      if (hintBtn) hintBtn.setAttribute('aria-expanded', 'false');

      document.querySelectorAll('.topic').forEach(btn => {
        btn.setAttribute('aria-pressed', String(btn.dataset.topic === topic));
      });

      renderStep();
    }

    function nextProblem() {
      const prevAnswers = problem ? JSON.stringify(problem.answers) : '';
      for (let i = 0; i < 15; i++) {
        problem = generate(topic, level);
        if (JSON.stringify(problem.answers) !== prevAnswers) break;
      }
      renderProblem();
    }

    const setTopic = t => {
      if (!topics[t]) return;
      topic = t;
      history.replaceState(null, '', '#' + t);
      nextProblem();
    };

    // Answer Checking
    const form = $('answer-form');
    if (form) {
      form.addEventListener('submit', event => {
        event.preventDefault();
        let allCorrect = true;
        let empty = false;
        let firstWrong = null;

        problem.answers.forEach((ans, i) => {
          const input = $('answer-' + i);
          if (!input) return;
          // Strip currency, commas, spaces, and optional unit suffixes (e.g. m, cm, sq m, m², tiles)
          const raw = input.value.trim()
            .replace(/[$,\s]/g, '')
            .replace(/(sq\s*m|m²|sq\s*cm|cm²|tiles|units|sqm|sqcm|m|cm)$/i, '');
          const valid = /^\d+(\.0+)?$/.test(raw);
          const correct = valid && Number(raw) === ans.value;
          if (!input.value.trim()) empty = true;
          input.setAttribute('aria-invalid', String(!correct));
          if (!correct) {
            allCorrect = false;
            firstWrong = firstWrong || input;
          }
        });

        const fb = $('feedback');
        if (allCorrect) {
          if (fb) {
            fb.className = 'feedback success';
            fb.textContent = solved
              ? '✓ You’ve already earned a star for this one. Try a new problem!'
              : '★ You got it! Great thinking. One shiny star for you.';
          }
          if (!solved) {
            solved = true;
            stars++;
            updateStars();
            try {
              localStorage.setItem('little-big-math-stars', String(stars));
            } catch (_) {}
            if (stars % 10 === 0) {
              const celeb = $('celebration');
              if (celeb) {
                celeb.textContent = `🌟 ${fmt(stars)} stars! Look how much your thinking has grown! 🌱`;
                celeb.classList.add('visible');
                setTimeout(() => celeb.classList.remove('visible'), 5000);
              }
            }
          }
        } else {
          if (fb) {
            fb.className = 'feedback try';
            fb.textContent = empty
              ? 'Fill in each answer box, then let’s check together.'
              : 'A little rethink! Check the highlighted answer. The picture or hint can help you find the next step.';
          }
          if (firstWrong) firstWrong.focus();
        }
      });
    }

    // Controls
    document.querySelectorAll('.topic').forEach(btn => {
      btn.addEventListener('click', () => setTopic(btn.dataset.topic));
    });

    const diffSelect = $('difficulty');
    if (diffSelect) {
      diffSelect.addEventListener('change', e => {
        level = e.target.value;
        nextProblem();
      });
    }

    const newBtn = $('new-button');
    if (newBtn) newBtn.addEventListener('click', nextProblem);

    const mixBtn = $('mix-button');
    if (mixBtn) {
      mixBtn.addEventListener('click', () => {
        const others = Object.keys(topics).filter(k => k !== topic);
        setTopic(pick(others));
      });
    }

    const hintBtn = $('hint-button');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        const hintEl = $('hint');
        if (hintEl) {
          hintEl.hidden = !hintEl.hidden;
          hintBtn.setAttribute('aria-expanded', String(!hintEl.hidden));
        }
      });
    }

    const prevStep = $('previous-step');
    if (prevStep) {
      prevStep.addEventListener('click', () => {
        if (step > 0) {
          step--;
          renderStep();
        }
      });
    }

    const nextStep = $('next-step');
    if (nextStep) {
      nextStep.addEventListener('click', () => {
        const steps = stepsFor(problem);
        if (step < steps.length - 1) {
          step++;
          renderStep();
        } else {
          nextProblem();
        }
      });
    }

    const stepDots = $('step-dots');
    if (stepDots) {
      stepDots.addEventListener('click', event => {
        const btn = event.target.closest('[data-step]');
        if (btn) {
          step = Number(btn.dataset.step);
          renderStep();
        }
      });
    }

    // Hash sync
    window.addEventListener('hashchange', () => {
      const linked = decodeURIComponent(location.hash.slice(1));
      if (topics[linked] && linked !== topic) {
        topic = linked;
        nextProblem();
      }
    });

    const initialHash = decodeURIComponent(location.hash.slice(1));
    if (topics[initialHash]) {
      topic = initialHash;
    }

    nextProblem();
    updateStars();
  }
})();
