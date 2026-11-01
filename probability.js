(() => {
  'use strict';
  const $ = id => document.getElementById(id);

  // ---------- Data ----------
  const COLORS = {
    red: { name: 'red', hex: '#e2725b', letter: 'R' },
    blue: { name: 'blue', hex: '#5d8fd8', letter: 'B' },
    yellow: { name: 'yellow', hex: '#f2c94c', letter: 'Y' },
    green: { name: 'green', hex: '#6aae6a', letter: 'G' },
    purple: { name: 'purple', hex: '#9d7bd2', letter: 'P' }
  };
  const topics = {
    words: { caption: 'CERTAIN OR IMPOSSIBLE?', icon: '🌈', title: 'How likely is it?', badge: 'Each marble is one chance' },
    likely: { caption: 'PICK A MARBLE', icon: '🫙', title: 'Reach into the jar', badge: 'Each marble is one chance' },
    spinner: { caption: 'SPIN IT', icon: '🎡', title: 'Where will it stop?', badge: 'Each slice is one chance' },
    dice: { caption: 'ROLL A DIE', icon: '🎲', title: 'Roll the die', badge: 'Each side is one chance' },
    coins: { caption: 'FLIP COINS', icon: '🪙', title: 'Heads or tails?', badge: 'Each row is one way to land' },
    fair: { caption: 'IS IT FAIR?', icon: '⚖️', title: 'Is the game fair?', badge: 'Each slice is one chance' }
  };
  const CHANCE_WORDS = ['Impossible', 'Unlikely', 'Even chance', 'Likely', 'Certain'];
  const names = ['Tom', 'Mia', 'Sam', 'Ava', 'Leo'];

  // ---------- Helpers ----------
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = list => list[rand(0, list.length - 1)];
  const shuffle = list => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = rand(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const listJoin = items => items.length < 2 ? items.join('') : items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const colorKeys = Object.keys(COLORS);
  /** Split `total` into 1 or 2 positive counts of colors other than `avoid`. */
  function fillOthers(total, avoid, maxColors = 2) {
    if (total <= 0) return [];
    const others = shuffle(colorKeys.filter(c => !avoid.includes(c)));
    if (total >= 2 && maxColors > 1 && Math.random() < 0.5) {
      const first = rand(1, total - 1);
      return [{ color: others[0], count: first }, { color: others[1], count: total - first }];
    }
    return [{ color: others[0], count: total }];
  }
  const marbleList = groups => listJoin(groups.map(g => `<strong>${plural(g.count, COLORS[g.color].name + ' marble', COLORS[g.color].name + ' marbles')}</strong>`));
  const expand = groups => groups.flatMap(g => Array(g.count).fill(g.color));

  let topic = 'spinner', level = 'easy', problem, step = 0, solved = false, stars = 0, trials = [];
  try { stars = Math.max(0, Number(localStorage.getItem('little-big-math-stars')) || 0); } catch (_) {}

  // ---------- Problem generators ----------
  function generate(kind, difficulty) {
    const easy = difficulty === 'easy';
    const name = pick(names);
    const p = { kind, name, easy };

    if (kind === 'words') {
      const category = pick(CHANCE_WORDS);
      let n = easy ? rand(4, 8) : rand(6, 12);
      if (category === 'Even chance' && n % 2) n++;
      const target = pick(colorKeys);
      const k = { Impossible: 0, Certain: n, 'Even chance': n / 2, Likely: rand(Math.floor(n / 2) + 1, n - 1), Unlikely: rand(1, Math.ceil(n / 2) - 1) }[category];
      p.target = target; p.k = k; p.n = n;
      p.groups = shuffle([...(k ? [{ color: target, count: k }] : []), ...fillOthers(n - k, [target], category === 'Even chance' ? 1 : 2)]);
      p.marbles = shuffle(expand(p.groups));
      p.story = `A jar has ${marbleList(p.groups)}. You reach in and pick one <strong>without looking</strong>. How likely is it that you pick a <strong>${COLORS[target].name}</strong> marble?`;
      p.answers = [{ type: 'choice', label: `Picking a ${COLORS[target].name} marble is…`, options: CHANCE_WORDS, value: category }];
      p.hint = `Count the ${COLORS[target].name} marbles. Are there none, fewer than half, exactly half, more than half, or are they all ${COLORS[target].name}?`;
      p.outcomes = p.groups.map(g => ({ key: g.color, color: g.color, weight: g.count, win: g.color === target }));
      p.watch = `${COLORS[target].name} marble`;
    }

    else if (kind === 'likely') {
      const count = easy ? 2 : 3, max = easy ? 6 : 8;
      const chosen = shuffle(colorKeys).slice(0, count);
      let counts;
      if (Math.random() < 0.2) { const same = rand(2, max - 2); counts = chosen.map(() => same); }
      else counts = shuffle(Array.from({ length: max }, (_, i) => i + 1)).slice(0, count);
      p.groups = chosen.map((color, i) => ({ color, count: counts[i] }));
      p.marbles = shuffle(expand(p.groups));
      p.n = p.marbles.length;
      const equal = counts.every(c => c === counts[0]);
      const sorted = [...p.groups].sort((a, b) => b.count - a.count);
      p.equal = equal; p.sorted = sorted;
      const options = [...chosen.map(c => cap(COLORS[c].name)), 'Equally likely'];
      p.story = `A jar has ${marbleList(p.groups)}. You pick one <strong>without looking</strong>. Which color are you <strong>most likely</strong> to pick?${easy ? '' : ' Which color are you <strong>least likely</strong> to pick?'}`;
      p.answers = [{ type: 'choice', label: 'Most likely', options, value: equal ? 'Equally likely' : cap(COLORS[sorted[0].color].name) }];
      if (!easy) p.answers.push({ type: 'choice', label: 'Least likely', options, value: equal ? 'Equally likely' : cap(COLORS[sorted[sorted.length - 1].color].name) });
      p.hint = 'Sort the marbles into rows by color. The color with the most marbles has the most chances to be picked.';
      p.outcomes = p.groups.map(g => ({ key: g.color, color: g.color, weight: g.count }));
    }

    else if (kind === 'spinner' || kind === 'fair') {
      const n = easy ? pick([4, 6, 8]) : pick([6, 8, 10, 12]);
      p.n = n;
      if (kind === 'spinner') {
        const target = pick(colorKeys);
        const k = rand(1, n - 1);
        p.target = target; p.k = k;
        p.groups = [{ color: target, count: k }, ...fillOthers(n - k, [target])];
        p.slices = shuffle(expand(p.groups));
        p.story = `This spinner has <strong>${n} equal slices</strong>. You spin it once. What is the chance it lands on <strong>${COLORS[target].name}</strong>?${easy ? '' : ` What is the chance it does <strong>not</strong> land on ${COLORS[target].name}?`}`;
        p.answers = [{ type: 'outOf', label: `Chance of ${COLORS[target].name}`, value: [k, n] }];
        if (!easy) p.answers.push({ type: 'outOf', label: `Chance of not ${COLORS[target].name}`, value: [n - k, n] });
        p.hint = `First count all the slices. Then count only the ${COLORS[target].name} slices. The chance is “${COLORS[target].name} slices out of all slices”.`;
        p.outcomes = p.groups.map(g => ({ key: g.color, color: g.color, weight: g.count, win: g.color === target }));
        p.watch = COLORS[target].name;
      } else {
        const [mine, theirs] = shuffle(colorKeys).slice(0, 2);
        const isFair = Math.random() < 0.38;
        let a = isFair ? n / 2 : rand(1, n - 1);
        if (!isFair && a === n / 2) a += pick([-1, 1]);
        p.mine = mine; p.theirs = theirs; p.a = a; p.b = n - a;
        p.groups = [{ color: mine, count: p.a }, { color: theirs, count: p.b }];
        p.slices = shuffle(expand(p.groups));
        const options = ['Fair: we have the same chance', 'Not fair: better for me', `Not fair: better for ${name}`];
        p.story = `You and ${name} play a spinner game. If it lands on <strong>${COLORS[mine].name}, you win</strong>. If it lands on <strong>${COLORS[theirs].name}, ${name} wins</strong>. Is this game fair?`;
        p.answers = [{ type: 'choice', label: 'This game is…', options, value: p.a === p.b ? options[0] : p.a > p.b ? options[1] : options[2] }];
        p.hint = `Count your ${COLORS[mine].name} slices and ${name}’s ${COLORS[theirs].name} slices. A fair game gives both players the same number of chances.`;
        p.outcomes = p.groups.map((g, i) => ({ key: g.color, color: g.color, weight: g.count, who: i === 0 ? 'You win' : `${name} wins` }));
      }
    }

    else if (kind === 'dice') {
      const events = easy ? [
        ['a 6', f => f === 6], ['a 1', f => f === 1], ['an even number', f => f % 2 === 0], ['an odd number', f => f % 2 === 1],
        ['a number bigger than 4', f => f > 4], ['a number smaller than 3', f => f < 3], ['a 7', () => false], ['a number from 1 to 6', () => true]
      ] : [
        ['a 2 or a 5', f => f === 2 || f === 5], ['a number bigger than 2', f => f > 2], ['anything except a 3', f => f !== 3],
        ['a number that is 3 or less', f => f <= 3], ['a number in the 3 times table', f => f % 3 === 0], ['an even number bigger than 2', f => f % 2 === 0 && f > 2],
        ['a 0', () => false], ['a number smaller than 5', f => f < 5]
      ];
      const [label, test] = pick(events);
      p.event = label; p.winners = [1, 2, 3, 4, 5, 6].filter(test); p.k = p.winners.length; p.n = 6;
      p.story = `You roll one normal die with sides <strong>1 to 6</strong>. What is the chance you roll <strong>${label}</strong>?`;
      p.answers = [{ type: 'outOf', label: `Chance of ${label}`, value: [p.k, 6] }];
      p.hint = `Look at all 6 sides. Point to each side that is ${label}. How many did you find, out of 6?`;
      p.outcomes = [1, 2, 3, 4, 5, 6].map(f => ({ key: String(f), face: f, weight: 1, win: p.winners.includes(f) }));
      p.watch = label;
    }

    else if (kind === 'coins') {
      const c = easy ? 2 : 3;
      const ways = Array.from({ length: 2 ** c }, (_, i) => Array.from({ length: c }, (_, j) => (i >> (c - 1 - j)) & 1 ? 'T' : 'H').join(''));
      const heads = w => [...w].filter(x => x === 'H').length;
      const events = easy ? [
        ['two heads', w => heads(w) === 2], ['two tails', w => heads(w) === 0], ['one head and one tail', w => heads(w) === 1], ['at least one head', w => heads(w) >= 1]
      ] : [
        ['three heads', w => heads(w) === 3], ['exactly two heads', w => heads(w) === 2], ['exactly one head', w => heads(w) === 1],
        ['at least one tail', w => heads(w) < 3], ['no heads at all', w => heads(w) === 0], ['more heads than tails', w => heads(w) >= 2]
      ];
      const [label, test] = pick(events);
      p.c = c; p.ways = ways; p.event = label; p.winners = ways.filter(test); p.k = p.winners.length; p.n = ways.length;
      p.story = `You flip <strong>${c} coins</strong>. Each coin lands on <strong>H</strong> (heads) or <strong>T</strong> (tails). How many different ways can the coins land? What is the chance of getting <strong>${label}</strong>?`;
      p.answers = [{ type: 'number', label: 'Different ways to land', value: p.n }, { type: 'outOf', label: `Chance of ${label}`, value: [p.k, p.n] }];
      p.hint = `Make a list. Start with coin 1 as H and list every way for the other coin${c > 2 ? 's' : ''}, then do the same with coin 1 as T. HT and TH are different!`;
      p.outcomes = ways.map(w => ({ key: w, coins: w, weight: 1, win: p.winners.includes(w) }));
      p.watch = label;
    }

    else throw new Error('Unknown problem type: ' + kind);
    return p;
  }

  // ---------- Pictures ----------
  const marble = (color, dim = false, glow = false) => `<span class="marble${dim ? ' dim' : ''}${glow ? ' glow' : ''}" style="--c:${COLORS[color].hex}" aria-hidden="true">${COLORS[color].letter}</span>`;
  const jar = (marbles, focus = null) => `<div class="jar" role="img" aria-label="A jar of ${marbles.length} marbles">${marbles.map(c => marble(c, focus && c !== focus, focus && c === focus)).join('')}</div>`;
  const colorRows = (groups, glowColors = []) => `<div class="color-rows">${groups.map(g => `<div class="color-row${glowColors.includes(g.color) ? ' glow-row' : ''}"><span class="color-row-label">${cap(COLORS[g.color].name)}</span><span class="color-row-marbles">${Array(g.count).fill(0).map(() => marble(g.color)).join('')}</span><strong>${g.count}</strong></div>`).join('')}</div>`;

  function spinner(slices, { focus = null, numbers = false, size = 210, label = '' } = {}) {
    const n = slices.length, r = 92, cx = 100, cy = 104;
    const point = (deg, rad) => [cx + rad * Math.cos(deg * Math.PI / 180), cy + rad * Math.sin(deg * Math.PI / 180)];
    const focusList = focus ? [].concat(focus) : null;
    const parts = slices.map((c, i) => {
      const a0 = -90 + i * 360 / n, a1 = a0 + 360 / n, [x0, y0] = point(a0, r), [x1, y1] = point(a1, r);
      const [tx, ty] = point((a0 + a1) / 2, r * 0.66);
      const dim = focusList && !focusList.includes(c);
      return `<path d="M${cx} ${cy}L${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z" fill="${dim ? '#e4e7da' : COLORS[c].hex}" stroke="#fffdf6" stroke-width="2.5"/>` +
        `<text x="${tx.toFixed(1)}" y="${(ty + 5).toFixed(1)}" text-anchor="middle" class="slice-text" opacity="${dim ? 0.35 : 1}">${numbers ? i + 1 : COLORS[c].letter}</text>`;
    }).join('');
    return `<svg class="spinner" viewBox="0 0 200 206" width="${size}" height="${size}" role="img" aria-label="${label || `Spinner with ${n} equal slices`}"><circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="#314d45"/>${parts}<circle cx="${cx}" cy="${cy}" r="9" fill="#314d45"/><path d="M${cx} ${cy}L${cx + 30} ${cy - 40}" stroke="#314d45" stroke-width="5" stroke-linecap="round"/></svg>`;
  }

  const PIPS = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]], 6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]] };
  const die = (face, { win = false, dim = false, size = 54 } = {}) => `<svg class="die${win ? ' win' : ''}${dim ? ' dim' : ''}" viewBox="0 0 60 60" width="${size}" height="${size}" role="img" aria-label="Die showing ${face}"><rect x="3" y="3" width="54" height="54" rx="11" fill="${win ? '#f7e9b2' : '#fffdf6'}" stroke="${win ? '#b48a1e' : '#314d45'}" stroke-width="${win ? 3.5 : 2}"/>${PIPS[face].map(([x, y]) => `<circle cx="${x * 15}" cy="${y * 15}" r="5" fill="#314d45"/>`).join('')}</svg>`;
  const dice = (winners = null) => `<div class="dice-row">${[1, 2, 3, 4, 5, 6].map(f => `<div class="die-cell">${die(f, { win: winners && winners.includes(f), dim: winners && !winners.includes(f) })}<span>${f}</span></div>`).join('')}</div>`;

  const coin = side => `<span class="coin ${side === 'H' ? 'heads' : 'tails'}" aria-hidden="true">${side}</span>`;
  const coinTable = (p, highlight = false) => `<div class="coin-table" style="--coins:${p.c}" role="img" aria-label="All ${p.n} ways ${p.c} coins can land"><div class="coin-row coin-head"><span>#</span>${Array.from({ length: p.c }, (_, i) => `<span>Coin ${i + 1}</span>`).join('')}<span></span></div>${p.ways.map((w, i) => { const win = highlight && p.winners.includes(w); return `<div class="coin-row${win ? ' win' : ''}${highlight && !win ? ' dim' : ''}"><span>${i + 1}</span>${[...w].map(coin).join('')}<span>${win ? '✓' : ''}</span></div>`; }).join('')}</div>`;

  const outOfBar = (k, n, color = '#f2c94c') => `<div class="out-of"><div class="out-of-cells">${Array.from({ length: n }, (_, i) => `<span style="${i < k ? `background:${color}` : ''}"></span>`).join('')}</div><div class="out-of-words"><strong>${k}</strong> out of <strong>${n}</strong></div></div>`;
  function chanceLine(k, n, word) {
    // Word stops sit at the centers of 5 equal columns; the track runs from the first center to the last.
    const pos = (n ? k / n : 0) * 100;
    const help = ['none', 'less than half', 'half', 'more than half', 'all'];
    return `<div class="chance-line" role="img" aria-label="Chance line: ${k} out of ${n} is ${word}"><div class="chance-track"><span class="chance-marker" style="left:${pos}%"><em>${k} of ${n}</em>▼</span></div><div class="chance-stops">${CHANCE_WORDS.map((w, i) => `<span class="${w === word ? 'here' : ''}"><strong>${w}</strong><small>${help[i]}</small></span>`).join('')}</div></div>`;
  }

  // ---------- Explanation steps ----------
  function stepsFor(p) {
    if (p.kind === 'words') {
      const t = COLORS[p.target].name, word = p.answers[0].value;
      const why = { Impossible: `There are no ${t} marbles, so it can never happen.`, Unlikely: `Fewer than half are ${t}. It could happen, but probably won’t.`, 'Even chance': `Exactly half are ${t}. It’s just as likely to happen as not.`, Likely: `More than half are ${t}. It will probably happen, but it’s not for sure.`, Certain: `Every marble is ${t}. It has to happen!` }[word];
      return [
        { title: 'Look inside the jar', description: `There are ${p.n} marbles. Each marble has the same chance of being picked.`, diagram: jar(p.marbles), equation: `${p.n} marbles = ${p.n} chances` },
        { title: `Find the ${t} marbles`, description: p.k ? `Light up only the ${t} marbles. Count them: ${p.k}.` : `Look carefully… there are no ${t} marbles at all!`, diagram: jar(p.marbles, p.target) + outOfBar(p.k, p.n, COLORS[p.target].hex), equation: `${p.k} out of ${p.n} are ${t}` },
        { title: 'Put it on the chance line', description: why, diagram: chanceLine(p.k, p.n, word), equation: `${p.k} out of ${p.n} → ${word}` }
      ];
    }
    if (p.kind === 'likely') {
      const top = p.sorted[0], low = p.sorted[p.sorted.length - 1];
      const cmp = p.equal ? p.groups.map(g => `${g.count} ${COLORS[g.color].name}`).join(' = ') : p.sorted.map(g => `${g.count} ${COLORS[g.color].name}`).join(' > ');
      return [
        { title: 'Look inside the jar', description: `${p.n} marbles are all mixed up. You can’t see which one you’ll grab.`, diagram: jar(p.marbles), equation: `${p.n} marbles = ${p.n} chances` },
        { title: 'Sort them by color', description: 'Line up each color in its own row. Now it’s easy to compare.', diagram: colorRows(p.groups), equation: p.groups.map(g => `${cap(COLORS[g.color].name)}: ${g.count}`).join('   ') },
        { title: 'More marbles, more chances', description: p.equal ? 'Every row is the same length. Each color has the same chance!' : `${cap(COLORS[top.color].name)} has the longest row, so it’s the most likely.${p.easy ? '' : ` ${cap(COLORS[low.color].name)} has the shortest row, so it’s the least likely.`}`, diagram: colorRows(p.groups, p.equal ? [] : [top.color]), equation: cmp }
      ];
    }
    if (p.kind === 'spinner') {
      const t = COLORS[p.target].name;
      const steps = [
        { title: 'Count all the slices', description: `Every slice is the same size, so each slice is one equal chance. Count them all.`, diagram: spinner(p.slices, { numbers: true }), equation: `${p.n} slices = ${p.n} chances` },
        { title: `Count the ${t} slices`, description: `Now count only the ${t} slices. There ${p.k === 1 ? 'is' : 'are'} ${p.k}.`, diagram: spinner(p.slices, { focus: p.target }), equation: `${p.k} ${t} slice${p.k === 1 ? '' : 's'}` },
        { title: 'Say the chance', description: `${p.k} of the ${p.n} slices are ${t}. We say the chance is ${p.k} out of ${p.n}.`, diagram: outOfBar(p.k, p.n, COLORS[p.target].hex), equation: `Chance of ${t} = ${p.k} out of ${p.n}` }
      ];
      if (!p.easy) steps.push({ title: `What about not ${t}?`, description: `Every slice that isn’t ${t} counts. Take the ${t} slices away from all the slices.`, diagram: spinner(p.slices, { focus: p.groups.slice(1).map(g => g.color) }) + outOfBar(p.n - p.k, p.n, '#b9c7ae'), equation: `${p.n} − ${p.k} = ${p.n - p.k}, so ${p.n - p.k} out of ${p.n}` });
      return steps;
    }
    if (p.kind === 'fair') {
      const m = COLORS[p.mine].name, o = COLORS[p.theirs].name;
      const verdict = p.a === p.b ? 'Same chances, so the game is fair!' : `Not fair: ${p.a > p.b ? 'you have' : p.name + ' has'} more chances to win.`;
      return [
        { title: 'Look at the spinner', description: `Every slice is the same size. There are ${p.n} slices, so there are ${p.n} chances.`, diagram: spinner(p.slices, { numbers: true }), equation: `${p.n} slices = ${p.n} chances` },
        { title: `Count your ${m} slices`, description: `You win on ${m}. You have ${p.a} winning slice${p.a === 1 ? '' : 's'}.`, diagram: spinner(p.slices, { focus: p.mine }), equation: `You: ${p.a} out of ${p.n}` },
        { title: `Count ${p.name}’s ${o} slices`, description: `${p.name} wins on ${o}. ${p.name} has ${p.b} winning slice${p.b === 1 ? '' : 's'}.`, diagram: spinner(p.slices, { focus: p.theirs }), equation: `${p.name}: ${p.b} out of ${p.n}` },
        { title: 'Compare the chances', description: `${verdict}${p.a !== p.b ? ` To make it fair, you would each need ${p.n / 2} slices.` : ''}`, diagram: `<div class="fair-compare"><div><span>You</span>${outOfBar(p.a, p.n, COLORS[p.mine].hex)}</div><div><span>${p.name}</span>${outOfBar(p.b, p.n, COLORS[p.theirs].hex)}</div></div>`, equation: `${p.a} ${p.a === p.b ? '=' : p.a > p.b ? '>' : '<'} ${p.b} → ${p.a === p.b ? 'Fair' : 'Not fair'}` }
      ];
    }
    if (p.kind === 'dice') return [
      { title: 'Look at all 6 sides', description: 'A die has 6 sides. Each side has the same chance of landing on top.', diagram: dice(), equation: '6 sides = 6 chances' },
      { title: `Find ${p.event}`, description: p.k === 0 ? `Check every side… none of them is ${p.event}!` : p.k === 6 ? `Every single side works!` : `Light up every side that is ${p.event}. ${p.k === 1 ? 'Only this side works' : 'These sides work'}: ${listJoin(p.winners.map(String))}.`, diagram: dice(p.winners), equation: `${p.k} side${p.k === 1 ? '' : 's'} match${p.k === 1 ? 'es' : ''}` },
      { title: 'Say the chance', description: `${p.k} of the 6 sides work. ${p.k === 0 ? 'It’s impossible!' : p.k === 6 ? 'It’s certain!' : p.k * 2 > 6 ? 'That’s more than half, so it’s likely.' : p.k * 2 === 6 ? 'That’s exactly half: an even chance.' : 'That’s less than half, so it’s unlikely.'}`, diagram: outOfBar(p.k, 6), equation: `Chance = ${p.k} out of 6` }
    ];
    // coins
    const mult = Array(p.c).fill(2).join(' × ');
    const mixed = p.c === 2 && p.event === 'one head and one tail';
    return [
      { title: 'List every way', description: `Each coin can land 2 ways. For each way coin 1 lands, coin 2 can land 2 ways${p.c > 2 ? ', and so can coin 3' : ''}. Make a tidy list so you don’t miss any.`, diagram: coinTable(p), equation: `${mult} = ${p.n} ways` },
      { title: `Find ${p.event}`, description: `Tick every row that shows ${p.event}.${mixed ? ' HT and TH are different ways: coin 1 and coin 2 swap!' : ''}`, diagram: coinTable(p, true), equation: `${p.k} row${p.k === 1 ? '' : 's'} match${p.k === 1 ? 'es' : ''}` },
      { title: 'Say the chance', description: `${p.k} of the ${p.n} ways give ${p.event}.`, diagram: outOfBar(p.k, p.n), equation: `Chance = ${p.k} out of ${p.n}` }
    ];
  }

  // ---------- Rendering ----------
  function storyVisual(p) {
    if (p.kind === 'words' || p.kind === 'likely') return jar(p.marbles);
    if (p.kind === 'spinner' || p.kind === 'fair') return spinner(p.slices, { size: 170 });
    if (p.kind === 'dice') return die(rand(1, 6), { size: 64 });
    return `<div class="coin-pair">${Array.from({ length: p.c }, () => `<span class="coin big">?</span>`).join('')}</div>`;
  }
  function answerField(a, i) {
    if (a.type === 'choice') return `<fieldset class="choice-field" id="answer-${i}" aria-invalid="false"><legend>${a.label}</legend><div class="choices">${a.options.map((o, j) => `<label class="choice"><input type="radio" name="answer-${i}" value="${o}" id="answer-${i}-${j}"><span>${o}</span></label>`).join('')}</div></fieldset>`;
    const input = (id, label) => `<div class="input-wrap"><input id="${id}" type="text" inputmode="numeric" autocomplete="off" placeholder="?" aria-label="${label}" aria-describedby="feedback" aria-invalid="false"></div>`;
    if (a.type === 'outOf') return `<div class="answer-row"><span class="answer-label">${a.label}</span><div class="out-of-inputs">${input(`answer-${i}-a`, a.label + ': how many winning chances')}<span>out of</span>${input(`answer-${i}-b`, a.label + ': how many chances altogether')}</div></div>`;
    return `<div class="answer-row"><label for="answer-${i}-a">${a.label}</label>${input(`answer-${i}-a`, a.label)}</div>`;
  }
  function renderStep() {
    const steps = stepsFor(problem), current = steps[step];
    $('visual-title').textContent = current.title;
    $('step-description').textContent = current.description;
    $('diagram').innerHTML = current.diagram;
    $('equation').textContent = current.equation;
    $('step-dots').innerHTML = steps.map((s, i) => `<button class="step-dot" data-step="${i}" aria-label="Step ${i + 1}: ${s.title}" ${i === step ? 'aria-current="step"' : ''}></button>`).join('');
    $('previous-step').disabled = step === 0;
    $('next-step').textContent = step === steps.length - 1 ? 'Try a new problem ↻' : 'Show the next step →';
    $('visual-note').textContent = `Step ${step + 1} of ${steps.length} · ${step === steps.length - 1 ? 'Try the answers, or test it below!' : 'Take your time. Try an answer whenever you’re ready.'}`;
  }
  function renderProblem() {
    step = 0; solved = false; trials = [];
    const meta = topics[topic];
    $('topic-caption').textContent = meta.caption;
    $('story-icon').textContent = meta.icon;
    $('problem-title').textContent = meta.title;
    $('picture-badge').textContent = meta.badge;
    $('story').innerHTML = problem.story;
    $('story-visual').innerHTML = storyVisual(problem);
    $('answer-fields').innerHTML = problem.answers.map(answerField).join('');
    $('feedback').textContent = ''; $('feedback').className = 'feedback';
    $('hint').hidden = true; $('hint-button').setAttribute('aria-expanded', 'false');
    $('hint-button').setAttribute('aria-controls', 'hint'); $('hint').textContent = problem.hint;
    document.querySelectorAll('.topic').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.topic === topic)));
    renderStep(); renderExperiment();
  }
  function nextProblem() {
    const previous = problem ? problem.story : '';
    for (let i = 0; i < 12; i++) { problem = generate(topic, level); if (problem.story !== previous) break; }
    renderProblem();
  }

  // ---------- Experiment: try it many times ----------
  function draw(p) {
    const total = p.outcomes.reduce((s, o) => s + o.weight, 0);
    let r = Math.random() * total;
    for (const o of p.outcomes) { r -= o.weight; if (r < 0) return o; }
    return p.outcomes[p.outcomes.length - 1];
  }
  const outcomeChip = o => o.color ? marble(o.color) : o.face ? die(o.face, { size: 26 }) : `<span class="coin-chips">${[...o.coins].map(coin).join('')}</span>`;
  function renderExperiment() {
    const p = problem, total = trials.length;
    const what = { words: 'pick a marble', likely: 'pick a marble', spinner: 'spin', fair: 'spin', dice: 'roll the die', coins: `flip the coin${p.c > 1 ? 's' : ''}` }[p.kind];
    $('experiment-intro').textContent = `Let’s ${what} for real! Each try is random. Watch the tally grow.`;
    $('try-reset').disabled = total === 0;
    $('experiment-last').innerHTML = total ? `<span>Last tries:</span>${trials.slice(-10).map(o => `<span class="last-chip">${outcomeChip(o)}</span>`).join('')}` : '<span>No tries yet. Press a button to start!</span>';
    const counts = p.outcomes.map(o => trials.filter(t => t.key === o.key).length);
    const max = Math.max(1, ...counts);
    $('tally').innerHTML = p.outcomes.map((o, i) => `<div class="tally-row${o.win ? ' win' : ''}"><span class="tally-label">${outcomeChip(o)}${o.who ? `<small>${o.who}</small>` : o.win ? '<small>✓</small>' : ''}</span><span class="tally-bar"><span style="width:${counts[i] / max * 100}%;${o.color ? `background:${COLORS[o.color].hex}` : ''}"></span></span><strong>${counts[i]}</strong></div>`).join('');
    let note = 'Things with more chances usually happen more often, but not every time!';
    if (total) {
      if (p.watch) { const wins = trials.filter(t => t.win).length; note = `${cap(p.watch)}: <strong>${wins} out of ${total}</strong> tries. The math says about ${p.k} out of every ${p.n}. ${total < 30 ? 'Keep trying, and the tally usually gets closer!' : 'See how close it gets?'}`; }
      else if (p.kind === 'fair') { const you = trials.filter(t => t.color === p.mine).length; note = `You won <strong>${you}</strong> times. ${p.name} won <strong>${total - you}</strong> times. ${total < 30 ? 'Try more spins to see who usually wins.' : p.a === p.b ? 'Fair games stay close over many spins.' : 'Over many spins, the player with more slices usually wins more.'}`; }
      else note = `${total} tries so far. Longer rows in the jar usually get longer tallies here, but surprises happen!`;
    }
    $('experiment-note').innerHTML = note;
  }
  function tryIt(times) { for (let i = 0; i < times; i++) trials.push(draw(problem)); renderExperiment(); }

  // ---------- Stars & checking ----------
  function updateStars() {
    $('star-count').textContent = stars.toLocaleString('en-US');
    const progress = stars && stars % 10 === 0 ? 10 : stars % 10;
    $('progress-fill').style.width = progress * 10 + '%';
    document.querySelector('.progress-track').setAttribute('aria-label', `${progress} of 10 stars toward a celebration`);
  }
  const readNumber = id => { const raw = $(id).value.trim(); return /^\d+$/.test(raw) ? Number(raw) : raw ? NaN : null; };
  $('answer-form').addEventListener('submit', event => {
    event.preventDefault();
    let allCorrect = true, empty = false, firstWrong = null, sameChance = false;
    problem.answers.forEach((a, i) => {
      let correct = false, focusEl;
      if (a.type === 'choice') {
        const chosen = document.querySelector(`input[name="answer-${i}"]:checked`);
        if (!chosen) empty = true;
        correct = Boolean(chosen) && chosen.value === a.value;
        $('answer-' + i).setAttribute('aria-invalid', String(!correct));
        focusEl = chosen || $(`answer-${i}-0`);
      } else if (a.type === 'outOf') {
        const top = readNumber(`answer-${i}-a`), bottom = readNumber(`answer-${i}-b`);
        if (top === null || bottom === null) empty = true;
        const [k, n] = a.value;
        // Equivalent chances (like 2 out of 4 for 1 out of 2) are also right.
        correct = top !== null && bottom > 0 && top <= bottom && top * n === k * bottom;
        if (correct && bottom !== n) sameChance = true;
        const topOk = correct || top === k, bottomOk = correct || bottom === n;
        $(`answer-${i}-a`).setAttribute('aria-invalid', String(!topOk));
        $(`answer-${i}-b`).setAttribute('aria-invalid', String(!bottomOk));
        focusEl = !topOk ? $(`answer-${i}-a`) : $(`answer-${i}-b`);
      } else {
        const value = readNumber(`answer-${i}-a`);
        if (value === null) empty = true;
        correct = value === a.value;
        $(`answer-${i}-a`).setAttribute('aria-invalid', String(!correct));
        focusEl = $(`answer-${i}-a`);
      }
      if (!correct) { allCorrect = false; firstWrong ??= focusEl; }
    });
    if (allCorrect) {
      $('feedback').className = 'feedback success';
      const extra = sameChance ? ' (That’s the same chance written a different way. Clever!)' : '';
      $('feedback').textContent = (solved ? '✓ You’ve already earned a star for this one. Try a new problem!' : '★ You got it! Great thinking. One shiny star for you.') + extra;
      if (!solved) {
        solved = true; stars++; updateStars();
        try { localStorage.setItem('little-big-math-stars', String(stars)); } catch (_) {}
        if (stars % 10 === 0) {
          $('celebration').textContent = `🌟 ${stars.toLocaleString('en-US')} stars! Look how much your thinking has grown! 🌱`;
          $('celebration').classList.add('visible');
          setTimeout(() => $('celebration').classList.remove('visible'), 5000);
        }
      }
    } else {
      $('feedback').className = 'feedback try';
      $('feedback').textContent = empty ? 'Fill in each answer, then let’s check together.' : 'A little rethink! Check the highlighted answer. The picture or hint can help.';
      firstWrong.focus();
    }
  });
  $('answer-fields').addEventListener('change', event => { const field = event.target.closest('.choice-field'); if (field) field.setAttribute('aria-invalid', 'false'); });

  // ---------- Controls ----------
  const setTopic = t => { topic = t; history.replaceState(null, '', '#' + t); nextProblem(); };
  document.querySelectorAll('.topic').forEach(b => b.addEventListener('click', () => setTopic(b.dataset.topic)));
  $('mix-button').addEventListener('click', () => setTopic(pick(Object.keys(topics).filter(k => k !== topic))));
  $('difficulty').addEventListener('change', e => { level = e.target.value; nextProblem(); });
  $('new-button').addEventListener('click', nextProblem);
  $('hint-button').addEventListener('click', () => { $('hint').hidden = !$('hint').hidden; $('hint-button').setAttribute('aria-expanded', String(!$('hint').hidden)); });
  $('previous-step').addEventListener('click', () => { if (step > 0) { step--; renderStep(); } });
  $('next-step').addEventListener('click', () => { if (step < stepsFor(problem).length - 1) { step++; renderStep(); } else nextProblem(); });
  $('step-dots').addEventListener('click', e => { const b = e.target.closest('[data-step]'); if (b) { step = Number(b.dataset.step); renderStep(); } });
  $('try-once').addEventListener('click', () => tryIt(1));
  $('try-ten').addEventListener('click', () => tryIt(10));
  $('try-reset').addEventListener('click', () => { trials = []; renderExperiment(); });

  const linked = decodeURIComponent(location.hash.slice(1));
  if (Object.hasOwn(topics, linked)) topic = linked;
  nextProblem(); updateStars();
  // Pure generators make it easy to check every problem family from the console.
  window.ChanceLab = { generate, stepsFor, getState: () => ({ topic, level, problem, step, solved, stars, trials: trials.length }) };
})();
