(() => {
  'use strict';

  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  const $ = id => isBrowser ? document.getElementById(id) : null;

  // ---------- Topics Configuration ----------
  const topics = {
    oneBracket: {
      caption: 'ONE PAIR OF BRACKETS',
      icon: '🫧',
      title: 'Solve inside the brackets first',
      badge: '1. Inside ( ) → 2. ×/÷ → 3. +/−'
    },
    twoBrackets: {
      caption: 'TWO BRACKETS',
      icon: '🫧',
      title: 'Solve both bracket bubbles, then join',
      badge: 'Solve each ( ) bubble first'
    },
    nested: {
      caption: 'NESTED BRACKETS',
      icon: '🧅',
      title: 'Peel from the innermost brackets out',
      badge: 'Inner ( ) → Outer ( ) → Outside'
    },
    mixedNest: {
      caption: 'ORDER TRAPS',
      icon: '⚠️',
      title: 'Watch out for × and ÷ inside brackets!',
      badge: '× and ÷ beat + and −'
    },
    addBrackets: {
      caption: 'PLACE THE BRACKETS',
      icon: '🎯',
      title: 'Where do the brackets go to hit the target?',
      badge: 'Test how brackets change the order'
    },
    missingInBracket: {
      caption: 'MYSTERY INSIDE ( )',
      icon: '🔍',
      title: 'Peel from the outside in to find □',
      badge: 'Work backwards step by step'
    }
  };

  // ---------- Helpers ----------
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = list => list[rand(0, list.length - 1)];
  const fmt = n => n.toLocaleString('en-US');

  function shuffle(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = rand(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Color-code an expression string by parenthesis depth and special tokens. */
  function colorizeExpr(str) {
    const tokens = [];
    let depth = 0;
    const out = [];
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === '(') {
        depth++;
        const cls = depth >= 2 ? 'b-inner' : 'b-outer';
        const pcls = depth >= 2 ? 'paren-inner' : 'paren-outer';
        out.push(`<span class="${cls}"><span class="${pcls}">(</span>`);
        tokens.push(cls);
      } else if (ch === ')') {
        const cls = tokens.pop() || 'b-outer';
        const pcls = cls === 'b-inner' ? 'paren-inner' : 'paren-outer';
        out.push(`<span class="${pcls}">)</span></span>`);
        depth = Math.max(0, depth - 1);
      } else if (ch === '□') {
        out.push('<span class="expr-mystery">□</span>');
      } else {
        out.push(ch);
      }
    }
    return out.join('');
  }

  const foc = s => `<span class="expr-focus">${s}</span>`;
  const res = n => `<span class="expr-result">${fmt(n)}</span>`;
  const outerWrap = inner => `<span class="b-outer"><span class="paren-outer">(</span>${inner}<span class="paren-outer">)</span></span>`;

  function evalMathStr(expr) {
    const clean = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    if (!/^[\d\s+\-*/()]+$/.test(clean)) throw new Error('Unsafe expression: ' + expr);
    return Function('"use strict"; return (' + clean + ');')();
  }

  function buildOrderLegend(activeRule) {
    const rules = [
      { id: 'inner', label: '1. Inner ( ) first' },
      { id: 'muldiv', label: '2. × and ÷ next' },
      { id: 'addsub', label: '3. + and − last' }
    ];
    return `<div class="order-legend">${rules
      .map(r => `<span class="order-rule${r.id === activeRule ? ' rule-active' : ''}">${r.label}</span>`)
      .join('')}</div>`;
  }

  function buildLadder(activeRule, rows, activeIdx) {
    const htmlRows = rows
      .map((row, idx) => {
        const cls = [
          'ladder-row',
          idx === 0 ? 'is-first' : '',
          idx === activeIdx ? 'is-active' : idx < activeIdx ? 'is-done' : '',
          row.final ? 'is-final' : ''
        ]
          .filter(Boolean)
          .join(' ');
        const eqCol = idx === 0 ? '' : '<span class="ladder-eq">=</span>';
        const tagCol = row.tag ? `<span class="ladder-tag">${row.tag}</span>` : '';
        return `<div class="${cls}">${eqCol}<span class="ladder-expr">${row.html}</span>${tagCol}</div>`;
      })
      .join('');
    return buildOrderLegend(activeRule) + `<div class="ladder">${htmlRows}</div>`;
  }

  // ---------- Problem Generator ----------
  function generate(kind, difficulty = 'easy', original = false) {
    const p = { kind, difficulty };

    // 1. oneBracket — Single pair of brackets
    if (kind === 'oneBracket') {
      const template = original ? 'addMul' : pick(['addMul', 'subMul', 'divAdd', 'mulSub']);
      p.template = template;

      let A, B, C, D, E, opIn, innerVal, mulVal, finalVal;
      if (template === 'addMul') {
        opIn = Math.random() < 0.5 ? '+' : '−';
        C = difficulty === 'easy' ? rand(3, 8) : difficulty === 'medium' ? rand(6, 15) : rand(15, 38);
        D = opIn === '+'
          ? (difficulty === 'easy' ? rand(2, 7) : difficulty === 'medium' ? rand(4, 14) : rand(8, 28))
          : rand(1, C - 2);
        innerVal = opIn === '+' ? C + D : C - D;
        B = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? rand(4, 15) : rand(12, 28);
        A = difficulty === 'easy' ? rand(4, 20) : difficulty === 'medium' ? rand(18, 95) : rand(110, 350);
        mulVal = B * innerVal;
        finalVal = A + mulVal;
        p.rawExpr = `${A} + ${B} × (${C} ${opIn} ${D})`;
        p.stepData = {
          ruleAfter1: 'muldiv',
          rows: [
            { html: `${A} + ${B} × ${foc(`(${C} ${opIn} ${D})`)}`, tag: 'Spot ( )' },
            { html: `${A} + ${foc(`${B} × ${res(innerVal)}`)}`, tag: 'Inside ( )' },
            { html: `${foc(`${A} + ${res(mulVal)}`)}`, tag: 'Multiply' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          descs: [
            `Brackets always come first! Focus inside (${C} ${opIn} ${D}).`,
            `First solve inside the brackets: ${C} ${opIn} ${D} = ${innerVal}.`,
            `Multiply before adding: ${B} × ${innerVal} = ${mulVal}.`,
            `Finally add: ${A} + ${mulVal} = ${finalVal}!`
          ],
          eqs: [
            `Inside ( ): ${C} ${opIn} ${D} = ?`,
            `${C} ${opIn} ${D} = ${innerVal}`,
            `${B} × ${innerVal} = ${mulVal}`,
            `${A} + ${mulVal} = ${finalVal} ✓`
          ]
        };
      } else if (template === 'subMul') {
        opIn = Math.random() < 0.5 ? '+' : '−';
        C = difficulty === 'easy' ? rand(3, 7) : difficulty === 'medium' ? rand(5, 14) : rand(12, 30);
        D = opIn === '+' ? rand(2, difficulty === 'easy' ? 6 : 12) : rand(1, C - 2);
        innerVal = opIn === '+' ? C + D : C - D;
        B = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(3, 12) : rand(11, 24);
        mulVal = B * innerVal;
        const rem = difficulty === 'easy' ? rand(5, 25) : difficulty === 'medium' ? rand(15, 80) : rand(40, 240);
        A = mulVal + rem;
        finalVal = rem;
        p.rawExpr = `${A} − ${B} × (${C} ${opIn} ${D})`;
        p.stepData = {
          ruleAfter1: 'muldiv',
          rows: [
            { html: `${A} − ${B} × ${foc(`(${C} ${opIn} ${D})`)}`, tag: 'Spot ( )' },
            { html: `${A} − ${foc(`${B} × ${res(innerVal)}`)}`, tag: 'Inside ( )' },
            { html: `${foc(`${A} − ${res(mulVal)}`)}`, tag: 'Multiply' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          descs: [
            `Do not subtract from ${A} yet! Solve inside (${C} ${opIn} ${D}) first.`,
            `Inside the brackets: ${C} ${opIn} ${D} = ${innerVal}.`,
            `Multiply next (× beats −): ${B} × ${innerVal} = ${mulVal}.`,
            `Now subtract: ${A} − ${mulVal} = ${finalVal}!`
          ],
          eqs: [
            `Inside ( ): ${C} ${opIn} ${D} = ?`,
            `${C} ${opIn} ${D} = ${innerVal}`,
            `${B} × ${innerVal} = ${mulVal}`,
            `${A} − ${mulVal} = ${finalVal} ✓`
          ]
        };
      } else if (template === 'divAdd') {
        D = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(4, 9) : rand(6, 14);
        const q = difficulty === 'easy' ? rand(3, 8) : difficulty === 'medium' ? rand(5, 16) : rand(12, 30);
        innerVal = D * q;
        opIn = Math.random() < 0.5 ? '+' : '−';
        if (opIn === '+') {
          A = rand(Math.floor(innerVal * 0.25), Math.floor(innerVal * 0.75));
          B = innerVal - A;
        } else {
          B = difficulty === 'easy' ? rand(2, 9) : rand(5, 30);
          A = innerVal + B;
        }
        E = difficulty === 'easy' ? rand(4, 20) : difficulty === 'medium' ? rand(15, 65) : rand(50, 220);
        mulVal = q;
        finalVal = q + E;
        p.rawExpr = `(${A} ${opIn} ${B}) ÷ ${D} + ${E}`;
        p.stepData = {
          ruleAfter1: 'muldiv',
          rows: [
            { html: `${foc(`(${A} ${opIn} ${B})`)} ÷ ${D} + ${E}`, tag: 'Spot ( )' },
            { html: `${foc(`${res(innerVal)} ÷ ${D}`)} + ${E}`, tag: 'Inside ( )' },
            { html: `${foc(`${res(q)} + ${E}`)}`, tag: 'Divide' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          descs: [
            `Because (${A} ${opIn} ${B}) is wrapped in brackets, solve it before dividing by ${D}.`,
            `Inside the brackets: ${A} ${opIn} ${B} = ${innerVal}.`,
            `Divide next: ${innerVal} ÷ ${D} = ${q}.`,
            `Finally add: ${q} + ${E} = ${finalVal}!`
          ],
          eqs: [
            `Inside ( ): ${A} ${opIn} ${B} = ?`,
            `${A} ${opIn} ${B} = ${innerVal}`,
            `${innerVal} ÷ ${D} = ${q}`,
            `${q} + ${E} = ${finalVal} ✓`
          ]
        };
      } else {
        // mulSub: B × (C + D) − E
        C = difficulty === 'easy' ? rand(3, 8) : difficulty === 'medium' ? rand(8, 22) : rand(15, 45);
        D = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? rand(5, 18) : rand(12, 35);
        innerVal = C + D;
        B = difficulty === 'easy' ? rand(3, 6) : difficulty === 'medium' ? rand(4, 12) : rand(12, 26);
        mulVal = B * innerVal;
        E = rand(3, Math.floor(mulVal * 0.6));
        finalVal = mulVal - E;
        p.rawExpr = `${B} × (${C} + ${D}) − ${E}`;
        p.stepData = {
          ruleAfter1: 'muldiv',
          rows: [
            { html: `${B} × ${foc(`(${C} + ${D})`)} − ${E}`, tag: 'Spot ( )' },
            { html: `${foc(`${B} × ${res(innerVal)}`)} − ${E}`, tag: 'Inside ( )' },
            { html: `${foc(`${res(mulVal)} − ${E}`)}`, tag: 'Multiply' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          descs: [
            `Start inside the brackets (${C} + ${D}) before multiplying by ${B}.`,
            `Inside the brackets: ${C} + ${D} = ${innerVal}.`,
            `Multiply next: ${B} × ${innerVal} = ${mulVal}.`,
            `Finally subtract: ${mulVal} − ${E} = ${finalVal}!`
          ],
          eqs: [
            `Inside ( ): ${C} + ${D} = ?`,
            `${C} + ${D} = ${innerVal}`,
            `${B} × ${innerVal} = ${mulVal}`,
            `${mulVal} − ${E} = ${finalVal} ✓`
          ]
        };
      }

      p.innerVal = innerVal;
      p.final = finalVal;
      p.story = `Calculate the value of this expression step by step:<br><strong>${p.rawExpr}</strong>`;
      p.answers = difficulty === 'easy'
        ? [{ label: 'Value inside ( )', value: innerVal }, { label: 'Final answer', value: finalVal }]
        : [{ label: 'Final answer', value: finalVal }];
      p.hint = `Solve the part inside ( ) first (${innerVal}), then multiply or divide before doing any + or −.`;
    }

    // 2. twoBrackets — Two separate pairs of brackets
    else if (kind === 'twoBrackets') {
      const variant = pick(['mulPair', 'addMulPair', 'subMulPair', 'divAddMul']);
      p.variant = variant;

      let leftStr, rightStr, leftVal, rightVal, finalVal, stepData;

      if (variant === 'mulPair') {
        const A = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? rand(5, 14) : rand(12, 35);
        const B = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(4, 12) : rand(8, 25);
        const C = difficulty === 'easy' ? rand(5, 9) : difficulty === 'medium' ? rand(10, 22) : rand(20, 48);
        const D = rand(1, C - 2);
        leftVal = A + B;
        rightVal = C - D;
        finalVal = leftVal * rightVal;
        leftStr = `(${A} + ${B})`;
        rightStr = `(${C} − ${D})`;
        p.rawExpr = `${leftStr} × ${rightStr}`;
        stepData = {
          rows: [
            { html: `${foc(leftStr)} × ${foc(rightStr)}`, tag: 'Two ( )' },
            { html: `${res(leftVal)} × ${foc(rightStr)}`, tag: 'Left ( )' },
            { html: `${foc(`${res(leftVal)} × ${res(rightVal)}`)}`, tag: 'Right ( )' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          rules: ['inner', 'inner', 'muldiv', 'muldiv'],
          descs: [
            `Solve both bracket bubbles separately before multiplying them together!`,
            `First bubble: ${A} + ${B} = ${leftVal}.`,
            `Second bubble: ${C} − ${D} = ${rightVal}.`,
            `Now multiply the two bubble results: ${leftVal} × ${rightVal} = ${finalVal}!`
          ],
          eqs: [
            `${leftStr} × ${rightStr}`,
            `${A} + ${B} = ${leftVal}`,
            `${C} − ${D} = ${rightVal}`,
            `${leftVal} × ${rightVal} = ${finalVal} ✓`
          ]
        };
      } else if (variant === 'addMulPair' || variant === 'subMulPair') {
        const isSub = variant === 'subMulPair';
        const M1 = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(4, 12) : rand(12, 25);
        const A = difficulty === 'easy' ? rand(3, 7) : difficulty === 'medium' ? rand(6, 15) : rand(15, 35);
        const B = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(4, 12) : rand(10, 25);
        leftVal = A + B;
        const leftProd = M1 * leftVal;

        const M2 = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(3, 9) : rand(6, 18);
        let C = difficulty === 'easy' ? rand(3, 7) : difficulty === 'medium' ? rand(5, 14) : rand(12, 28);
        let D = isSub ? rand(1, C - 2) : (difficulty === 'easy' ? rand(2, 5) : rand(4, 12));
        rightVal = isSub ? C - D : C + D;
        let rightProd = M2 * rightVal;

        if (isSub && rightProd >= leftProd) {
          // Ensure leftProd > rightProd by adjusting C or D cleanly
          rightVal = Math.max(2, Math.floor((leftProd - 4) / M2) - 1);
          D = difficulty === 'easy' ? rand(1, 3) : rand(2, 8);
          C = rightVal + D;
          rightProd = M2 * rightVal;
        }
        const opMid = isSub ? '−' : '+';
        finalVal = isSub ? leftProd - rightProd : leftProd + rightProd;
        leftStr = `(${A} + ${B})`;
        rightStr = isSub ? `(${C} − ${D})` : `(${C} + ${D})`;
        p.rawExpr = `${M1} × ${leftStr} ${opMid} ${M2} × ${rightStr}`;

        stepData = {
          rows: [
            { html: `${M1} × ${foc(leftStr)} ${opMid} ${M2} × ${foc(rightStr)}`, tag: 'Two ( )' },
            { html: `${M1} × ${res(leftVal)} ${opMid} ${M2} × ${res(rightVal)}`, tag: 'Both ( )' },
            { html: `${foc(`${res(leftProd)} ${opMid} ${res(rightProd)}`)}`, tag: 'Multiply' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          rules: ['inner', 'inner', 'muldiv', 'addsub'],
          descs: [
            `Solve each pair of brackets first before multiplying by ${M1} and ${M2}.`,
            `Left bracket: ${A} + ${B} = ${leftVal}. Right bracket: ${C} ${isSub ? '−' : '+'} ${D} = ${rightVal}.`,
            `Do both multiplications before ${isSub ? 'subtracting' : 'adding'}: ${M1} × ${leftVal} = ${leftProd}, and ${M2} × ${rightVal} = ${rightProd}.`,
            `Join the results: ${leftProd} ${opMid} ${rightProd} = ${finalVal}!`
          ],
          eqs: [
            `Solve ${leftStr} and ${rightStr}`,
            `Left = ${leftVal}, Right = ${rightVal}`,
            `${leftProd} ${opMid} ${rightProd}`,
            `${leftProd} ${opMid} ${rightProd} = ${finalVal} ✓`
          ]
        };
      } else {
        // divAddMul: (A + B) ÷ D + M × (C − E)
        const D = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(4, 8) : rand(6, 12);
        const q = difficulty === 'easy' ? rand(3, 8) : difficulty === 'medium' ? rand(5, 14) : rand(10, 24);
        leftVal = D * q;
        const A = rand(Math.floor(leftVal * 0.3), Math.floor(leftVal * 0.7));
        const B = leftVal - A;
        const M = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(4, 12) : rand(8, 22);
        const C = difficulty === 'easy' ? rand(5, 9) : difficulty === 'medium' ? rand(10, 22) : rand(20, 45);
        const E = rand(1, C - 2);
        rightVal = C - E;
        const rightProd = M * rightVal;
        finalVal = q + rightProd;
        leftStr = `(${A} + ${B})`;
        rightStr = `(${C} − ${E})`;
        p.rawExpr = `${leftStr} ÷ ${D} + ${M} × ${rightStr}`;

        stepData = {
          rows: [
            { html: `${foc(leftStr)} ÷ ${D} + ${M} × ${foc(rightStr)}`, tag: 'Two ( )' },
            { html: `${res(leftVal)} ÷ ${D} + ${M} × ${res(rightVal)}`, tag: 'Both ( )' },
            { html: `${foc(`${res(q)} + ${res(rightProd)}`)}`, tag: '÷ and ×' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          rules: ['inner', 'inner', 'muldiv', 'addsub'],
          descs: [
            `Solve both pairs of brackets first.`,
            `Left bubble: ${A} + ${B} = ${leftVal}. Right bubble: ${C} − ${E} = ${rightVal}.`,
            `Next do division and multiplication: ${leftVal} ÷ ${D} = ${q}, and ${M} × ${rightVal} = ${rightProd}.`,
            `Finally add them: ${q} + ${rightProd} = ${finalVal}!`
          ],
          eqs: [
            `Solve ${leftStr} and ${rightStr}`,
            `Left = ${leftVal}, Right = ${rightVal}`,
            `${q} + ${rightProd}`,
            `${q} + ${rightProd} = ${finalVal} ✓`
          ]
        };
      }

      p.leftVal = leftVal;
      p.rightVal = rightVal;
      p.final = finalVal;
      p.stepData = stepData;
      p.story = `Solve both bracket bubbles first, then combine:<br><strong>${p.rawExpr}</strong>`;
      p.answers = difficulty === 'large'
        ? [{ label: 'Final answer', value: finalVal }]
        : [
            { label: `First bracket ${leftStr}`, value: leftVal },
            { label: `Second bracket ${rightStr}`, value: rightVal },
            { label: 'Final answer', value: finalVal }
          ];
      p.hint = `Find ${leftStr} = ${leftVal} and ${rightStr} = ${rightVal} first, then follow ×/÷ before +/−.`;
    }

    // 3. nested — Nested Brackets (like 123 + 20 × (12 + 2 × (1 + 3)))
    else if (kind === 'nested') {
      let A, B, C, D, E, F, G = 0, opMid, opIn, opOut, template;
      let innerVal, midVal, outerVal, prodVal, finalVal, rawExpr;

      if (original) {
        template = 'addAdd';
        A = 123; B = 20; C = 12; D = 2; E = 1; F = 3;
        opOut = '+'; opMid = '+'; opIn = '+';
        innerVal = 4; midVal = 8; outerVal = 20; prodVal = 400; finalVal = 523;
        rawExpr = '123 + 20 × (12 + 2 × (1 + 3))';
      } else {
        const templates = difficulty === 'large'
          ? ['addAdd', 'addSubIn', 'subMid', 'subOut', 'divMid', 'trailSub']
          : ['addAdd', 'addSubIn', 'subMid', 'subOut', 'divMid'];
        template = pick(templates);

        if (template === 'addAdd' || template === 'addSubIn' || template === 'trailSub') {
          opIn = template === 'addSubIn' ? '−' : '+';
          E = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? rand(1, 9) : rand(8, 22);
          F = opIn === '+'
            ? (difficulty === 'easy' ? rand(1, 5) : difficulty === 'medium' ? rand(2, 8) : rand(5, 18))
            : rand(1, E - 1);
          innerVal = opIn === '+' ? E + F : E - F;
          D = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(2, 6) : rand(3, 9);
          midVal = D * innerVal;
          C = difficulty === 'easy' ? rand(2, 9) : difficulty === 'medium' ? rand(6, 20) : rand(12, 35);
          outerVal = C + midVal;
          B = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? pick([10, 12, 15, 20, 25]) : rand(12, 35);
          prodVal = B * outerVal;
          A = difficulty === 'easy' ? rand(10, 45) : difficulty === 'medium' ? rand(60, 220) : rand(120, 480);

          if (template === 'trailSub') {
            G = rand(25, Math.min(250, prodVal + A - 10));
            finalVal = A + prodVal - G;
            rawExpr = `${A} + ${B} × (${C} + ${D} × (${E} ${opIn} ${F})) − ${G}`;
          } else {
            finalVal = A + prodVal;
            rawExpr = `${A} + ${B} × (${C} + ${D} × (${E} ${opIn} ${F}))`;
          }
          opOut = '+'; opMid = '+';
        } else if (template === 'subMid') {
          // A + B × (C − D × (E + F))
          E = difficulty === 'easy' ? rand(1, 4) : difficulty === 'medium' ? rand(2, 7) : rand(4, 12);
          F = difficulty === 'easy' ? rand(1, 4) : difficulty === 'medium' ? rand(1, 6) : rand(3, 10);
          innerVal = E + F;
          D = difficulty === 'easy' ? rand(2, 3) : difficulty === 'medium' ? rand(2, 5) : rand(3, 8);
          midVal = D * innerVal;
          const extraC = difficulty === 'easy' ? rand(2, 8) : difficulty === 'medium' ? rand(4, 18) : rand(8, 30);
          C = midVal + extraC;
          outerVal = extraC;
          B = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? pick([10, 15, 20, 25]) : rand(12, 32);
          prodVal = B * outerVal;
          A = difficulty === 'easy' ? rand(10, 50) : difficulty === 'medium' ? rand(80, 250) : rand(150, 500);
          finalVal = A + prodVal;
          opOut = '+'; opMid = '−'; opIn = '+';
          rawExpr = `${A} + ${B} × (${C} − ${D} × (${E} + ${F}))`;
        } else if (template === 'subOut') {
          // A − B × (C + D × (E + F))
          E = difficulty === 'easy' ? rand(1, 3) : difficulty === 'medium' ? rand(1, 6) : rand(3, 10);
          F = difficulty === 'easy' ? rand(1, 3) : difficulty === 'medium' ? rand(1, 5) : rand(2, 8);
          innerVal = E + F;
          D = difficulty === 'easy' ? 2 : rand(2, 4);
          midVal = D * innerVal;
          C = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? rand(4, 12) : rand(8, 22);
          outerVal = C + midVal;
          B = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? pick([5, 10, 12, 15]) : rand(8, 20);
          prodVal = B * outerVal;
          const rem = difficulty === 'easy' ? rand(8, 40) : difficulty === 'medium' ? rand(20, 120) : rand(50, 300);
          A = prodVal + rem;
          finalVal = rem;
          opOut = '−'; opMid = '+'; opIn = '+';
          rawExpr = `${A} − ${B} × (${C} + ${D} × (${E} + ${F}))`;
        } else {
          // divMid: A + B × (C + M ÷ (E + F))
          E = difficulty === 'easy' ? rand(1, 3) : difficulty === 'medium' ? rand(2, 5) : rand(3, 8);
          F = difficulty === 'easy' ? rand(1, 3) : difficulty === 'medium' ? rand(1, 5) : rand(2, 7);
          innerVal = E + F;
          const q = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? rand(4, 12) : rand(6, 18);
          const M = innerVal * q;
          D = M; // hold numerator of division
          midVal = q;
          C = difficulty === 'easy' ? rand(2, 8) : difficulty === 'medium' ? rand(5, 18) : rand(10, 32);
          outerVal = C + q;
          B = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? pick([10, 15, 20, 25]) : rand(12, 30);
          prodVal = B * outerVal;
          A = difficulty === 'easy' ? rand(10, 45) : difficulty === 'medium' ? rand(60, 200) : rand(120, 450);
          finalVal = A + prodVal;
          opOut = '+'; opMid = '+'; opIn = '+';
          rawExpr = `${A} + ${B} × (${C} + ${M} ÷ (${E} + ${F}))`;
        }
      }

      p.template = template;
      p.A = A; p.B = B; p.C = C; p.D = D; p.E = E; p.F = F; p.G = G;
      p.opOut = opOut; p.opMid = opMid; p.opIn = opIn;
      p.innerVal = innerVal; p.midVal = midVal; p.outerVal = outerVal; p.prodVal = prodVal; p.final = finalVal;
      p.rawExpr = rawExpr;

      const isDivMid = template === 'divMid';
      const innerStr = `(${E} ${opIn} ${F})`;
      const midOpSym = isDivMid ? '÷' : '×';
      const midPart = isDivMid ? `${D} ÷ ${innerStr}` : `${D} × ${innerStr}`;
      const midCollapsed = isDivMid ? `${D} ÷ ${res(innerVal)}` : `${D} × ${res(innerVal)}`;
      const trailStr = G ? ` − ${G}` : '';

      const rows = [
        { html: `${A} ${opOut} ${B} × ${outerWrap(`${C} ${opMid} ${isDivMid ? `${D} ÷ ` : `${D} × `}${foc(innerStr)}`)}${trailStr}`, tag: 'Inner ( )' },
        { html: `${A} ${opOut} ${B} × ${outerWrap(`${C} ${opMid} ${foc(midCollapsed)}`)}${trailStr}`, tag: isDivMid ? '÷ inside ( )' : '× inside ( )' },
        { html: `${A} ${opOut} ${B} × ${foc(outerWrap(`${C} ${opMid} ${res(midVal)}`))}${trailStr}`, tag: 'Outer ( )' },
        { html: `${A} ${opOut} ${foc(`${B} × ${res(outerVal)}`)}${trailStr}`, tag: '× outside' }
      ];
      if (G) {
        rows.push({ html: `${foc(`${A} + ${res(prodVal)}`)} − ${G}`, tag: 'Left to right' });
        rows.push({ html: `${foc(`${res(A + prodVal)} − ${G}`)}`, tag: 'Subtract' });
      } else {
        rows.push({ html: `${foc(`${A} ${opOut} ${res(prodVal)}`)}`, tag: opOut === '+' ? 'Add' : 'Subtract' });
      }
      rows.push({ html: `${res(finalVal)}`, tag: 'Final ✓', final: true });

      const descs = [
        `Two layers of brackets! Start with the deepest inner bubble: (${E} ${opIn} ${F}).`,
        `Inner bubble first: ${E} ${opIn} ${F} = ${innerVal}. Now do ${isDivMid ? 'division' : 'multiplication'} inside the outer brackets: ${midPart.replace(innerStr, String(innerVal))}.`,
        `${isDivMid ? `${D} ÷ ${innerVal}` : `${D} × ${innerVal}`} = ${midVal}. Finish inside the outer brackets: ${C} ${opMid} ${midVal}.`,
        `The outer brackets collapse to ${outerVal}! Next multiply outside: ${B} × ${outerVal} = ${prodVal}.`,
        G
          ? `Now work left to right: ${A} + ${prodVal} = ${A + prodVal}, then subtract ${G}.`
          : `Finally ${opOut === '+' ? 'add' : 'subtract'}: ${A} ${opOut} ${prodVal} = ${finalVal}!`,
        ...(G ? [`Subtract ${G}: ${A + prodVal} − ${G} = ${finalVal}!`] : []),
        `Peeling from the inside out gives ${finalVal}!`
      ];

      const eqs = [
        `Inner ( ): ${E} ${opIn} ${F} = ?`,
        `${E} ${opIn} ${F} = ${innerVal}`,
        `${isDivMid ? `${D} ÷ ${innerVal}` : `${D} × ${innerVal}`} = ${midVal} → ${C} ${opMid} ${midVal} = ${outerVal}`,
        `${B} × ${outerVal} = ${prodVal}`,
        G ? `${A} + ${prodVal} = ${A + prodVal}` : `${A} ${opOut} ${prodVal} = ${finalVal} ✓`,
        ...(G ? [`${A + prodVal} − ${G} = ${finalVal} ✓`] : []),
        `${rawExpr} = ${finalVal} ✓`
      ];

      p.stepData = { rows, descs, eqs, hasTrail: Boolean(G) };
      p.story = `Peel the nested brackets from the inside out:<br><strong>${rawExpr}</strong>`;
      if (difficulty === 'easy') {
        p.answers = [
          { label: `Innermost bracket ${innerStr}`, value: innerVal },
          { label: 'Outer bracket value', value: outerVal },
          { label: 'Final answer', value: finalVal }
        ];
      } else if (difficulty === 'medium') {
        p.answers = [
          { label: 'Outer bracket value', value: outerVal },
          { label: 'Final answer', value: finalVal }
        ];
      } else {
        p.answers = [{ label: 'Final answer', value: finalVal }];
      }
      p.hint = `1) Solve inner ${innerStr} = ${innerVal}. 2) Multiply/divide inside outer ( ) to get ${midVal}, then find outer ( ) = ${outerVal}. 3) Multiply ${B} × ${outerVal} = ${prodVal} before ${opOut === '+' ? 'adding' : 'subtracting'} ${A}.`;
    }

    // 4. mixedNest — Order Traps inside & around brackets
    else if (kind === 'mixedNest') {
      const trap = pick(['subDivIn', 'nestThenDiv', 'subDivNest', 'twoTermMix']);
      p.trap = trap;

      let outerVal, finalVal, rawExpr, stepData;

      if (trap === 'subDivIn') {
        // A + B × (C − M ÷ D)
        const D = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(4, 9) : rand(6, 14);
        const q = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? rand(4, 12) : rand(8, 20);
        const M = D * q;
        const extra = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? rand(5, 16) : rand(10, 30);
        const C = q + extra;
        outerVal = extra;
        const B = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(4, 12) : rand(10, 25);
        const prod = B * outerVal;
        const A = difficulty === 'easy' ? rand(10, 35) : difficulty === 'medium' ? rand(40, 150) : rand(120, 420);
        finalVal = A + prod;
        rawExpr = `${A} + ${B} × (${C} − ${M} ÷ ${D})`;
        stepData = {
          rows: [
            { html: `${A} + ${B} × ${outerWrap(`${C} − ${foc(`${M} ÷ ${D}`)}`)}`, tag: 'Trap: ÷ first!' },
            { html: `${A} + ${B} × ${foc(outerWrap(`${C} − ${res(q)}`))}`, tag: 'Finish ( )' },
            { html: `${A} + ${foc(`${B} × ${res(outerVal)}`)}`, tag: 'Multiply' },
            { html: `${foc(`${A} + ${res(prod)}`)}`, tag: 'Add' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          rules: ['muldiv', 'inner', 'muldiv', 'addsub', 'addsub'],
          descs: [
            `Careful! Inside the brackets (${C} − ${M} ÷ ${D}), do NOT subtract first—division beats subtraction!`,
            `Divide inside the brackets first: ${M} ÷ ${D} = ${q}. Now subtract: ${C} − ${q} = ${outerVal}.`,
            `Multiply outside the brackets: ${B} × ${outerVal} = ${prod}.`,
            `Finally add: ${A} + ${prod} = ${finalVal}!`,
            `Order trap cleared: ${rawExpr} = ${finalVal}!`
          ],
          eqs: [
            `Inside ( ): do ${M} ÷ ${D} before subtracting`,
            `${M} ÷ ${D} = ${q} → ${C} − ${q} = ${outerVal}`,
            `${B} × ${outerVal} = ${prod}`,
            `${A} + ${prod} = ${finalVal} ✓`,
            `${rawExpr} = ${finalVal} ✓`
          ]
        };
      } else if (trap === 'nestThenDiv') {
        // (A − B × (C + D)) ÷ K + E
        const C = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(3, 8) : rand(5, 14);
        const D = difficulty === 'easy' ? rand(1, 4) : difficulty === 'medium' ? rand(2, 7) : rand(4, 12);
        const inner = C + D;
        const B = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(3, 7) : rand(4, 10);
        const mid = B * inner;
        const K = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(3, 7) : rand(4, 10);
        const q = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? rand(4, 12) : rand(8, 22);
        outerVal = K * q;
        const A = mid + outerVal;
        const E = difficulty === 'easy' ? rand(5, 25) : difficulty === 'medium' ? rand(15, 80) : rand(40, 250);
        finalVal = q + E;
        rawExpr = `(${A} − ${B} × (${C} + ${D})) ÷ ${K} + ${E}`;
        stepData = {
          rows: [
            { html: `${outerWrap(`${A} − ${B} × ${foc(`(${C} + ${D})`)}`)} ÷ ${K} + ${E}`, tag: 'Inner ( )' },
            { html: `${outerWrap(`${A} − ${foc(`${B} × ${res(inner)}`)}`)} ÷ ${K} + ${E}`, tag: '× inside ( )' },
            { html: `${foc(outerWrap(`${A} − ${res(mid)}`))} ÷ ${K} + ${E}`, tag: 'Finish outer ( )' },
            { html: `${foc(`${res(outerVal)} ÷ ${K}`)} + ${E}`, tag: 'Divide' },
            { html: `${foc(`${res(q)} + ${E}`)}`, tag: 'Add' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          rules: ['inner', 'muldiv', 'inner', 'muldiv', 'addsub', 'addsub'],
          descs: [
            `Peel the innermost bracket (${C} + ${D}) first.`,
            `${C} + ${D} = ${inner}. Inside the outer brackets, multiply ${B} × ${inner} before subtracting from ${A}!`,
            `${B} × ${inner} = ${mid}. Finish the outer brackets: ${A} − ${mid} = ${outerVal}.`,
            `Divide the outer bracket result by ${K}: ${outerVal} ÷ ${K} = ${q}.`,
            `Finally add ${E}: ${q} + ${E} = ${finalVal}!`,
            `Solved cleanly: ${finalVal}!`
          ],
          eqs: [
            `Inner ( ): ${C} + ${D} = ${inner}`,
            `${B} × ${inner} = ${mid}`,
            `Outer ( ): ${A} − ${mid} = ${outerVal}`,
            `${outerVal} ÷ ${K} = ${q}`,
            `${q} + ${E} = ${finalVal} ✓`,
            `${rawExpr} = ${finalVal} ✓`
          ]
        };
      } else if (trap === 'subDivNest') {
        // A − B × (C + M ÷ (E − F))
        const E = difficulty === 'easy' ? rand(4, 8) : difficulty === 'medium' ? rand(6, 14) : rand(10, 22);
        const d = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(3, 6) : rand(4, 9);
        const F = E - d;
        const q = difficulty === 'easy' ? rand(2, 6) : difficulty === 'medium' ? rand(4, 10) : rand(6, 16);
        const M = d * q;
        const C = difficulty === 'easy' ? rand(2, 7) : difficulty === 'medium' ? rand(5, 14) : rand(10, 25);
        outerVal = C + q;
        const B = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(3, 8) : rand(6, 15);
        const prod = B * outerVal;
        const rem = difficulty === 'easy' ? rand(6, 30) : difficulty === 'medium' ? rand(20, 90) : rand(45, 250);
        const A = prod + rem;
        finalVal = rem;
        rawExpr = `${A} − ${B} × (${C} + ${M} ÷ (${E} − ${F}))`;
        stepData = {
          rows: [
            { html: `${A} − ${B} × ${outerWrap(`${C} + ${M} ÷ ${foc(`(${E} − ${F})`)}`)}`, tag: 'Inner ( )' },
            { html: `${A} − ${B} × ${outerWrap(`${C} + ${foc(`${M} ÷ ${res(d)}`)}`)}`, tag: '÷ inside ( )' },
            { html: `${A} − ${B} × ${foc(outerWrap(`${C} + ${res(q)}`))}`, tag: 'Outer ( )' },
            { html: `${A} − ${foc(`${B} × ${res(outerVal)}`)}`, tag: '× outside' },
            { html: `${foc(`${A} − ${res(prod)}`)}`, tag: 'Subtract' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          rules: ['inner', 'muldiv', 'inner', 'muldiv', 'addsub', 'addsub'],
          descs: [
            `Start at the innermost bubble (${E} − ${F}).`,
            `${E} − ${F} = ${d}. Next divide ${M} ÷ ${d} before adding ${C}!`,
            `${M} ÷ ${d} = ${q}. Add inside outer brackets: ${C} + ${q} = ${outerVal}.`,
            `Multiply outside (do not subtract from ${A} yet!): ${B} × ${outerVal} = ${prod}.`,
            `Finally subtract from ${A}: ${A} − ${prod} = ${finalVal}!`,
            `Solved cleanly: ${finalVal}!`
          ],
          eqs: [
            `Inner ( ): ${E} − ${F} = ${d}`,
            `${M} ÷ ${d} = ${q}`,
            `Outer ( ): ${C} + ${q} = ${outerVal}`,
            `${B} × ${outerVal} = ${prod}`,
            `${A} − ${prod} = ${finalVal} ✓`,
            `${rawExpr} = ${finalVal} ✓`
          ]
        };
      } else {
        // twoTermMix: A × B + C × (D − E × F)
        const E = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(3, 7) : rand(5, 12);
        const F = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(3, 8) : rand(4, 11);
        const innerProd = E * F;
        const extra = difficulty === 'easy' ? rand(2, 7) : difficulty === 'medium' ? rand(4, 15) : rand(8, 26);
        const D = innerProd + extra;
        outerVal = extra;
        const A = difficulty === 'easy' ? rand(3, 8) : difficulty === 'medium' ? rand(6, 15) : rand(12, 28);
        const B = difficulty === 'easy' ? rand(3, 8) : difficulty === 'medium' ? rand(5, 14) : rand(10, 24);
        const leftProd = A * B;
        const C = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(4, 12) : rand(8, 20);
        const rightProd = C * outerVal;
        finalVal = leftProd + rightProd;
        rawExpr = `${A} × ${B} + ${C} × (${D} − ${E} × ${F})`;
        stepData = {
          rows: [
            { html: `${A} × ${B} + ${C} × ${outerWrap(`${D} − ${foc(`${E} × ${F}`)}`)}`, tag: '× inside ( )' },
            { html: `${A} × ${B} + ${C} × ${foc(outerWrap(`${D} − ${res(innerProd)}`))}`, tag: 'Finish ( )' },
            { html: `${foc(`${A} × ${B}`)} + ${foc(`${C} × ${res(outerVal)}`)}`, tag: 'Multiply both' },
            { html: `${foc(`${res(leftProd)} + ${res(rightProd)}`)}`, tag: 'Add' },
            { html: `${res(finalVal)}`, tag: 'Final ✓', final: true }
          ],
          rules: ['muldiv', 'inner', 'muldiv', 'addsub', 'addsub'],
          descs: [
            `Inside (${D} − ${E} × ${F}), multiply ${E} × ${F} before subtracting from ${D}!`,
            `${E} × ${F} = ${innerProd}. Finish the bracket: ${D} − ${innerProd} = ${outerVal}.`,
            `Now multiply both sides: ${A} × ${B} = ${leftProd} and ${C} × ${outerVal} = ${rightProd}.`,
            `Finally add the two products: ${leftProd} + ${rightProd} = ${finalVal}!`,
            `Trap avoided: ${finalVal}!`
          ],
          eqs: [
            `Inside ( ): ${E} × ${F} = ${innerProd}`,
            `${D} − ${innerProd} = ${outerVal}`,
            `${A} × ${B} = ${leftProd} and ${C} × ${outerVal} = ${rightProd}`,
            `${leftProd} + ${rightProd} = ${finalVal} ✓`,
            `${rawExpr} = ${finalVal} ✓`
          ]
        };
      }

      p.outerVal = outerVal;
      p.final = finalVal;
      p.rawExpr = rawExpr;
      p.stepData = stepData;
      p.story = `Watch out for order traps! Always do <strong>× and ÷ before + and −</strong>, even inside brackets:<br><strong>${rawExpr}</strong>`;
      p.answers = difficulty === 'large'
        ? [{ label: 'Final answer', value: finalVal }]
        : [
            { label: 'Value inside outer ( )', value: outerVal },
            { label: 'Final answer', value: finalVal }
          ];
      p.hint = `Inside every bracket, check for × or ÷ before + or −. The outer bracket collapses to ${outerVal}.`;
    }

    // 5. addBrackets — Place the brackets to hit the target number
    else if (kind === 'addBrackets') {
      let baseExpr, candidates, noBrVal;

      for (let attempt = 0; attempt < 60; attempt++) {
        if (difficulty === 'easy') {
          const a = rand(2, 7), b = rand(2, 6), c = rand(2, 6), d = rand(2, 6);
          if (Math.random() < 0.6) {
            baseExpr = `${a} + ${b} × ${c} + ${d}`;
            candidates = [
              `(${a} + ${b}) × ${c} + ${d}`,
              `${a} + ${b} × (${c} + ${d})`,
              `(${a} + ${b}) × (${c} + ${d})`
            ];
          } else {
            const bigC = rand(5, 9), smallD = rand(1, bigC - 2);
            baseExpr = `${a} + ${b} × ${bigC} − ${smallD}`;
            candidates = [
              `(${a} + ${b}) × ${bigC} − ${smallD}`,
              `${a} + ${b} × (${bigC} − ${smallD})`,
              `(${a} + ${b}) × (${bigC} − ${smallD})`
            ];
          }
        } else if (difficulty === 'medium') {
          const a = rand(3, 12), b = rand(2, 8), c = rand(4, 12), d = rand(2, 8);
          if (Math.random() < 0.5) {
            baseExpr = `${a} × ${b} + ${c} × ${d}`;
            candidates = [
              `${a} × (${b} + ${c}) × ${d}`,
              `(${a} × ${b} + ${c}) × ${d}`,
              `${a} × (${b} + ${c} × ${d})`,
              `${a} × ${b} + ${c} × ${d}`
            ];
          } else {
            baseExpr = `${a} + ${b} × ${c} + ${d}`;
            candidates = [
              `(${a} + ${b}) × ${c} + ${d}`,
              `${a} + ${b} × (${c} + ${d})`,
              `(${a} + ${b}) × (${c} + ${d})`,
              `${a} + ${b} × ${c} + ${d}`
            ];
          }
        } else {
          // large: 5 numbers with nested bracket options!
          const a = rand(3, 12), b = rand(2, 6), c = rand(3, 10), d = rand(2, 5), e = rand(2, 6);
          baseExpr = `${a} + ${b} × ${c} + ${d} × ${e}`;
          candidates = [
            `${a} + ${b} × (${c} + ${d} × ${e})`,
            `${a} + ${b} × ((${c} + ${d}) × ${e})`,
            `(${a} + ${b}) × (${c} + ${d} × ${e})`,
            `(${a} + ${b} × ${c} + ${d}) × ${e}`
          ];
        }

        noBrVal = evalMathStr(baseExpr);
        const evaluated = candidates.map(expr => ({ expr, val: evalMathStr(expr) }));
        const vals = evaluated.map(x => x.val);
        const allPositive = vals.every(v => Number.isInteger(v) && v > 0);
        const allDistinct = new Set(vals).size === vals.length;
        const bracketed = evaluated.filter(x => x.expr !== baseExpr && x.val !== noBrVal);

        if (allPositive && allDistinct && bracketed.length >= 2) {
          const winner = pick(bracketed);
          const shuffled = shuffle(evaluated);
          p.baseExpr = baseExpr;
          p.noBrVal = noBrVal;
          p.evaluated = shuffled;
          p.winner = winner;
          p.target = winner.val;
          p.final = winner.val;
          p.rawExpr = winner.expr;
          p.story = `Look at this expression without brackets: <strong>${baseExpr}</strong> (= ${fmt(noBrVal)}).<br>Which bracket placement makes the answer equal <strong>${fmt(winner.val)}</strong>?`;
          p.answers = [
            {
              type: 'choice',
              label: `Which expression equals ${fmt(winner.val)}?`,
              options: shuffled.map(x => x.expr),
              value: winner.expr
            }
          ];
          p.hint = `Without brackets, × happens first to give ${fmt(noBrVal)}. Test the inner ( ) of each option to see which lands on ${fmt(winner.val)}!`;
          break;
        }
      }
      if (!p.rawExpr) {
        // Guaranteed deterministic fallback
        p.baseExpr = '4 + 3 × 5 + 2';
        p.noBrVal = 21;
        p.evaluated = [
          { expr: '(4 + 3) × 5 + 2', val: 37 },
          { expr: '4 + 3 × (5 + 2)', val: 25 },
          { expr: '(4 + 3) × (5 + 2)', val: 49 }
        ];
        p.winner = p.evaluated[1];
        p.target = 25;
        p.final = 25;
        p.rawExpr = '4 + 3 × (5 + 2)';
        p.story = `Look at this expression without brackets: <strong>4 + 3 × 5 + 2</strong> (= 21).<br>Which bracket placement makes the answer equal <strong>25</strong>?`;
        p.answers = [{ type: 'choice', label: 'Which expression equals 25?', options: p.evaluated.map(x => x.expr), value: '4 + 3 × (5 + 2)' }];
        p.hint = 'Without brackets, 4 + 15 + 2 = 21. Try grouping (5 + 2) first!';
      }
    }

    // 6. missingInBracket — Mystery number □ inside brackets
    else if (kind === 'missingInBracket') {
      const variant = difficulty === 'easy'
        ? 'oneAdd'
        : difficulty === 'medium'
          ? pick(['oneSub', 'nestAdd'])
          : pick(['nestSubIn', 'nestSubOut']);
      p.variant = variant;

      let x, outerVal, total, rawExpr, storyExpr, steps;

      if (variant === 'oneAdd') {
        // A + B × (□ + C) = T
        x = rand(2, 9);
        const C = rand(2, 8);
        outerVal = x + C;
        const B = rand(2, 6);
        const prod = B * outerVal;
        const A = rand(6, 30);
        total = A + prod;
        rawExpr = `${A} + ${B} × (□ + ${C})`;
        storyExpr = `${rawExpr} = ${fmt(total)}`;
        steps = [
          {
            title: 'See the outer shell',
            description: `Cover up ${B} × (□ + ${C}) as one big piece. ${A} plus that piece equals ${total}.`,
            diagram: buildLadder('addsub', [
              { html: `${A} + ${foc(`${B} × (□ + ${C})`)} = ${total}`, tag: 'Equation' },
              { html: `${foc(`${B} × (□ + ${C})`)} = ${total} − ${A} = ${res(prod)}`, tag: 'Undo +' }
            ], 1),
            equation: `${total} − ${A} = ${prod}`
          },
          {
            title: 'Peel off the × ' + B,
            description: `${B} groups of (□ + ${C}) equal ${prod}. Divide by ${B} to find what is inside the brackets.`,
            diagram: buildLadder('muldiv', [
              { html: `${B} × ${foc(`(□ + ${C})`)} = ${prod}`, tag: 'Product' },
              { html: `${foc(`□ + ${C}`)} = ${prod} ÷ ${B} = ${res(outerVal)}`, tag: `Undo × ${B}` }
            ], 1),
            equation: `${prod} ÷ ${B} = ${outerVal}`
          },
          {
            title: 'Find the mystery number □',
            description: `Inside the brackets, □ + ${C} = ${outerVal}. Subtract ${C} to uncover □!`,
            diagram: buildLadder('inner', [
              { html: `${foc(`□ + ${C}`)} = ${outerVal}`, tag: 'Inside ( )' },
              { html: `□ = ${outerVal} − ${C} = ${res(x)}`, tag: 'Found □ ✓', final: true }
            ], 1),
            equation: `□ = ${outerVal} − ${C} = ${x}`
          },
          {
            title: 'Check forward!',
            description: `Plug □ = ${x} back into the expression: ${A} + ${B} × (${x} + ${C}) = ${A} + ${B} × ${outerVal} = ${total}.`,
            diagram: buildLadder('inner', [
              { html: `${A} + ${B} × (${res(x)} + ${C})`, tag: 'Plug in' },
              { html: `${A} + ${B} × ${res(outerVal)} = ${res(total)}`, tag: 'Matches ✓', final: true }
            ], 1),
            equation: `${A} + ${B} × (${x} + ${C}) = ${total} ✓`
          }
        ];
      } else if (variant === 'oneSub') {
        // A − B × (□ + C) = T
        x = rand(3, 12);
        const C = rand(2, 9);
        outerVal = x + C;
        const B = rand(3, 9);
        const prod = B * outerVal;
        total = rand(6, 35);
        const A = prod + total;
        rawExpr = `${A} − ${B} × (□ + ${C})`;
        storyExpr = `${rawExpr} = ${fmt(total)}`;
        steps = [
          {
            title: 'Find what was subtracted',
            description: `${A} minus the block ${B} × (□ + ${C}) leaves ${total}. So that block equals ${A} − ${total} = ${prod}.`,
            diagram: buildLadder('addsub', [
              { html: `${A} − ${foc(`${B} × (□ + ${C})`)} = ${total}`, tag: 'Equation' },
              { html: `${foc(`${B} × (□ + ${C})`)} = ${A} − ${total} = ${res(prod)}`, tag: 'Subtracted part' }
            ], 1),
            equation: `${A} − ${total} = ${prod}`
          },
          {
            title: 'Peel off the × ' + B,
            description: `Divide ${prod} by ${B} to uncover the bracket (□ + ${C}).`,
            diagram: buildLadder('muldiv', [
              { html: `${B} × ${foc(`(□ + ${C})`)} = ${prod}`, tag: 'Product' },
              { html: `${foc(`□ + ${C}`)} = ${prod} ÷ ${B} = ${res(outerVal)}`, tag: `Undo × ${B}` }
            ], 1),
            equation: `${prod} ÷ ${B} = ${outerVal}`
          },
          {
            title: 'Uncover □',
            description: `Since □ + ${C} = ${outerVal}, subtract ${C} to get □ = ${x}.`,
            diagram: buildLadder('inner', [
              { html: `□ + ${C} = ${outerVal}`, tag: 'Inside ( )' },
              { html: `□ = ${outerVal} − ${C} = ${res(x)}`, tag: 'Found □ ✓', final: true }
            ], 1),
            equation: `□ = ${outerVal} − ${C} = ${x}`
          },
          {
            title: 'Check forward!',
            description: `${A} − ${B} × (${x} + ${C}) = ${A} − ${B} × ${outerVal} = ${A} − ${prod} = ${total}.`,
            diagram: buildLadder('inner', [
              { html: `${A} − ${B} × (${res(x)} + ${C}) = ${res(total)}`, tag: 'Matches ✓', final: true }
            ], 0),
            equation: `${A} − ${B} × (${x} + ${C}) = ${total} ✓`
          }
        ];
      } else if (variant === 'nestAdd') {
        // A + B × (C + D × (□ + E)) = T
        x = rand(2, 9);
        const E = rand(1, 7);
        const inner = x + E;
        const D = rand(2, 5);
        const mid = D * inner;
        const C = rand(4, 15);
        outerVal = C + mid;
        const B = pick([5, 10, 12, 20]);
        const prod = B * outerVal;
        const A = rand(20, 140);
        total = A + prod;
        rawExpr = `${A} + ${B} × (${C} + ${D} × (□ + ${E}))`;
        storyExpr = `${rawExpr} = ${fmt(total)}`;
        steps = [
          {
            title: 'Peel off the outside +' + A + ' and ×' + B,
            description: `Subtract ${A}: ${total} − ${A} = ${prod}. Then divide by ${B} to find the whole outer bracket.`,
            diagram: buildLadder('muldiv', [
              { html: `${B} × ${outerWrap(`${C} + ${D} × (□ + ${E})`)} = ${total} − ${A} = ${res(prod)}`, tag: 'Undo + ' + A },
              { html: `${outerWrap(`${C} + ${D} × (□ + ${E})`)} = ${prod} ÷ ${B} = ${res(outerVal)}`, tag: `Undo × ${B}` }
            ], 1),
            equation: `(${total} − ${A}) ÷ ${B} = ${outerVal}`
          },
          {
            title: 'Peel off ' + C + ' inside the outer bracket',
            description: `Now we know ${C} + ${D} × (□ + ${E}) = ${outerVal}. Subtract ${C} to isolate ${D} × (□ + ${E}).`,
            diagram: buildLadder('addsub', [
              { html: `${C} + ${foc(`${D} × (□ + ${E})`)} = ${outerVal}`, tag: 'Outer ( )' },
              { html: `${D} × (□ + ${E}) = ${outerVal} − ${C} = ${res(mid)}`, tag: `Undo + ${C}` }
            ], 1),
            equation: `${outerVal} − ${C} = ${mid}`
          },
          {
            title: 'Divide by ' + D + ' to open the inner bracket',
            description: `${D} × (□ + ${E}) = ${mid}. Divide by ${D}: ${mid} ÷ ${D} = ${inner}.`,
            diagram: buildLadder('inner', [
              { html: `${D} × (□ + ${E}) = ${mid}`, tag: 'Inner ×' },
              { html: `□ + ${E} = ${mid} ÷ ${D} = ${res(inner)}`, tag: `Undo × ${D}` }
            ], 1),
            equation: `${mid} ÷ ${D} = ${inner}`
          },
          {
            title: 'Find □ and check!',
            description: `□ + ${E} = ${inner}, so □ = ${inner} − ${E} = ${x}! Forward check: ${A} + ${B} × (${C} + ${D} × (${x} + ${E})) = ${total}.`,
            diagram: buildLadder('inner', [
              { html: `□ = ${inner} − ${E} = ${res(x)}`, tag: 'Found □' },
              { html: `${A} + ${B} × (${C} + ${D} × (${res(x)} + ${E})) = ${res(total)}`, tag: 'Matches ✓', final: true }
            ], 1),
            equation: `□ = ${x} ✓`
          }
        ];
      } else if (variant === 'nestSubIn') {
        // A + B × (C + D × (□ − E)) = T
        const E = rand(2, 8);
        x = E + rand(2, 12);
        const inner = x - E;
        const D = rand(2, 6);
        const mid = D * inner;
        const C = rand(5, 20);
        outerVal = C + mid;
        const B = rand(8, 22);
        const prod = B * outerVal;
        const A = rand(30, 180);
        total = A + prod;
        rawExpr = `${A} + ${B} × (${C} + ${D} × (□ − ${E}))`;
        storyExpr = `${rawExpr} = ${fmt(total)}`;
        steps = [
          {
            title: 'Peel outside-in: undo +' + A + ' and ×' + B,
            description: `Subtract ${A} (${total} − ${A} = ${prod}), then divide by ${B} to get the outer bracket: ${prod} ÷ ${B} = ${outerVal}.`,
            diagram: buildLadder('muldiv', [
              { html: `${B} × ${outerWrap(`${C} + ${D} × (□ − ${E})`)} = ${res(prod)}`, tag: `Undo + ${A}` },
              { html: `${outerWrap(`${C} + ${D} × (□ − ${E})`)} = ${res(outerVal)}`, tag: `Undo × ${B}` }
            ], 1),
            equation: `(${total} − ${A}) ÷ ${B} = ${outerVal}`
          },
          {
            title: 'Undo +' + C + ' and ×' + D,
            description: `Subtract ${C}: ${outerVal} − ${C} = ${mid}. Then divide by ${D}: ${mid} ÷ ${D} = ${inner}.`,
            diagram: buildLadder('muldiv', [
              { html: `${D} × (□ − ${E}) = ${outerVal} − ${C} = ${res(mid)}`, tag: `Undo + ${C}` },
              { html: `□ − ${E} = ${mid} ÷ ${D} = ${res(inner)}`, tag: `Undo × ${D}` }
            ], 1),
            equation: `(${outerVal} − ${C}) ÷ ${D} = ${inner}`
          },
          {
            title: 'Add ' + E + ' back to find □',
            description: `Since □ − ${E} = ${inner}, add ${E} back: □ = ${inner} + ${E} = ${x}!`,
            diagram: buildLadder('inner', [
              { html: `□ − ${E} = ${inner}`, tag: 'Inner ( )' },
              { html: `□ = ${inner} + ${E} = ${res(x)}`, tag: 'Found □ ✓', final: true }
            ], 1),
            equation: `□ = ${inner} + ${E} = ${x}`
          },
          {
            title: 'Verify forward',
            description: `${A} + ${B} × (${C} + ${D} × (${x} − ${E})) = ${A} + ${B} × ${outerVal} = ${total}.`,
            diagram: buildLadder('inner', [
              { html: `${A} + ${B} × (${C} + ${D} × (${res(x)} − ${E})) = ${res(total)}`, tag: 'Matches ✓', final: true }
            ], 0),
            equation: `${rawExpr.replace('□', String(x))} = ${total} ✓`
          }
        ];
      } else {
        // nestSubOut: A − B × (C + D × (□ + E)) = T
        x = rand(2, 10);
        const E = rand(2, 7);
        const inner = x + E;
        const D = rand(2, 5);
        const mid = D * inner;
        const C = rand(4, 15);
        outerVal = C + mid;
        const B = rand(4, 15);
        const prod = B * outerVal;
        total = rand(15, 95);
        const A = prod + total;
        rawExpr = `${A} − ${B} × (${C} + ${D} × (□ + ${E}))`;
        storyExpr = `${rawExpr} = ${fmt(total)}`;
        steps = [
          {
            title: 'Find the subtracted chunk',
            description: `${A} minus the big product leaves ${total}. So ${B} × (${C} + ${D} × (□ + ${E})) = ${A} − ${total} = ${prod}.`,
            diagram: buildLadder('addsub', [
              { html: `${A} − ${foc(`${B} × (...)`)} = ${total}`, tag: 'Equation' },
              { html: `${B} × ${outerWrap(`${C} + ${D} × (□ + ${E})`)} = ${res(prod)}`, tag: 'Subtracted chunk' }
            ], 1),
            equation: `${A} − ${total} = ${prod}`
          },
          {
            title: 'Peel off ×' + B + ' and +' + C,
            description: `Divide by ${B}: ${prod} ÷ ${B} = ${outerVal}. Then subtract ${C}: ${outerVal} − ${C} = ${mid}.`,
            diagram: buildLadder('muldiv', [
              { html: `${C} + ${D} × (□ + ${E}) = ${res(outerVal)}`, tag: `Undo × ${B}` },
              { html: `${D} × (□ + ${E}) = ${res(mid)}`, tag: `Undo + ${C}` }
            ], 1),
            equation: `${prod} ÷ ${B} = ${outerVal} → ${outerVal} − ${C} = ${mid}`
          },
          {
            title: 'Open the inner bracket',
            description: `Divide by ${D}: ${mid} ÷ ${D} = ${inner}. Then subtract ${E}: □ = ${inner} − ${E} = ${x}!`,
            diagram: buildLadder('inner', [
              { html: `□ + ${E} = ${mid} ÷ ${D} = ${res(inner)}`, tag: `Undo × ${D}` },
              { html: `□ = ${inner} − ${E} = ${res(x)}`, tag: 'Found □ ✓', final: true }
            ], 1),
            equation: `□ = ${inner} − ${E} = ${x}`
          },
          {
            title: 'Verify forward',
            description: `${A} − ${B} × (${C} + ${D} × (${x} + ${E})) = ${A} − ${prod} = ${total}.`,
            diagram: buildLadder('inner', [
              { html: `${A} − ${B} × (${C} + ${D} × (${res(x)} + ${E})) = ${res(total)}`, tag: 'Matches ✓', final: true }
            ], 0),
            equation: `${rawExpr.replace('□', String(x))} = ${total} ✓`
          }
        ];
      }

      p.x = x;
      p.outerVal = outerVal;
      p.target = total;
      p.final = x;
      p.rawExpr = rawExpr;
      p.storyExpr = storyExpr;
      p.steps = steps;
      p.story = `Find the mystery number <strong>□</strong> that makes this equation true:<br><strong>${storyExpr}</strong>`;
      p.answers = difficulty === 'large'
        ? [{ label: 'Mystery number □', value: x }]
        : [
            { label: 'Value of outer bracket', value: outerVal },
            { label: 'Mystery number □', value: x }
          ];
      p.hint = `Peel from the outside in! First isolate the outer bracket to find ${outerVal}, then work inward to uncover □.`;
    }

    else {
      throw new Error('Unknown problem kind: ' + kind);
    }

    return p;
  }

  // ---------- Visual Explanations (stepsFor) ----------
  function stepsFor(p) {
    if (p.kind === 'oneBracket') {
      const { rows, descs, eqs, ruleAfter1 } = p.stepData;
      return [
        { title: 'Spot the brackets', description: descs[0], diagram: buildLadder('inner', rows.slice(0, 1), 0), equation: eqs[0] },
        { title: 'Solve inside the brackets', description: descs[1], diagram: buildLadder(ruleAfter1, rows.slice(0, 2), 1), equation: eqs[1] },
        { title: 'Do × or ÷ next', description: descs[2], diagram: buildLadder('addsub', rows.slice(0, 3), 2), equation: eqs[2] },
        { title: 'Finish the last step', description: descs[3], diagram: buildLadder('addsub', rows, 3), equation: eqs[3] }
      ];
    }

    if (p.kind === 'twoBrackets') {
      const { rows, rules, descs, eqs } = p.stepData;
      return [
        { title: 'Spot both bracket bubbles', description: descs[0], diagram: buildLadder(rules[0], rows.slice(0, 1), 0), equation: eqs[0] },
        { title: 'Solve both bracket bubbles', description: descs[1], diagram: buildLadder(rules[1], rows.slice(0, 2), 1), equation: eqs[1] },
        { title: 'Do × and ÷ next', description: descs[2], diagram: buildLadder(rules[2], rows.slice(0, 3), 2), equation: eqs[2] },
        { title: 'Combine for the final answer', description: descs[3], diagram: buildLadder(rules[3], rows, 3), equation: eqs[3] }
      ];
    }

    if (p.kind === 'nested') {
      const { rows, descs, eqs, hasTrail } = p.stepData;
      const steps = [
        { title: 'Peel the innermost ( ) first', description: descs[0], diagram: buildLadder('inner', rows.slice(0, 1), 0), equation: eqs[0] },
        { title: 'Do × or ÷ inside the outer ( )', description: descs[1], diagram: buildLadder('muldiv', rows.slice(0, 2), 1), equation: eqs[1] },
        { title: 'Finish the outer ( )', description: descs[2], diagram: buildLadder('inner', rows.slice(0, 3), 2), equation: eqs[2] },
        { title: 'Multiply outside the brackets', description: descs[3], diagram: buildLadder('muldiv', rows.slice(0, 4), 3), equation: eqs[3] },
        { title: 'Add or subtract left to right', description: descs[4], diagram: buildLadder('addsub', rows.slice(0, 5), 4), equation: eqs[4] }
      ];
      if (hasTrail) {
        steps.push({ title: 'Subtract at the end', description: descs[5], diagram: buildLadder('addsub', rows.slice(0, 6), 5), equation: eqs[5] });
        steps.push({ title: 'Verify the full ladder', description: descs[6], diagram: buildLadder('addsub', rows, 6), equation: eqs[6] });
      } else {
        steps.push({ title: 'Verify the full ladder', description: descs[5], diagram: buildLadder('addsub', rows, 5), equation: eqs[5] });
      }
      return steps;
    }

    if (p.kind === 'mixedNest') {
      const { rows, rules, descs, eqs } = p.stepData;
      return rows.map((row, i) => ({
        title: i === 0 ? 'Spot the order trap' : i === rows.length - 1 ? 'Verify the answer' : `Step ${i + 1}: follow the priority rule`,
        description: descs[i],
        diagram: buildLadder(rules[i], rows.slice(0, i + 1), i),
        equation: eqs[i]
      }));
    }

    if (p.kind === 'addBrackets') {
      const listHtml = reveal => `<div class="choice-compare-list">${p.evaluated
        .map(c => {
          const isWin = reveal && c.expr === p.winner.expr;
          return `<div class="choice-compare-row${isWin ? ' is-match' : ''}"><span>${colorizeExpr(c.expr)}</span><span class="choice-compare-val">${reveal ? '= ' + fmt(c.val) + (isWin ? ' ✓' : '') : '= ?'}</span></div>`;
        })
        .join('')}</div>`;
      return [
        {
          title: 'What happens without brackets?',
          description: `Without brackets, multiplication happens first: ${p.baseExpr} = ${fmt(p.noBrVal)}. That is not ${fmt(p.target)} — so brackets MUST change the order!`,
          diagram: buildOrderLegend('muldiv') + `<div class="expr-banner">${p.baseExpr} = ${res(p.noBrVal)}</div>`,
          equation: `Target is ${fmt(p.target)} (not ${fmt(p.noBrVal)})`
        },
        {
          title: 'Test each bracket placement',
          description: `Evaluate the part inside ( ) first for each choice and compare the results.`,
          diagram: buildOrderLegend('inner') + listHtml(true),
          equation: `Compare every result to ${fmt(p.target)}`
        },
        {
          title: 'Match the target!',
          description: `Only ${p.winner.expr} equals ${fmt(p.target)}!`,
          diagram: buildOrderLegend('inner') + `<div class="expr-banner">${colorizeExpr(p.winner.expr)} = ${res(p.target)}</div>`,
          equation: `${p.winner.expr} = ${fmt(p.target)} ✓`
        }
      ];
    }

    if (p.kind === 'missingInBracket') {
      return p.steps;
    }

    throw new Error('Unknown problem kind: ' + p.kind);
  }

  // ---------- Application State & Controller ----------
  let topic = 'nested';
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
    if (starEl) starEl.textContent = fmt(stars);
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

    const sv = $('story-visual');
    if (sv) {
      if (problem.kind === 'addBrackets') {
        sv.innerHTML = `<div class="expr-banner">${problem.baseExpr} &nbsp;→&nbsp; <span class="expr-result">${fmt(problem.target)}</span></div>`;
      } else if (problem.kind === 'missingInBracket') {
        sv.innerHTML = `<div class="expr-banner">${colorizeExpr(problem.rawExpr)} = <span class="expr-result">${fmt(problem.target)}</span></div>`;
      } else {
        sv.innerHTML = `<div class="expr-banner">${colorizeExpr(problem.rawExpr)}</div>`;
      }
    }

    const af = $('answer-fields');
    af.innerHTML = problem.answers
      .map((a, i) => {
        if (a.type === 'choice') {
          return `<fieldset class="choice-field" id="field-${i}" aria-invalid="false">
            <legend>${a.label}</legend>
            <div class="choices">
              ${a.options
                .map((opt, j) => `<label class="choice">
                  <input type="radio" name="answer-${i}" id="answer-${i}-${j}" value="${opt}">
                  <span>${colorizeExpr(opt)}</span>
                </label>`)
                .join('')}
            </div>
          </fieldset>`;
        }
        return `<div class="answer-row">
          <label for="answer-${i}">${a.label}</label>
          <div class="input-wrap">
            <input type="text" id="answer-${i}" inputmode="numeric" autocomplete="off" placeholder="?">
          </div>
        </div>`;
      })
      .join('');

    $('feedback').className = 'feedback';
    $('feedback').textContent = '';
    $('hint').textContent = problem.hint;
    $('hint').hidden = true;
    $('hint-button').setAttribute('aria-expanded', 'false');

    document.querySelectorAll('.topic').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.topic === topic));
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

    $('step-dots').innerHTML = steps
      .map((_, i) => `<button class="step-dot" data-step="${i}" aria-label="Step ${i + 1}" ${i === step ? 'aria-current="step"' : ''}></button>`)
      .join('');

    $('previous-step').disabled = step === 0;
    $('next-step').textContent = step < steps.length - 1 ? 'Show the next step →' : 'Try another problem ↻';
  }

  function nextProblem(original = false) {
    problem = generate(topic, level, original);
    step = 0;
    solved = false;
    renderProblem();
  }

  function setTopic(t) {
    if (!topics[t]) return;
    topic = t;
    if (isBrowser) history.replaceState(null, '', '#' + t);
    nextProblem(false);
  }

  if (isBrowser) {
    $('answer-form').addEventListener('submit', event => {
      event.preventDefault();
      let allCorrect = true;
      let empty = false;
      let firstWrong = null;

      problem.answers.forEach((a, i) => {
        if (a.type === 'choice') {
          const fieldset = $(`field-${i}`);
          const checked = document.querySelector(`input[name="answer-${i}"]:checked`);
          if (!checked) empty = true;
          const correct = Boolean(checked) && checked.value === a.value;
          if (fieldset) fieldset.setAttribute('aria-invalid', String(!correct));
          if (!correct) {
            allCorrect = false;
            firstWrong = firstWrong || checked || $(`answer-${i}-0`);
          }
        } else {
          const input = $(`answer-${i}`);
          const raw = input.value.trim().replace(/[,\s]/g, '');
          if (!raw) empty = true;
          const valid = /^\d+$/.test(raw);
          const correct = valid && Number(raw) === a.value;
          input.setAttribute('aria-invalid', String(!correct));
          if (!correct) {
            allCorrect = false;
            firstWrong = firstWrong || input;
          }
        }
      });

      if (allCorrect) {
        $('feedback').className = 'feedback success';
        $('feedback').textContent = solved
          ? '✓ You’ve already earned a star for this problem. Try a new one!'
          : '★ You got it! Great layer-peeling thinking. One shiny star for you.';

        if (!solved) {
          solved = true;
          stars++;
          updateStars();
          try {
            localStorage.setItem('little-big-math-stars', String(stars));
          } catch (_) {}

          if (stars % 10 === 0) {
            const cele = $('celebration');
            cele.textContent = `🌟 ${fmt(stars)} stars! Look how much your thinking has grown! 🌱`;
            cele.classList.add('visible');
            setTimeout(() => cele.classList.remove('visible'), 5000);
          }
        }
      } else {
        $('feedback').className = 'feedback try';
        $('feedback').textContent = empty
          ? 'Fill in each answer, then let’s check together.'
          : 'A little rethink! Check the highlighted answer. Step through the layer ladder or hint for help.';
        if (firstWrong && typeof firstWrong.focus === 'function') firstWrong.focus();
      }
    });

    document.querySelectorAll('.topic').forEach(btn => {
      btn.addEventListener('click', () => setTopic(btn.dataset.topic));
    });

    $('mix-button').addEventListener('click', () => {
      const keys = Object.keys(topics).filter(k => k !== topic);
      setTopic(pick(keys));
    });

    $('difficulty').addEventListener('change', e => {
      level = e.target.value;
      nextProblem(false);
    });

    $('new-button').addEventListener('click', () => nextProblem(false));

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
        nextProblem(false);
      }
    });

    $('step-dots').addEventListener('click', e => {
      const b = e.target.closest('[data-step]');
      if (b) {
        step = Number(b.dataset.step);
        renderStep();
      }
    });

    window.addEventListener('hashchange', () => {
      const linked = decodeURIComponent(location.hash.slice(1));
      if (topics[linked] && linked !== topic) {
        topic = linked;
        nextProblem(false);
      }
    });

    const initHash = decodeURIComponent(location.hash.slice(1));
    if (topics[initHash]) {
      topic = initHash;
    }

    nextProblem(topic === 'nested');
    updateStars();
  }

  const getState = () => ({ topic, level, problem, step, solved, stars });

  if (typeof window !== 'undefined') {
    window.BracketsLab = { generate, stepsFor, getState, topics };
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generate, stepsFor, getState, topics };
  }
})();
