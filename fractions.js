(() => {
  'use strict';
  const $ = id => typeof document !== 'undefined' ? document.getElementById(id) : null;

  // ---------- Data & Topics ----------
  const topics = {
    fairShare: {
      caption: 'FAIR SHARES',
      icon: '🍕',
      title: 'Cut every piece so everyone gets the same',
      badge: 'Slice each whole into equal pieces'
    },
    numberLine: {
      caption: 'FRACTION NUMBER LINE',
      icon: '🐸',
      title: 'Hop along equal spaces on the line',
      badge: 'Count equal jumps from 0'
    },
    equivalent: {
      caption: 'SAME-SIZE FRACTIONS',
      icon: '🍫',
      title: 'Cut each piece smaller, keep the same amount',
      badge: 'Same size chocolate, more pieces'
    },
    compare: {
      caption: 'WHICH IS BIGGER?',
      icon: '⚖️',
      title: 'Compare two fractions without guessing',
      badge: 'Compare piece size and piece count'
    },
    ofWhole: {
      caption: 'PART OF A GROUP',
      icon: '🧺',
      title: 'Split the basket into equal teams',
      badge: 'Divide into equal groups, then multiply'
    },
    fracAddSub: {
      caption: 'ADD & TAKE AWAY PARTS',
      icon: '🧩',
      title: 'Combine or take away same-size slices',
      badge: 'Denominators stay the same'
    },
    decimals: {
      caption: 'TENTHS & HUNDREDTHS',
      icon: '🪙',
      title: 'Meet the decimal point',
      badge: 'Tenths and hundredths place value'
    }
  };

  const names = ['Mia', 'Leo', 'Ava', 'Tom', 'Sam', 'Zoe', 'Eli', 'Kai', 'Maya', 'Noah'];
  const items = [
    { name: 'apples', icon: '🍎' },
    { name: 'strawberries', icon: '🍓' },
    { name: 'cookies', icon: '🍪' },
    { name: 'cupcakes', icon: '🧁' },
    { name: 'stars', icon: '⭐' },
    { name: 'gems', icon: '💎' },
    { name: 'balloons', icon: '🎈' },
    { name: 'marbles', icon: '🔮' }
  ];

  // ---------- Helpers ----------
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
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  let topic = 'fairShare', level = 'easy', problem = null, step = 0, solved = false, stars = 0;
  if (typeof localStorage !== 'undefined') {
    try { stars = Math.max(0, Number(localStorage.getItem('little-big-math-stars')) || 0); } catch (_) {}
  }

  // ---------- Problem Generators ----------
  function generate(kind, difficulty = 'easy') {
    const name = pick(names);
    const otherName = pick(names.filter(n => n !== name));
    const item = pick(items);
    const p = { kind, difficulty, name, otherName, item };

    if (kind === 'fairShare') {
      let a, b;
      if (difficulty === 'easy') {
        const pairs = [[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [2, 5], [3, 5]];
        [a, b] = pick(pairs);
      } else if (difficulty === 'medium') {
        const bOpts = [2, 3, 4];
        b = pick(bOpts);
        const w = rand(1, 2);
        const r = rand(1, b - 1);
        a = w * b + r;
      } else {
        const bOpts = [3, 4, 5, 6];
        b = pick(bOpts);
        const w = rand(1, 2);
        const r = rand(1, b - 1);
        a = w * b + r;
      }
      p.a = a;
      p.b = b;
      p.wholes = Math.floor(a / b);
      p.rem = a % b;
      p.story = `<strong>${a} identical pizza${a > 1 ? 's are' : ' is'}</strong> shared equally among <strong>${b} children</strong>. To make it fair, every pizza is cut into <strong>${b} equal slices</strong>. How much pizza does each child get?`;
      p.answers = [
        { type: 'number', label: 'Top number (slices each child gets)', value: a },
        { type: 'number', label: 'Bottom number (slices per whole pizza)', value: b }
      ];
      if (a > b) {
        p.answers.push(
          { type: 'number', label: 'Whole pizzas each child gets', value: p.wholes },
          { type: 'number', label: `Extra slices leftover (out of ${b})`, value: p.rem }
        );
      }
      p.hint = `Every pizza is cut into ${b} equal slices (each slice is 1/${b}). Child 1 takes 1 slice from each of the ${a} pizzas. That gives Child 1 a total of ${a} slices of size 1/${b}.`;
    }

    else if (kind === 'numberLine') {
      let d, n, maxWhole;
      if (difficulty === 'easy') {
        d = pick([2, 3, 4, 6]);
        n = rand(1, d - 1);
        maxWhole = 1;
      } else if (difficulty === 'medium') {
        d = pick([3, 4, 5, 6, 8]);
        n = rand(d + 1, 2 * d - 1);
        maxWhole = 2;
      } else {
        d = pick([4, 5, 6, 8, 10]);
        n = rand(2 * d + 1, 3 * d - 1);
        maxWhole = 3;
      }
      p.d = d;
      p.n = n;
      p.maxWhole = maxWhole;
      p.story = `A frog starts at <strong>0</strong> and hops along the number line. The space between whole numbers is split into <strong>equal parts</strong>. Look at where the star <strong>⭐️</strong> is! What fraction is marked by the star?`;
      p.answers = [
        { type: 'number', label: 'Denominator (equal spaces in 1 whole)', value: d },
        { type: 'number', label: 'Numerator (hops from 0 to the star)', value: n }
      ];
      p.hint = `First count how many equal parts divide the jump from 0 to 1. That is your denominator (bottom number). Then count every single hop of that size from 0 to the star ⭐️. That is your numerator (top number).`;
    }

    else if (kind === 'equivalent') {
      let a, b, k;
      if (difficulty === 'easy') {
        a = 1;
        b = pick([2, 3, 4]);
        k = pick([2, 3, 4]);
      } else if (difficulty === 'medium') {
        const pool = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5]];
        [a, b] = pick(pool);
        k = pick([2, 3, 4]);
      } else {
        const pool = [[3, 4], [2, 3], [3, 5], [5, 6], [4, 7]];
        [a, b] = pick(pool);
        k = pick([3, 4, 5]);
      }
      const newA = a * k;
      const newB = b * k;
      p.a = a;
      p.b = b;
      p.k = k;
      p.newA = newA;
      p.newB = newB;
      p.story = `Two identical chocolate bars are shown. The top bar is split into <strong>${b} equal pieces</strong>, and <strong>${a}</strong> of them ${a === 1 ? 'is' : 'are'} shaded (<strong>${a}/${b}</strong>). The bottom bar cuts each piece into <strong>${k} smaller pieces</strong>, making <strong>${newB}</strong> pieces in all. How many small pieces must be shaded to keep the same amount?`;
      p.answers = [
        { type: 'number', label: 'Multiplier (small pieces in 1 big piece)', value: k },
        { type: 'number', label: `Missing numerator (?) in ${a}/${b} = ?/${newB}`, value: newA }
      ];
      p.hint = `When you cut every piece into ${k} smaller pieces, you multiply both the top and bottom by ${k}: ${a} × ${k} = ${newA}. The shaded amount stays the exact same!`;
    }

    else if (kind === 'compare') {
      // 3 classical rules
      let rule;
      if (difficulty === 'easy') {
        rule = pick(['sameDenom', 'sameNum']);
      } else if (difficulty === 'medium') {
        rule = pick(['sameDenom', 'sameNum', 'halfBenchmark']);
      } else {
        rule = pick(['oneBenchmark', 'halfBenchmark', 'sameNum']);
      }
      p.rule = rule;

      if (rule === 'sameDenom') {
        const d = pick([4, 5, 6, 8, 10]);
        let a1 = rand(1, d - 1);
        let a2 = rand(1, d - 1);
        while (a2 === a1) a2 = rand(1, d - 1);
        p.a1 = a1; p.b1 = d;
        p.a2 = a2; p.b2 = d;
        const firstBigger = a1 > a2;
        p.firstBigger = firstBigger;
        p.story = `Compare two fractions with the <strong>same denominator</strong>: <strong>${a1}/${d}</strong> and <strong>${a2}/${d}</strong>. Both are cut into slices of size <strong>1/${d}</strong>. Which fraction is bigger?`;
        const opt1 = `First fraction (${a1}/${d}) is bigger`;
        const opt2 = `Second fraction (${a2}/${d}) is bigger`;
        p.answers = [
          { type: 'choice', label: 'Which fraction is bigger?', options: [opt1, opt2], value: firstBigger ? opt1 : opt2 },
          { type: 'number', label: 'How many more pieces does the bigger fraction have?', value: Math.abs(a1 - a2) }
        ];
        p.hint = `When the denominators are the same, every slice is the exact same size (1/${d}). The fraction with more slices (${Math.max(a1, a2)}) is bigger!`;
      } else if (rule === 'sameNum') {
        const n = pick([1, 2, 3]);
        let b1 = rand(n + 1, 8);
        let b2 = rand(n + 1, 8);
        while (b2 === b1) b2 = rand(n + 1, 8);
        p.a1 = n; p.b1 = b1;
        p.a2 = n; p.b2 = b2;
        const firstBigger = b1 < b2; // fewer slices means bigger pieces!
        p.firstBigger = firstBigger;
        p.story = `Compare two fractions with the <strong>same numerator</strong>: <strong>${n}/${b1}</strong> and <strong>${n}/${b2}</strong>. Both have <strong>${n} piece${n > 1 ? 's' : ''}</strong>, but the wholes were cut into different numbers of pieces. Which fraction is bigger?`;
        const opt1 = `First fraction (${n}/${b1}) is bigger`;
        const opt2 = `Second fraction (${n}/${b2}) is bigger`;
        p.answers = [
          { type: 'choice', label: 'Which fraction is bigger?', options: [opt1, opt2], value: firstBigger ? opt1 : opt2 },
          { type: 'number', label: 'Which denominator makes BIGGER pieces? (Fewer cuts)', value: Math.min(b1, b2) }
        ];
        p.hint = `Fewer cuts mean BIGGER slices! A pizza cut into ${Math.min(b1, b2)} slices has much bigger slices than a pizza cut into ${Math.max(b1, b2)} slices. Since both have ${n} slice${n > 1 ? 's' : ''}, ${n}/${Math.min(b1, b2)} is bigger.`;
      } else if (rule === 'halfBenchmark') {
        // One fraction < 1/2, one fraction > 1/2
        const pairs = [
          { f1: [2, 5], f2: [5, 8], b1: 5, a1: 2, b2: 8, a2: 5 }, // 2/5 = 0.4 < 0.5, 5/8 = 0.625 > 0.5
          { f1: [3, 8], f2: [4, 6], b1: 8, a1: 3, b2: 6, a2: 4 }, // 3/8 < 1/2, 4/6 > 1/2
          { f1: [5, 6], f2: [3, 10], b1: 6, a1: 5, b2: 10, a3: 3 } // 5/6 > 1/2, 3/10 < 1/2
        ];
        const chosen = pick(pairs);
        p.a1 = chosen.f1[0]; p.b1 = chosen.f1[1];
        p.a2 = chosen.f2[0]; p.b2 = chosen.f2[1];
        const val1 = p.a1 / p.b1;
        const val2 = p.a2 / p.b2;
        const firstBigger = val1 > val2;
        p.firstBigger = firstBigger;
        p.story = `Compare <strong>${p.a1}/${p.b1}</strong> and <strong>${p.a2}/${p.b2}</strong> using <strong>1/2 as a benchmark</strong>. One fraction is less than half, and the other is more than half! Which is bigger?`;
        const opt1 = `First fraction (${p.a1}/${p.b1}) is bigger`;
        const opt2 = `Second fraction (${p.a2}/${p.b2}) is bigger`;
        p.answers = [
          { type: 'choice', label: 'Which fraction is bigger?', options: [opt1, opt2], value: firstBigger ? opt1 : opt2 },
          { type: 'number', label: `How many pieces make exactly 1/2 of ${p.b2 % 2 === 0 ? p.b2 : p.b1}?`, value: (p.b2 % 2 === 0 ? p.b2 : p.b1) / 2 }
        ];
        p.hint = `Compare each fraction to 1/2! Half of 8 is 4, so 3/8 is less than half. Half of 6 is 3, so 4/6 is more than half. Any fraction greater than 1/2 beats a fraction less than 1/2!`;
      } else {
        // oneBenchmark: missing unit fraction to 1 whole! e.g. 5/6 vs 7/8
        const pairs = [
          { f1: [5, 6], f2: [7, 8] },
          { f1: [7, 8], f2: [9, 10] },
          { f1: [3, 4], f2: [4, 5] },
          { f1: [4, 5], f2: [5, 6] }
        ];
        const chosen = pick(pairs);
        p.a1 = chosen.f1[0]; p.b1 = chosen.f1[1];
        p.a2 = chosen.f2[0]; p.b2 = chosen.f2[1];
        const firstBigger = (p.a1 / p.b1) > (p.a2 / p.b2);
        p.firstBigger = firstBigger;
        p.story = `Compare <strong>${p.a1}/${p.b1}</strong> and <strong>${p.a2}/${p.b2}</strong>. Both are missing <strong>just 1 slice</strong> to make 1 whole! Which fraction is bigger (closer to 1 whole)?`;
        const opt1 = `First fraction (${p.a1}/${p.b1}) is bigger`;
        const opt2 = `Second fraction (${p.a2}/${p.b2}) is bigger`;
        const biggerB = Math.max(p.b1, p.b2);
        p.answers = [
          { type: 'choice', label: 'Which fraction is bigger?', options: [opt1, opt2], value: firstBigger ? opt1 : opt2 },
          { type: 'number', label: 'Denominator of the SMALLER missing piece (closer to 1 whole)', value: biggerB }
        ];
        p.hint = `${p.a1}/${p.b1} is missing 1/${p.b1}. ${p.a2}/${p.b2} is missing 1/${p.b2}. A 1/${biggerB} slice is smaller than a 1/${Math.min(p.b1, p.b2)} slice. Missing a smaller piece means you are closer to 1 whole!`;
      }
    }

    else if (kind === 'ofWhole') {
      let b, g, a;
      if (difficulty === 'easy') {
        b = pick([2, 3, 4]);
        g = rand(2, 5);
        a = rand(1, b - 1);
      } else if (difficulty === 'medium') {
        b = pick([3, 4, 5, 6]);
        g = rand(4, 8);
        a = rand(2, b - 1);
      } else {
        b = pick([5, 6, 8, 10]);
        g = rand(5, 12);
        a = rand(2, b - 1);
      }
      const N = b * g;
      p.b = b;
      p.g = g;
      p.a = a;
      p.N = N;
      p.miaCount = a * g;
      p.leoCount = (b - a) * g;
      p.story = `A basket has <strong>${N} ${item.name}</strong>. ${name} gets <strong>${a}/${b}</strong> of them, and ${otherName} gets the rest. How many ${item.name} does ${name} get?`;
      p.answers = [
        { type: 'number', label: `Items in 1 equal part (1/${b} of ${N})`, value: g },
        { type: 'number', label: `${name}’s items (${a}/${b} of ${N})`, value: p.miaCount }
      ];
      if (difficulty === 'large') {
        p.answers.push({ type: 'number', label: `${otherName}’s remaining items (${b - a}/${b} of ${N})`, value: p.leoCount });
      }
      p.hint = `First split the ${N} ${item.name} into ${b} equal groups: ${N} ÷ ${b} = ${g} in each group. Then give ${name} ${a} of those groups: ${a} × ${g} = ${p.miaCount}.`;
    }

    else if (kind === 'fracAddSub') {
      let subType;
      if (difficulty === 'easy') {
        subType = pick(['add', 'sub']);
      } else if (difficulty === 'medium') {
        subType = pick(['wholeSub', 'add', 'sub']);
      } else {
        subType = pick(['wholeSub2', 'improperAdd', 'wholeSub']);
      }
      p.subType = subType;

      if (subType === 'add') {
        const d = pick([4, 5, 6, 8]);
        const a = rand(1, d - 2);
        const b = rand(1, d - a);
        p.d = d; p.a = a; p.b = b;
        p.resNum = a + b;
        p.story = `You have <strong>${a}/${d}</strong> of a ribbon, and your friend gives you <strong>${b}/${d}</strong> more. What fraction of the ribbon do you have altogether?`;
        p.answers = [
          { type: 'number', label: 'Result numerator (top number)', value: p.resNum },
          { type: 'number', label: 'Result denominator (bottom number)', value: d }
        ];
        p.hint = `The slices are all the same size (1/${d}). Add the top numbers together: ${a} + ${b} = ${p.resNum}. The bottom number (${d}) NEVER changes!`;
      } else if (subType === 'sub') {
        const d = pick([4, 5, 6, 8]);
        const a = rand(2, d - 1);
        const b = rand(1, a - 1);
        p.d = d; p.a = a; p.b = b;
        p.resNum = a - b;
        p.story = `A chocolate bar has <strong>${a}/${d}</strong> left. You eat <strong>${b}/${d}</strong> of the bar. What fraction of the bar is left?`;
        p.answers = [
          { type: 'number', label: 'Result numerator (top number)', value: p.resNum },
          { type: 'number', label: 'Result denominator (bottom number)', value: d }
        ];
        p.hint = `Both fractions are made of 1/${d} pieces. Take away the top numbers: ${a} − ${b} = ${p.resNum}. The bottom number stays ${d}!`;
      } else if (subType === 'wholeSub') {
        const d = pick([4, 5, 6, 8, 10]);
        const a = rand(1, d - 1);
        p.d = d; p.a = a;
        p.resNum = d - a;
        p.story = `You start with <strong>1 whole cake</strong>. You share <strong>${a}/${d}</strong> of the cake with friends. What fraction of the cake is left?`;
        p.answers = [
          { type: 'number', label: 'Result numerator (top number)', value: p.resNum },
          { type: 'number', label: 'Result denominator (bottom number)', value: d }
        ];
        p.hint = `Rewrite 1 whole cake as a fraction with denominator ${d}: 1 = ${d}/${d}. Then subtract: ${d}/${d} − ${a}/${d} = ${p.resNum}/${d}.`;
      } else if (subType === 'wholeSub2') {
        const d = pick([4, 5, 6, 8]);
        const a = rand(1, d - 1);
        p.d = d; p.a = a;
        p.resNum = 2 * d - a;
        p.story = `You have <strong>2 whole pizzas</strong>. You and your friends eat <strong>${a}/${d}</strong> of a pizza. What fraction of pizza is left?`;
        p.answers = [
          { type: 'number', label: 'Result numerator (top number)', value: p.resNum },
          { type: 'number', label: 'Result denominator (bottom number)', value: d }
        ];
        p.hint = `2 whole pizzas equal ${2 * d}/${d} slices. Take away ${a}/${d}: ${2 * d} − ${a} = ${p.resNum}. So ${p.resNum}/${d} is left (which is 1 whole and ${d - a}/${d})!`;
      } else {
        // improperAdd
        const d = pick([3, 4, 5, 6]);
        const a = rand(2, d - 1);
        const b = rand(d - a + 1, d);
        p.d = d; p.a = a; p.b = b;
        p.resNum = a + b;
        p.story = `You bake two pans of brownies cut into <strong>${d} equal squares</strong>. You put <strong>${a}/${d}</strong> on a plate, then add <strong>${b}/${d}</strong> more. What fraction do you have on the plate?`;
        p.answers = [
          { type: 'number', label: 'Result numerator (top number)', value: p.resNum },
          { type: 'number', label: 'Result denominator (bottom number)', value: d }
        ];
        p.hint = `Add the numerators: ${a} + ${b} = ${p.resNum}. The denominator remains ${d}. ${p.resNum}/${d} is an improper fraction (more than 1 whole pan: 1 and ${p.resNum - d}/${d})!`;
      }
    }

    else if (kind === 'decimals') {
      let subType;
      if (difficulty === 'easy') {
        subType = 'tenths';
      } else if (difficulty === 'medium') {
        subType = pick(['hundredths', 'decimalAdd']);
      } else {
        subType = pick(['decimalSub', 'hundredthsMixed']);
      }
      p.subType = subType;

      if (subType === 'tenths') {
        const w = rand(0, 3);
        const t = rand(1, 9);
        const decVal = Number(`${w}.${t}`);
        const totalTenths = w * 10 + t;
        p.w = w; p.t = t;
        p.decVal = decVal;
        p.totalTenths = totalTenths;
        p.story = `A model shows <strong>${w > 0 ? `${w} whole bar${w > 1 ? 's' : ''} and ` : ''}${t} tenth${t > 1 ? 's' : ''}</strong> of a bar shaded. Each whole bar is partitioned into 10 equal columns. Write this as a decimal!`;
        p.answers = [
          { type: 'number', label: `Decimal value (e.g. ${w}.${t})`, value: decVal, isDecimal: true },
          { type: 'number', label: 'How many tenths altogether?', value: totalTenths }
        ];
        p.hint = `1 whole = 10 tenths. Put the whole number before the decimal point, and the tenths right after: ${w}.${t}! Altogether there are ${totalTenths} tenths.`;
      } else if (subType === 'hundredths') {
        const h = pick([15, 25, 35, 45, 65, 75, 85, 40]);
        const decVal = Number((h / 100).toFixed(2));
        p.w = 0; p.h = h;
        p.decVal = decVal;
        p.story = `A $10 \\times 10$ square grid has <strong>100 equal small squares</strong>. Exactly <strong>${h} squares</strong> are shaded (<strong>${h}/100</strong>). Write this fraction as a decimal!`;
        p.answers = [
          { type: 'number', label: 'Decimal value (e.g. 0.25)', value: decVal, isDecimal: true },
          { type: 'number', label: 'How many hundredths altogether?', value: h }
        ];
        p.hint = `Hundredths occupy two spaces after the decimal point. ${h}/100 is written as 0.${h < 10 ? '0' + h : h}.`;
      } else if (subType === 'hundredthsMixed') {
        const w = rand(1, 4);
        const h = pick([25, 50, 75, 40, 60, 35]);
        const decVal = Number((w + h / 100).toFixed(2));
        p.w = w; p.h = h;
        p.decVal = decVal;
        p.story = `${name} has <strong>${w} dollar${w > 1 ? 's' : ''} and ${h} cents</strong> ($${decVal.toFixed(2)}). Since 1 cent = 1/100 of a dollar, write this amount as a decimal and count the total cents.`;
        p.answers = [
          { type: 'number', label: `Decimal value (e.g. ${decVal.toFixed(2)})`, value: decVal, isDecimal: true },
          { type: 'number', label: 'Total cents (hundredths of a dollar)', value: w * 100 + h }
        ];
        p.hint = `Dollars are whole numbers, and cents are hundredths! ${w} dollars and ${h} cents = ${decVal.toFixed(2)}. In total cents, each dollar is 100 cents.`;
      } else if (subType === 'decimalAdd') {
        const t1 = rand(12, 38);
        const t2 = rand(11, 29);
        const a = t1 / 10;
        const b = t2 / 10;
        const res = Number(((t1 + t2) / 10).toFixed(1));
        p.a = a; p.b = b; p.res = res;
        p.story = `${name} has <strong>${a.toFixed(1)} meters</strong> of ribbon, and buys <strong>${b.toFixed(1)} meters</strong> more. How many meters of ribbon does ${name} have in total?`;
        p.answers = [
          { type: 'number', label: 'Total meters (e.g. 4.5)', value: res, isDecimal: true },
          { type: 'number', label: 'Total tenths of a meter', value: t1 + t2 }
        ];
        p.hint = `Line up the decimal points! Add the tenths first: ${t1 % 10} tenths + ${t2 % 10} tenths. If you reach 10 tenths, carry 1 whole to the ones column.`;
      } else {
        // decimalSub
        const t1 = rand(35, 65);
        const t2 = rand(12, 28);
        const a = t1 / 10;
        const b = t2 / 10;
        const res = Number(((t1 - t2) / 10).toFixed(1));
        p.a = a; p.b = b; p.res = res;
        p.story = `${name} has a plank of wood <strong>${a.toFixed(1)} meters</strong> long and cuts off <strong>${b.toFixed(1)} meters</strong>. How long is the remaining piece?`;
        p.answers = [
          { type: 'number', label: 'Remaining meters (e.g. 2.4)', value: res, isDecimal: true },
          { type: 'number', label: 'Remaining tenths of a meter', value: t1 - t2 }
        ];
        p.hint = `Line up the numbers at the decimal point and subtract: ${a.toFixed(1)} − ${b.toFixed(1)} = ${res.toFixed(1)}.`;
      }
    }

    else throw new Error('Unknown problem kind: ' + kind);
    return p;
  }

  // ---------- Visual SVG & HTML Builders ----------

  function pizzaSvg(slices, highlighted = [], size = 95) {
    const cx = 50, cy = 50, r = 43, cr = 37;
    let paths = '';
    for (let i = 0; i < slices; i++) {
      const a0 = -Math.PI / 2 + (2 * Math.PI * i) / slices;
      const a1 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / slices;
      const x0 = (cx + cr * Math.cos(a0)).toFixed(2);
      const y0 = (cy + cr * Math.sin(a0)).toFixed(2);
      const x1 = (cx + cr * Math.cos(a1)).toFixed(2);
      const y1 = (cy + cr * Math.sin(a1)).toFixed(2);
      const isHigh = highlighted.includes(i);
      const fill = isHigh ? '#f0cd65' : '#fff4d6';
      const stroke = isHigh ? '#315b48' : '#d2a76f';
      const strokeW = isHigh ? '2.5' : '1.2';

      // Mid angle for pepperoni dot
      const midA = (a0 + a1) / 2;
      const px = (cx + 0.58 * cr * Math.cos(midA)).toFixed(1);
      const py = (cy + 0.58 * cr * Math.sin(midA)).toFixed(1);

      paths += `<path d="M${cx} ${cy} L${x0} ${y0} A${cr} ${cr} 0 0 1 ${x1} ${y1} Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"/>`;
      paths += `<circle cx="${px}" cy="${py}" r="3.2" fill="#c4472d" opacity="${isHigh ? '0.9' : '0.45'}"/>`;
    }
    return `<svg class="pizza-svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="Pizza with ${slices} slices">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#dfa56b" stroke="#87582c" stroke-width="2.5"/>
      ${paths}
      <circle cx="${cx}" cy="${cy}" r="3.5" fill="#87582c"/>
    </svg>`;
  }

  function numberLineSvg({ d, n, maxWhole = 1, showHops = false, starAt = null, frogAt = null }) {
    const W = 420;
    const x0 = 35;
    const yLine = 56;
    const stepX = W / (maxWhole * d);

    let ticks = '';
    for (let w = 0; w <= maxWhole; w++) {
      const x = (x0 + w * d * stepX).toFixed(1);
      ticks += `<line x1="${x}" y1="${yLine - 14}" x2="${x}" y2="${yLine + 14}" stroke="#263f37" stroke-width="2.5"/>`;
      ticks += `<text x="${x}" y="${yLine + 30}" font-size="14" font-weight="700" fill="#263f37" text-anchor="middle">${w}</text>`;
    }
    for (let i = 1; i < maxWhole * d; i++) {
      if (i % d === 0) continue;
      const x = (x0 + i * stepX).toFixed(1);
      ticks += `<line x1="${x}" y1="${yLine - 7}" x2="${x}" y2="${yLine + 7}" stroke="#66746a" stroke-width="1.5"/>`;
      if (d <= 6) {
        ticks += `<text x="${x}" y="${yLine + 22}" font-size="9" fill="#66746a" text-anchor="middle">${i}/${d}</text>`;
      }
    }

    let hops = '';
    if (showHops && n > 0) {
      for (let h = 0; h < n; h++) {
        const startX = x0 + h * stepX;
        const endX = startX + stepX;
        const midX = (startX + endX) / 2;
        hops += `<path d="M${startX.toFixed(1)} ${yLine} Q${midX.toFixed(1)} ${yLine - 26} ${endX.toFixed(1)} ${yLine}" fill="none" stroke="#315b48" stroke-width="2.5" stroke-dasharray="3 2"/>`;
      }
    }

    let markers = '';
    if (starAt !== null) {
      const sx = (x0 + starAt * stepX).toFixed(1);
      markers += `<text x="${sx}" y="${yLine - 18}" font-size="20" text-anchor="middle">⭐️</text>`;
      markers += `<circle cx="${sx}" cy="${yLine}" r="4" fill="#d7a841"/>`;
    }
    if (frogAt !== null) {
      const fx = (x0 + frogAt * stepX).toFixed(1);
      markers += `<text x="${fx}" y="${yLine - 18}" font-size="20" text-anchor="middle">🐸</text>`;
    }

    return `<div class="number-line-container">
      <svg class="number-line-svg" viewBox="0 0 490 95" width="100%" height="95" role="img" aria-label="Number line divided into ${d}ths">
        <line x1="${x0 - 15}" y1="${yLine}" x2="${x0 + W + 15}" y2="${yLine}" stroke="#263f37" stroke-width="3" stroke-linecap="round"/>
        ${ticks}
        ${hops}
        ${markers}
      </svg>
    </div>`;
  }

  function equivBarsHtml(a, b, k, stepNum = 1) {
    const newA = a * k;
    const newB = b * k;
    const topCells = Array.from({ length: b }, (_, i) => {
      const isShaded = i < a;
      return `<div class="frac-cell ${isShaded ? 'shaded' : ''}">1/${b}</div>`;
    }).join('');

    let bottomCells = '';
    for (let i = 0; i < newB; i++) {
      const isShaded = i < newA;
      const isMajorCut = (i + 1) % k === 0 && (i + 1) !== newB;
      bottomCells += `<div class="frac-cell ${isShaded ? 'shaded-secondary' : ''} ${isMajorCut ? '' : 'subdivided'}">1/${newB}</div>`;
    }

    return `<div class="equiv-bars">
      <div class="equiv-bar-row">
        <div class="equiv-bar-label"><span>Top bar (${a}/${b})</span><span>${a} of ${b} pieces</span></div>
        <div class="frac-bar">${topCells}</div>
      </div>
      ${stepNum >= 2 ? `
      <div class="cut-arrows">
        <span>↓ Each piece cut into ${k} smaller slices (×${k}) ↓</span>
      </div>
      <div class="equiv-bar-row">
        <div class="equiv-bar-label"><span>Bottom bar (${newA}/${newB})</span><span>${newA} of ${newB} pieces</span></div>
        <div class="frac-bar">${bottomCells}</div>
      </div>` : ''}
    </div>`;
  }

  function compareBarsHtml(p, showWinner = false) {
    const cells1 = Array.from({ length: p.b1 }, (_, i) => {
      const isShaded = i < p.a1;
      const isMissing = !isShaded && p.rule === 'oneBenchmark' && i === p.a1;
      return `<div class="frac-cell ${isShaded ? 'shaded' : isMissing ? 'missing-piece' : ''}">${isShaded ? `1/${p.b1}` : isMissing ? 'gap' : ''}</div>`;
    }).join('');

    const cells2 = Array.from({ length: p.b2 }, (_, i) => {
      const isShaded = i < p.a2;
      const isMissing = !isShaded && p.rule === 'oneBenchmark' && i === p.a2;
      return `<div class="frac-cell ${isShaded ? 'shaded-secondary' : isMissing ? 'missing-piece' : ''}">${isShaded ? `1/${p.b2}` : isMissing ? 'gap' : ''}</div>`;
    }).join('');

    const winnerText = p.firstBigger ? `${p.a1}/${p.b1} is greater!` : `${p.a2}/${p.b2} is greater!`;

    return `<div class="compare-duel">
      <div class="equiv-bar-row">
        <div class="equiv-bar-label"><strong>Fraction 1: ${p.a1}/${p.b1}</strong><span>${p.a1} piece${p.a1 > 1 ? 's' : ''} of size 1/${p.b1}</span></div>
        <div class="frac-bar">${cells1}</div>
      </div>
      <div class="equiv-bar-row">
        <div class="equiv-bar-label"><strong>Fraction 2: ${p.a2}/${p.b2}</strong><span>${p.a2} piece${p.a2 > 1 ? 's' : ''} of size 1/${p.b2}</span></div>
        <div class="frac-bar">${cells2}</div>
      </div>
      ${showWinner ? `<div class="compare-winner-badge">🏆 <span>${winnerText}</span></div>` : ''}
    </div>`;
  }

  function traysHtml(b, g, itemIcon, miaTrays = 0, leoTrays = 0) {
    let trays = '';
    for (let i = 0; i < b; i++) {
      const isMia = i < miaTrays;
      const isLeo = !isMia && (i - miaTrays) < leoTrays;
      const trayClass = isMia ? 'mia-tray' : isLeo ? 'leo-tray' : '';
      const trayLabel = isMia ? `Mia (${g})` : isLeo ? `Leo (${g})` : `Tray ${i + 1} (${g})`;
      const icons = Array(g).fill(itemIcon).join(' ');
      trays += `<div class="tray ${trayClass}">
        <div class="tray-header">${trayLabel}</div>
        <div class="tray-items">${icons}</div>
      </div>`;
    }
    return `<div class="trays-wrap">${trays}</div>`;
  }

  function addSubBarHtml(p, stepNum = 1) {
    const d = p.d;
    let cells = '';

    if (p.subType === 'add' || p.subType === 'improperAdd') {
      const totalShaded = p.resNum;
      const barsCount = totalShaded > d ? 2 : 1;
      let barsHtml = '';
      for (let barIdx = 0; barIdx < barsCount; barIdx++) {
        let barCells = '';
        for (let i = 0; i < d; i++) {
          const overallIdx = barIdx * d + i;
          let cellClass = '';
          if (overallIdx < p.a) cellClass = 'part-a';
          else if (stepNum >= 2 && overallIdx < p.a + p.b) cellClass = 'part-b';
          barCells += `<div class="add-sub-cell ${cellClass}">1/${d}</div>`;
        }
        barsHtml += `<div class="add-sub-bar" style="margin-bottom:8px">${barCells}</div>`;
      }
      return barsHtml;
    }

    if (p.subType === 'sub') {
      for (let i = 0; i < d; i++) {
        let cellClass = '';
        if (i < p.resNum) cellClass = 'part-a';
        else if (i < p.a) cellClass = stepNum >= 2 ? 'crossed' : 'part-a';
        cells += `<div class="add-sub-cell ${cellClass}">1/${d}</div>`;
      }
      return `<div class="add-sub-bar">${cells}</div>`;
    }

    if (p.subType === 'wholeSub') {
      for (let i = 0; i < d; i++) {
        const isTaken = i >= p.resNum;
        const cellClass = isTaken ? (stepNum >= 2 ? 'crossed' : 'part-a') : 'part-a';
        cells += `<div class="add-sub-cell ${cellClass}">1/${d}</div>`;
      }
      return `<div class="add-sub-bar">${cells}</div>`;
    }

    // wholeSub2
    let barsHtml = '';
    for (let barIdx = 0; barIdx < 2; barIdx++) {
      let barCells = '';
      for (let i = 0; i < d; i++) {
        const overallIdx = barIdx * d + i;
        const isTaken = overallIdx >= p.resNum;
        const cellClass = isTaken ? (stepNum >= 2 ? 'crossed' : 'part-a') : 'part-a';
        barCells += `<div class="add-sub-cell ${cellClass}">1/${d}</div>`;
      }
      barsHtml += `<div class="add-sub-bar" style="margin-bottom:8px">${barCells}</div>`;
    }
    return barsHtml;
  }

  function strip10Html(shaded, total = 10) {
    const cells = Array.from({ length: total }, (_, i) => {
      const isShaded = i < shaded;
      return `<div class="strip-10-cell ${isShaded ? 'shaded' : ''}">0.1</div>`;
    }).join('');
    return `<div class="strip-10">${cells}</div>`;
  }

  function grid100Html(shaded) {
    const cells = Array.from({ length: 100 }, (_, i) => {
      const isShaded = i < shaded;
      return `<div class="grid-100-cell ${isShaded ? 'shaded' : ''}"></div>`;
    }).join('');
    return `<div class="grid-100">${cells}</div>`;
  }

  function placeValueTable(ones, tenths, hundredths = null) {
    const cols = hundredths !== null ? 4 : 3;
    return `<div class="pv-table" style="--pv-cols: ${cols}">
      <div class="pv-header">Ones</div>
      <div class="pv-dot">.</div>
      <div class="pv-header">Tenths (1/10)</div>
      ${hundredths !== null ? '<div class="pv-header">Hundredths (1/100)</div>' : ''}
      <div class="pv-val">${ones}</div>
      <div class="pv-dot">.</div>
      <div class="pv-val">${tenths}</div>
      ${hundredths !== null ? `<div class="pv-val">${hundredths}</div>` : ''}
    </div>`;
  }

  // ---------- Explanation Steps ----------
  function stepsFor(p) {
    if (p.kind === 'fairShare') {
      const a = p.a, b = p.b;
      // Step 1: whole pizzas
      const pizzaRow1 = `<div class="pizza-row">${Array.from({ length: a }, (_, i) => `<div class="pizza-item">${pizzaSvg(1, [], 85)}<span>Pizza ${i + 1}</span></div>`).join('')}</div>`;
      // Step 2: sliced pizzas
      const pizzaRow2 = `<div class="pizza-row">${Array.from({ length: a }, (_, i) => `<div class="pizza-item">${pizzaSvg(b, [], 85)}<span>${b} slices</span></div>`).join('')}</div>`;
      // Step 3: highlight slice 0 in each pizza for Child 1
      const pizzaRow3 = `<div class="pizza-row">${Array.from({ length: a }, (_, i) => `<div class="pizza-item">${pizzaSvg(b, [0], 85)}<span>Child 1’s slice</span></div>`).join('')}</div>`;
      // Step 4: collected shares
      let gathered = '';
      if (a <= b) {
        gathered = `<div class="pizza-row"><div class="pizza-item">${pizzaSvg(b, Array.from({ length: a }, (_, i) => i), 105)}<span>Child 1 gets ${a}/${b} pizza</span></div></div>`;
      } else {
        const fullPizzas = Math.floor(a / b);
        const rem = a % b;
        const items = [];
        for (let i = 0; i < fullPizzas; i++) {
          items.push(`<div class="pizza-item">${pizzaSvg(b, Array.from({ length: b }, (_, k) => k), 85)}<span>1 whole pizza (${b}/${b})</span></div>`);
        }
        if (rem > 0) {
          items.push(`<div class="pizza-item">${pizzaSvg(b, Array.from({ length: rem }, (_, k) => k), 85)}<span>${rem}/${b} pizza</span></div>`);
        }
        gathered = `<div class="pizza-row">${items.join('')}</div>`;
      }

      return [
        {
          title: `See all ${plural(a, 'pizza', 'pizzas')}`,
          description: `There ${a === 1 ? 'is' : 'are'} ${a} whole pizza${a > 1 ? 's' : ''} to share equally among ${b} children.`,
          diagram: pizzaRow1,
          equation: `${a} pizza${a > 1 ? 's' : ''} ÷ ${b} children`
        },
        {
          title: `Cut every pizza into ${b} equal slices`,
          description: `To be completely fair, every pizza is cut into ${b} equal slices. Each slice is 1/${b} of a whole pizza.`,
          diagram: pizzaRow2,
          equation: `${a} pizza${a > 1 ? 's' : ''} × ${b} slices = ${a * b} slices of size 1/${b}`
        },
        {
          title: `Give 1 slice from each pizza to Child 1`,
          description: `Child 1 takes 1 slice from Pizza 1, 1 slice from Pizza 2, and so on. That makes ${a} slice${a > 1 ? 's' : ''} altogether!`,
          diagram: pizzaRow3,
          equation: `${a} slice${a > 1 ? 's' : ''} of size 1/${b}`
        },
        {
          title: `Assemble Child 1’s share`,
          description: `Child 1 gets ${a}/${b} of a pizza.${a > b ? ` Since ${a} > ${b}, that is ${Math.floor(a / b)} whole pizza${Math.floor(a / b) > 1 ? 's' : ''} and ${a % b}/${b} more!` : ''}`,
          diagram: gathered,
          equation: `${a} ÷ ${b} = ${a}/${b}${a > b ? ` = ${Math.floor(a / b)} and ${a % b}/${b}` : ''} pizza`
        }
      ];
    }

    if (p.kind === 'numberLine') {
      const d = p.d, n = p.n, maxW = p.maxWhole;
      return [
        {
          title: `Count the equal spaces from 0 to 1`,
          description: `Look at the distance between 0 and 1. It is split into ${d} equal spaces. That tells you every jump is 1/${d}!`,
          diagram: numberLineSvg({ d, n, maxWhole: maxW, showHops: false }),
          equation: `1 whole = ${d} equal parts → denominator is ${d}`
        },
        {
          title: `Follow the frog’s hops from 0`,
          description: `The frog starts at 0 and takes ${n} equal hops of size 1/${d} along the line.`,
          diagram: numberLineSvg({ d, n, maxWhole: maxW, showHops: true }),
          equation: `${n} hop${n > 1 ? 's' : ''} of 1/${d}`
        },
        {
          title: `Land on the star ⭐️`,
          description: `The frog lands right on the star at ${n}/${d}!${n > d ? ` The frog hopped past 1 whole (${d}/${d}) and ${n - d} more space${n - d > 1 ? 's' : ''}!` : ''}`,
          diagram: numberLineSvg({ d, n, maxWhole: maxW, showHops: true, starAt: n, frogAt: n }),
          equation: `Star is at ${n}/${d}${n >= d ? ` = ${Math.floor(n / d)} and ${n % d}/${d}` : ''}`
        }
      ];
    }

    if (p.kind === 'equivalent') {
      const a = p.a, b = p.b, k = p.k, newA = p.newA, newB = p.newB;
      return [
        {
          title: `Look at the first fraction bar: ${a}/${b}`,
          description: `The bar is divided into ${b} equal parts, and ${a} ${a === 1 ? 'part is' : 'parts are'} shaded.`,
          diagram: equivBarsHtml(a, b, k, 1),
          equation: `Top bar: ${a}/${b}`
        },
        {
          title: `Cut every piece into ${k} smaller pieces`,
          description: `Slice each 1/${b} piece into ${k} smaller slices. That multiplies both the total pieces and shaded pieces by ${k}.`,
          diagram: equivBarsHtml(a, b, k, 2),
          equation: `Total pieces: ${b} × ${k} = ${newB}`
        },
        {
          title: `Count the new shaded pieces: ${newA}/${newB}`,
          description: `The shaded length didn’t change at all! We just cut it into ${newA} smaller pieces.`,
          diagram: equivBarsHtml(a, b, k, 2),
          equation: `${a}/${b} = (${a} × ${k}) / (${b} × ${k}) = ${newA}/${newB}`
        }
      ];
    }

    if (p.kind === 'compare') {
      let ruleDesc;
      if (p.rule === 'sameDenom') {
        ruleDesc = `Both fractions have denominator ${p.b1}, so each piece is the same size (1/${p.b1}). The one with more pieces (${Math.max(p.a1, p.a2)}) is bigger!`;
      } else if (p.rule === 'sameNum') {
        ruleDesc = `Both fractions have ${p.a1} piece${p.a1 > 1 ? 's' : ''}. But cutting into ${Math.min(p.b1, p.b2)} pieces means each piece is much bigger than cutting into ${Math.max(p.b1, p.b2)} pieces!`;
      } else if (p.rule === 'halfBenchmark') {
        ruleDesc = `Compare to 1/2: one fraction is less than 1/2, while the other is more than 1/2. The fraction above 1/2 wins!`;
      } else {
        ruleDesc = `Both are missing 1 slice to make 1 whole. 1/${Math.max(p.b1, p.b2)} is a smaller missing piece than 1/${Math.min(p.b1, p.b2)}, so ${p.firstBigger ? `${p.a1}/${p.b1}` : `${p.a2}/${p.b2}`} is closer to 1 whole!`;
      }

      const winnerFrac = p.firstBigger ? `${p.a1}/${p.b1}` : `${p.a2}/${p.b2}`;
      const loserFrac = p.firstBigger ? `${p.a2}/${p.b2}` : `${p.a1}/${p.b1}`;

      return [
        {
          title: `Stack both fraction bars`,
          description: `Line up ${p.a1}/${p.b1} and ${p.a2}/${p.b2} side by side so their total lengths match.`,
          diagram: compareBarsHtml(p, false),
          equation: `Compare: ${p.a1}/${p.b1}   vs   ${p.a2}/${p.b2}`
        },
        {
          title: `Apply the reasoning rule`,
          description: ruleDesc,
          diagram: compareBarsHtml(p, false),
          equation: p.rule === 'sameDenom' ? `Same denominator: compare numerators` : p.rule === 'sameNum' ? `Same numerator: fewer cuts = bigger slices` : `Benchmark reasoning`
        },
        {
          title: `See the winner`,
          description: `${winnerFrac} is greater than ${loserFrac}.`,
          diagram: compareBarsHtml(p, true),
          equation: `${winnerFrac} > ${loserFrac}`
        }
      ];
    }

    if (p.kind === 'ofWhole') {
      const b = p.b, g = p.g, a = p.a, N = p.N, miaCount = p.miaCount, leoCount = p.leoCount;
      const allIcons = Array(N).fill(p.item.icon).join(' ');
      return [
        {
          title: `See all ${N} ${p.item.name}`,
          description: `The basket contains ${N} ${p.item.name} altogether.`,
          diagram: `<div style="font-size:22px;line-height:1.4;letter-spacing:4px;text-align:center;padding:12px">${allIcons}</div>`,
          equation: `Total = ${N} ${p.item.name}`
        },
        {
          title: `Divide into ${b} equal trays`,
          description: `Share the ${N} ${p.item.name} equally into ${b} trays. Each tray gets ${g} ${p.item.name} (that is 1/${b} of the group).`,
          diagram: traysHtml(b, g, p.item.icon, 0, 0),
          equation: `${N} ÷ ${b} = ${g} in 1 tray (1/${b} of ${N})`
        },
        {
          title: `Give ${a} tray${a > 1 ? 's' : ''} to ${p.name}`,
          description: `${p.name} gets ${a}/${b} of the basket. Multiply ${a} trays × ${g} items = ${miaCount} ${p.item.name}!`,
          diagram: traysHtml(b, g, p.item.icon, a, b - a),
          equation: `${a} tray${a > 1 ? 's' : ''} × ${g} = ${miaCount} ${p.item.name} for ${p.name}`
        },
        {
          title: `Check the remaining items for ${p.otherName}`,
          description: `${p.otherName} gets the remaining ${b - a} trays (${leoCount} ${p.item.name}). Together, ${miaCount} + ${leoCount} = ${N}!`,
          diagram: traysHtml(b, g, p.item.icon, a, b - a),
          equation: `${miaCount} (${p.name}) + ${leoCount} (${p.otherName}) = ${N} ${p.item.name}`
        }
      ];
    }

    if (p.kind === 'fracAddSub') {
      const d = p.d;
      if (p.subType === 'add' || p.subType === 'improperAdd') {
        return [
          {
            title: `Identify the slice size: 1/${d}`,
            description: `Every piece is 1/${d} of the whole. Both fractions are made of the exact same size slices.`,
            diagram: addSubBarHtml(p, 1),
            equation: `Slice size = 1/${d}`
          },
          {
            title: `Combine the slices: ${p.a}/${d} + ${p.b}/${d}`,
            description: `You have ${p.a} slices, and add ${p.b} more slices.`,
            diagram: addSubBarHtml(p, 2),
            equation: `${p.a}/${d} + ${p.b}/${d} = (${p.a} + ${p.b}) / ${d}`
          },
          {
            title: `Count the result: ${p.resNum}/${d}`,
            description: `You have ${p.resNum} slices of size 1/${d}. The denominator NEVER adds together because the slice size didn't change!`,
            diagram: addSubBarHtml(p, 2),
            equation: `${p.resNum}/${d}${p.resNum > d ? ` = ${Math.floor(p.resNum / d)} and ${p.resNum % d}/${d}` : ''}`
          }
        ];
      }

      if (p.subType === 'sub') {
        return [
          {
            title: `Start with ${p.a}/${d}`,
            description: `There are ${p.a} slices of size 1/${d}.`,
            diagram: addSubBarHtml(p, 1),
            equation: `Starting amount = ${p.a}/${d}`
          },
          {
            title: `Take away ${p.b}/${d}`,
            description: `Remove ${p.b} slices. Cross them out!`,
            diagram: addSubBarHtml(p, 2),
            equation: `${p.a}/${d} − ${p.b}/${d} = (${p.a} − ${p.b}) / ${d}`
          },
          {
            title: `Count the remaining slices: ${p.resNum}/${d}`,
            description: `There are ${p.resNum} slices left, each of size 1/${d}.`,
            diagram: addSubBarHtml(p, 2),
            equation: `Result = ${p.resNum}/${d}`
          }
        ];
      }

      // wholeSub or wholeSub2
      const wholes = p.subType === 'wholeSub2' ? 2 : 1;
      const totalSlices = wholes * d;
      return [
        {
          title: `Rewrite ${wholes} whole${wholes > 1 ? 's' : ''} as a fraction`,
          description: `Each whole is ${d}/${d} slices. So ${wholes} whole${wholes > 1 ? 's' : ''} = ${totalSlices}/${d}!`,
          diagram: addSubBarHtml(p, 1),
          equation: `${wholes} whole${wholes > 1 ? 's' : ''} = ${totalSlices}/${d}`
        },
        {
          title: `Take away ${p.a}/${d}`,
          description: `Cross out ${p.a} of the ${totalSlices} slices.`,
          diagram: addSubBarHtml(p, 2),
          equation: `${totalSlices}/${d} − ${p.a}/${d} = (${totalSlices} − ${p.a}) / ${d}`
        },
        {
          title: `Count the leftover slices: ${p.resNum}/${d}`,
          description: `${p.resNum} slices of size 1/${d} remain.`,
          diagram: addSubBarHtml(p, 2),
          equation: `Result = ${p.resNum}/${d}${p.resNum > d ? ` = ${Math.floor(p.resNum / d)} and ${p.resNum % d}/${d}` : ''}`
        }
      ];
    }

    // decimals
    if (p.kind === 'decimals') {
      if (p.subType === 'tenths') {
        return [
          {
            title: `Model ${p.w > 0 ? `${p.w} wholes and ` : ''}${p.t} tenths`,
            description: `Each whole bar is 10 tenths (10 columns). ${p.t} columns are shaded in the tenths bar.`,
            diagram: strip10Html(p.t, 10),
            equation: `1 whole = 10 tenths`
          },
          {
            title: `Place value columns`,
            description: `Wholes go in the Ones column. Tenths go directly to the right of the decimal point.`,
            diagram: placeValueTable(p.w, p.t),
            equation: `${p.w} ones + ${p.t} tenths = ${p.decVal}`
          },
          {
            title: `Total tenths`,
            description: `${p.w} wholes = ${p.w * 10} tenths. Add the ${p.t} tenths to get ${p.totalTenths} tenths in all.`,
            diagram: placeValueTable(p.w, p.t),
            equation: `${p.decVal} = ${p.totalTenths}/10 = ${p.totalTenths} tenths`
          }
        ];
      }

      if (p.subType === 'hundredths' || p.subType === 'hundredthsMixed') {
        const w = p.w, h = p.h;
        const tensDigit = Math.floor(h / 10);
        const onesH = h % 10;
        return [
          {
            title: `Look at the 100-grid (${h}/100)`,
            description: `A 100-grid has 10 columns of 10 squares each. Exactly ${h} squares are shaded.`,
            diagram: grid100Html(h),
            equation: `${h}/100 = 0.${h < 10 ? '0' + h : h}`
          },
          {
            title: `Place value chart`,
            description: `The decimal point separates whole ones from parts. Tenths come first, then hundredths.`,
            diagram: placeValueTable(w, tensDigit, onesH),
            equation: `${w} ones + ${tensDigit} tenths + ${onesH} hundredths`
          },
          {
            title: `Read the decimal value: ${p.decVal}`,
            description: `Written as a decimal, this is ${p.decVal}. Each hundredth is 1 cent of a dollar!`,
            diagram: placeValueTable(w, tensDigit, onesH),
            equation: `${w > 0 ? `${w} and ` : ''}${h}/100 = ${p.decVal}`
          }
        ];
      }

      // decimalAdd or decimalSub
      const isAdd = p.subType === 'decimalAdd';
      const opSign = isAdd ? '+' : '−';
      return [
        {
          title: `Line up at the decimal point`,
          description: `Keep the ones column over ones, and tenths over tenths.`,
          diagram: `<div style="font-family:monospace;font-size:22px;line-height:1.6;text-align:center;padding:14px;background:#fffdf6;border:2px solid #b7c3ad;border-radius:12px;max-width:220px;margin:0 auto">
            <div>&nbsp;&nbsp;${p.a.toFixed(1)}</div>
            <div>${opSign} ${p.b.toFixed(1)}</div>
            <div style="border-top:2px solid #314d45">&nbsp;&nbsp;${p.res.toFixed(1)}</div>
          </div>`,
          equation: `${p.a.toFixed(1)} ${opSign} ${p.b.toFixed(1)}`
        },
        {
          title: `Calculate tenths first`,
          description: isAdd
            ? `Add the tenths: ${Math.round((p.a % 1) * 10)} tenths + ${Math.round((p.b % 1) * 10)} tenths. Regroup 10 tenths into 1 whole if needed.`
            : `Subtract the tenths: ${Math.round((p.a % 1) * 10)} tenths − ${Math.round((p.b % 1) * 10)} tenths. Borrow 1 whole (10 tenths) if needed.`,
          diagram: placeValueTable(Math.floor(p.res), Math.round((p.res % 1) * 10)),
          equation: `${isAdd ? 'Tenths add together' : 'Tenths subtract'}`
        },
        {
          title: `Final result: ${p.res.toFixed(1)}`,
          description: `The result is ${p.res.toFixed(1)} (which is ${Math.round(p.res * 10)} tenths altogether).`,
          diagram: placeValueTable(Math.floor(p.res), Math.round((p.res % 1) * 10)),
          equation: `${p.a.toFixed(1)} ${opSign} ${p.b.toFixed(1)} = ${p.res.toFixed(1)}`
        }
      ];
    }

    return [];
  }

  // ---------- Story Visual (problem card preview) ----------
  function storyVisual(p) {
    if (p.kind === 'fairShare') {
      const shownPizzas = Math.min(p.a, 4);
      return `<div class="pizza-row">${Array.from({ length: shownPizzas }, () => pizzaSvg(p.b, [0], 70)).join('')}${p.a > 4 ? `<span>+${p.a - 4} more</span>` : ''}</div>`;
    }
    if (p.kind === 'numberLine') {
      return numberLineSvg({ d: p.d, n: p.n, maxWhole: p.maxWhole, showHops: true, starAt: p.n });
    }
    if (p.kind === 'equivalent') {
      return equivBarsHtml(p.a, p.b, p.k, 2);
    }
    if (p.kind === 'compare') {
      return compareBarsHtml(p, false);
    }
    if (p.kind === 'ofWhole') {
      return traysHtml(p.b, p.g, p.item.icon, p.a, 0);
    }
    if (p.kind === 'fracAddSub') {
      return addSubBarHtml(p, 1);
    }
    if (p.kind === 'decimals') {
      if (p.subType === 'hundredths' || p.subType === 'hundredthsMixed') return grid100Html(p.h);
      if (p.subType === 'tenths') return strip10Html(p.t);
      return placeValueTable(Math.floor(p.a), Math.round((p.a % 1) * 10));
    }
    return '';
  }

  // ---------- Rendering & DOM ----------
  function answerField(a, i) {
    if (a.type === 'choice') {
      return `<fieldset class="choice-field" id="answer-${i}" aria-invalid="false">
        <legend>${a.label}</legend>
        <div class="choices">
          ${a.options.map((o, j) => `<label class="choice"><input type="radio" name="answer-${i}" value="${o}" id="answer-${i}-${j}"><span>${o}</span></label>`).join('')}
        </div>
      </fieldset>`;
    }

    const placeholder = a.isDecimal ? '0.0' : '?';
    return `<div class="answer-row">
      <label for="answer-${i}-a">${a.label}</label>
      <div class="input-wrap">
        <input id="answer-${i}-a" type="text" inputmode="${a.isDecimal ? 'decimal' : 'numeric'}" autocomplete="off" placeholder="${placeholder}" aria-label="${a.label}" aria-describedby="feedback" aria-invalid="false">
      </div>
    </div>`;
  }

  function renderStep() {
    if (typeof document === 'undefined') return;
    const steps = stepsFor(problem);
    if (!steps || !steps.length) return;
    const current = steps[step];
    $('visual-title').textContent = current.title;
    $('step-description').textContent = current.description;
    $('diagram').innerHTML = current.diagram;
    $('equation').textContent = current.equation;
    $('step-dots').innerHTML = steps.map((s, i) => `<button class="step-dot" data-step="${i}" aria-label="Step ${i + 1}: ${s.title}" ${i === step ? 'aria-current="step"' : ''}></button>`).join('');
    $('previous-step').disabled = step === 0;
    $('next-step').textContent = step === steps.length - 1 ? 'Try a new problem ↻' : 'Show the next step →';
    $('visual-note').textContent = `Step ${step + 1} of ${steps.length} · Take your time. You can try an answer at any step.`;
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
    const previous = problem ? problem.story : '';
    for (let i = 0; i < 15; i++) {
      problem = generate(topic, level);
      if (problem.story !== previous) break;
    }
    renderProblem();
  }

  function updateStars() {
    if (typeof document === 'undefined') return;
    $('star-count').textContent = stars.toLocaleString('en-US');
    const progress = stars && stars % 10 === 0 ? 10 : stars % 10;
    const progressFill = $('progress-fill');
    if (progressFill) progressFill.style.width = (progress * 10) + '%';
    const progressTrack = document.querySelector('.progress-track');
    if (progressTrack) progressTrack.setAttribute('aria-label', `${progress} of 10 stars toward a celebration`);
  }

  const readNumber = id => {
    const el = $(id);
    if (!el) return null;
    const raw = el.value.trim();
    if (/^(\d+(\.\d+)?|\.\d+)$/.test(raw)) return Number(raw);
    return raw ? NaN : null;
  };

  // Setup DOM events only in browser
  if (typeof document !== 'undefined') {
    $('answer-form').addEventListener('submit', event => {
      event.preventDefault();
      let allCorrect = true;
      let empty = false;
      let firstWrong = null;

      problem.answers.forEach((a, i) => {
        let correct = false;
        let focusEl = null;

        if (a.type === 'choice') {
          const chosen = document.querySelector(`input[name="answer-${i}"]:checked`);
          if (!chosen) empty = true;
          correct = Boolean(chosen) && chosen.value === a.value;
          const field = $('answer-' + i);
          if (field) field.setAttribute('aria-invalid', String(!correct));
          focusEl = chosen || $(`answer-${i}-0`);
        } else {
          const value = readNumber(`answer-${i}-a`);
          if (value === null) empty = true;
          correct = value !== null && !isNaN(value) && Math.abs(value - a.value) < 1e-5;
          const inputEl = $(`answer-${i}-a`);
          if (inputEl) inputEl.setAttribute('aria-invalid', String(!correct));
          focusEl = inputEl;
        }

        if (!correct) {
          allCorrect = false;
          firstWrong ??= focusEl;
        }
      });

      if (allCorrect) {
        $('feedback').className = 'feedback success';
        $('feedback').textContent = solved
          ? '✓ You’ve already earned a star for this one. Try a new problem!'
          : '★ You got it! Great mathematical thinking. One shiny star for you.';
        if (!solved) {
          solved = true;
          stars++;
          updateStars();
          try { localStorage.setItem('little-big-math-stars', String(stars)); } catch (_) {}
          if (stars % 10 === 0) {
            $('celebration').textContent = `🌟 ${stars.toLocaleString('en-US')} stars! Look how much your thinking has grown! 🌱`;
            $('celebration').classList.add('visible');
            setTimeout(() => $('celebration').classList.remove('visible'), 5000);
          }
        }
      } else {
        $('feedback').className = 'feedback try';
        $('feedback').textContent = empty
          ? 'Fill in each answer, then let’s check together.'
          : 'A little rethink! Check the highlighted box. The diagram or hint can guide you.';
        if (firstWrong && typeof firstWrong.focus === 'function') firstWrong.focus();
      }
    });

    $('answer-fields').addEventListener('change', event => {
      const field = event.target.closest('.choice-field');
      if (field) field.setAttribute('aria-invalid', 'false');
      const input = event.target.closest('input');
      if (input) input.setAttribute('aria-invalid', 'false');
    });

    const setTopic = t => {
      topic = t;
      history.replaceState(null, '', '#' + t);
      nextProblem();
    };

    document.querySelectorAll('.topic').forEach(b => {
      b.addEventListener('click', () => setTopic(b.dataset.topic));
    });

    $('mix-button').addEventListener('click', () => {
      const pool = Object.keys(topics).filter(k => k !== topic);
      setTopic(pick(pool));
    });

    $('difficulty').addEventListener('change', e => {
      level = e.target.value;
      nextProblem();
    });

    $('new-button').addEventListener('click', nextProblem);

    $('hint-button').addEventListener('click', () => {
      $('hint').hidden = !$('hint').hidden;
      $('hint-button').setAttribute('aria-expanded', String(!$('hint').hidden));
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

    window.addEventListener('hashchange', () => {
      const hash = decodeURIComponent(location.hash.slice(1));
      if (topics[hash] && hash !== topic) {
        topic = hash;
        nextProblem();
      }
    });

    const linked = decodeURIComponent(location.hash.slice(1));
    if (Object.hasOwn(topics, linked)) topic = linked;

    nextProblem();
    updateStars();
  }

  // ---------- Exports ----------
  const API = {
    generate,
    stepsFor,
    storyVisual,
    getState: () => ({ topic, level, problem, step, solved, stars })
  };

  if (typeof window !== 'undefined') {
    window.FractionsLab = API;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  }
})();
