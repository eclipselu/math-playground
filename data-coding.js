(() => {
  'use strict';

  // ---------- Helpers & Utilities ----------
  const $ = id => (typeof document !== 'undefined' ? document.getElementById(id) : null);
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = list => list[rand(0, list.length - 1)];
  const shuffle = list => {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = rand(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const fmt = n => Number(n).toLocaleString('en-US');

  // ---------- Topic Metadata ----------
  const topics = {
    scaledGraph: {
      caption: 'SCALED GRAPHS',
      icon: '📊',
      title: 'One mark can mean many items',
      badge: 'Scale: 1 step = S items'
    },
    twoWayTable: {
      caption: 'TWO-WAY TABLE',
      icon: '📋',
      title: 'Rows and columns that add up both ways',
      badge: 'Row totals = Column totals'
    },
    compassGrid: {
      caption: 'COMPASS & GRID MAP',
      icon: '🧭',
      title: 'North, South, East, West, and diagonal corners',
      badge: 'North is UP · East is RIGHT'
    },
    codingBot: {
      caption: 'ROBOT CODING',
      icon: '🤖',
      title: 'Follow the code blocks and repeat loops',
      badge: 'Loops repeat blocks K times'
    }
  };

  const COMPASS_DIRECTIONS = ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];

  // ---------- Problem Themes & Data ----------
  const GRAPH_THEMES = [
    {
      topic: 'reading',
      title: 'Books Read During Reading Week',
      itemName: 'books read',
      unit: 'books',
      categories: [
        { name: 'Mia', icon: '📖', color: '#4a90e2' },
        { name: 'Leo', icon: '📗', color: '#27ae60' },
        { name: 'Ava', icon: '📙', color: '#e67e22' },
        { name: 'Sam', icon: '📕', color: '#8e44ad' }
      ]
    },
    {
      topic: 'garden',
      title: 'Seedlings Planted in School Garden',
      itemName: 'seedlings',
      unit: 'seedlings',
      categories: [
        { name: 'Sunflower', icon: '🌻', color: '#f39c12' },
        { name: 'Marigold', icon: '🌼', color: '#e67e22' },
        { name: 'Daisy', icon: '🌸', color: '#e84393' },
        { name: 'Tulip', icon: '🌷', color: '#27ae60' }
      ]
    },
    {
      topic: 'sports',
      title: 'Favorite Weekend Sports',
      itemName: 'votes',
      unit: 'votes',
      categories: [
        { name: 'Soccer', icon: '⚽', color: '#2980b9' },
        { name: 'Swimming', icon: '🏊', color: '#16a085' },
        { name: 'Cycling', icon: '🚲', color: '#d35400' },
        { name: 'Running', icon: '🏃', color: '#8e44ad' }
      ]
    },
    {
      topic: 'nature',
      title: 'Wetland Animals Counted',
      itemName: 'animals',
      unit: 'animals',
      categories: [
        { name: 'Birds', icon: '🐦', color: '#3498db' },
        { name: 'Frogs', icon: '🐸', color: '#2ecc71' },
        { name: 'Turtles', icon: '🐢', color: '#1abc9c' },
        { name: 'Ducks', icon: '🦆', color: '#e67e22' }
      ]
    }
  ];

  const TABLE_THEMES = [
    {
      context: 'After-School Activity Clubs',
      unit: 'students',
      groups: ['Grade 3A', 'Grade 3B', 'Grade 3C'],
      activities: ['Art Club', 'Chess Club', 'Music Club']
    },
    {
      context: 'Sports Day Sign-Ups',
      unit: 'athletes',
      groups: ['Red Team', 'Blue Team', 'Green Team'],
      activities: ['Basketball', 'Soccer', 'Relay Race']
    },
    {
      context: 'School Craft Fair Entries',
      unit: 'crafts',
      groups: ['Room 101', 'Room 102', 'Room 103'],
      activities: ['Origami', 'Clay Pottery', 'Painting']
    }
  ];

  const LANDMARKS = [
    { name: 'School', icon: '🏫' },
    { name: 'Library', icon: '📚' },
    { name: 'Park', icon: '🌳' },
    { name: 'Bakery', icon: '🥐' },
    { name: 'Zoo', icon: '🦁' },
    { name: 'Pond', icon: '🦆' },
    { name: 'Museum', icon: '🏛️' },
    { name: 'Camp', icon: '⛺' }
  ];

  // ---------- Problem Generators ----------

  function generate(kind, difficulty = 'easy') {
    const isEasy = difficulty === 'easy';
    const isLarge = difficulty === 'large';
    const p = { kind, difficulty, isEasy, isLarge };

    // 1. Scaled Bar Graphs & Pictographs
    if (kind === 'scaledGraph') {
      const theme = pick(GRAPH_THEMES);
      p.theme = theme;
      p.title = theme.title;
      p.itemName = theme.itemName;
      p.unit = theme.unit;
      p.categories = [...theme.categories];

      // Scale factor S: 2, 5, 10 on easy; 2, 5, 10, 20 on medium; 5, 10, 20, 25 on large
      const scaleChoices = isEasy ? [2, 5, 10] : isLarge ? [5, 10, 20, 25] : [2, 5, 10, 20];
      const S = pick(scaleChoices);
      p.S = S;

      // Half-step allowed on medium and large when S is even (2, 10, 20)
      const allowHalf = !isEasy && S % 2 === 0 && Math.random() < 0.6;
      p.hasHalf = allowHalf;

      const minSteps = isEasy ? 2 : isLarge ? 3 : 2;
      const maxSteps = isEasy ? 5 : isLarge ? 8 : 6;

      // Generate distinct whole steps for categories
      const stepPool = [];
      for (let s = minSteps; s <= maxSteps; s++) stepPool.push(s);
      const chosenSteps = shuffle(stepPool).slice(0, 4);

      if (allowHalf) {
        // Assign a half-step to one category (e.g. 3.5 steps)
        const halfCatIdx = rand(0, 3);
        chosenSteps[halfCatIdx] = chosenSteps[halfCatIdx] - 0.5;
      }

      p.steps = chosenSteps;
      p.values = chosenSteps.map(s => Math.round(s * S));

      // Question 1: Target category value
      const targetIdx = rand(0, 3);
      p.targetIdx = targetIdx;
      p.targetCat = p.categories[targetIdx];
      p.targetSteps = p.steps[targetIdx];
      p.targetVal = p.values[targetIdx];

      // Question 2: Multi-step comparison: (Cat A + Cat B) - Cat C, or Total across all 4
      const q2Type = isEasy || Math.random() < 0.4 ? 'total' : 'compare';
      p.q2Type = q2Type;

      if (q2Type === 'total') {
        const total = p.values.reduce((sum, v) => sum + v, 0);
        p.ans2 = total;
        p.q2Prompt = `How many ${p.itemName} were counted in all across <strong>all 4 categories</strong>?`;
        p.q2Label = 'Total across all 4 categories';
        p.q2Equation = `${p.values.join(' + ')} = ${total}`;
      } else {
        // Find 2 categories whose sum is strictly greater than a 3rd
        let a = 0, b = 1, c = 2;
        const indices = shuffle([0, 1, 2, 3]);
        for (let i = 0; i < 4; i++) {
          for (let j = i + 1; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
              if (k !== i && k !== j && p.values[i] + p.values[j] > p.values[k]) {
                a = i; b = j; c = k;
                break;
              }
            }
          }
        }
        p.cmpA = p.categories[a];
        p.cmpB = p.categories[b];
        p.cmpC = p.categories[c];
        p.cmpValA = p.values[a];
        p.cmpValB = p.values[b];
        p.cmpValC = p.values[c];
        p.ans2 = (p.cmpValA + p.cmpValB) - p.cmpValC;
        p.q2Prompt = `How many more ${p.itemName} do <strong>${p.cmpA.name} and ${p.cmpB.name}</strong> have together than <strong>${p.cmpC.name}</strong>?`;
        p.q2Label = `(${p.cmpA.name} + ${p.cmpB.name}) minus ${p.cmpC.name}`;
        p.q2Equation = `(${p.cmpValA} + ${p.cmpValB}) − ${p.cmpValC} = ${p.cmpValA + p.cmpValB} − ${p.cmpValC} = ${p.ans2}`;
      }

      p.story = `The graph shows <strong>${p.title}</strong>.<br>Look at the scale key: <strong>each grid step represents ${S} ${p.unit}</strong>${allowHalf ? ` (and a half-step represents ${S / 2} ${p.unit})` : ''}.<br><br>1. How many ${p.unit} does <strong>${p.targetCat.name}</strong> have?<br>2. ${p.q2Prompt}`;

      p.answers = [
        { label: `Number of ${p.unit} for ${p.targetCat.name}`, value: p.targetVal },
        { label: p.q2Label, value: p.ans2 }
      ];

      p.hint = `First check the scale: each square step stands for ${S} ${p.unit}. For ${p.targetCat.name}, count the steps and multiply by ${S}.`;
    }

    // 2. Two-Way Summary Tables
    else if (kind === 'twoWayTable') {
      const theme = pick(TABLE_THEMES);
      p.theme = theme;
      p.context = theme.context;
      p.unit = theme.unit;

      const numRows = isLarge ? 3 : 2;
      p.groups = theme.groups.slice(0, numRows);
      p.activities = [...theme.activities];

      // Grid values: easy (4..15), medium (12..40), large (15..60)
      const minVal = isEasy ? 4 : isLarge ? 15 : 12;
      const maxVal = isEasy ? 15 : isLarge ? 55 : 38;

      const grid = [];
      for (let r = 0; r < numRows; r++) {
        const row = [];
        for (let c = 0; c < 3; c++) {
          row.push(rand(minVal, maxVal));
        }
        grid.push(row);
      }
      p.grid = grid;

      // Compute row totals
      p.rowTotals = grid.map(row => row.reduce((s, v) => s + v, 0));
      // Compute column totals
      p.colTotals = [0, 1, 2].map(c => grid.reduce((s, row) => s + row[c], 0));
      // Grand total
      p.grandTotal = p.rowTotals.reduce((s, v) => s + v, 0);

      // Missing cells setup:
      // Missing cell ?1: in row 0, col 1 (Chess Club / Activity 1)
      p.missingRow = 0;
      p.missingCol = 1;
      p.ans1 = grid[0][1];

      // Missing cell ?2: column total for col 1
      p.ans2 = p.colTotals[1];

      if (isLarge) {
        // Missing cell ?3: Grand Total
        p.ans3 = p.grandTotal;
        p.story = `The two-way summary table shows <strong>${p.context}</strong> across ${numRows} groups. Several numbers are missing and marked with <strong>?1</strong>, <strong>?2</strong>, and <strong>?3</strong>.<br><br>Use the row totals and column totals to find each missing value!`;
        p.answers = [
          { label: `Missing cell ?1 (${p.groups[0]} in ${p.activities[1]})`, value: p.ans1 },
          { label: `Missing cell ?2 (${p.activities[1]} Column Total)`, value: p.ans2 },
          { label: 'Missing cell ?3 (Grand Total)', value: p.ans3 }
        ];
      } else {
        p.story = `The two-way summary table shows <strong>${p.context}</strong>. Two numbers are missing and marked with <strong>?1</strong> and <strong>?2</strong>.<br><br>Find <strong>?1</strong> using the row total, then use that to find <strong>?2</strong>!`;
        p.answers = [
          { label: `Missing cell ?1 (${p.groups[0]} in ${p.activities[1]})`, value: p.ans1 },
          { label: `Missing cell ?2 (${p.activities[1]} Column Total)`, value: p.ans2 }
        ];
      }

      p.hint = `Look at the row for ${p.groups[0]}: the row total is ${p.rowTotals[0]}. Take away ${grid[0][0]} and ${grid[0][2]} to find ?1! Then add column ${p.activities[1]} downwards to find ?2.`;
    }

    // 3. 8-Point Compass & Grid Map
    else if (kind === 'compassGrid') {
      const gridSize = isEasy ? 6 : isLarge ? 10 : 8;
      p.gridSize = gridSize;

      const landmarkPool = shuffle(LANDMARKS);
      p.startLandmark = landmarkPool[0];
      p.otherLandmarks = landmarkPool.slice(1, isEasy ? 4 : 6);

      // Starting coordinate (x0, y0)
      let x0, y0, dx1, dy1, dx2, dy2, dx3, dy3;
      let finalX, finalY, netDx, netDy;

      // Keep generating until moves stay within 1..gridSize and net displacement forms an 8-point direction
      let attempts = 0;
      while (attempts++ < 100) {
        x0 = rand(2, gridSize - 2);
        y0 = rand(2, gridSize - 2);

        // Move 1: East or West
        const move1Dir = Math.random() < 0.5 ? 'East' : 'West';
        const dist1 = rand(1, isEasy ? 2 : 3);
        dx1 = move1Dir === 'East' ? dist1 : -dist1;
        dy1 = 0;

        // Move 2: North or South
        const move2Dir = Math.random() < 0.5 ? 'North' : 'South';
        const dist2 = rand(1, isEasy ? 2 : 3);
        dx2 = 0;
        dy2 = move2Dir === 'North' ? dist2 : -dist2;

        // Move 3 (medium and large): extra horizontal or vertical hop
        if (isEasy) {
          dx3 = 0;
          dy3 = 0;
        } else {
          const move3Axis = Math.random() < 0.5 ? 'H' : 'V';
          const dist3 = rand(1, 2);
          if (move3Axis === 'H') {
            const m3Dir = Math.random() < 0.5 ? 'East' : 'West';
            dx3 = m3Dir === 'East' ? dist3 : -dist3;
            dy3 = 0;
          } else {
            const m3Dir = Math.random() < 0.5 ? 'North' : 'South';
            dx3 = 0;
            dy3 = m3Dir === 'North' ? dist3 : -dist3;
          }
        }

        const leg1X = x0 + dx1;
        const leg1Y = y0 + dy1;
        const leg2X = leg1X + dx2;
        const leg2Y = leg1Y + dy2;
        finalX = leg2X + dx3;
        finalY = leg2Y + dy3;

        netDx = finalX - x0;
        netDy = finalY - y0;

        if (
          leg1X >= 1 && leg1X <= gridSize &&
          leg1Y >= 1 && leg1Y <= gridSize &&
          leg2X >= 1 && leg2X <= gridSize &&
          leg2Y >= 1 && leg2Y <= gridSize &&
          finalX >= 1 && finalX <= gridSize &&
          finalY >= 1 && finalY <= gridSize &&
          (netDx !== 0 || netDy !== 0)
        ) {
          break;
        }
      }

      p.x0 = x0; p.y0 = y0;
      p.moves = [
        { dir: dx1 > 0 ? 'East' : 'West', dist: Math.abs(dx1), dx: dx1, dy: 0 },
        { dir: dy2 > 0 ? 'North' : 'South', dist: Math.abs(dy2), dx: 0, dy: dy2 }
      ];
      if (dx3 !== 0 || dy3 !== 0) {
        p.moves.push({
          dir: dx3 > 0 ? 'East' : dx3 < 0 ? 'West' : dy3 > 0 ? 'North' : 'South',
          dist: Math.abs(dx3 + dy3),
          dx: dx3,
          dy: dy3
        });
      }

      p.finalX = finalX;
      p.finalY = finalY;
      p.netDx = netDx;
      p.netDy = netDy;

      // Determine 8-point compass direction from start to finish
      let direction = '';
      if (netDx > 0 && netDy > 0) direction = 'Northeast';
      else if (netDx < 0 && netDy > 0) direction = 'Northwest';
      else if (netDx > 0 && netDy < 0) direction = 'Southeast';
      else if (netDx < 0 && netDy < 0) direction = 'Southwest';
      else if (netDx > 0 && netDy === 0) direction = 'East';
      else if (netDx < 0 && netDy === 0) direction = 'West';
      else if (netDx === 0 && netDy > 0) direction = 'North';
      else if (netDx === 0 && netDy < 0) direction = 'South';

      p.direction = direction;

      // Describe move instructions
      const moveDescriptions = p.moves.map(m => `walk <strong>${m.dist} block${m.dist > 1 ? 's' : ''} ${m.dir}</strong>`).join(', then ');

      p.story = `You start at the <strong>${p.startLandmark.name}</strong> at coordinate <strong>(${x0}, ${y0})</strong>.<br>Follow the path: ${moveDescriptions}.<br><br>Find the final coordinate and the compass direction from the start!`;

      p.answers = [
        { label: 'Final East-West column (X)', value: finalX },
        { label: 'Final North-South row (Y)', value: finalY },
        { type: 'choice', label: 'Looking from start, final spot is…', options: COMPASS_DIRECTIONS, value: direction }
      ];

      p.hint = 'East adds to column X, West subtracts from X. North adds to row Y, South subtracts from Y. Diagonal corners are Northeast, Northwest, Southeast, or Southwest.';
    }

    // 4. Grid Robot & Loop Coding
    else if (kind === 'codingBot') {
      const gridSize = isEasy ? 6 : isLarge ? 10 : 8;
      p.gridSize = gridSize;

      let K, d1, d2, hasExtra, dir3, d3, extraDx, extraDy, x0, y0, finalX, finalY;
      let botAttempts = 0;
      while (botAttempts++ < 300) {
        K = isEasy ? rand(2, 3) : isLarge ? rand(3, 4) : rand(2, 3);
        d1 = isEasy ? 1 : rand(1, 2);
        d2 = isEasy ? 1 : rand(1, 2);
        hasExtra = !isEasy;
        dir3 = pick(['East', 'West', 'North', 'South']);
        d3 = hasExtra ? rand(1, 2) : 0;

        extraDx = dir3 === 'East' ? d3 : dir3 === 'West' ? -d3 : 0;
        extraDy = dir3 === 'North' ? d3 : dir3 === 'South' ? -d3 : 0;

        const spanX = K * d1 + Math.max(0, extraDx);
        const spanY = K * d2 + Math.max(0, extraDy);

        if (spanX < gridSize && spanY < gridSize) {
          const minPossibleX = Math.max(1, 1 - Math.min(0, extraDx));
          const maxPossibleX = gridSize - spanX;
          const minPossibleY = Math.max(1, 1 - Math.min(0, extraDy));
          const maxPossibleY = gridSize - spanY;

          if (maxPossibleX >= minPossibleX && maxPossibleY >= minPossibleY) {
            x0 = rand(minPossibleX, maxPossibleX);
            y0 = rand(minPossibleY, maxPossibleY);
            finalX = x0 + K * d1 + extraDx;
            finalY = y0 + K * d2 + extraDy;
            if (finalX >= 1 && finalX <= gridSize && finalY >= 1 && finalY <= gridSize) {
              break;
            }
          }
        }
      }

      p.K = K;
      p.dir1Name = 'East'; p.d1 = d1; p.dir1Icon = '➡️';
      p.dir2Name = 'North'; p.d2 = d2; p.dir2Icon = '⬆️';
      p.hasExtra = hasExtra;
      p.dir3Name = dir3; p.d3 = d3;
      p.dir3Icon = dir3 === 'East' ? '➡️' : dir3 === 'West' ? '⬅️' : dir3 === 'North' ? '⬆️' : '⬇️';
      p.extraDx = extraDx; p.extraDy = extraDy;
      p.x0 = x0; p.y0 = y0;
      p.finalX = finalX; p.finalY = finalY;

      // Total steps calculation: K * (d1 + d2) + d3
      p.totalSteps = K * (d1 + d2) + d3;

      p.story = `A little robot starts at square <strong>(${x0}, ${y0})</strong> on a ${gridSize}×${gridSize} grid.<br>It runs this code program with a <strong>repeat ${K} times</strong> loop.<br><br>Where does the robot land, and how many total steps does it take?`;

      p.answers = [
        { label: 'Final column (X) after code runs', value: p.finalX },
        { label: 'Final row (Y) after code runs', value: p.finalY },
        { label: 'Total steps moved by the robot', value: p.totalSteps }
      ];

      p.hint = `Inside the loop, the robot takes ${d1 + d2} steps each time. With repeat ${K}, that’s ${K} × ${d1 + d2} steps${hasExtra ? ` plus ${d3} more at the end` : ''}.`;
    }

    return p;
  }

  // ---------- SVG & Visual Renderers ----------

  function renderScaledGraphSvg(p, options = {}) {
    const { showValues = false, highlightIdx = -1, showDiff = false } = options;
    const S = p.S;
    const maxVal = Math.max(...p.values);
    const maxSteps = Math.ceil(maxVal / S) + 1;
    const svgW = 490, svgH = 220;
    const originX = 110, originY = 185;
    const chartW = 350, chartH = 135;
    const stepW = chartW / maxSteps;
    const barH = 20;

    let svg = `<svg class="scaled-graph-svg" viewBox="0 0 ${svgW} ${svgH}" role="img" aria-label="Scaled bar graph of ${p.title}">`;

    // Scale Key Banner
    svg += `<rect x="20" y="8" width="450" height="26" rx="8" fill="#edf1e4" stroke="#c8d8c2" />`;
    svg += `<text x="245" y="25" text-anchor="middle" class="scale-badge-text">🔑 Scale Key: 1 grid step = ${S} ${p.unit}${p.hasHalf ? ` · ½ step = ${S / 2}` : ''}</text>`;

    // Grid lines & Axis labels
    for (let s = 0; s <= maxSteps; s++) {
      const gx = originX + s * stepW;
      svg += `<line x1="${gx}" y1="${originY - chartH}" x2="${gx}" y2="${originY}" class="graph-grid-line" />`;
      svg += `<text x="${gx}" y="${originY + 16}" class="graph-tick-label">${s * S}</text>`;
    }

    // Axes
    svg += `<line x1="${originX}" y1="${originY - chartH}" x2="${originX}" y2="${originY}" class="graph-axis-line" />`;
    svg += `<line x1="${originX}" y1="${originY}" x2="${originX + chartW}" y2="${originY}" class="graph-axis-line" />`;

    // Category Bars
    p.categories.forEach((cat, i) => {
      const steps = p.steps[i];
      const val = p.values[i];
      const barW = steps * stepW;
      const barY = originY - chartH + 12 + i * 32;
      const isTarget = highlightIdx === i;

      // Category icon + label
      svg += `<text x="${originX - 10}" y="${barY + 14}" text-anchor="end" class="graph-label">${cat.icon} ${cat.name}</text>`;

      // Bar rectangle
      svg += `<rect x="${originX}" y="${barY}" width="${barW}" height="${barH}" rx="4" fill="${cat.color}" ${isTarget ? 'stroke="#263f37" stroke-width="2.5"' : ''} />`;

      // Value label or formula badge
      if (showValues || isTarget) {
        const textVal = isTarget ? `${steps} × ${S} = ${val}` : `${val}`;
        svg += `<text x="${originX + barW + 7}" y="${barY + 14}" class="bar-val-badge">${textVal}</text>`;
      }
    });

    svg += `</svg>`;
    return svg;
  }

  function renderTwoWayTableHtml(p, options = {}) {
    const { step = 0 } = options;
    const isLarge = p.isLarge;

    let html = `<div class="two-way-wrap"><table class="two-way-table" aria-label="Two-way summary table">`;

    // Table Header
    html += `<thead><tr>`;
    html += `<th class="corner-cell">Group \\ Activity</th>`;
    p.activities.forEach((act, c) => {
      const isColFocus = step >= 3 && c === p.missingCol;
      html += `<th class="${isColFocus ? 'col-focus' : ''}">${act}</th>`;
    });
    html += `<th class="row-total">Row Total</th>`;
    html += `</tr></thead>`;

    // Table Body
    html += `<tbody>`;
    p.groups.forEach((grp, r) => {
      const isRowFocus = step === 2 && r === p.missingRow;
      html += `<tr class="${isRowFocus ? 'row-focus' : ''}">`;
      html += `<th class="row-header">${grp}</th>`;

      p.activities.forEach((_, c) => {
        const isMissing1 = r === p.missingRow && c === p.missingCol;
        const isColFocus = step >= 3 && c === p.missingCol;

        if (isMissing1) {
          if (step >= 2) {
            html += `<td class="${isColFocus ? 'col-focus' : ''}"><span class="missing-badge solved">${p.ans1}</span></td>`;
          } else {
            html += `<td class="${isColFocus ? 'col-focus' : ''}"><span class="missing-badge">?1</span></td>`;
          }
        } else {
          html += `<td class="${isColFocus ? 'col-focus' : ''}">${p.grid[r][c]}</td>`;
        }
      });

      html += `<td class="row-total"><strong>${p.rowTotals[r]}</strong></td>`;
      html += `</tr>`;
    });

    // Column Total Row
    html += `<tr>`;
    html += `<th class="row-header col-total">Column Total</th>`;
    p.activities.forEach((_, c) => {
      const isMissing2 = c === p.missingCol;
      const isColFocus = step >= 3 && isMissing2;

      if (isMissing2) {
        if (step >= 3) {
          html += `<td class="col-total ${isColFocus ? 'col-focus' : ''}"><span class="missing-badge solved">${p.ans2}</span></td>`;
        } else {
          html += `<td class="col-total ${isColFocus ? 'col-focus' : ''}"><span class="missing-badge">?2</span></td>`;
        }
      } else {
        html += `<td class="col-total">${p.colTotals[c]}</td>`;
      }
    });

    // Grand Total Cell
    if (isLarge) {
      if (step >= 4) {
        html += `<td class="grand-total"><span class="missing-badge solved">${p.ans3}</span></td>`;
      } else {
        html += `<td class="grand-total"><span class="missing-badge">?3</span></td>`;
      }
    } else {
      html += `<td class="grand-total">${p.grandTotal}</td>`;
    }

    html += `</tr></tbody></table></div>`;
    return html;
  }

  function renderCompassRoseSvg(cx, cy, r, highlightDir = '') {
    const points = [
      { name: 'North', angle: 0, label: 'N' },
      { name: 'Northeast', angle: 45, label: 'NE' },
      { name: 'East', angle: 90, label: 'E' },
      { name: 'Southeast', angle: 135, label: 'SE' },
      { name: 'South', angle: 180, label: 'S' },
      { name: 'Southwest', angle: 225, label: 'SW' },
      { name: 'West', angle: 270, label: 'W' },
      { name: 'Northwest', angle: 315, label: 'NW' }
    ];

    let svg = `<g class="compass-card">`;
    // Outer dial
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fffef9" stroke="#b7c3b2" stroke-width="2" />`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r - 8}" fill="none" stroke="#dedfd3" stroke-width="1" />`;

    points.forEach(pt => {
      const rad = (pt.angle - 90) * Math.PI / 180;
      const tipX = cx + (r - 10) * Math.cos(rad);
      const tipY = cy + (r - 10) * Math.sin(rad);
      const isHigh = pt.name === highlightDir;
      const strokeCol = isHigh ? '#d7a841' : pt.label.length === 1 ? '#263f37' : '#7e8d83';
      const strokeW = isHigh ? 3 : pt.label.length === 1 ? 2 : 1;

      svg += `<line x1="${cx}" y1="${cy}" x2="${tipX}" y2="${tipY}" stroke="${strokeCol}" stroke-width="${strokeW}" />`;

      // Label text
      const lblX = cx + (r + 7) * Math.cos(rad);
      const lblY = cy + (r + 7) * Math.sin(rad);
      svg += `<text x="${lblX}" y="${lblY}" class="map-axis-label" dominant-baseline="central" fill="${isHigh ? '#aa7a12' : '#263f37'}" font-weight="${isHigh ? '800' : '600'}">${pt.label}</text>`;
    });

    svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="#315b48" />`;
    svg += `</g>`;
    return svg;
  }

  function renderCompassGridSvg(p, options = {}) {
    const { showPath = true, showVector = false, highlightDir = '' } = options;
    const N = p.gridSize;
    const svgW = 470, svgH = 340;
    const gridLeft = 45, gridBottom = 300;
    const gridW = 270, gridH = 270;
    const cellW = gridW / N, cellH = gridH / N;

    const toSvgX = x => gridLeft + (x - 0.5) * cellW;
    const toSvgY = y => gridBottom - (y - 0.5) * cellH;

    let svg = `<svg class="compass-map-svg" viewBox="0 0 ${svgW} ${svgH}" role="img" aria-label="Coordinate grid map with 8-point compass">`;

    // Arrow marker defs
    svg += `<defs>
      <marker id="arrow-leg1" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2980b9" />
      </marker>
      <marker id="arrow-leg2" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#27ae60" />
      </marker>
      <marker id="arrow-leg3" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#e67e22" />
      </marker>
      <marker id="arrow-vector" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#8e44ad" />
      </marker>
    </defs>`;

    // Grid Background
    svg += `<rect x="${gridLeft}" y="${gridBottom - gridH}" width="${gridW}" height="${gridH}" class="map-grid-bg" />`;

    // Grid lines & Coordinates
    for (let i = 0; i <= N; i++) {
      const gx = gridLeft + i * cellW;
      const gy = gridBottom - i * cellH;
      // Vertical grid lines
      svg += `<line x1="${gx}" y1="${gridBottom - gridH}" x2="${gx}" y2="${gridBottom}" class="map-grid-line" />`;
      // Horizontal grid lines
      svg += `<line x1="${gridLeft}" y1="${gy}" x2="${gridLeft + gridW}" y2="${gy}" class="map-grid-line" />`;

      // Numbers along X-axis
      if (i > 0) {
        svg += `<text x="${gridLeft + (i - 0.5) * cellW}" y="${gridBottom + 16}" class="map-coord-label">${i}</text>`;
      }
      // Numbers along Y-axis
      if (i > 0) {
        svg += `<text x="${gridLeft - 14}" y="${gridBottom - (i - 0.5) * cellH}" class="map-coord-label">${i}</text>`;
      }
    }

    // Axis Direction Labels
    svg += `<text x="${gridLeft + gridW / 2}" y="${gridBottom + 32}" class="map-axis-label">West ← Column (X) → East</text>`;
    svg += `<text x="${gridLeft - 30}" y="${gridBottom - gridH / 2}" class="map-axis-label" transform="rotate(-90 ${gridLeft - 30} ${gridBottom - gridH / 2})">South ← Row (Y) → North</text>`;

    // Compass Rose in top right
    svg += renderCompassRoseSvg(395, 95, 45, highlightDir);

    // Landmarks
    p.otherLandmarks.forEach((lm, idx) => {
      // Deterministic layout for other landmarks
      const lx = ((p.x0 + idx * 3) % N) + 1;
      const ly = ((p.y0 + idx * 2 + 1) % N) + 1;
      if (lx !== p.x0 || ly !== p.y0) {
        svg += `<text x="${toSvgX(lx)}" y="${toSvgY(ly)}" text-anchor="middle" dominant-baseline="central" font-size="14" opacity="0.6">${lm.icon}</text>`;
      }
    });

    // Start Landmark
    const startSvgX = toSvgX(p.x0);
    const startSvgY = toSvgY(p.y0);
    svg += `<circle cx="${startSvgX}" cy="${startSvgY}" r="${cellW * 0.42}" fill="#eaf3e4" stroke="#315b48" stroke-width="2" />`;
    svg += `<text x="${startSvgX}" y="${startSvgY}" text-anchor="middle" dominant-baseline="central" font-size="18">${p.startLandmark.icon}</text>`;
    svg += `<text x="${startSvgX}" y="${startSvgY - cellH * 0.5 - 2}" text-anchor="middle" font-size="10" font-weight="700" fill="#315b48">START (${p.x0},${p.y0})</text>`;

    // Path Movement Arrows
    if (showPath) {
      let curX = p.x0;
      let curY = p.y0;
      const legColors = ['#2980b9', '#27ae60', '#e67e22'];
      const legMarkers = ['arrow-leg1', 'arrow-leg2', 'arrow-leg3'];

      p.moves.forEach((move, i) => {
        const nextX = curX + move.dx;
        const nextY = curY + move.dy;
        const x1 = toSvgX(curX), y1 = toSvgY(curY);
        const x2 = toSvgX(nextX), y2 = toSvgY(nextY);

        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${legColors[i]}" stroke-width="3" stroke-linecap="round" marker-end="url(#${legMarkers[i]})" />`;
        curX = nextX;
        curY = nextY;
      });

      // End Marker
      const endSvgX = toSvgX(p.finalX);
      const endSvgY = toSvgY(p.finalY);
      svg += `<circle cx="${endSvgX}" cy="${endSvgY}" r="${cellW * 0.4}" fill="#fcf2d7" stroke="#d7a841" stroke-width="2" />`;
      svg += `<text x="${endSvgX}" y="${endSvgY}" text-anchor="middle" dominant-baseline="central" font-size="16">⭐</text>`;
      svg += `<text x="${endSvgX}" y="${endSvgY + cellH * 0.5 + 11}" text-anchor="middle" font-size="10" font-weight="700" fill="#825a12">END (${p.finalX},${p.finalY})</text>`;

      // Direct Compass Vector from Start to End
      if (showVector) {
        svg += `<line x1="${startSvgX}" y1="${startSvgY}" x2="${endSvgX}" y2="${endSvgY}" stroke="#8e44ad" stroke-width="2.5" stroke-dasharray="4 3" marker-end="url(#arrow-vector)" />`;
      }
    }

    svg += `</svg>`;
    return svg;
  }

  function renderCodingBotVisual(p, options = {}) {
    const { step = 0 } = options;
    const N = p.gridSize;
    const svgW = 340, svgH = 260;
    const gridLeft = 40, gridBottom = 225;
    const gridW = 200, gridH = 200;
    const cellW = gridW / N, cellH = gridH / N;

    const toSvgX = x => gridLeft + (x - 0.5) * cellW;
    const toSvgY = y => gridBottom - (y - 0.5) * cellH;

    // Code Card HTML
    let cardHtml = `<div class="code-blocks-card">`;
    cardHtml += `<div class="code-block code-start"><span>🚩 when program starts</span></div><br>`;
    cardHtml += `<div class="code-block code-loop"><span>🔁 repeat <strong>${p.K}</strong> times:</span></div>`;
    cardHtml += `<div class="code-loop-body">`;
    cardHtml += `<div><span class="code-block code-move">${p.dir1Icon} move ${p.dir1Name} <strong>${p.d1}</strong> step${p.d1 > 1 ? 's' : ''}</span></div>`;
    cardHtml += `<div><span class="code-block code-move">${p.dir2Icon} move ${p.dir2Name} <strong>${p.d2}</strong> step${p.d2 > 1 ? 's' : ''}</span></div>`;
    cardHtml += `</div>`;
    cardHtml += `<div class="code-loop-end">end loop</div>`;
    if (p.hasExtra) {
      cardHtml += `<div><span class="code-block code-move-extra">${p.dir3Icon} move ${p.dir3Name} <strong>${p.d3}</strong> step${p.d3 > 1 ? 's' : ''}</span></div>`;
    }
    cardHtml += `</div>`;

    // SVG Grid
    let svg = `<svg class="coding-grid-svg" viewBox="0 0 ${svgW} ${svgH}" role="img" aria-label="Robot loop path on grid">`;

    // Grid Background & lines
    svg += `<rect x="${gridLeft}" y="${gridBottom - gridH}" width="${gridW}" height="${gridH}" class="map-grid-bg" />`;
    for (let i = 0; i <= N; i++) {
      const gx = gridLeft + i * cellW;
      const gy = gridBottom - i * cellH;
      svg += `<line x1="${gx}" y1="${gridBottom - gridH}" x2="${gx}" y2="${gridBottom}" class="map-grid-line" />`;
      svg += `<line x1="${gridLeft}" y1="${gy}" x2="${gridLeft + gridW}" y2="${gy}" class="map-grid-line" />`;
      if (i > 0) {
        svg += `<text x="${gridLeft + (i - 0.5) * cellW}" y="${gridBottom + 14}" class="map-coord-label" font-size="9">${i}</text>`;
        svg += `<text x="${gridLeft - 10}" y="${gridBottom - (i - 0.5) * cellH}" class="map-coord-label" font-size="9">${i}</text>`;
      }
    }

    svg += `<text x="${gridLeft + gridW / 2}" y="${gridBottom + 27}" class="map-axis-label">Column X</text>`;

    // Start Position Robot
    const startX = toSvgX(p.x0);
    const startY = toSvgY(p.y0);
    svg += `<circle cx="${startX}" cy="${startY}" r="${cellW * 0.4}" fill="#eaf3e4" stroke="#315b48" stroke-width="1.5" />`;
    svg += `<text x="${startX}" y="${startY}" text-anchor="middle" dominant-baseline="central" font-size="14">🤖</text>`;
    svg += `<text x="${startX}" y="${startY - cellH * 0.5 - 2}" text-anchor="middle" font-size="8" font-weight="700" fill="#315b48">START</text>`;

    // Tracing Loops
    const loopColors = ['#2980b9', '#16a085', '#d35400', '#8e44ad', '#2c3e50'];
    let curX = p.x0;
    let curY = p.y0;

    for (let k = 1; k <= p.K; k++) {
      const nextX = curX + p.d1;
      const nextY = curY + p.d2;
      const c = loopColors[(k - 1) % loopColors.length];

      const x1 = toSvgX(curX), y1 = toSvgY(curY);
      const xMid = toSvgX(nextX), yMid = y1;
      const x2 = xMid, y2 = toSvgY(nextY);

      svg += `<path d="M ${x1} ${y1} L ${xMid} ${yMid} L ${x2} ${y2}" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round" />`;
      svg += `<circle cx="${x2}" cy="${y2}" r="3" fill="${c}" />`;

      curX = nextX;
      curY = nextY;
    }

    // Post-loop extra move
    if (p.hasExtra) {
      const finalX = curX + p.extraDx;
      const finalY = curY + p.extraDy;
      const x1 = toSvgX(curX), y1 = toSvgY(curY);
      const x2 = toSvgX(finalX), y2 = toSvgY(finalY);
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8e44ad" stroke-width="2.5" stroke-dasharray="3 2" />`;
      curX = finalX;
      curY = finalY;
    }

    // Final Landing Spot
    const finalSvgX = toSvgX(p.finalX);
    const finalSvgY = toSvgY(p.finalY);
    svg += `<circle cx="${finalSvgX}" cy="${finalSvgY}" r="${cellW * 0.42}" fill="#fcf2d7" stroke="#d7a841" stroke-width="2" />`;
    svg += `<text x="${finalSvgX}" y="${finalSvgY}" text-anchor="middle" dominant-baseline="central" font-size="14">⭐</text>`;
    svg += `<text x="${finalSvgX}" y="${finalSvgY + cellH * 0.5 + 9}" text-anchor="middle" font-size="8" font-weight="700" fill="#825a12">(${p.finalX},${p.finalY})</text>`;

    svg += `</svg>`;

    return `<div class="coding-container">${cardHtml}${svg}</div>`;
  }

  // ---------- Step-by-Step Explanations (`stepsFor`) ----------

  function stepsFor(p) {
    if (p.kind === 'scaledGraph') {
      const S = p.S;
      const targetCat = p.targetCat;
      const targetSteps = p.targetSteps;
      const targetVal = p.targetVal;

      return [
        {
          title: 'Step 1: Check the scale key',
          description: `Each square step stands for ${S} ${p.unit}${p.hasHalf ? `, and a half-step represents ${S / 2} ${p.unit}` : ''}. Look at the numbers along the bottom line: they count up by ${S}s.`,
          diagram: renderScaledGraphSvg(p, { showValues: false }),
          equation: `1 step = ${S} ${p.unit}`
        },
        {
          title: `Step 2: Find ${targetCat.name}’s bar`,
          description: `${targetCat.name}’s bar reaches ${targetSteps} step${targetSteps === 1 ? '' : 's'}. Multiply steps by the scale ${S}: ${targetSteps} × ${S} = ${targetVal} ${p.unit}.`,
          diagram: renderScaledGraphSvg(p, { showValues: true, highlightIdx: p.targetIdx }),
          equation: `${targetSteps} steps × ${S} = ${targetVal} ${p.unit}`
        },
        {
          title: 'Step 3: Solve the comparison question',
          description: p.q2Type === 'total'
            ? `To find the total across all 4 categories, add each bar’s exact value together: ${p.q2Equation}.`
            : `Add ${p.cmpA.name} (${p.cmpValA}) and ${p.cmpB.name} (${p.cmpValB}) to get ${p.cmpValA + p.cmpValB}. Then take away ${p.cmpC.name} (${p.cmpValC}) to get ${p.ans2} more.`,
          diagram: renderScaledGraphSvg(p, { showValues: true, showDiff: true }),
          equation: p.q2Equation
        }
      ];
    }

    if (p.kind === 'twoWayTable') {
      const isLarge = p.isLarge;
      const r0 = p.groups[0];
      const c1 = p.activities[1];
      const knownRowSum = p.grid[0][0] + p.grid[0][2];
      const steps = [
        {
          title: 'Step 1: Spot the row with one missing clue',
          description: `Look across the table. In ${r0}’s row, 2 of the 3 clubs are already filled in, and the row total is ${p.rowTotals[0]}. That means only ?1 is missing!`,
          diagram: renderTwoWayTableHtml(p, { step: 1 }),
          equation: `${p.grid[0][0]} + ?1 + ${p.grid[0][2]} = ${p.rowTotals[0]}`
        },
        {
          title: 'Step 2: Solve for ?1 using the row sum',
          description: `Take away the known numbers from the row total: ${p.rowTotals[0]} − (${p.grid[0][0]} + ${p.grid[0][2]}) = ${p.rowTotals[0]} − ${knownRowSum} = ${p.ans1}. Now ?1 is solved!`,
          diagram: renderTwoWayTableHtml(p, { step: 2 }),
          equation: `?1 = ${p.rowTotals[0]} − ${knownRowSum} = ${p.ans1}`
        },
        {
          title: 'Step 3: Unlock ?2 down the column',
          description: isLarge
            ? `Now that ?1 is ${p.ans1}, add all 3 groups down the ${c1} column to find ?2: ${p.ans1} + ${p.grid[1][1]} + ${p.grid[2][1]} = ${p.ans2}.`
            : `Now that ?1 is ${p.ans1}, add the two rows down the ${c1} column to find ?2: ${p.ans1} + ${p.grid[1][1]} = ${p.ans2}.`,
          diagram: renderTwoWayTableHtml(p, { step: 3 }),
          equation: isLarge
            ? `?2 = ${p.ans1} + ${p.grid[1][1]} + ${p.grid[2][1]} = ${p.ans2}`
            : `?2 = ${p.ans1} + ${p.grid[1][1]} = ${p.ans2}`
        }
      ];

      if (isLarge) {
        steps.push({
          title: 'Step 4: Check the Grand Total (?3)',
          description: `Add all the row totals together (or all the column totals) to find the Grand Total: ${p.rowTotals.join(' + ')} = ${p.grandTotal}.`,
          diagram: renderTwoWayTableHtml(p, { step: 4 }),
          equation: `Grand Total = ${p.rowTotals.join(' + ')} = ${p.grandTotal}`
        });
      }

      return steps;
    }

    if (p.kind === 'compassGrid') {
      const move1 = p.moves[0];
      const move2 = p.moves[1];
      const move3 = p.moves[2];

      return [
        {
          title: 'Step 1: Locate the start and compass rose',
          description: `Start at ${p.startLandmark.name} at (${p.x0}, ${p.y0}). Look at the 8-point compass in the corner: North is UP, South is DOWN, East is RIGHT, West is LEFT.`,
          diagram: renderCompassGridSvg(p, { showPath: false }),
          equation: `Start at (${p.x0}, ${p.y0})`
        },
        {
          title: 'Step 2: Track East and West moves (Column X)',
          description: `Column X changes with East (+) and West (−). Beginning at X = ${p.x0}, following the path brings the column to final X = ${p.finalX}.`,
          diagram: renderCompassGridSvg(p, { showPath: true, showVector: false }),
          equation: `X: ${p.x0} ${p.netDx >= 0 ? '+' : '−'} ${Math.abs(p.netDx)} = ${p.finalX}`
        },
        {
          title: 'Step 3: Track North and South moves (Row Y) & direction',
          description: `Row Y changes with North (+) and South (−) to final Y = ${p.finalY}. Looking from the start (${p.x0}, ${p.y0}) to (${p.finalX}, ${p.finalY}), the purple dashed arrow points ${p.direction}!`,
          diagram: renderCompassGridSvg(p, { showPath: true, showVector: true, highlightDir: p.direction }),
          equation: `Y: ${p.y0} ${p.netDy >= 0 ? '+' : '−'} ${Math.abs(p.netDy)} = ${p.finalY} → Direction: ${p.direction}`
        }
      ];
    }

    // codingBot
    return [
      {
        title: 'Step 1: Read the loop code',
        description: `Everything inside the repeat loop runs ${p.K} times. In 1 loop, the robot takes ${p.d1} step${p.d1 > 1 ? 's' : ''} ${p.dir1Name} and ${p.d2} step${p.d2 > 1 ? 's' : ''} ${p.dir2Name} (${p.d1 + p.d2} steps per loop).`,
        diagram: renderCodingBotVisual(p, { step: 1 }),
        equation: `1 loop = ${p.d1} + ${p.d2} = ${p.d1 + p.d2} steps`
      },
      {
        title: 'Step 2: Multiply by K loop iterations',
        description: `Repeating ${p.K} times moves X by ${p.K} × ${p.d1} = ${p.K * p.d1}, and Y by ${p.K} × ${p.d2} = ${p.K * p.d2}. After the loop, the robot is at (${p.x0 + p.K * p.d1}, ${p.y0 + p.K * p.d2}).`,
        diagram: renderCodingBotVisual(p, { step: 2 }),
        equation: `After loop: (${p.x0} + ${p.K * p.d1}, ${p.y0} + ${p.K * p.d2})`
      },
      {
        title: 'Step 3: Add extra moves and count total steps',
        description: p.hasExtra
          ? `The program finishes with ${p.d3} step${p.d3 > 1 ? 's' : ''} ${p.dir3Name}, landing at (${p.finalX}, ${p.finalY}). Total steps = (${p.K} × ${p.d1 + p.d2}) + ${p.d3} = ${p.totalSteps}.`
          : `The robot lands at (${p.finalX}, ${p.finalY}). Total steps = ${p.K} × ${p.d1 + p.d2} = ${p.totalSteps}.`,
        diagram: renderCodingBotVisual(p, { step: 3 }),
        equation: p.hasExtra
          ? `(${p.K} × ${p.d1 + p.d2}) + ${p.d3} = ${p.totalSteps} steps`
          : `${p.K} × ${p.d1 + p.d2} = ${p.totalSteps} steps`
      }
    ];
  }

  // ---------- Application State & Controller ----------

  let topic = 'scaledGraph';
  let level = 'easy';
  let problem = null;
  let step = 0;
  let solved = false;
  let stars = 0;

  if (typeof localStorage !== 'undefined') {
    try {
      stars = Math.max(0, Number(localStorage.getItem('little-big-math-stars')) || 0);
    } catch (_) {}
  }

  function storyVisual(p) {
    if (p.kind === 'scaledGraph') return renderScaledGraphSvg(p, { showValues: false });
    if (p.kind === 'twoWayTable') return renderTwoWayTableHtml(p, { step: 0 });
    if (p.kind === 'compassGrid') return renderCompassGridSvg(p, { showPath: true, showVector: false });
    return renderCodingBotVisual(p, { step: 0 });
  }

  function answerField(a, i) {
    if (a.type === 'choice') {
      return `<fieldset class="choice-field" id="answer-${i}" aria-invalid="false">
        <legend>${a.label}</legend>
        <div class="choices">
          ${a.options.map((o, j) => `<label class="choice"><input type="radio" name="answer-${i}" value="${o}" id="answer-${i}-${j}"><span>${o}</span></label>`).join('')}
        </div>
      </fieldset>`;
    }

    return `<div class="answer-row">
      <label for="answer-${i}">${a.label}</label>
      <div class="input-wrap">
        <input id="answer-${i}" name="answer-${i}" type="text" inputmode="numeric" autocomplete="off" placeholder="?" aria-label="${a.label}" aria-describedby="feedback" aria-invalid="false">
      </div>
    </div>`;
  }

  function renderStep() {
    if (!problem || typeof document === 'undefined') return;
    const steps = stepsFor(problem);
    const current = steps[step];
    $('visual-title').textContent = current.title;
    $('step-description').textContent = current.description;
    $('diagram').innerHTML = current.diagram;
    $('equation').textContent = current.equation;
    $('step-dots').innerHTML = steps.map((s, i) => `<button class="step-dot" data-step="${i}" aria-label="Step ${i + 1}: ${s.title}" ${i === step ? 'aria-current="step"' : ''}></button>`).join('');
    $('previous-step').disabled = step === 0;
    $('next-step').textContent = step === steps.length - 1 ? 'Try a new problem ↻' : 'Show the next step →';
    $('visual-note').textContent = `Step ${step + 1} of ${steps.length} · ${step === steps.length - 1 ? 'Try the answers, or start another adventure.' : 'Take your time. Try an answer whenever you’re ready.'}`;
  }

  function renderProblem() {
    if (typeof document === 'undefined') return;
    step = 0;
    solved = false;
    const meta = topics[topic];
    $('topic-caption').textContent = meta.caption;
    $('story-icon').textContent = meta.icon;
    $('problem-title').textContent = meta.title;
    $('picture-badge').textContent = meta.badge;
    $('story').innerHTML = problem.story;
    $('story-visual').innerHTML = storyVisual(problem);
    $('answer-fields').innerHTML = problem.answers.map(answerField).join('');
    $('feedback').textContent = '';
    $('feedback').className = 'feedback';
    $('hint').hidden = true;
    $('hint-button').setAttribute('aria-expanded', 'false');
    $('hint-button').setAttribute('aria-controls', 'hint');
    $('hint').textContent = problem.hint;
    document.querySelectorAll('.topic').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.topic === topic)));
    renderStep();
  }

  function nextProblem() {
    const prevStr = problem ? JSON.stringify(problem.answers) : '';
    for (let i = 0; i < 15; i++) {
      problem = generate(topic, level);
      if (JSON.stringify(problem.answers) !== prevStr) break;
    }
    renderProblem();
  }

  function updateStars() {
    if (typeof document === 'undefined') return;
    $('star-count').textContent = fmt(stars);
    const progress = stars && stars % 10 === 0 ? 10 : stars % 10;
    $('progress-fill').style.width = progress * 10 + '%';
    const track = document.querySelector('.progress-track');
    if (track) track.setAttribute('aria-label', `${progress} of 10 stars toward a celebration`);
  }

  // ---------- DOM Event Bindings ----------
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      // Form check handler
      $('answer-form').addEventListener('submit', event => {
        event.preventDefault();
        let allCorrect = true;
        let empty = false;
        let firstWrong = null;

        problem.answers.forEach((a, i) => {
          let correct = false;
          let focusEl;

          if (a.type === 'choice') {
            const chosen = document.querySelector(`input[name="answer-${i}"]:checked`);
            if (!chosen) empty = true;
            correct = Boolean(chosen) && chosen.value === a.value;
            const field = $('answer-' + i);
            if (field) field.setAttribute('aria-invalid', String(!correct));
            focusEl = chosen || $(`answer-${i}-0`);
          } else {
            const input = $('answer-' + i);
            const raw = input.value.trim().replace(/[,\s]/g, '');
            if (!raw) empty = true;
            const valid = /^-?\d+(\.0+)?$/.test(raw);
            correct = valid && Number(raw) === a.value;
            input.setAttribute('aria-invalid', String(!correct));
            focusEl = input;
          }

          if (!correct) {
            allCorrect = false;
            firstWrong = firstWrong || focusEl;
          }
        });

        if (allCorrect) {
          $('feedback').className = 'feedback success';
          $('feedback').textContent = solved
            ? '✓ You’ve already earned a star for this one. Try a new problem!'
            : '★ You got it! Great thinking. One shiny star for you.';

          if (!solved) {
            solved = true;
            stars++;
            updateStars();
            try {
              localStorage.setItem('little-big-math-stars', String(stars));
            } catch (_) {}

            if (stars % 10 === 0) {
              $('celebration').textContent = `🌟 ${fmt(stars)} stars! Look how much your thinking has grown! 🌱`;
              $('celebration').classList.add('visible');
              setTimeout(() => $('celebration').classList.remove('visible'), 5000);
            }
          }
        } else {
          $('feedback').className = 'feedback try';
          $('feedback').textContent = empty
            ? 'Fill in each answer box, then let’s check together.'
            : 'A little rethink! Check the highlighted answer. The picture or hint can help.';
          if (firstWrong && typeof firstWrong.focus === 'function') firstWrong.focus();
        }
      });

      $('answer-fields').addEventListener('change', event => {
        const field = event.target.closest('.choice-field');
        if (field) field.setAttribute('aria-invalid', 'false');
      });

      // Controls
      const setTopic = t => {
        topic = t;
        history.replaceState(null, '', '#' + t);
        nextProblem();
      };

      document.querySelectorAll('.topic').forEach(button => {
        button.addEventListener('click', () => setTopic(button.dataset.topic));
      });

      $('mix-button').addEventListener('click', () => {
        const choices = Object.keys(topics).filter(k => k !== topic);
        setTopic(pick(choices));
      });

      $('difficulty').addEventListener('change', event => {
        level = event.target.value;
        nextProblem();
      });

      $('new-button').addEventListener('click', nextProblem);

      $('hint-button').addEventListener('click', () => {
        const h = $('hint');
        h.hidden = !h.hidden;
        $('hint-button').setAttribute('aria-expanded', String(!h.hidden));
      });

      $('previous-step').addEventListener('click', () => {
        if (step > 0) {
          step--;
          renderStep();
        }
      });

      $('next-step').addEventListener('click', () => {
        if (step < stepsFor(problem).length - 1) {
          step++;
          renderStep();
        } else {
          nextProblem();
        }
      });

      $('step-dots').addEventListener('click', event => {
        const button = event.target.closest('[data-step]');
        if (button) {
          step = Number(button.dataset.step);
          renderStep();
        }
      });

      // Deep link support
      const linked = decodeURIComponent(location.hash.slice(1));
      if (Object.hasOwn(topics, linked)) {
        topic = linked;
      }

      nextProblem();
      updateStars();
    });
  }

  // ---------- Exports ----------
  const exported = {
    generate,
    stepsFor,
    getState: () => ({ topic, level, problem, step, solved, stars })
  };

  if (typeof window !== 'undefined') {
    window.DataCodingLab = exported;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generate, stepsFor };
  }
})();
