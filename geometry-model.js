(function (root) {
  'use strict';

  // ==========================================
  // Part 1: Existing 3D Solids Model (Prisms & Pyramids)
  // ==========================================
  const bases = {
    triangle: { name: 'Triangle', adjective: 'Triangular', sides: 3 },
    square: { name: 'Square', adjective: 'Square-based', sides: 4 },
    rectangle: { name: 'Rectangle', adjective: 'Rectangular-based', sides: 4 },
    pentagon: { name: 'Pentagon', adjective: 'Pentagonal', sides: 5 },
    hexagon: { name: 'Hexagon', adjective: 'Hexagonal', sides: 6 }
  };
  const subtract = (a, b) => a.map((v, i) => v - b[i]);
  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const average = points => [0,1,2].map(i => points.reduce((s, p) => s + p[i], 0) / points.length);

  function build(family, base) {
    if (!['prism', 'pyramid'].includes(family) || !bases[base]) throw new Error('Unknown solid');
    const n = bases[base].sides;
    const ring = base === 'rectangle' ? [[-1.35, -0.8], [1.35, -0.8], [1.35, 0.8], [-1.35, 0.8]] :
      base === 'square' ? [[-1,-1], [1,-1], [1,1], [-1,1]] :
      Array.from({length:n}, (_,i) => [1.3*Math.cos(2*Math.PI*i/n-Math.PI/2), 1.3*Math.sin(2*Math.PI*i/n-Math.PI/2)]);
    const vertices = ring.map(([x,z]) => [x,-1,z]);
    if (family === 'prism') vertices.push(...ring.map(([x,z]) => [x,1,z]));
    else vertices.push([0,1.4,0]);
    const faces = [{ indices:Array.from({length:n}, (_,i) => i), base:true, label:'Bottom base' }];
    if (family === 'prism') faces.push({ indices:Array.from({length:n}, (_,i) => n+i), base:true, label:'Matching top base' });
    for (let i=0;i<n;i++) faces.push({indices:family === 'prism' ? [i,(i+1)%n,(i+1)%n+n,i+n] : [i,(i+1)%n,n],base:false,label:(family === 'prism' ? 'Rectangle side ' : 'Triangle side ') + (i+1)});
    const center = average(vertices);
    faces.forEach((face,i) => {
      const points = face.indices.map(index => vertices[index]);
      face.center = average(points);
      let normal = cross(subtract(points[1],points[0]),subtract(points[2],points[0]));
      if (dot(normal,subtract(face.center,center)) < 0) { face.indices.reverse(); normal = normal.map(v => -v); }
      const length = Math.sqrt(dot(normal,normal));
      face.normal = normal.map(v => v/length); face.id = i;
    });
    const edges = [], map = new Map();
    faces.forEach(face => face.indices.forEach((a,i) => {
      const b = face.indices[(i+1)%face.indices.length], key = [a,b].sort((x,y)=>x-y).join('-');
      if (!map.has(key)) { const edge = {a,b,faces:[],id:edges.length}; map.set(key,edge); edges.push(edge); }
      map.get(key).faces.push(face.id);
    }));
    edges.forEach(edge => {
      const onBottom = edge.a < n && edge.b < n;
      const onTop = family === 'prism' && edge.a >= n && edge.b >= n;
      edge.group = onBottom ? 'Bottom base' : onTop ? 'Top base' : family === 'prism' ? 'Joining edge' : 'Edge to tip';
    });
    return { family, base, n, vertices, faces, edges, name:bases[base].adjective + ' ' + family };
  }

  function rotate(point, yaw, tilt) {
    const [x,y,z] = point, cy=Math.cos(yaw), sy=Math.sin(yaw), ct=Math.cos(tilt), st=Math.sin(tilt);
    const xx=x*cy+z*sy, zz=-x*sy+z*cy;
    return [xx,y*ct-zz*st,y*st+zz*ct];
  }

  // ==========================================
  // Part 2: Math Helpers & Common Utilities
  // ==========================================
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

  // ==========================================
  // Part 3: 2D Polygons & Quadrilaterals (`quads`)
  // ==========================================
  const QUAD_SHAPES = {
    square: {
      key: 'square',
      name: 'Square',
      family: 'Square',
      parallelPairs: 2,
      rightAngles: 4,
      equalSides: 'All 4 sides equal',
      pts: [[70, 35], [190, 35], [190, 155], [70, 155]],
      rightAngleIndices: [0, 1, 2, 3],
      parallelPairsSides: [
        [[0, 1], [3, 2]],
        [[0, 3], [1, 2]]
      ],
      equalSideGroups: [[[0, 1], [1, 2], [2, 3], [3, 0]]],
      clues: [
        '4 equal side lengths.',
        '2 pairs of parallel sides (opposite sides never meet).',
        '4 right angles (90° square corners).',
        'A square is also a special rectangle AND a special rhombus!'
      ]
    },
    rectangle: {
      key: 'rectangle',
      name: 'Rectangle',
      family: 'Rectangle',
      parallelPairs: 2,
      rightAngles: 4,
      equalSides: '2 pairs of equal sides',
      pts: [[45, 45], [215, 45], [215, 145], [45, 145]],
      rightAngleIndices: [0, 1, 2, 3],
      parallelPairsSides: [
        [[0, 1], [3, 2]],
        [[0, 3], [1, 2]]
      ],
      equalSideGroups: [
        [[0, 1], [3, 2]],
        [[0, 3], [1, 2]]
      ],
      clues: [
        'Opposite sides are equal length and parallel.',
        '2 pairs of parallel sides.',
        '4 right angles (90° square corners).',
        'A rectangle is also a parallelogram with right angles.'
      ]
    },
    rhombus: {
      key: 'rhombus',
      name: 'Rhombus',
      family: 'Rhombus',
      parallelPairs: 2,
      rightAngles: 0,
      equalSides: 'All 4 sides equal',
      pts: [[85, 35], [215, 35], [165, 155], [35, 155]],
      rightAngleIndices: [],
      parallelPairsSides: [
        [[0, 1], [3, 2]],
        [[0, 3], [1, 2]]
      ],
      equalSideGroups: [[[0, 1], [1, 2], [2, 3], [3, 0]]],
      clues: [
        'All 4 sides have equal length (slanted diamond shape).',
        '2 pairs of parallel sides.',
        '0 right angles (slanted corners).',
        'A rhombus is a parallelogram with all 4 sides equal.'
      ]
    },
    parallelogram: {
      key: 'parallelogram',
      name: 'Parallelogram',
      family: 'Parallelogram',
      parallelPairs: 2,
      rightAngles: 0,
      equalSides: '2 pairs of equal sides',
      pts: [[80, 45], [225, 45], [185, 145], [40, 145]],
      rightAngleIndices: [],
      parallelPairsSides: [
        [[0, 1], [3, 2]],
        [[0, 3], [1, 2]]
      ],
      equalSideGroups: [
        [[0, 1], [3, 2]],
        [[0, 3], [1, 2]]
      ],
      clues: [
        'Opposite sides are parallel and equal length.',
        '2 pairs of parallel sides.',
        '0 right angles.',
        'Slanted opposite sides run like train tracks.'
      ]
    },
    right_trapezoid: {
      key: 'right_trapezoid',
      name: 'Right Trapezoid',
      family: 'Trapezoid',
      parallelPairs: 1,
      rightAngles: 2,
      equalSides: 'No equal sides',
      pts: [[55, 40], [155, 40], [215, 150], [55, 150]],
      rightAngleIndices: [0, 3],
      parallelPairsSides: [
        [[0, 1], [3, 2]]
      ],
      equalSideGroups: [],
      clues: [
        'Exactly 1 pair of parallel sides (top & bottom bases).',
        '2 right angles (90° square corners on the straight side).',
        'The other side is slanted.'
      ]
    },
    isosceles_trapezoid: {
      key: 'isosceles_trapezoid',
      name: 'Isosceles Trapezoid',
      family: 'Trapezoid',
      parallelPairs: 1,
      rightAngles: 0,
      equalSides: '1 pair of equal slanted sides',
      pts: [[80, 40], [180, 40], [220, 150], [40, 150]],
      rightAngleIndices: [],
      parallelPairsSides: [
        [[0, 1], [3, 2]]
      ],
      equalSideGroups: [
        [[0, 3], [1, 2]]
      ],
      clues: [
        'Exactly 1 pair of parallel sides (top & bottom).',
        'The two slanted sides have equal length.',
        '0 right angles.'
      ]
    },
    kite: {
      key: 'kite',
      name: 'Kite',
      family: 'Kite',
      parallelPairs: 0,
      rightAngles: 0,
      equalSides: '2 pairs of adjacent equal sides',
      pts: [[130, 25], [215, 90], [130, 175], [45, 90]],
      rightAngleIndices: [],
      parallelPairsSides: [],
      equalSideGroups: [
        [[0, 1], [0, 3]],
        [[2, 1], [2, 3]]
      ],
      clues: [
        '2 pairs of equal sides that touch (adjacent equal sides).',
        '0 pairs of parallel sides.',
        '0 right angles.'
      ]
    }
  };

  function renderQuadSvg(shape, options = {}) {
    const { pts, rightAngleIndices, parallelPairsSides, equalSideGroups } = shape;
    const {
      showParallel = false,
      showRightAngles = false,
      showEqualTicks = false,
      labels = ['A', 'B', 'C', 'D'],
      w = 270,
      h = 190
    } = options;

    const pointsStr = pts.map(p => p.join(',')).join(' ');
    const parts = [];

    // Background shape
    parts.push(`<polygon points="${pointsStr}" fill="#fdfcf5" stroke="#315b48" stroke-width="2.5" stroke-linejoin="round"/>`);

    // Right angle boxes
    if (showRightAngles && rightAngleIndices && rightAngleIndices.length > 0) {
      const boxSize = 14;
      rightAngleIndices.forEach(idx => {
        const v = pts[idx];
        const prev = pts[(idx - 1 + pts.length) % pts.length];
        const next = pts[(idx + 1) % pts.length];
        const d1 = [prev[0] - v[0], prev[1] - v[1]];
        const d2 = [next[0] - v[0], next[1] - v[1]];
        const len1 = Math.hypot(...d1) || 1;
        const len2 = Math.hypot(...d2) || 1;
        const u1 = [d1[0] / len1 * boxSize, d1[1] / len1 * boxSize];
        const u2 = [d2[0] / len2 * boxSize, d2[1] / len2 * boxSize];
        const p1 = [v[0] + u1[0], v[1] + u1[1]];
        const p2 = [v[0] + u1[0] + u2[0], v[1] + u1[1] + u2[1]];
        const p3 = [v[0] + u2[0], v[1] + u2[1]];
        parts.push(`<polyline points="${p1.join(',')} ${p2.join(',')} ${p3.join(',')}" fill="#fdf0c2" fill-opacity="0.6" stroke="#b0811e" stroke-width="2" stroke-linecap="round"/>`);
        parts.push(`<circle cx="${v[0] + (u1[0]+u2[0])*0.5}" cy="${v[1] + (u1[1]+u2[1])*0.5}" r="2" fill="#b0811e"/>`);
      });
    }

    // Parallel side arrows
    if (showParallel && parallelPairsSides) {
      const arrowColors = ['#2865af', '#d96726', '#874ba0'];
      parallelPairsSides.forEach((pair, pairIdx) => {
        const color = arrowColors[pairIdx % arrowColors.length];
        pair.forEach(edge => {
          const [i1, i2] = edge;
          const p1 = pts[i1], p2 = pts[i2];
          const mx = (p1[0] + p2[0]) / 2;
          const my = (p1[1] + p2[1]) / 2;
          const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len, uy = dy / len;
          const px = -uy, py = ux;
          // Arrow chevron
          const tip = [mx + ux * 5, my + uy * 5];
          const left = [mx - ux * 5 + px * 5, my - uy * 5 + py * 5];
          const right = [mx - ux * 5 - px * 5, my - uy * 5 - py * 5];
          parts.push(`<polyline points="${left.join(',')} ${tip.join(',')} ${right.join(',')}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`);
        });
      });
    }

    // Equal side tick marks
    if (showEqualTicks && equalSideGroups) {
      equalSideGroups.forEach((group, groupIdx) => {
        const ticksCount = groupIdx + 1; // 1 tick or 2 ticks
        group.forEach(edge => {
          const [i1, i2] = edge;
          const p1 = pts[i1], p2 = pts[i2];
          const mx = (p1[0] + p2[0]) / 2;
          const my = (p1[1] + p2[1]) / 2;
          const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len, uy = dy / len;
          const px = -uy, py = ux;
          const offsets = ticksCount === 1 ? [0] : [-3.5, 3.5];
          offsets.forEach(off => {
            const ox = mx + ux * off, oy = my + uy * off;
            parts.push(`<line x1="${ox - px * 6}" y1="${oy - py * 6}" x2="${ox + px * 6}" y2="${oy + py * 6}" stroke="#c94e32" stroke-width="2.5" stroke-linecap="round"/>`);
          });
        });
      });
    }

    // Vertex dots & labels
    pts.forEach((p, i) => {
      parts.push(`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#315b48"/>`);
      if (labels && labels[i]) {
        // Offset outwards
        const cx = 130, cy = 95;
        const ox = p[0] > cx ? p[0] + 12 : p[0] - 12;
        const oy = p[1] > cy ? p[1] + 14 : p[1] - 8;
        parts.push(`<text x="${ox}" y="${oy}" text-anchor="middle" font-size="12" font-weight="700" fill="#263f37">${labels[i]}</text>`);
      }
    });

    return `<svg viewBox="0 0 ${w} ${h}" class="quad-svg" role="img" aria-label="${shape.name}">${parts.join('')}</svg>`;
  }

  // ==========================================
  // Part 4: 3D Cube Block Views (`views`)
  // ==========================================
  const VIEW_PRESETS = {
    easy: [
      { grid: [[2, 1], [0, 1]], name: 'Small Step' },
      { grid: [[1, 2], [1, 0]], name: 'L-Tower' },
      { grid: [[1, 1], [1, 2]], name: 'Corner Peak' },
      { grid: [[0, 2], [1, 1]], name: 'Diagonal Steps' },
      { grid: [[2, 0], [1, 0]], name: 'Wall Duo' },
      { grid: [[1, 0], [1, 2]], name: 'Side Tower' }
    ],
    medium: [
      { grid: [[2, 1, 0], [1, 0, 2]], name: 'Triple Span' },
      { grid: [[3, 1, 0], [0, 2, 1]], name: 'Stair Ridge' },
      { grid: [[1, 2, 1], [2, 0, 1]], name: 'Bridge Blocks' },
      { grid: [[2, 0, 1], [1, 2, 0], [0, 1, 1]], name: 'Square Maze' },
      { grid: [[3, 0, 0], [1, 2, 0], [0, 1, 1]], name: 'Corner High' },
      { grid: [[1, 1, 2], [2, 1, 0]], name: 'Twin Rise' }
    ],
    large: [
      { grid: [[3, 1, 2], [1, 0, 1], [0, 2, 1]], name: 'Castle Ridge' },
      { grid: [[2, 2, 0], [1, 3, 1], [0, 1, 1]], name: 'Center Spire' },
      { grid: [[3, 0, 1], [2, 2, 0], [1, 1, 2]], name: 'Terrace Peak' },
      { grid: [[2, 1, 1], [3, 0, 2], [0, 2, 1]], name: 'Hidden Courtyard' },
      { grid: [[3, 2, 1], [0, 2, 0], [1, 1, 2]], name: 'Sky Steps' }
    ]
  };

  function computeStackStats(grid) {
    const R = grid.length;
    const C = grid[0].length;
    let totalCubes = 0;
    let topSquares = 0;
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        totalCubes += grid[r][c];
        if (grid[r][c] > 0) topSquares++;
      }
    }
    // Front view: looking at column silhouettes from front
    const frontHeights = [];
    for (let c = 0; c < C; c++) {
      let maxH = 0;
      for (let r = 0; r < R; r++) maxH = Math.max(maxH, grid[r][c]);
      frontHeights.push(maxH);
    }
    const frontSquares = frontHeights.reduce((s, h) => s + h, 0);

    // Right-side view: looking from right side along rows
    const sideHeights = [];
    for (let r = 0; r < R; r++) {
      let maxH = 0;
      for (let c = 0; c < C; c++) maxH = Math.max(maxH, grid[r][c]);
      sideHeights.push(maxH);
    }
    const sideSquares = sideHeights.reduce((s, h) => s + h, 0);

    return { R, C, totalCubes, topSquares, frontHeights, frontSquares, sideHeights, sideSquares };
  }

  function renderIsometricStack(grid, options = {}) {
    const R = grid.length;
    const C = grid[0].length;
    const { highlight = null, showArrows = true } = options;

    const w = 310, h = 210;
    const dx = 26, dy = 15, dz = 28;
    const ox = 155 + (R - C) * 12;
    const oy = 115;

    // Collect all unit cubes to sort back-to-front
    const cubes = [];
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        const hVal = grid[r][c];
        for (let z = 0; z < hVal; z++) {
          cubes.push({ r, c, z, key: (r + c) * 10 + z });
        }
      }
    }
    // Painter's order: smaller r+c drawn first (back), then bottom z first
    cubes.sort((a, b) => a.key - b.key);

    const parts = [];

    // Base shadow / grid footprint
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        const cx = ox + (c - r) * dx;
        const cy = oy + (c + r) * dy;
        parts.push(`<polygon points="${cx},${cy - dy} ${cx + dx},${cy} ${cx},${cy + dy} ${cx - dx},${cy}" fill="#000" fill-opacity="0.04" stroke="#c2ceba" stroke-dasharray="2 2" stroke-width="1"/>`);
      }
    }

    cubes.forEach(({ r, c, z }) => {
      const cx = ox + (c - r) * dx;
      const cy = oy + (c + r) * dy - z * dz;

      const topFill = highlight === 'top' ? '#f4c542' : '#dfead6';
      const leftFill = highlight === 'front' ? '#5891d9' : '#98ba8e';
      const rightFill = highlight === 'side' ? '#e2725b' : '#6b9562';

      // Top face
      parts.push(`<polygon points="${cx},${cy - dz} ${cx + dx},${cy - dz + dy} ${cx},${cy - dz + 2 * dy} ${cx - dx},${cy - dz + dy}" fill="${topFill}" stroke="#315b48" stroke-width="1.4" stroke-linejoin="round"/>`);
      // Front-left face (visible as front)
      parts.push(`<polygon points="${cx - dx},${cy - dz + dy} ${cx},${cy - dz + 2 * dy} ${cx},${cy + 2 * dy} ${cx - dx},${cy + dy}" fill="${leftFill}" stroke="#315b48" stroke-width="1.4" stroke-linejoin="round"/>`);
      // Front-right face (visible as side)
      parts.push(`<polygon points="${cx},${cy - dz + 2 * dy} ${cx + dx},${cy - dz + dy} ${cx + dx},${cy + dy} ${cx},${cy + 2 * dy}" fill="${rightFill}" stroke="#315b48" stroke-width="1.4" stroke-linejoin="round"/>`);
    });

    if (showArrows) {
      // Top arrow
      parts.push(`<g opacity="0.85"><text x="${ox}" y="22" font-size="11" font-weight="700" fill="#aa7a12" text-anchor="middle">⬇ TOP VIEW</text></g>`);
      // Front arrow
      parts.push(`<g opacity="0.85"><text x="35" y="${h - 15}" font-size="11" font-weight="700" fill="#2865af" text-anchor="start">FRONT ↗</text></g>`);
      // Right arrow
      parts.push(`<g opacity="0.85"><text x="${w - 35}" y="${h - 15}" font-size="11" font-weight="700" fill="#b84b36" text-anchor="end">↖ RIGHT SIDE</text></g>`);
    }

    return `<svg viewBox="0 0 ${w} ${h}" class="block-stack-svg" role="img" aria-label="Isometric stack of unit cubes">${parts.join('')}</svg>`;
  }

  function render2DViewGrid(title, cols, maxHeight, heights, color, badge = '') {
    const cellSize = 22;
    const maxH = Math.max(3, maxHeight);
    const gw = cols * cellSize;
    const gh = maxH * cellSize;
    const parts = [];

    parts.push(`<div class="view-card" style="border-top: 3px solid ${color};">`);
    parts.push(`<h4>${title}</h4>`);
    parts.push(`<svg viewBox="0 0 ${gw + 10} ${gh + 24}" class="view-grid-svg">`);

    // Draw grid
    for (let c = 0; c < cols; c++) {
      const colH = heights[c];
      for (let r = 0; r < maxH; r++) {
        // r=0 is top, maxH-1 is bottom
        const rowFromBottom = maxH - 1 - r;
        const isFilled = rowFromBottom < colH;
        const x = 5 + c * cellSize;
        const y = 5 + r * cellSize;
        const fill = isFilled ? color : '#f6f7f2';
        const stroke = isFilled ? '#263f37' : '#d2d9cc';
        parts.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`);
      }
      // Label below column
      parts.push(`<text x="${5 + c * cellSize + cellSize / 2}" y="${gh + 18}" text-anchor="middle" font-size="10" font-weight="700" fill="#66746a">${heights[c]}</text>`);
    }

    parts.push(`</svg>`);
    if (badge) parts.push(`<div class="view-badge"><strong>${badge}</strong></div>`);
    parts.push(`</div>`);
    return parts.join('');
  }

  function renderTopViewFlat(grid) {
    const R = grid.length;
    const C = grid[0].length;
    const cellSize = 22;
    const gw = C * cellSize;
    const gh = R * cellSize;
    const parts = [];

    parts.push(`<div class="view-card" style="border-top: 3px solid #aa7a12;">`);
    parts.push(`<h4>Top View (from above)</h4>`);
    parts.push(`<svg viewBox="0 0 ${gw + 10} ${gh + 24}" class="view-grid-svg">`);

    let occupied = 0;
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        const val = grid[r][c];
        const isFilled = val > 0;
        if (isFilled) occupied++;
        const x = 5 + c * cellSize;
        const y = 5 + r * cellSize;
        const fill = isFilled ? '#f4c542' : '#f6f7f2';
        const stroke = isFilled ? '#263f37' : '#d2d9cc';
        parts.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`);
        if (isFilled) {
          parts.push(`<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="#263f37">${val}</text>`);
        }
      }
    }
    parts.push(`<text x="${(gw + 10) / 2}" y="${gh + 18}" text-anchor="middle" font-size="10" font-weight="700" fill="#66746a">Heights shown</text>`);
    parts.push(`</svg>`);
    parts.push(`<div class="view-badge"><strong>${occupied} squares</strong> visible</div>`);
    parts.push(`</div>`);
    return parts.join('');
  }

  // ==========================================
  // Part 5: 3D Nets (`nets`)
  // ==========================================
  const CUBE_NET_TEMPLATES = [
    {
      id: 'cross_141',
      name: 'Classic Cross Net (1-4-1)',
      cells: [
        [0, 1, 1],
        [1, 0, 2], [1, 1, 3], [1, 2, 4], [1, 3, 5],
        [2, 1, 6]
      ],
      oppositePairs: [[1, 6], [2, 4], [3, 5]],
      skipPairsExplanation: 'In row 2: Face 2 and Face 4 skip Face 3. Face 3 and Face 5 skip Face 4. The top and bottom flaps (Face 1 & Face 6) meet on opposite sides.'
    },
    {
      id: 't_net_141',
      name: 'T-Net (1-4-1)',
      cells: [
        [0, 2, 1],
        [1, 0, 2], [1, 1, 3], [1, 2, 4], [1, 3, 5],
        [2, 1, 6]
      ],
      oppositePairs: [[1, 6], [2, 4], [3, 5]],
      skipPairsExplanation: 'In the middle row of 4: Face 2 is opposite Face 4 (skip 3), and Face 3 is opposite Face 5 (skip 4). Flaps Face 1 & Face 6 fold opposite each other.'
    },
    {
      id: 'z_net_231',
      name: 'Z-Net (2-3-1)',
      cells: [
        [0, 0, 1], [0, 1, 2],
        [1, 1, 3], [1, 2, 4], [1, 3, 5],
        [2, 3, 6]
      ],
      oppositePairs: [[1, 4], [2, 5], [3, 6]],
      skipPairsExplanation: 'Z-step rule: 2 squares over and 1 down folds opposite! Face 1 is opposite Face 4, Face 2 is opposite Face 5, and Face 3 is opposite Face 6.'
    },
    {
      id: 'l_net_132',
      name: 'L-Net (1-3-2)',
      cells: [
        [0, 0, 1],
        [1, 0, 2], [1, 1, 3], [1, 2, 4],
        [2, 2, 5], [2, 3, 6]
      ],
      oppositePairs: [[1, 3], [2, 4], [5, 6]],
      skipPairsExplanation: 'Skip-one in the middle row gives Face 2 opposite Face 4. Flaps and turns fold Face 1 opposite Face 3, and Face 5 opposite Face 6.'
    },
    {
      id: 'stairs_222',
      name: 'Staircase Net (2-2-2)',
      cells: [
        [0, 0, 1], [0, 1, 2],
        [1, 1, 3], [1, 2, 4],
        [2, 2, 5], [2, 3, 6]
      ],
      oppositePairs: [[1, 4], [2, 5], [3, 6]],
      skipPairsExplanation: 'Each 2-step stair matches with the face across the diagonal fold! (1 matches 4, 2 matches 5, 3 matches 6).'
    }
  ];

  function renderNetSvg(cells, faceNumbers, highlightPair = null, pairColors = {}) {
    const cellSize = 38;
    const maxR = Math.max(...cells.map(c => c[0])) + 1;
    const maxC = Math.max(...cells.map(c => c[1])) + 1;
    const w = maxC * cellSize + 24;
    const h = maxR * cellSize + 24;

    const parts = [];

    cells.forEach(([r, c, tmplIdx]) => {
      const num = faceNumbers[tmplIdx];
      const x = 12 + c * cellSize;
      const y = 12 + r * cellSize;

      let fill = '#fffef9';
      let stroke = '#315b48';
      let strokeW = 2;

      if (pairColors[num]) {
        fill = pairColors[num];
        stroke = '#263f37';
        strokeW = 2.5;
      }

      parts.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"/>`);
      parts.push(`<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 6}" text-anchor="middle" font-size="17" font-weight="800" fill="#263f37">${num}</text>`);
    });

    return `<svg viewBox="0 0 ${w} ${h}" class="net-svg" role="img" aria-label="Cube Net with 6 numbered squares">${parts.join('')}</svg>`;
  }

  function renderFoldedCubeSvg(faces = {}) {
    const w = 180, h = 180;
    const cx = 90, cy = 90;
    const s = 42;
    const dy = 24;

    const topFill = faces.top?.color || '#fbeee2';
    const topNum = faces.top?.num || '1';

    const leftFill = faces.left?.color || '#e9efdf';
    const leftNum = faces.left?.num || '2';

    const rightFill = faces.right?.color || '#f2ecf8';
    const rightNum = faces.right?.num || '3';

    const parts = [];
    // Top
    parts.push(`<polygon points="${cx},${cy - s} ${cx + s},${cy - s + dy} ${cx},${cy - s + 2 * dy} ${cx - s},${cy - s + dy}" fill="${topFill}" stroke="#315b48" stroke-width="2" stroke-linejoin="round"/>`);
    parts.push(`<text x="${cx}" y="${cy - s + dy + 5}" text-anchor="middle" font-size="16" font-weight="800" fill="#263f37">${topNum}</text>`);

    // Front-Left
    parts.push(`<polygon points="${cx - s},${cy - s + dy} ${cx},${cy - s + 2 * dy} ${cx},${cy + dy} ${cx - s},${cy}" fill="${leftFill}" stroke="#315b48" stroke-width="2" stroke-linejoin="round"/>`);
    parts.push(`<text x="${cx - s / 2}" y="${cy + 5}" text-anchor="middle" font-size="16" font-weight="800" fill="#263f37">${leftNum}</text>`);

    // Front-Right
    parts.push(`<polygon points="${cx},${cy - s + 2 * dy} ${cx + s},${cy - s + dy} ${cx + s},${cy} ${cx},${cy + dy}" fill="${rightFill}" stroke="#315b48" stroke-width="2" stroke-linejoin="round"/>`);
    parts.push(`<text x="${cx + s / 2}" y="${cy + 5}" text-anchor="middle" font-size="16" font-weight="800" fill="#263f37">${rightNum}</text>`);

    return `<svg viewBox="0 0 ${w} ${h}" class="folded-cube-svg" role="img" aria-label="Folded 3D Cube showing opposite face alignment">${parts.join('')}</svg>`;
  }

  // ==========================================
  // Part 6: Symmetry & Mirror Flips (`symmetry`)
  // ==========================================
  const SYMMETRY_SHAPES = {
    equilateral_triangle: {
      name: 'Equilateral Triangle',
      linesCount: 3,
      clues: '3 equal sides, 3 equal angles (60°). Each line passes from a corner through the center to the opposite side midpoint.',
      lines: [
        { x1: 135, y1: 25, x2: 135, y2: 175, label: 'Vertical' },
        { x1: 50, y1: 155, x2: 185, y2: 80, label: 'Diagonal 1' },
        { x1: 220, y1: 155, x2: 85, y2: 80, label: 'Diagonal 2' }
      ],
      draw(options = {}) {
        const pts = [[135, 25], [220, 155], [50, 155]];
        return renderShapeWithMirrorLines(pts, options.showLines ? this.lines : [], options);
      }
    },
    isosceles_triangle: {
      name: 'Isosceles Triangle',
      linesCount: 1,
      clues: '2 equal sides. Exactly 1 vertical line of symmetry straight down through the top corner.',
      lines: [
        { x1: 135, y1: 25, x2: 135, y2: 165, label: 'Vertical mirror line' }
      ],
      draw(options = {}) {
        const pts = [[135, 25], [205, 165], [65, 165]];
        return renderShapeWithMirrorLines(pts, options.showLines ? this.lines : [], options);
      }
    },
    rectangle: {
      name: 'Rectangle',
      linesCount: 2,
      clues: '2 lines of symmetry (1 vertical through top/bottom midpoints, 1 horizontal through side midpoints). Diagonals are NOT lines of symmetry!',
      lines: [
        { x1: 135, y1: 30, x2: 135, y2: 160, label: 'Vertical' },
        { x1: 40, y1: 95, x2: 230, y2: 95, label: 'Horizontal' }
      ],
      draw(options = {}) {
        const pts = [[50, 45], [220, 45], [220, 145], [50, 145]];
        return renderShapeWithMirrorLines(pts, options.showLines ? this.lines : [], options);
      }
    },
    square: {
      name: 'Square',
      linesCount: 4,
      clues: '4 lines of symmetry: 1 vertical, 1 horizontal, and 2 diagonals from opposite corners.',
      lines: [
        { x1: 135, y1: 25, x2: 135, y2: 165, label: 'Vertical' },
        { x1: 65, y1: 95, x2: 205, y2: 95, label: 'Horizontal' },
        { x1: 75, y1: 35, x2: 195, y2: 155, label: 'Diagonal 1' },
        { x1: 195, y1: 35, x2: 75, y2: 155, label: 'Diagonal 2' }
      ],
      draw(options = {}) {
        const pts = [[75, 35], [195, 35], [195, 155], [75, 155]];
        return renderShapeWithMirrorLines(pts, options.showLines ? this.lines : [], options);
      }
    },
    rhombus: {
      name: 'Rhombus',
      linesCount: 2,
      clues: '2 lines of symmetry, running along its two diagonals connecting opposite corners.',
      lines: [
        { x1: 135, y1: 25, x2: 135, y2: 165, label: 'Vertical diagonal' },
        { x1: 45, y1: 95, x2: 225, y2: 95, label: 'Horizontal diagonal' }
      ],
      draw(options = {}) {
        const pts = [[135, 25], [225, 95], [135, 165], [45, 95]];
        return renderShapeWithMirrorLines(pts, options.showLines ? this.lines : [], options);
      }
    },
    parallelogram: {
      name: 'Parallelogram',
      linesCount: 0,
      clues: '0 lines of symmetry! Folding along diagonals or side midpoints does not align the corners (it has rotational symmetry, but NO reflection symmetry!).',
      lines: [],
      draw(options = {}) {
        const pts = [[90, 45], [225, 45], [180, 145], [45, 145]];
        return renderShapeWithMirrorLines(pts, options.showLines ? this.lines : [], options);
      }
    },
    regular_pentagon: {
      name: 'Regular Pentagon',
      linesCount: 5,
      clues: '5 lines of symmetry: from each of the 5 corners through the center to the opposite edge midpoint.',
      lines: [
        { x1: 135, y1: 25, x2: 135, y2: 165, label: 'Line 1' },
        { x1: 215, y1: 75, x2: 65, y2: 145, label: 'Line 2' },
        { x1: 185, y1: 165, x2: 90, y2: 45, label: 'Line 3' },
        { x1: 85, y1: 165, x2: 180, y2: 45, label: 'Line 4' },
        { x1: 55, y1: 75, x2: 205, y2: 145, label: 'Line 5' }
      ],
      draw(options = {}) {
        const pts = [[135, 30], [210, 85], [182, 160], [88, 160], [60, 85]];
        return renderShapeWithMirrorLines(pts, options.showLines ? this.lines : [], options);
      }
    },
    regular_hexagon: {
      name: 'Regular Hexagon',
      linesCount: 6,
      clues: '6 lines of symmetry: 3 connecting opposite corners and 3 connecting opposite side midpoints.',
      lines: [
        { x1: 135, y1: 25, x2: 135, y2: 165, label: 'Corner-Corner 1' },
        { x1: 65, y1: 55, x2: 205, y2: 135, label: 'Corner-Corner 2' },
        { x1: 65, y1: 135, x2: 205, y2: 55, label: 'Corner-Corner 3' },
        { x1: 100, y1: 30, x2: 170, y2: 160, label: 'Mid-Mid 1' },
        { x1: 170, y1: 30, x2: 100, y2: 160, label: 'Mid-Mid 2' },
        { x1: 50, y1: 95, x2: 220, y2: 95, label: 'Mid-Mid 3' }
      ],
      draw(options = {}) {
        const pts = [[100, 35], [170, 35], [205, 95], [170, 155], [100, 155], [65, 95]];
        return renderShapeWithMirrorLines(pts, options.showLines ? this.lines : [], options);
      }
    }
  };

  function renderShapeWithMirrorLines(pts, lines = [], options = {}) {
    const w = 270, h = 190;
    const parts = [];

    // Polygon
    parts.push(`<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="#fdfcf5" stroke="#315b48" stroke-width="2.5" stroke-linejoin="round"/>`);

    // Dashed mirror lines
    const lineColors = ['#9d4edd', '#e2725b', '#2865af', '#388e3c', '#d97706', '#ec4899'];
    lines.forEach((l, i) => {
      const color = lineColors[i % lineColors.length];
      parts.push(`<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${color}" stroke-width="2" stroke-dasharray="5 4"/>`);
    });

    return `<svg viewBox="0 0 ${w} ${h}" class="symmetry-svg" role="img" aria-label="2D shape for symmetry investigation">${parts.join('')}</svg>`;
  }

  function renderGridReflectionSvg(pCol, pRow, mirrorCol = 5, options = {}) {
    const { showReflection = false, showDistanceArrows = false, shape = 'point' } = options;
    const cellSize = 25;
    const W = 11 * cellSize + 20;
    const H = 7 * cellSize + 20;
    const ox = 15, oy = 15;

    const parts = [];

    // Grid lines
    for (let c = 0; c <= 10; c++) {
      const x = ox + c * cellSize;
      parts.push(`<line x1="${x}" y1="${oy}" x2="${x}" y2="${oy + 6 * cellSize}" stroke="#e0e5d9" stroke-width="1"/>`);
      parts.push(`<text x="${x}" y="${oy + 6 * cellSize + 15}" font-size="9" text-anchor="middle" fill="#66746a">${c}</text>`);
    }
    for (let r = 0; r <= 6; r++) {
      const y = oy + r * cellSize;
      parts.push(`<line x1="${ox}" y1="${y}" x2="${ox + 10 * cellSize}" y2="${y}" stroke="#e0e5d9" stroke-width="1"/>`);
      parts.push(`<text x="${ox - 8}" y="${y + 3}" font-size="9" text-anchor="end" fill="#66746a">${r}</text>`);
    }

    // Mirror line at mirrorCol
    const mx = ox + mirrorCol * cellSize;
    parts.push(`<line x1="${mx}" y1="${oy - 8}" x2="${mx}" y2="${oy + 6 * cellSize + 8}" stroke="#8057af" stroke-width="3" stroke-dasharray="6 4"/>`);
    parts.push(`<text x="${mx}" y="${oy - 10}" font-size="11" font-weight="700" fill="#8057af" text-anchor="middle">🪞 Mirror Line (x = ${mirrorCol})</text>`);

    // Original Point P
    const px = ox + pCol * cellSize;
    const py = oy + pRow * cellSize;
    const dist = mirrorCol - pCol;
    const reflCol = mirrorCol + dist;
    const rpx = ox + reflCol * cellSize;

    if (shape === 'triangle') {
      // Small triangle with apex at P
      const tPts = [[px, py], [px - cellSize, py + cellSize], [px, py + cellSize]];
      parts.push(`<polygon points="${tPts.map(p => p.join(',')).join(' ')}" fill="#fdf0c2" stroke="#b0811e" stroke-width="2"/>`);
      if (showReflection) {
        const rtPts = [[rpx, py], [rpx + cellSize, py + cellSize], [rpx, py + cellSize]];
        parts.push(`<polygon points="${rtPts.map(p => p.join(',')).join(' ')}" fill="#d5ebd0" stroke="#315b48" stroke-width="2"/>`);
      }
    } else {
      parts.push(`<circle cx="${px}" cy="${py}" r="7" fill="#2865af" stroke="#1d4375" stroke-width="2"/>`);
      parts.push(`<text x="${px}" y="${py - 10}" font-size="11" font-weight="700" fill="#2865af" text-anchor="middle">Point P</text>`);
      if (showReflection) {
        parts.push(`<circle cx="${rpx}" cy="${py}" r="7" fill="#315b48" stroke="#1e382c" stroke-width="2"/>`);
        parts.push(`<text x="${rpx}" y="${py - 10}" font-size="11" font-weight="700" fill="#315b48" text-anchor="middle">P′ (Reflection)</text>`);
      }
    }

    if (showDistanceArrows) {
      // Arrow from P to mirror line
      parts.push(`<line x1="${px + 8}" y1="${py}" x2="${mx - 3}" y2="${py}" stroke="#2865af" stroke-width="2"/>`);
      parts.push(`<text x="${(px + mx) / 2}" y="${py - 5}" font-size="10" font-weight="700" fill="#2865af" text-anchor="middle">${dist} units</text>`);

      if (showReflection) {
        // Arrow from mirror line to P'
        parts.push(`<line x1="${mx + 3}" y1="${py}" x2="${rpx - 8}" y2="${py}" stroke="#315b48" stroke-width="2"/>`);
        parts.push(`<text x="${(mx + rpx) / 2}" y="${py - 5}" font-size="10" font-weight="700" fill="#315b48" text-anchor="middle">${dist} units</text>`);
      }
    }

    return `<svg viewBox="0 0 ${W} ${H}" class="grid-reflection-svg" role="img" aria-label="Grid mirror reflection">${parts.join('')}</svg>`;
  }

  // ==========================================
  // Part 7: Unified Problem Generator (`generate`)
  // ==========================================
  function generate(kind, level = 'easy') {
    const isEasy = level === 'easy';
    const isLarge = level === 'large';

    // ----------------------------------------
    // TOPIC: `quads` (2D Polygon Detective)
    // ----------------------------------------
    if (kind === 'quads') {
      const shapeKeys = isEasy
        ? ['square', 'rectangle', 'parallelogram', 'right_trapezoid', 'isosceles_trapezoid']
        : ['square', 'rectangle', 'rhombus', 'parallelogram', 'right_trapezoid', 'isosceles_trapezoid', 'kite'];
      const chosenKey = pick(shapeKeys);
      const s = QUAD_SHAPES[chosenKey];

      if (isLarge && Math.random() < 0.5) {
        // Hierarchy & Multi-family question
        const isSq = Math.random() < 0.5;
        const target = isSq ? QUAD_SHAPES.square : QUAD_SHAPES.rhombus;
        return {
          kind: 'quads',
          level,
          caption: '2D POLYGON DETECTIVE',
          icon: '🔷',
          title: 'Shape families & special properties',
          badge: 'Compare shape definitions',
          targetKey: target.key,
          shape: target,
          isHierarchy: true,
          story: `Look at this <strong>${target.name}</strong>. In geometry, shapes can belong to more than one family when they share the same rules!`,
          storyVisual: renderQuadSvg(target, { showParallel: true, showRightAngles: true, showEqualTicks: true }),
          answers: [
            { type: 'number', label: 'Pairs of parallel sides', value: target.parallelPairs },
            { type: 'number', label: 'Right angles (90°)', value: target.rightAngles },
            {
              type: 'choice',
              label: isSq ? 'Is every square also a rectangle?' : 'Is every rhombus also a parallelogram?',
              options: isSq
                ? ['Yes (it has 4 right angles and parallel opposite sides)', 'No (all 4 sides must be different lengths)']
                : ['Yes (opposite sides are parallel and equal)', 'No (angles must be 90°)'],
              value: isSq
                ? 'Yes (it has 4 right angles and parallel opposite sides)'
                : 'Yes (opposite sides are parallel and equal)'
            }
          ],
          hint: 'Remember: A rectangle only requires 4 right angles and parallel opposite sides. If all 4 sides happen to be equal too, it is STILL a rectangle (a square-shaped one!)'
        };
      }

      // Standard single quadrilateral detective problem
      const answers = [
        { type: 'number', label: 'Pairs of parallel sides', value: s.parallelPairs },
        { type: 'number', label: 'Right angles (90° square corners)', value: s.rightAngles }
      ];

      if (!isEasy) {
        const shapeOptions = ['Square', 'Rectangle', 'Rhombus', 'Parallelogram', 'Trapezoid', 'Kite'];
        answers.push({
          type: 'choice',
          label: 'What is this quadrilateral called?',
          options: shapeOptions,
          value: s.family
        });
      }

      return {
        kind: 'quads',
        level,
        caption: '2D POLYGON DETECTIVE',
        icon: '🔷',
        title: 'Right angles, parallel lines, and equal sides',
        badge: 'Count parallel pairs & square corners',
        targetKey: s.key,
        shape: s,
        story: `Detective alert! Inspect this quadrilateral. Trace its sides and check its corners. How many <strong>pairs of parallel sides</strong> and how many <strong>right angles (90°)</strong> does it have?`,
        storyVisual: renderQuadSvg(s, { labels: ['A', 'B', 'C', 'D'] }),
        answers,
        hint: 'Parallel lines run like train tracks and never cross. Right angles are square corners like the corner of a book (90°).'
      };
    }

    // ----------------------------------------
    // TOPIC: `views` (3D Cube Block Views)
    // ----------------------------------------
    if (kind === 'views') {
      const presets = VIEW_PRESETS[level] || VIEW_PRESETS.easy;
      const preset = pick(presets);
      const grid = preset.grid;
      const stats = computeStackStats(grid);

      const answers = [
        { type: 'number', label: 'Total unit cubes in the stack', value: stats.totalCubes },
        { type: 'number', label: 'Squares visible in the Front view', value: stats.frontSquares }
      ];

      if (!isEasy) {
        if (isLarge) {
          answers.push({ type: 'number', label: 'Squares visible in the Right-Side view', value: stats.sideSquares });
        } else {
          answers.push({ type: 'number', label: 'Squares visible in the Top view', value: stats.topSquares });
        }
      }

      return {
        kind: 'views',
        level,
        caption: 'BLOCK VIEWS',
        icon: '🧱',
        title: 'Front, top, and side views of unit cubes',
        badge: 'Three-view projection (三视图)',
        presetName: preset.name,
        grid,
        stats,
        story: `A builder stacked unit cubes into this <strong>${preset.name}</strong> structure. Can you find the total number of cubes, and how many squares you see when looking straight from the <strong>Front</strong>?`,
        storyVisual: renderIsometricStack(grid, { showArrows: true }),
        answers,
        hint: 'For the Front view, find the tallest tower in each column. For total cubes, add up the heights of all the stacks (including cubes hidden underneath!).'
      };
    }

    // ----------------------------------------
    // TOPIC: `nets` (Unfold the Solid)
    // ----------------------------------------
    if (kind === 'nets') {
      const tmpl = pick(CUBE_NET_TEMPLATES);
      // Map template indices 1..6 to unique shuffled numbers 1..6
      const perm = shuffle([1, 2, 3, 4, 5, 6]);
      const faceNumbers = {};
      for (let i = 1; i <= 6; i++) {
        faceNumbers[i] = perm[i - 1];
      }

      // Map opposite pairs to actual face numbers
      const mappedPairs = tmpl.oppositePairs.map(([t1, t2]) => [faceNumbers[t1], faceNumbers[t2]]);

      // Pick target pair for questions
      const targetPair = pick(mappedPairs);
      const [faceA, faceB] = Math.random() < 0.5 ? [targetPair[0], targetPair[1]] : [targetPair[1], targetPair[0]];

      // Remaining pair for second question
      const otherPair = mappedPairs.find(p => p !== targetPair);
      const [faceC, faceD] = Math.random() < 0.5 ? [otherPair[0], otherPair[1]] : [otherPair[1], otherPair[0]];

      const answers = [
        { type: 'number', label: `Which face is opposite Face ${faceA}?`, value: faceB }
      ];

      if (!isEasy) {
        answers.push({ type: 'number', label: `Which face is opposite Face ${faceC}?`, value: faceD });
      }

      if (isLarge) {
        answers.push({
          type: 'number',
          label: `If Face ${faceA} is on the BOTTOM, which face is on the TOP?`,
          value: faceB
        });
      }

      return {
        kind: 'nets',
        level,
        caption: 'UNFOLD THE SOLID',
        icon: '📦',
        title: 'Flat nets that fold into 3D shapes',
        badge: 'Opposite faces in a cube net',
        template: tmpl,
        faceNumbers,
        mappedPairs,
        faceA,
        faceB,
        faceC,
        faceD,
        story: `This flat net folds into a 3D cube with 6 numbered faces. When folded up into a solid cube, <strong>which face is directly opposite Face ${faceA}</strong>?`,
        storyVisual: renderNetSvg(tmpl.cells, faceNumbers),
        answers,
        hint: 'Skip-one rule: In a straight line of 3 or 4 squares, skip one square in between to find opposite faces!'
      };
    }

    // ----------------------------------------
    // TOPIC: `symmetry` (Symmetry & Grid Reflections)
    // ----------------------------------------
    if (kind === 'symmetry') {
      const mode = Math.random() < 0.5 ? 'shape' : 'grid';

      if (mode === 'shape') {
        const shapeKeys = isEasy
          ? ['square', 'rectangle', 'equilateral_triangle', 'isosceles_triangle']
          : ['parallelogram', 'rhombus', 'regular_pentagon', 'regular_hexagon'];
        const chosenKey = pick(shapeKeys);
        const s = SYMMETRY_SHAPES[chosenKey];

        const answers = [
          { type: 'number', label: `Lines of symmetry in a ${s.name}`, value: s.linesCount }
        ];

        if (isLarge) {
          const other = SYMMETRY_SHAPES.parallelogram;
          answers.push({
            type: 'number',
            label: 'Lines of symmetry in a Parallelogram',
            value: other.linesCount
          });
        }

        return {
          kind: 'symmetry',
          level,
          subMode: 'shape',
          shapeKey: chosenKey,
          shape: s,
          caption: 'MIRROR & GRID',
          icon: '🦋',
          title: 'Lines of symmetry and mirror flips',
          badge: 'Folding symmetry (轴对称)',
          story: `Look at this <strong>${s.name}</strong>. A line of symmetry divides a shape into two matching halves that fold right on top of each other. How many lines of symmetry does it have?`,
          storyVisual: s.draw({ showLines: false }),
          answers,
          hint: s.clues
        };
      } else {
        // Grid reflection mode
        const pCol = rand(1, 4);
        const pRow = rand(1, 5);
        const mirrorCol = 5;
        const dist = mirrorCol - pCol;
        const reflCol = mirrorCol + dist;
        const isTriangle = isLarge;

        const answers = [
          { type: 'number', label: 'Distance from Point P to the mirror line (units)', value: dist },
          { type: 'number', label: 'Grid column where the reflection P′ lands', value: reflCol }
        ];

        return {
          kind: 'symmetry',
          level,
          subMode: 'grid',
          pCol,
          pRow,
          mirrorCol,
          dist,
          reflCol,
          isTriangle,
          caption: 'MIRROR & GRID',
          icon: '🦋',
          title: 'Lines of symmetry and mirror flips',
          badge: 'Grid mirror reflection',
          story: `Point P is located at <strong>column ${pCol}</strong> on the grid. It is reflected across the purple mirror line at <strong>column ${mirrorCol}</strong>. How far is it from the mirror, and where does its reflection land?`,
          storyVisual: renderGridReflectionSvg(pCol, pRow, mirrorCol, { showReflection: false, showDistanceArrows: false, shape: isTriangle ? 'triangle' : 'point' }),
          answers,
          hint: 'The mirror reflection lands on the other side at the EXACT same distance from the mirror line!'
        };
      }
    }

    throw new Error('Unknown problem kind: ' + kind);
  }

  // ==========================================
  // Part 8: Step-by-Step Visual Explanations (`stepsFor`)
  // ==========================================
  function stepsFor(p) {
    if (!p || !p.kind) return [];

    // ----------------------------------------
    // STEPS: `quads`
    // ----------------------------------------
    if (p.kind === 'quads') {
      const s = p.shape;
      return [
        {
          description: `Look at the 4-sided polygon (quadrilateral) with vertices A, B, C, D. Let's inspect its sides and corners step-by-step.`,
          diagram: renderQuadSvg(s, { labels: ['A', 'B', 'C', 'D'] }),
          equation: `Quadrilateral with 4 sides and 4 vertices`
        },
        {
          description: `First, check for parallel sides. Parallel lines point in the same direction like train tracks and never cross. This shape has <strong>${s.parallelPairs} pair${s.parallelPairs === 1 ? '' : 's'} of parallel sides</strong> (marked with colored arrows).`,
          diagram: renderQuadSvg(s, { showParallel: true, labels: ['A', 'B', 'C', 'D'] }),
          equation: `${s.parallelPairs} pair${s.parallelPairs === 1 ? '' : 's'} of parallel sides`
        },
        {
          description: `Next, test each corner for a right angle (90° square corner). Look for where sides meet straight like the corner of a book. This shape has <strong>${s.rightAngles} right angle${s.rightAngles === 1 ? '' : 's'}</strong> (marked with square corner symbols).`,
          diagram: renderQuadSvg(s, { showParallel: true, showRightAngles: true, labels: ['A', 'B', 'C', 'D'] }),
          equation: `${s.rightAngles} right angle${s.rightAngles === 1 ? '' : 's'} (90°)`
        },
        {
          description: `Finally, check side lengths. ${s.equalSides}. Putting all clues together, this shape is a <strong>${s.name}</strong> (${s.clues[s.clues.length - 1]}).`,
          diagram: renderQuadSvg(s, { showParallel: true, showRightAngles: true, showEqualTicks: true, labels: ['A', 'B', 'C', 'D'] }),
          equation: `${s.name} = ${s.parallelPairs} parallel pair${s.parallelPairs === 1 ? '' : 's'} + ${s.rightAngles} right angle${s.rightAngles === 1 ? '' : 's'}`
        }
      ];
    }

    // ----------------------------------------
    // STEPS: `views`
    // ----------------------------------------
    if (p.kind === 'views') {
      const { grid, stats } = p;
      return [
        {
          description: `Here is the 3D block stack. It is built on a base grid with unit cubes stacked in columns.`,
          diagram: renderIsometricStack(grid, { showArrows: true }),
          equation: `Structure: ${stats.R} rows × ${stats.C} columns`
        },
        {
          description: `<strong>Top View (俯视图):</strong> Look straight down from the ceiling. Every grid cell with at least 1 cube shows one square. There are <strong>${stats.topSquares} squares</strong> visible from above.`,
          diagram: `<div class="views-split">${renderIsometricStack(grid, { highlight: 'top', showArrows: false })}${renderTopViewFlat(grid)}</div>`,
          equation: `Top view = ${stats.topSquares} squares`
        },
        {
          description: `<strong>Front View (正视图):</strong> Look straight at the front. For each column, you only see the tallest stack in that column: heights are [${stats.frontHeights.join(', ')}]. Adding them gives <strong>${stats.frontSquares} squares</strong> visible in front!`,
          diagram: `<div class="views-split">${renderIsometricStack(grid, { highlight: 'front', showArrows: false })}${render2DViewGrid('Front View', stats.C, 3, stats.frontHeights, '#5891d9', `${stats.frontSquares} squares`)}</div>`,
          equation: `${stats.frontHeights.join(' + ')} = ${stats.frontSquares} front squares`
        },
        {
          description: `<strong>Total Unit Cubes:</strong> Count the heights of all columns. Cubes on top are supported by hidden cubes underneath! Total unit cubes = <strong>${stats.totalCubes} cubes</strong>.`,
          diagram: renderIsometricStack(grid, { showArrows: true }),
          equation: `Total = ${stats.totalCubes} unit cubes`
        }
      ];
    }

    // ----------------------------------------
    // STEPS: `nets`
    // ----------------------------------------
    if (p.kind === 'nets') {
      const tmpl = p.template;
      const faceNums = p.faceNumbers;
      const [pair1, pair2, pair3] = p.mappedPairs;

      const colors = {
        [pair1[0]]: '#f8ddc9', [pair1[1]]: '#f8ddc9',
        [pair2[0]]: '#d4e4c5', [pair2[1]]: '#d4e4c5',
        [pair3[0]]: '#e6dcf2', [pair3[1]]: '#e6dcf2'
      };

      return [
        {
          description: `This unfolded 2D net has 6 numbered squares that fold into a 3D cube. Let's find which faces fold directly opposite each other.`,
          diagram: renderNetSvg(tmpl.cells, faceNums),
          equation: `6 square faces fold into 1 cube`
        },
        {
          description: `<strong>Opposite Pair 1 (Peach):</strong> Using the "skip-one-square" rule: in a straight line, faces separated by one square fold opposite each other. Here, <strong>Face ${pair1[0]}</strong> is opposite <strong>Face ${pair1[1]}</strong>!`,
          diagram: renderNetSvg(tmpl.cells, faceNums, pair1, { [pair1[0]]: '#f8ddc9', [pair1[1]]: '#f8ddc9' }),
          equation: `Face ${pair1[0]} ⟷ Face ${pair1[1]} (opposite)`
        },
        {
          description: `<strong>Opposite Pair 2 (Green):</strong> Next, find the second opposite pair: <strong>Face ${pair2[0]}</strong> folds directly opposite <strong>Face ${pair2[1]}</strong>!`,
          diagram: renderNetSvg(tmpl.cells, faceNums, pair2, { [pair1[0]]: '#f8ddc9', [pair1[1]]: '#f8ddc9', [pair2[0]]: '#d4e4c5', [pair2[1]]: '#d4e4c5' }),
          equation: `Face ${pair2[0]} ⟷ Face ${pair2[1]} (opposite)`
        },
        {
          description: `<strong>Opposite Pair 3 (Lilac):</strong> The remaining two squares, <strong>Face ${pair3[0]}</strong> and <strong>Face ${pair3[1]}</strong>, fold to meet on opposite sides! See the folded 3D cube alongside the flat net.`,
          diagram: `<div class="nets-split">${renderNetSvg(tmpl.cells, faceNums, null, colors)}${renderFoldedCubeSvg({ top: { num: pair1[0], color: '#f8ddc9' }, left: { num: pair2[0], color: '#d4e4c5' }, right: { num: pair3[0], color: '#e6dcf2' } })}</div>`,
          equation: `Pair 1: ${pair1[0]}⟷${pair1[1]} · Pair 2: ${pair2[0]}⟷${pair2[1]} · Pair 3: ${pair3[0]}⟷${pair3[1]}`
        }
      ];
    }

    // ----------------------------------------
    // STEPS: `symmetry`
    // ----------------------------------------
    if (p.kind === 'symmetry') {
      if (p.subMode === 'shape') {
        const s = p.shape;
        return [
          {
            description: `Here is the ${s.name}. To find lines of symmetry, imagine folding the shape along a straight crease so both halves match exactly.`,
            diagram: s.draw({ showLines: false }),
            equation: `Shape: ${s.name}`
          },
          {
            description: s.linesCount > 0
              ? `Draw the first line of symmetry. Notice that every point on the left flips right onto its matching point on the right!`
              : `Try folding along the diagonal or side midpoints. The corners do NOT align! A parallelogram has 0 lines of symmetry.`,
            diagram: s.draw({ showLines: s.linesCount > 0 }),
            equation: s.linesCount > 0 ? `Lines of symmetry = ${s.linesCount}` : `0 lines of symmetry`
          },
          {
            description: `Summary: ${s.clues}`,
            diagram: s.draw({ showLines: true }),
            equation: `${s.name}: ${s.linesCount} line${s.linesCount === 1 ? '' : 's'} of symmetry`
          }
        ];
      } else {
        // Grid reflection steps
        const { pCol, pRow, mirrorCol, dist, reflCol, isTriangle } = p;
        return [
          {
            description: `Point P is located at <strong>column ${pCol}</strong>. The vertical mirror line is at <strong>column ${mirrorCol}</strong>.`,
            diagram: renderGridReflectionSvg(pCol, pRow, mirrorCol, { showReflection: false, showDistanceArrows: false, shape: isTriangle ? 'triangle' : 'point' }),
            equation: `P at col ${pCol} · Mirror at col ${mirrorCol}`
          },
          {
            description: `Count the horizontal grid steps from Point P to the mirror line: <strong>${mirrorCol} - ${pCol} = ${dist} grid units</strong>.`,
            diagram: renderGridReflectionSvg(pCol, pRow, mirrorCol, { showReflection: false, showDistanceArrows: true, shape: isTriangle ? 'triangle' : 'point' }),
            equation: `Distance to mirror = ${dist} units`
          },
          {
            description: `The reflection P′ must land on the opposite side at the EXACT same distance: <strong>${mirrorCol} + ${dist} = column ${reflCol}</strong>!`,
            diagram: renderGridReflectionSvg(pCol, pRow, mirrorCol, { showReflection: true, showDistanceArrows: true, shape: isTriangle ? 'triangle' : 'point' }),
            equation: `Reflected column = ${mirrorCol} + ${dist} = ${reflCol}`
          }
        ];
      }
    }

    return [];
  }

  // ==========================================
  // Part 9: Exports
  // ==========================================
  const GeometryModel = {
    bases,
    build,
    rotate,
    average,
    subtract,
    dot,
    cross,
    generate,
    stepsFor,
    // Export sub-components for testing/custom use
    QUAD_SHAPES,
    VIEW_PRESETS,
    CUBE_NET_TEMPLATES,
    SYMMETRY_SHAPES,
    renderQuadSvg,
    renderIsometricStack,
    renderNetSvg,
    renderGridReflectionSvg
  };

  root.GeometryModel = GeometryModel;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeometryModel;
  }
})(typeof window === 'undefined' ? globalThis : window);
