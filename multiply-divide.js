(() => {
  'use strict';

  // Environment check
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  const $ = id => isBrowser ? document.getElementById(id) : null;

  // ---------- Topics Configuration ----------
  const topics = {
    splitArray: {
      caption: 'BREAK-APART ARRAY',
      icon: '🟦',
      title: 'Split a big grid into friendly pieces',
      badge: 'Cut into friendly pieces'
    },
    boxMult: {
      caption: 'BOX MULTIPLICATION',
      icon: '📦',
      title: 'Four rooms in one big rectangle',
      badge: 'Tens and ones in 4 rooms'
    },
    remainders: {
      caption: 'LEFTOVERS MATTER',
      icon: '🚣',
      title: 'What do we do with the remainder?',
      badge: 'Boats, ribbons & max remainder'
    },
    cycles: {
      caption: 'REPEATING PATTERNS',
      icon: '🏮',
      title: 'Around and around the cycle',
      badge: 'Full cycles and leftover items'
    },
    cryptarithm: {
      caption: 'HIDDEN DIGITS',
      icon: '🕵️',
      title: 'Crack the vertical math code',
      badge: 'Deduce ones then tens'
    }
  };

  // ---------- Math & Random Helpers ----------
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = list => list[rand(0, list.length - 1)];
  const fmt = n => n.toLocaleString('en-US');

  // Themes for Cycles
  const CYCLE_THEMES = [
    { name: 'lanterns', icons: ['🏮', '🔴', '🟡', '🔵', '🟢'], target: '🔴', targetName: 'red lanterns' },
    { name: 'sky charms', icons: ['⭐', '⭐', '🌙', '☀️'], target: '⭐', targetName: 'stars' },
    { name: 'jeweled beads', icons: ['💎', '🔮', '✨', '💍'], target: '💎', targetName: 'diamonds' },
    { name: 'garden tiles', icons: ['🌸', '🌻', '🍀', '🍄'], target: '🌸', targetName: 'blossoms' },
    { name: 'fruit stickers', icons: ['🍎', '🍌', '🍇', '🍊'], target: '🍎', targetName: 'apples' }
  ];

  // ---------- Problem Generator ----------
  function generate(kind, difficulty = 'easy') {
    const p = { kind, difficulty };

    // 1. splitArray — Break-Apart Array (Distributive Property)
    if (kind === 'splitArray') {
      let r, c, c1, c2;
      if (difficulty === 'easy') {
        r = rand(6, 9);
        c = rand(6, 9);
        c1 = 5;
        c2 = c - c1;
      } else if (difficulty === 'medium') {
        r = rand(6, 9);
        c = rand(11, 16);
        c1 = 10;
        c2 = c - c1;
      } else {
        r = rand(11, 15);
        c = rand(12, 18);
        c1 = 10;
        c2 = c - c1;
      }
      const part1 = r * c1;
      const part2 = r * c2;
      const total = r * c;

      p.r = r;
      p.c = c;
      p.c1 = c1;
      p.c2 = c2;
      p.part1 = part1;
      p.part2 = part2;
      p.total = total;

      p.story = `You are building a rectangular tile mosaic with <strong>${r} rows</strong> and <strong>${c} columns</strong> (${r} × ${c}). To make multiplying friendly, split the ${c} columns into <strong>${c1} columns</strong> on the left and <strong>${c2} columns</strong> on the right.`;
      p.answers = [
        { label: `Left piece (${r} × ${c1})`, value: part1 },
        { label: `Right piece (${r} × ${c2})`, value: part2 },
        { label: `Total grid (${r} × ${c})`, value: total }
      ];
      p.hint = `Multiply the rows by the first column part: ${r} × ${c1} = ${part1}. Then multiply by the second column part: ${r} × ${c2} = ${part2}. Finally, add the two friendly pieces together (${part1} + ${part2}).`;
    }

    // 2. boxMult — 2-Digit × 2-Digit Area Box Model
    else if (kind === 'boxMult') {
      let T1, O1, T2, O2;
      if (difficulty === 'easy') {
        T1 = 10;
        O1 = rand(2, 6);
        T2 = 10;
        O2 = rand(2, 6);
      } else if (difficulty === 'medium') {
        T1 = pick([20, 30]);
        O1 = rand(2, 6);
        T2 = pick([10, 20]);
        O2 = rand(3, 7);
      } else {
        T1 = pick([40, 50, 60]);
        O1 = rand(3, 8);
        T2 = pick([30, 40]);
        O2 = rand(4, 9);
      }

      const num1 = T1 + O1;
      const num2 = T2 + O2;
      const p1 = T1 * T2; // Top-left (Tens × Tens)
      const p2 = O1 * T2; // Top-right (Ones × Tens)
      const p3 = T1 * O2; // Bottom-left (Tens × Ones)
      const p4 = O1 * O2; // Bottom-right (Ones × Ones)
      const total = num1 * num2;

      p.T1 = T1; p.O1 = O1;
      p.T2 = T2; p.O2 = O2;
      p.num1 = num1; p.num2 = num2;
      p.p1 = p1; p.p2 = p2; p.p3 = p3; p.p4 = p4;
      p.total = total;

      p.story = `Multiply <strong>${num1} × ${num2}</strong> by breaking each number into tens and ones: <strong>${num1} = ${T1} + ${O1}</strong> and <strong>${num2} = ${T2} + ${O2}</strong>. The 2×2 box splits the multiplication into four rooms.`;
      p.answers = [
        { label: `Top-left room (${T1} × ${T2})`, value: p1 },
        { label: `Bottom-right room (${O1} × ${O2})`, value: p4 },
        { label: `Total product (${num1} × ${num2})`, value: total }
      ];
      p.hint = `Calculate the tens-tens room: ${T1} × ${T2} = ${p1}. Calculate the ones-ones room: ${O1} × ${O2} = ${p4}. Add all four rooms (${p1} + ${p2} + ${p3} + ${p4}) to find the total product.`;
    }

    // 3. remainders — Division with Remainders: Round Up, Round Down & Max Remainder
    else if (kind === 'remainders') {
      const variant = pick(['roundUp', 'roundDown', 'reverseRemainder']);
      p.variant = variant;

      if (variant === 'roundUp') {
        let k, q;
        if (difficulty === 'easy') {
          k = rand(3, 5); q = rand(3, 6);
        } else if (difficulty === 'medium') {
          k = rand(5, 8); q = rand(6, 12);
        } else {
          k = rand(7, 12); q = rand(14, 25);
        }
        const r = rand(1, k - 1);
        const N = q * k + r;
        p.k = k; p.q = q; p.r = r; p.N = N;

        p.story = `A class of <strong>${N} children</strong> are going boating on the lake. Each boat safely holds at most <strong>${k} children</strong>. How many children are left over after filling complete boats? How many boats are needed so that <strong>every single child</strong> gets to ride?`;
        p.answers = [
          { label: 'Leftover children', value: r },
          { label: 'Boats needed so everyone rides', value: q + 1 }
        ];
        p.hint = `Divide ${N} ÷ ${k} = ${q} with a remainder of ${r}. The ${q} boats are full, but the ${r} leftover children still need a boat to ride! Round up: ${q} + 1 = ${q + 1} boats.`;
      } else if (variant === 'roundDown') {
        let k, q;
        if (difficulty === 'easy') {
          k = rand(3, 5); q = rand(3, 7);
        } else if (difficulty === 'medium') {
          k = rand(6, 9); q = rand(7, 14);
        } else {
          k = rand(8, 15); q = rand(15, 30);
        }
        const r = rand(1, k - 1);
        const N = q * k + r;
        p.k = k; p.q = q; p.r = r; p.N = N;

        p.story = `You have a spool of <strong>${N} meters of craft ribbon</strong>. Making one complete prize bow requires <strong>${k} meters</strong> of ribbon. How many full bows can you make? How many meters of ribbon will be left over?`;
        p.answers = [
          { label: 'Full bows you can make', value: q },
          { label: 'Meters of ribbon left over', value: r }
        ];
        p.hint = `Divide ${N} ÷ ${k} = ${q} with a remainder of ${r}. You can make ${q} full bows. The remaining ${r} meters is not enough to make another bow, so round down (去尾法)!`;
      } else {
        // reverseRemainder
        let d, q;
        if (difficulty === 'easy') {
          d = rand(4, 7); q = rand(3, 9);
        } else if (difficulty === 'medium') {
          d = rand(6, 12); q = rand(10, 25);
        } else {
          d = rand(12, 25); q = rand(20, 45);
        }
        const rMax = d - 1;
        const dividendMax = q * d + rMax;
        p.d = d; p.q = q; p.rMax = rMax; p.dividendMax = dividendMax;

        p.story = `In the mystery division problem: <strong>□ ÷ ${d} = ${q} R ?</strong>, what is the <strong>largest possible remainder</strong>? When the remainder is at its largest, what was the <strong>starting number (dividend □)</strong>?`;
        p.answers = [
          { label: 'Largest possible remainder', value: rMax },
          { label: 'Largest starting number (dividend □)', value: dividendMax }
        ];
        p.hint = `The remainder must always be strictly less than the divisor (${d}). So the largest possible remainder is ${d} − 1 = ${rMax}. The starting number is ${q} × ${d} + ${rMax} = ${dividendMax}.`;
      }
    }

    // 4. cycles — Repeating Remainder Cycles (周期问题)
    else if (kind === 'cycles') {
      const theme = pick(CYCLE_THEMES);
      const pattern = [...theme.icons];
      const L = pattern.length;
      const target = theme.target;
      const targetName = theme.targetName;

      let q;
      if (difficulty === 'easy') {
        q = rand(3, 6);
      } else if (difficulty === 'medium') {
        q = rand(7, 14);
      } else {
        q = rand(16, 35);
      }
      const r = rand(1, L - 1);
      const N = q * L + r;

      const cOne = pattern.filter(x => x === target).length;
      const cR = pattern.slice(0, r).filter(x => x === target).length;
      const totalTarget = q * cOne + cR;

      p.theme = theme;
      p.pattern = pattern;
      p.L = L;
      p.target = target;
      p.targetName = targetName;
      p.q = q;
      p.r = r;
      p.N = N;
      p.cOne = cOne;
      p.cR = cR;
      p.totalTarget = totalTarget;

      p.story = `A repeating pattern of ${theme.name} repeats in a cycle of <strong>${L} items</strong>: <strong>${pattern.join(' ')}</strong>. If you place <strong>${N} items</strong> in a row following this pattern, how many <strong>full repeating cycles of ${L}</strong> are completed? How many <strong>${target} ${targetName}</strong> will there be altogether?`;
      p.answers = [
        { label: `Full cycles of ${L}`, value: q },
        { label: `Total ${target} ${targetName} in all ${N} items`, value: totalTarget }
      ];
      p.hint = `Divide total items by the cycle length: ${N} ÷ ${L} = ${q} R ${r}. That is ${q} full cycles and ${r} leftover items. Multiply full cycles by the count per cycle (${q} × ${cOne} = ${q * cOne}), then add the ${cR} in the leftover row!`;
    }

    // 5. cryptarithm — Missing Digit Puzzles (竖式谜)
    else if (kind === 'cryptarithm') {
      // Pick operation based on difficulty
      let opType;
      if (difficulty === 'easy') {
        opType = pick(['add', 'sub']);
      } else if (difficulty === 'medium') {
        opType = pick(['add', 'sub', 'mult']);
      } else {
        opType = pick(['mult', 'add3', 'sub']);
      }
      p.opType = opType;

      if (opType === 'add') {
        // Addition: ▲ A2 + B1 ★ = C1 C2
        const A2 = rand(4, 8);
        const C2 = rand(0, A2 - 1); // guarantees carry
        const star = 10 + C2 - A2; // 2..9
        const B1 = rand(1, 4);
        const C1 = rand(B1 + 2, 9);
        const tri = C1 - B1 - 1; // carry = 1

        p.A2 = A2; p.B1 = B1; p.C1 = C1; p.C2 = C2;
        p.star = star; p.tri = tri;
        p.topNum = `${tri}${A2}`;
        p.bottomNum = `${B1}${star}`;
        p.sum = `${C1}${C2}`;

        p.story = `Find the hidden digits <strong>★</strong> and <strong>▲</strong> in this vertical addition:<br><br>` +
          `<span style="font-family:monospace;font-size:18px;">&nbsp;&nbsp;▲&nbsp;${A2}<br>+&nbsp;${B1}&nbsp;★<br>----<br>&nbsp;&nbsp;${C1}&nbsp;${C2}</span>`;

        p.onesExplanation = `In the ones column: ${A2} + ★ ends in ${C2}. Since ${A2} + ★ ≥ ${A2}, the sum must be 1${C2}. So ★ = 1${C2} − ${A2} = ${star}, carrying 1 to the tens place.`;
        p.onesEquation = `${A2} + ${star} = 1${C2} \\implies ★ = ${star} \\text{ (carry 1)}`;
        p.tensExplanation = `In the tens column: ▲ + ${B1} + 1 (carry) = ${C1}. So ▲ = ${C1} − ${B1} − 1 = ${tri}.`;
        p.tensEquation = `${tri} + ${B1} + 1 = ${C1} \\implies ▲ = ${tri}`;
        p.fullEquation = `${tri}${A2} + ${B1}${star} = ${C1}${C2}`;
      } else if (opType === 'sub') {
        // Subtraction: A1 ★ − ▲ B2 = C1 C2
        const B2 = rand(5, 9);
        const star = rand(0, B2 - 1); // requires borrow
        const C2 = 10 + star - B2;
        const C1 = rand(1, 4);
        const tri = rand(1, 4);
        const A1 = C1 + tri + 1; // borrow gives (A1 - 1) - tri = C1

        p.A1 = A1; p.B2 = B2; p.C1 = C1; p.C2 = C2;
        p.star = star; p.tri = tri;
        p.topNum = `${A1}${star}`;
        p.bottomNum = `${tri}${B2}`;
        p.diff = `${C1}${C2}`;

        p.story = `Find the hidden digits <strong>★</strong> and <strong>▲</strong> in this vertical subtraction:<br><br>` +
          `<span style="font-family:monospace;font-size:18px;">&nbsp;&nbsp;${A1}&nbsp;★<br>−&nbsp;▲&nbsp;${B2}<br>----<br>&nbsp;&nbsp;${C1}&nbsp;${C2}</span>`;

        p.onesExplanation = `In the ones column: ★ − ${B2} = ${C2}. Since ★ < ${B2}, we must borrow 1 ten: 10 + ★ − ${B2} = ${C2} \\implies ★ = ${B2} + ${C2} − 10 = ${star}.`;
        p.onesEquation = `1${star} − ${B2} = ${C2} \\implies ★ = ${star} \\text{ (borrowed 1)}`;
        p.tensExplanation = `In the tens column: with the 1 borrowed, ${A1} becomes ${A1 - 1}. Then ${A1 - 1} − ▲ = ${C1} \\implies ▲ = ${A1 - 1} − ${C1} = ${tri}.`;
        p.tensEquation = `${A1 - 1} − ${tri} = ${C1} \\implies ▲ = ${tri}`;
        p.fullEquation = `${A1}${star} − ${tri}${B2} = ${C1}${C2}`;
      } else if (opType === 'add3') {
        // 3-digit addition: ▲ A2 + B1 ★ = 1 C1 C2
        const A2 = rand(4, 8);
        const C2 = rand(0, A2 - 1);
        const star = 10 + C2 - A2; // 2..9, carries 1
        const B1 = rand(5, 8);
        const tri = rand(5, 9); // always a single digit
        const sumTens = tri + B1 + 1; // carry 1 from ones => 11..18
        const C1 = sumTens - 10; // 1..8

        p.A2 = A2; p.B1 = B1; p.C1 = C1; p.C2 = C2;
        p.star = star; p.tri = tri;
        p.topNum = `${tri}${A2}`;
        p.bottomNum = `${B1}${star}`;
        p.sum = `1${C1}${C2}`;

        p.story = `Find the hidden digits <strong>★</strong> and <strong>▲</strong> in this vertical addition:<br><br>` +
          `<span style="font-family:monospace;font-size:18px;">&nbsp;&nbsp;&nbsp;▲&nbsp;${A2}<br>+&nbsp;&nbsp;${B1}&nbsp;★<br>-----<br>&nbsp;1&nbsp;${C1}&nbsp;${C2}</span>`;

        p.onesExplanation = `In the ones column: ${A2} + ★ ends in ${C2}. That means ${A2} + ★ = 1${C2}, so ★ = 1${C2} − ${A2} = ${star}, carrying 1 to tens.`;
        p.onesEquation = `${A2} + ${star} = 1${C2} \\implies ★ = ${star} \\text{ (carry 1)}`;
        p.tensExplanation = `In the tens column: ▲ + ${B1} + 1 = 1${C1}. So ▲ = 1${C1} − ${B1} − 1 = ${tri}.`;
        p.tensEquation = `${tri} + ${B1} + 1 = 1${C1} \\implies ▲ = ${tri}`;
        p.fullEquation = `${tri}${A2} + ${B1}${star} = 1${C1}${C2}`;
      } else {
        // Multiplication: ▲ ★ × K = P
        const K = pick([3, 7]);
        const star = rand(3, 9);
        const carry = Math.floor((star * K) / 10);
        const P2 = (star * K) % 10;
        const tri = K === 7 ? rand(1, 3) : rand(1, 4);
        const P1 = tri * K + carry;
        const product = (tri * 10 + star) * K;

        p.K = K; p.star = star; p.tri = tri; p.carry = carry;
        p.P1 = P1; p.P2 = P2; p.product = product;
        p.hundreds = Math.floor(product / 100);
        p.tens = Math.floor((product % 100) / 10);
        p.ones = product % 10;

        p.story = `Find the hidden digits <strong>★</strong> and <strong>▲</strong> in this vertical multiplication:<br><br>` +
          `<span style="font-family:monospace;font-size:18px;">&nbsp;&nbsp;▲&nbsp;★<br>×&nbsp;&nbsp;&nbsp;${K}<br>----<br>&nbsp;${P1}&nbsp;${P2}</span>`;

        p.onesExplanation = `In the ones column: ★ × ${K} ends in ${P2}. In the ${K} times table, the only digit that ends in ${P2} is ${star} (${star} × ${K} = ${star * K}). So ★ = ${star}, carrying ${carry} to tens.`;
        p.onesEquation = `${star} × ${K} = ${star * K} \\implies ★ = ${star} \\text{ (carry ${carry})}`;
        p.tensExplanation = `In the tens column: ▲ × ${K} + ${carry} = ${P1}. That means ▲ × ${K} = ${P1 - carry}, so ▲ = ${tri}.`;
        p.tensEquation = `${tri} × ${K} + ${carry} = ${P1} \\implies ▲ = ${tri}`;
        p.fullEquation = `${tri}${star} × ${K} = ${product}`;
      }

      p.answers = [
        { label: 'Digit for ★', value: p.star },
        { label: 'Digit for ▲', value: p.tri }
      ];
      p.hint = 'Start in the ones column first! Watch out for carries or borrows, then use that to find the tens digit ▲.';
    }

    else {
      throw new Error('Unknown problem kind: ' + kind);
    }

    return p;
  }

  // ---------- Visual Rendering Helpers ----------

  /** Render Break-Apart Array SVG */
  function renderArraySvg(p, mode) {
    const { r, c, c1, c2, part1, part2, total } = p;
    const vbW = 440;
    const vbH = 210;
    const padX = 35;
    const padY = 35;
    const usableW = vbW - padX * 2;
    const usableH = vbH - padY * 2;

    const cellW = usableW / c;
    const cellH = usableH / r;
    const w1 = c1 * cellW;
    const w2 = c2 * cellW;
    const h = usableH;

    let svg = `<svg class="array-svg" viewBox="0 0 ${vbW} ${vbH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Break-apart array ${r} rows by ${c} columns">`;

    // Left border label (rows)
    svg += `<text x="${padX - 10}" y="${padY + h / 2}" font-size="12" font-weight="700" fill="#315b48" text-anchor="end" dominant-baseline="middle">${r} rows</text>`;

    if (mode === 'all') {
      // Whole single rectangle
      svg += `<rect x="${padX}" y="${padY}" width="${usableW}" height="${h}" rx="8" fill="#dce8e0" stroke="#a4bfae" stroke-width="1.5"/>`;
      svg += `<text x="${padX + usableW / 2}" y="${padY - 12}" font-size="13" font-weight="700" fill="#315b48" text-anchor="middle">${c} columns</text>`;
      svg += `<text class="array-text" x="${padX + usableW / 2}" y="${padY + h / 2}" font-size="20" fill="#263f37">${r} × ${c} = ?</text>`;
    } else {
      // Split into two colored pieces
      svg += `<rect x="${padX}" y="${padY}" width="${w1}" height="${h}" rx="6" class="array-cell-left"/>`;
      svg += `<rect x="${padX + w1}" y="${padY}" width="${w2}" height="${h}" rx="6" class="array-cell-right"/>`;

      // Top labels
      svg += `<text x="${padX + w1 / 2}" y="${padY - 12}" font-size="12" font-weight="700" fill="#275239" text-anchor="middle">${c1} cols</text>`;
      svg += `<text x="${padX + w1 + w2 / 2}" y="${padY - 12}" font-size="12" font-weight="700" fill="#9c4f24" text-anchor="middle">${c2} cols</text>`;

      // Cut line
      svg += `<line x1="${padX + w1}" y1="${padY - 4}" x2="${padX + w1}" y2="${padY + h + 4}" class="array-cut-line"/>`;
      svg += `<text x="${padX + w1}" y="${padY - 16}" font-size="11" text-anchor="middle">✂️ cut</text>`;

      if (mode === 'split') {
        svg += `<text class="array-text" x="${padX + w1 / 2}" y="${padY + h / 2}" font-size="15" fill="#275239">${r} × ${c1}</text>`;
        svg += `<text class="array-text" x="${padX + w1 + w2 / 2}" y="${padY + h / 2}" font-size="15" fill="#9c4f24">${r} × ${c2}</text>`;
      } else if (mode === 'parts') {
        svg += `<text class="array-text" x="${padX + w1 / 2}" y="${padY + h / 2}" font-size="16" fill="#1b452d">${r} × ${c1} = ${part1}</text>`;
        svg += `<text class="array-text" x="${padX + w1 + w2 / 2}" y="${padY + h / 2}" font-size="16" fill="#883c16">${r} × ${c2} = ${part2}</text>`;
      } else if (mode === 'sum') {
        svg += `<text class="array-text" x="${padX + w1 / 2}" y="${padY + h / 2}" font-size="16" fill="#1b452d">${part1}</text>`;
        svg += `<text class="array-text" x="${padX + w1 + w2 / 2}" y="${padY + h / 2}" font-size="16" fill="#883c16">${part2}</text>`;
        svg += `<text x="${padX + usableW / 2}" y="${padY + h + 18}" font-size="13" font-weight="800" fill="#263f37" text-anchor="middle">${part1} + ${part2} = ${total} tiles</text>`;
      }
    }

    svg += '</svg>';
    return `<div class="split-array-wrap">${svg}</div>`;
  }

  /** Render Area Box Model HTML */
  function renderBoxModel(p, highlightStep) {
    const { T1, O1, T2, O2, p1, p2, p3, p4, total } = p;
    return `
      <div class="box-model-wrap">
        <div class="box-grid">
          <div class="box-corner-spacer"></div>
          <div class="box-header-col">+ ${T1}</div>
          <div class="box-header-col">+ ${O1}</div>

          <div class="box-header-row">${T2}</div>
          <div class="box-room room-p1 ${highlightStep === 1 ? 'glow-room' : ''}">
            <span class="room-calc">${T1} × ${T2}</span>
            <strong class="room-val">${highlightStep >= 1 ? p1 : '?'}</strong>
          </div>
          <div class="box-room room-p2 ${highlightStep === 1 ? 'glow-room' : ''}">
            <span class="room-calc">${O1} × ${T2}</span>
            <strong class="room-val">${p2}</strong>
          </div>

          <div class="box-header-row">+ ${O2}</div>
          <div class="box-room room-p3 ${highlightStep === 1 ? 'glow-room' : ''}">
            <span class="room-calc">${T1} × ${O2}</span>
            <strong class="room-val">${p3}</strong>
          </div>
          <div class="box-room room-p4 ${highlightStep === 2 ? 'glow-room' : ''}">
            <span class="room-calc">${O1} × ${O2}</span>
            <strong class="room-val">${highlightStep >= 2 ? p4 : '?'}</strong>
          </div>
        </div>
        ${highlightStep >= 3 ? `<div class="box-add-stack">Total: ${p1} + ${p2} + ${p3} + ${p4} = <strong>${total}</strong></div>` : ''}
      </div>
    `;
  }

  /** Render Boats for Remainders (Variant A) */
  function renderBoats(p, stepIndex) {
    const { k, q, r, N } = p;
    let html = '<div class="boats-wrap"><div class="boats-grid">';

    // Render full boats (up to 8 visually if large)
    const displayQ = Math.min(q, 6);
    for (let i = 0; i < displayQ; i++) {
      const seats = Array.from({ length: k }, () => '<span class="camper-token" aria-hidden="true">🧒</span>').join('');
      html += `
        <div class="boat-card">
          <div class="boat-title">Boat ${i + 1} (${k}/${k})</div>
          <div class="boat-passengers">${seats}</div>
        </div>
      `;
    }
    if (q > displayQ) {
      html += `<div class="boat-card" style="display:grid;place-items:center;font-size:12px;font-weight:700;color:var(--muted)">+ ${q - displayQ} more full boats</div>`;
    }

    // Leftover boat
    if (stepIndex >= 2) {
      const leftoverSeats = Array.from({ length: r }, () => '<span class="camper-token" aria-hidden="true">🧒</span>').join('') +
        Array.from({ length: k - r }, () => '<span class="empty-seat">empty</span>').join('');
      html += `
        <div class="boat-card boat-extra">
          <div class="boat-title">Boat ${q + 1} (${r} kids)</div>
          <div class="boat-passengers">${leftoverSeats}</div>
        </div>
      `;
    }

    html += '</div></div>';
    return html;
  }

  /** Render Ribbon for Remainders (Variant B) */
  function renderRibbon(p, stepIndex) {
    const { k, q, r, N } = p;
    const fullPercent = ((q * k) / N) * 100;
    const leftoverPercent = (r / N) * 100;

    return `
      <div class="ribbon-wrap">
        <div class="ribbon-bar">
          <div class="ribbon-segment" style="width:${fullPercent}%">
            <span>✂️ ${q} full bows (${q * k}m)</span>
          </div>
          ${stepIndex >= 2 ? `<div class="ribbon-segment ribbon-leftover" style="width:${leftoverPercent}%"><span>${r}m left</span></div>` : ''}
        </div>
        <div class="ribbon-legend">
          <span>0m</span>
          <span>Full bows: ${q} × ${k}m</span>
          <span>Total: ${N}m</span>
        </div>
      </div>
    `;
  }

  /** Render Remainder Rule Scale (Variant C) */
  function renderRemRule(p, stepIndex) {
    const { d, q, rMax, dividendMax } = p;
    const scaleMax = Math.min(d + 1, 10);
    const scaleItems = Array.from({ length: scaleMax }, (_, i) => {
      let cls = 'rem-scale-item';
      if (i === rMax && stepIndex >= 1) cls += ' max-rem';
      else if (i >= d) cls += ' too-big';
      return `<div class="${cls}">${i}</div>`;
    }).join('');

    return `
      <div class="rem-rule-wrap">
        <div class="rem-equation-badge">
          <span>□</span> ÷ ${d} = ${q} R <span>${stepIndex >= 1 ? rMax : '?'}</span>
        </div>
        <div class="rem-scale-row">${scaleItems}</div>
        <div class="rem-rule-text">
          Remainder must be strictly smaller than divisor ${d} (r &lt; ${d}).<br>
          ${stepIndex >= 2 ? `<strong>Starting number:</strong> ${q} × ${d} + ${rMax} = <strong>${dividendMax}</strong>` : ''}
        </div>
      </div>
    `;
  }

  /** Render Cycles Pattern HTML */
  function renderCycles(p, stepIndex) {
    const { pattern, L, target, q, r, N, cOne, cR, totalTarget } = p;
    const maxRows = Math.min(q, 4);

    let rowsHtml = '';
    for (let row = 0; row < maxRows; row++) {
      const cells = pattern.map(sym => `<span class="cycle-cell ${sym === target ? 'target' : ''}">${sym}</span>`).join('');
      rowsHtml += `
        <div class="cycle-row">
          <span class="cycle-row-label">Cycle ${row + 1}</span>
          <div class="cycle-row-cells">${cells}</div>
        </div>
      `;
    }
    if (q > maxRows) {
      rowsHtml += `<div class="cycle-row" style="font-size:11px;color:var(--muted);justify-content:center;">... ${q - maxRows} more complete cycles ...</div>`;
    }

    if (stepIndex >= 2 && r > 0) {
      const leftoverCells = pattern.slice(0, r).map(sym => `<span class="cycle-cell ${sym === target ? 'target' : ''}">${sym}</span>`).join('');
      rowsHtml += `
        <div class="cycle-row cycle-leftovers">
          <span class="cycle-row-label">Leftover ${r}</span>
          <div class="cycle-row-cells">${leftoverCells}</div>
        </div>
      `;
    }

    return `
      <div class="cycle-model-wrap">
        <div class="cycle-stamp-box">
          <span>Repeating Stamp (${L}):</span>
          <div class="cycle-stamp-items">${pattern.join(' ')}</div>
        </div>
        <div class="cycle-rows">${rowsHtml}</div>
        ${stepIndex >= 3 ? `<div class="cycle-summary-chip">${q} cycles × ${cOne} + ${cR} leftovers = <strong>${totalTarget}</strong> ${target}</div>` : ''}
      </div>
    `;
  }

  /** Render Vertical Math (Cryptarithm 竖式) */
  function renderVm(p, stepIndex) {
    const { opType, star, tri } = p;
    const starSolved = stepIndex >= 1;
    const triSolved = stepIndex >= 2;

    const starBadge = starSolved ? `<span class="vm-solved">${star}</span>` : '<span class="mystery-star">★</span>';
    const triBadge = triSolved ? `<span class="vm-solved">${tri}</span>` : '<span class="mystery-tri">▲</span>';

    if (opType === 'add') {
      const { A2, B1, C1, C2 } = p;
      return `
        <div class="vm-wrap">
          <div class="vm-card">
            <div class="vm-grid" style="--vm-cols: 2">
              <div></div>
              <div class="vm-carry-cell">${starSolved ? '<span class="vm-carry-dot">1</span>' : ''}</div>
              <div class="vm-carry-cell"></div>

              <div></div>
              <div class="vm-cell">${triBadge}</div>
              <div class="vm-cell">${A2}</div>

              <div class="vm-op">+</div>
              <div class="vm-cell">${B1}</div>
              <div class="vm-cell">${starBadge}</div>

              <div class="vm-divider"></div>

              <div></div>
              <div class="vm-cell">${C1}</div>
              <div class="vm-cell">${C2}</div>
            </div>
          </div>
        </div>
      `;
    } else if (opType === 'sub') {
      const { A1, B2, C1, C2 } = p;
      return `
        <div class="vm-wrap">
          <div class="vm-card">
            <div class="vm-grid" style="--vm-cols: 2">
              <div></div>
              <div class="vm-carry-cell">${starSolved ? '<span class="vm-carry-dot">−1</span>' : ''}</div>
              <div class="vm-carry-cell"></div>

              <div></div>
              <div class="vm-cell">${A1}</div>
              <div class="vm-cell">${starBadge}</div>

              <div class="vm-op">−</div>
              <div class="vm-cell">${triBadge}</div>
              <div class="vm-cell">${B2}</div>

              <div class="vm-divider"></div>

              <div></div>
              <div class="vm-cell">${C1}</div>
              <div class="vm-cell">${C2}</div>
            </div>
          </div>
        </div>
      `;
    } else if (opType === 'add3') {
      const { A2, B1, C1, C2 } = p;
      return `
        <div class="vm-wrap">
          <div class="vm-card">
            <div class="vm-grid" style="--vm-cols: 3">
              <div></div>
              <div class="vm-carry-cell"></div>
              <div class="vm-carry-cell">${starSolved ? '<span class="vm-carry-dot">1</span>' : ''}</div>
              <div class="vm-carry-cell"></div>

              <div></div>
              <div></div>
              <div class="vm-cell">${triBadge}</div>
              <div class="vm-cell">${A2}</div>

              <div class="vm-op">+</div>
              <div></div>
              <div class="vm-cell">${B1}</div>
              <div class="vm-cell">${starBadge}</div>

              <div class="vm-divider"></div>

              <div></div>
              <div class="vm-cell">1</div>
              <div class="vm-cell">${C1}</div>
              <div class="vm-cell">${C2}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      // mult
      const { K, P1, P2, carry, hundreds, tens } = p;
      return `
        <div class="vm-wrap">
          <div class="vm-card">
            <div class="vm-grid" style="--vm-cols: 3">
              <div></div>
              <div></div>
              <div class="vm-carry-cell">${starSolved ? `<span class="vm-carry-dot">+${carry}</span>` : ''}</div>
              <div class="vm-carry-cell"></div>

              <div></div>
              <div></div>
              <div class="vm-cell">${triBadge}</div>
              <div class="vm-cell">${starBadge}</div>

              <div class="vm-op">×</div>
              <div></div>
              <div></div>
              <div class="vm-cell">${K}</div>

              <div class="vm-divider"></div>

              <div></div>
              ${hundreds ? `<div class="vm-cell">${hundreds}</div>` : '<div></div>'}
              <div class="vm-cell">${tens}</div>
              <div class="vm-cell">${P2}</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // ---------- Explanation Steps Generator ----------
  function stepsFor(p) {
    if (p.kind === 'splitArray') {
      const { r, c, c1, c2, part1, part2, total } = p;
      return [
        {
          title: 'See the whole grid',
          description: `We have a grid of ${r} rows and ${c} columns (${r} × ${c}). That is a big calculation to do in one step!`,
          diagram: renderArraySvg(p, 'all'),
          equation: `? = ${r} × ${c}`
        },
        {
          title: 'Make a friendly cut',
          description: `Cut the ${c} columns into two easy parts: ${c1} columns on the left and ${c2} columns on the right.`,
          diagram: renderArraySvg(p, 'split'),
          equation: `${r} × ${c} = ${r} × (${c1} + ${c2})`
        },
        {
          title: 'Multiply each friendly piece',
          description: `Left piece has ${r} × ${c1} = ${part1} tiles. Right piece has ${r} × ${c2} = ${part2} tiles.`,
          diagram: renderArraySvg(p, 'parts'),
          equation: `${r} × ${c1} = ${part1}  \\text{ and }  ${r} × ${c2} = ${part2}`
        },
        {
          title: 'Add the pieces together',
          description: `Add the two friendly pieces: ${part1} + ${part2} = ${total} tiles altogether!`,
          diagram: renderArraySvg(p, 'sum'),
          equation: `${part1} + ${part2} = ${total} ✓`
        }
      ];
    }

    if (p.kind === 'boxMult') {
      const { num1, num2, T1, O1, T2, O2, p1, p2, p3, p4, total } = p;
      return [
        {
          title: 'Break by place value',
          description: `Break ${num1} into ${T1} + ${O1}, and break ${num2} into ${T2} + ${O2}. This creates 4 rooms inside one big rectangle.`,
          diagram: renderBoxModel(p, 0),
          equation: `${num1} × ${num2} = (${T1} + ${O1}) × (${T2} + ${O2})`
        },
        {
          title: 'Calculate the tens rooms',
          description: `Top-left big room is tens × tens: ${T1} × ${T2} = ${p1}. The other two rooms are ${O1} × ${T2} = ${p2} and ${T1} × ${O2} = ${p3}.`,
          diagram: renderBoxModel(p, 1),
          equation: `\\text{Top-left room} = ${T1} × ${T2} = ${p1}`
        },
        {
          title: 'Calculate the ones room',
          description: `Bottom-right corner is ones × ones: ${O1} × ${O2} = ${p4}.`,
          diagram: renderBoxModel(p, 2),
          equation: `\\text{Bottom-right room} = ${O1} × ${O2} = ${p4}`
        },
        {
          title: 'Add all four rooms',
          description: `Sum all 4 partial products: ${p1} + ${p2} + ${p3} + ${p4} = ${total}.`,
          diagram: renderBoxModel(p, 3),
          equation: `${p1} + ${p2} + ${p3} + ${p4} = ${total} ✓`
        }
      ];
    }

    if (p.kind === 'remainders') {
      if (p.variant === 'roundUp') {
        const { N, k, q, r } = p;
        return [
          {
            title: 'See the waiting group',
            description: `${N} children need to ride in boats that hold at most ${k} each.`,
            diagram: renderBoats(p, 0),
            equation: `${N} \\text{ children waiting}`
          },
          {
            title: 'Fill full boats',
            description: `${q} boats are completely full with ${k} children each: ${q} × ${k} = ${q * k} children seated.`,
            diagram: renderBoats(p, 1),
            equation: `${q} × ${k} = ${q * k}`
          },
          {
            title: 'Look at the remainder',
            description: `${N} − ${q * k} = ${r} children are left over on the dock.`,
            diagram: renderBoats(p, 2),
            equation: `${N} ÷ ${k} = ${q} \\text{ R } ${r}`
          },
          {
            title: 'Round up: one more boat! (进一法)',
            description: `Because every child must ride, the ${r} leftovers get their own boat! Total boats needed: ${q} + 1 = ${q + 1}.`,
            diagram: renderBoats(p, 3),
            equation: `${q} + 1 = ${q + 1} \\text{ boats needed} ✓`
          }
        ];
      } else if (p.variant === 'roundDown') {
        const { N, k, q, r } = p;
        return [
          {
            title: 'The whole ribbon',
            description: `You have ${N} meters of ribbon. Each full bow requires ${k} meters.`,
            diagram: renderRibbon(p, 0),
            equation: `${N} \\text{ meters of ribbon}`
          },
          {
            title: 'Cut full bows',
            description: `You can cut ${q} full pieces of ${k} meters each: ${q} × ${k} = ${q * k} meters.`,
            diagram: renderRibbon(p, 1),
            equation: `${q} × ${k} = ${q * k} \\text{ meters used}`
          },
          {
            title: 'Look at the leftover ribbon',
            description: `${N} − ${q * k} = ${r} meters remain. Since ${r} < ${k}, this is not enough for another bow.`,
            diagram: renderRibbon(p, 2),
            equation: `${N} ÷ ${k} = ${q} \\text{ R } ${r}`
          },
          {
            title: 'Round down (去尾法)',
            description: `You can make ${q} full bows. The remaining ${r} meters of ribbon is left over.`,
            diagram: renderRibbon(p, 3),
            equation: `${q} \\text{ full bows, } ${r} \\text{ meters left over} ✓`
          }
        ];
      } else {
        const { d, q, rMax, dividendMax } = p;
        return [
          {
            title: 'The division rule',
            description: `In □ ÷ ${d} = ${q} R ?, the remainder must always be strictly less than the divisor ${d}.`,
            diagram: renderRemRule(p, 0),
            equation: `0 \\le \\text{Remainder} < ${d}`
          },
          {
            title: 'Largest possible remainder',
            description: `The greatest whole number smaller than ${d} is ${d} − 1 = ${rMax}.`,
            diagram: renderRemRule(p, 1),
            equation: `\\text{Max Remainder} = ${d} − 1 = ${rMax}`
          },
          {
            title: 'Rebuild the dividend',
            description: `Multiply quotient by divisor, then add the remainder: ${q} × ${d} + ${rMax} = ${dividendMax}.`,
            diagram: renderRemRule(p, 2),
            equation: `\\text{Dividend} = (${q} × ${d}) + ${rMax} = ${dividendMax}`
          },
          {
            title: 'Verify the equation',
            description: `${dividendMax} ÷ ${d} = ${q} with a remainder of ${rMax}. Perfect match!`,
            diagram: renderRemRule(p, 3),
            equation: `${dividendMax} ÷ ${d} = ${q} \\text{ R } ${rMax} ✓`
          }
        ];
      }
    }

    if (p.kind === 'cycles') {
      const { pattern, L, target, q, r, N, cOne, cR, totalTarget } = p;
      return [
        {
          title: 'Find the repeating unit',
          description: `The pattern repeats every ${L} items: ${pattern.join(' ')}. The target ${target} appears ${cOne} time${cOne === 1 ? '' : 's'} in each cycle.`,
          diagram: renderCycles(p, 0),
          equation: `\\text{Cycle length} = ${L}`
        },
        {
          title: 'Divide into full cycles',
          description: `${N} ÷ ${L} = ${q} with a remainder of ${r}. That gives ${q} complete repeating cycles.`,
          diagram: renderCycles(p, 1),
          equation: `${N} ÷ ${L} = ${q} \\text{ R } ${r}`
        },
        {
          title: 'Check the leftover items',
          description: `The first ${r} items of the next cycle are: ${pattern.slice(0, r).join(' ')}. It contains ${cR} ${target}.`,
          diagram: renderCycles(p, 2),
          equation: `${r} \\text{ leftovers have } ${cR} \\text{ } ${target}`
        },
        {
          title: 'Count the target items',
          description: `${q} full cycles have ${q} × ${cOne} = ${q * cOne} ${target}. Adding the ${cR} leftovers gives ${totalTarget} altogether.`,
          diagram: renderCycles(p, 3),
          equation: `(${q} × ${cOne}) + ${cR} = ${totalTarget} ✓`
        }
      ];
    }

    if (p.kind === 'cryptarithm') {
      return [
        {
          title: 'Inspect the columns',
          description: 'In vertical arithmetic, start with the ones column! Watch for carries or borrows.',
          diagram: renderVm(p, 0),
          equation: '\\text{Start with the Ones column}'
        },
        {
          title: 'Solve for ★ in the ones column',
          description: p.onesExplanation,
          diagram: renderVm(p, 1),
          equation: p.onesEquation
        },
        {
          title: 'Solve for ▲ in the tens column',
          description: p.tensExplanation,
          diagram: renderVm(p, 2),
          equation: p.tensEquation
        },
        {
          title: 'Verify the vertical math',
          description: `Substitute ★ = ${p.star} and ▲ = ${p.tri}. All columns balance!`,
          diagram: renderVm(p, 3),
          equation: `${p.fullEquation} ✓`
        }
      ];
    }

    throw new Error('Unknown problem kind: ' + p.kind);
  }

  // ---------- Application State & Controller ----------
  let topic = 'splitArray';
  let level = 'easy';
  let problem = null;
  let step = 0;
  let solved = false;
  let stars = 0;

  if (isBrowser) {
    try {
      stars = Math.max(0, Number(localStorage.getItem('little-big-math-stars')) || 0);
    } catch (_) {}
  }

  function updateStars() {
    if (!isBrowser) return;
    const starEl = $('star-count');
    if (starEl) starEl.textContent = stars.toLocaleString('en-US');
    const fillEl = $('progress-fill');
    const progress = stars && stars % 10 === 0 ? 10 : stars % 10;
    if (fillEl) fillEl.style.width = progress * 10 + '%';
    const track = document.querySelector('.progress-track');
    if (track) track.setAttribute('aria-label', `${progress} of 10 stars toward a celebration`);
  }

  function renderProblem() {
    if (!isBrowser || !problem) return;
    const t = topics[topic];
    $('topic-caption').textContent = t.caption;
    $('story-icon').textContent = t.icon;
    $('problem-title').textContent = t.title;
    $('picture-badge').textContent = t.badge;
    $('story').innerHTML = problem.story;

    // Mini visual preview in problem card
    const sv = $('story-visual');
    if (sv) {
      if (topic === 'splitArray') {
        sv.innerHTML = renderArraySvg(problem, 'split');
      } else if (topic === 'boxMult') {
        sv.innerHTML = renderBoxModel(problem, 0);
      } else if (topic === 'remainders') {
        if (problem.variant === 'roundUp') sv.innerHTML = renderBoats(problem, 2);
        else if (problem.variant === 'roundDown') sv.innerHTML = renderRibbon(problem, 2);
        else sv.innerHTML = renderRemRule(problem, 1);
      } else if (topic === 'cycles') {
        sv.innerHTML = renderCycles(problem, 1);
      } else if (topic === 'cryptarithm') {
        sv.innerHTML = renderVm(problem, 0);
      }
    }

    // Answer fields
    const af = $('answer-fields');
    af.innerHTML = problem.answers.map((a, i) => `
      <div class="answer-row">
        <label for="answer-${i}">${a.label}</label>
        <div class="input-wrap">
          <input type="text" id="answer-${i}" inputmode="numeric" autocomplete="off">
        </div>
      </div>
    `).join('');

    // Reset feedback & hint
    $('feedback').className = 'feedback';
    $('feedback').textContent = '';
    $('hint').textContent = problem.hint;
    $('hint').hidden = true;
    $('hint-button').setAttribute('aria-expanded', 'false');

    // Sync topic buttons
    document.querySelectorAll('.topic').forEach(b => {
      const active = b.dataset.topic === topic;
      b.setAttribute('aria-pressed', String(active));
    });

    renderStep();
  }

  function renderStep() {
    if (!isBrowser || !problem) return;
    const steps = stepsFor(problem);
    if (step >= steps.length) step = steps.length - 1;
    if (step < 0) step = 0;

    const s = steps[step];
    $('visual-title').textContent = s.title;
    $('step-description').textContent = s.description;
    $('diagram').innerHTML = s.diagram;
    $('equation').textContent = s.equation;

    // Step dots
    $('step-dots').innerHTML = steps.map((_, i) => `
      <button class="step-dot" data-step="${i}" aria-label="Step ${i + 1}" ${i === step ? 'aria-current="step"' : ''}></button>
    `).join('');

    // Step buttons
    $('previous-step').disabled = step === 0;
    $('next-step').textContent = step < steps.length - 1 ? 'Show the next step →' : 'Try another problem ↻';
  }

  function nextProblem() {
    problem = generate(topic, level);
    step = 0;
    solved = false;
    renderProblem();
  }

  function setTopic(t) {
    if (!topics[t]) return;
    topic = t;
    if (isBrowser) history.replaceState(null, '', '#' + t);
    nextProblem();
  }

  // ---------- Form Submission & Answer Checking ----------
  if (isBrowser) {
    const readNumber = id => {
      const raw = $(id).value.trim();
      return /^\d+$/.test(raw) ? Number(raw) : raw ? NaN : null;
    };

    $('answer-form').addEventListener('submit', event => {
      event.preventDefault();
      let allCorrect = true;
      let empty = false;
      let firstWrong = null;

      problem.answers.forEach((a, i) => {
        const input = $(`answer-${i}`);
        const val = readNumber(`answer-${i}`);
        if (val === null) empty = true;
        const correct = val === a.value;
        input.setAttribute('aria-invalid', String(!correct));
        if (!correct) {
          allCorrect = false;
          firstWrong = firstWrong || input;
        }
      });

      if (allCorrect) {
        $('feedback').className = 'feedback success';
        $('feedback').textContent = solved
          ? '✓ You’ve already earned a star for this problem. Try a new one!'
          : '★ You got it! Great thinking. One shiny star for you.';

        if (!solved) {
          solved = true;
          stars++;
          updateStars();
          try {
            localStorage.setItem('little-big-math-stars', String(stars));
          } catch (_) {}

          if (stars % 10 === 0) {
            const cele = $('celebration');
            cele.textContent = `🌟 ${stars.toLocaleString('en-US')} stars! Look how much your thinking has grown! 🌱`;
            cele.classList.add('visible');
            setTimeout(() => cele.classList.remove('visible'), 5000);
          }
        }
      } else {
        $('feedback').className = 'feedback try';
        $('feedback').textContent = empty
          ? 'Fill in each answer box, then let’s check together.'
          : 'A little rethink! Check the highlighted answer. The picture or hint can help.';
        if (firstWrong) firstWrong.focus();
      }
    });

    // Event listeners
    document.querySelectorAll('.topic').forEach(btn => {
      btn.addEventListener('click', () => setTopic(btn.dataset.topic));
    });

    $('mix-button').addEventListener('click', () => {
      const keys = Object.keys(topics).filter(k => k !== topic);
      setTopic(pick(keys));
    });

    $('difficulty').addEventListener('change', e => {
      level = e.target.value;
      nextProblem();
    });

    $('new-button').addEventListener('click', nextProblem);

    $('hint-button').addEventListener('click', () => {
      const hintEl = $('hint');
      hintEl.hidden = !hintEl.hidden;
      $('hint-button').setAttribute('aria-expanded', String(!hintEl.hidden));
    });

    $('previous-step').addEventListener('click', () => {
      if (step > 0) {
        step--;
        renderStep();
      }
    });

    $('next-step').addEventListener('click', () => {
      const steps = stepsFor(problem);
      if (step < steps.length - 1) {
        step++;
        renderStep();
      } else {
        nextProblem();
      }
    });

    $('step-dots').addEventListener('click', e => {
      const b = e.target.closest('[data-step]');
      if (b) {
        step = Number(b.dataset.step);
        renderStep();
      }
    });

    // Deep linking
    window.addEventListener('hashchange', () => {
      const linked = decodeURIComponent(location.hash.slice(1));
      if (topics[linked] && linked !== topic) {
        topic = linked;
        nextProblem();
      }
    });

    const initHash = decodeURIComponent(location.hash.slice(1));
    if (topics[initHash]) {
      topic = initHash;
    }

    // Init
    nextProblem();
    updateStars();
  }

  // ---------- Exports ----------
  const getState = () => ({ topic, level, problem, step, solved, stars });

  if (typeof window !== 'undefined') {
    window.MultiplyDivideLab = { generate, stepsFor, getState };
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generate, stepsFor, getState, topics };
  }
})();
