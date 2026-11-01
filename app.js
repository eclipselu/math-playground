(() => {
  'use strict';
  const $ = id => typeof document !== 'undefined' ? document.getElementById(id) : null;
  const topics = {
    difference: { caption: 'A LITTLE MORE', icon: '🍫', title: 'Yesterday and today' },
    ratio: { caption: 'TIMES AS MUCH', icon: '💰', title: 'Let’s share the treasure' },
    extra: { caption: 'A LITTLE EXTRA', icon: '✨', title: 'A treasure with a little extra' },
    shop: { caption: 'LITTLE SHOP', icon: '🍟', title: 'A trip to the little shop' },
    count: { caption: 'NUMBER HOPS', icon: '🐸', title: 'Hop along the number path' },
    sharing: { caption: 'SHARE FAIRLY', icon: '🍓', title: 'A fair share for everyone' },
    missing: { caption: 'THE MISSING PIECE', icon: '🧩', title: 'Find the hidden treasures' },
    groups: { caption: 'BAGS OF TREASURES', icon: '🧸', title: 'Little bags, lots of treasures' },
    twoStep: { caption: 'FIRST… THEN…', icon: '🎈', title: 'One little step at a time' },
    diffRatio: { caption: 'DIFFERENCE & TIMES', icon: '⚖️', title: 'More, and times as much' },
    age: { caption: 'AGE PUZZLE', icon: '🎂', title: 'Growing up together' },
    venn: { caption: 'OVERLAPPING CIRCLES', icon: '⭕', title: 'Both, one, or neither' },
    combo: { caption: 'CLEVER COMBINATIONS', icon: '👕', title: 'Every possible way' },
    planting: { caption: 'GAPS AND MARKERS', icon: '🌲', title: 'Count the spaces between' },
    backwards: { caption: 'WORK BACKWARDS', icon: '⏪', title: 'Rewind the story' },
    chickenRabbit: { caption: 'HEADS AND LEGS', icon: '🐰', title: 'Chickens and rabbits in a pen' }
  };
  const names = ['Tom', 'Mia', 'Sam', 'Ava', 'Leo', 'Emma', 'Jack', 'Zoe'];
  const treasures = [
    {name:'stickers', icon:'⭐'}, {name:'marbles', icon:'🔵'},
    {name:'toy cars', icon:'🚗'}, {name:'shells', icon:'🐚'},
    {name:'blocks', icon:'🧱'}, {name:'cards', icon:'🃏'},
    {name:'colored pencils', icon:'✏️'}, {name:'badges', icon:'🏅'}
  ];
  const menus = [
    {first:'pack of fries', plural:'packs of fries', second:'burger', secondPlural:'burgers', a:'🍟', b:'🍔'},
    {first:'apple', plural:'apples', second:'muffin', secondPlural:'muffins', a:'🍎', b:'🧁'},
    {first:'pencil', plural:'pencils', second:'notebook', secondPlural:'notebooks', a:'✏️', b:'📓'},
    {first:'cookie', plural:'cookies', second:'sandwich', secondPlural:'sandwiches', a:'🍪', b:'🥪'}
  ];
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const fmt = n => n.toLocaleString('en-US');
  let topic = 'shop', level = 'easy', problem, step = 0, solved = false, stars = 0;
  try {
    if (typeof localStorage !== 'undefined') {
      stars = Math.max(0, Number(localStorage.getItem('little-big-math-stars')) || 0);
    }
  } catch (_) {}

  function generate(kind, difficulty, original = false) {
    const ranges = { easy: [2, 9], medium: [10, 30], large: [50, 250] };
    const [lo, hi] = ranges[difficulty];
    const base = original ? 2 : rand(lo, difficulty === 'easy' && kind === 'shop' ? 3 : difficulty === 'easy' && ['sharing','groups'].includes(kind) ? 6 : hi);
    const multiplier = original ? 2 : rand(2, difficulty === 'easy' ? 3 : 4);
    const extra = rand(1, difficulty === 'easy' ? 6 : difficulty === 'medium' ? 15 : 50);
    const name = names[rand(0, names.length - 1)];
    const item = treasures[rand(0, treasures.length - 1)];
    const p = { kind, base, multiplier, extra, name, item };

    if (kind === 'difference') {
      p.total = base * 2 + extra;
      p.story = `You collected <strong>${fmt(p.total)} ${item.name}</strong> altogether over yesterday and today. Today you collected <strong>${extra} more</strong> than yesterday.`;
      p.answers = [{label:`${item.name} yesterday`, value:base}, {label:`${item.name} today`, value:base + extra}];
      p.hint = `Put the ${extra} extra ${item.name} aside. The rest can be shared equally between two days.`;
    } else if (kind === 'ratio' || kind === 'extra') {
      p.extra = kind === 'extra' ? extra : 0;
      p.money = rand(0, 1) === 0;
      p.total = base * (multiplier + 1) + p.extra;
      p.story = `You and ${name} have <strong>${p.money ? '$' + fmt(p.total) : fmt(p.total) + ' ' + item.name} altogether</strong>. ${name} has <strong>${multiplier === 2 ? 'twice' : multiplier + ' times'} as ${p.money ? 'much money' : 'many ' + item.name} as you${p.extra ? ', plus ' + (p.money ? '$' : '') + p.extra + ' extra' : ''}</strong>.`;
      p.answers = [{label:p.money ? 'Your money' : `Your ${item.name}`, value:base, money:p.money}, {label:`${name}’s ${p.money ? 'money' : item.name}`, value:base * multiplier + p.extra, money:p.money}];
      p.hint = `${p.extra ? 'Put the extra ' + (p.money ? '$' : '') + p.extra + ' aside first. ' : ''}You have 1 equal part and ${name} has ${multiplier}. How many parts is that altogether?`;
    } else if (kind === 'shop') {
      p.menu = original ? menus[0] : menus[rand(0, menus.length - 1)];
      p.fries = original ? 3 : rand(2, 4); p.burgers = original ? 2 : rand(1, difficulty === 'easy' ? 2 : 3);
      p.buyFries = original ? 4 : rand(2, difficulty === 'easy' ? 4 : 5); p.buyBurgers = original ? 5 : rand(2, difficulty === 'easy' ? 4 : 5);
      p.total = (p.fries + p.burgers * multiplier) * base;
      p.story = `${original ? 'James' : name} buys <strong>${p.fries} ${p.menu.plural}</strong> and <strong>${p.burgers} ${p.burgers === 1 ? p.menu.second : p.menu.secondPlural}</strong> for <strong>$${fmt(p.total)}</strong>. One ${p.menu.second} costs <strong>${multiplier === 2 ? 'twice' : multiplier + ' times'} as much</strong> as one ${p.menu.first}.`;
      p.answers = [{label:`Price of one ${p.menu.first}`, value:base, money:true}, {label:`Price of ${p.buyFries} ${p.menu.plural} + ${p.buyBurgers} ${p.menu.secondPlural}`, value:(p.buyFries + p.buyBurgers * multiplier) * base, money:true}];
      p.hint = `Draw 1 box for each ${p.menu.first} and ${multiplier} boxes for each ${p.menu.second}. Share $${fmt(p.total)} equally between all the boxes.`;
    } else if (kind === 'sharing' || kind === 'groups') {
      p.groups = rand(2, difficulty === 'easy' ? 4 : 5);
      p.total = base * p.groups;
      if (kind === 'sharing') {
        p.story = `${name} has <strong>${fmt(p.total)} ${item.name}</strong> to share equally between <strong>${p.groups} children</strong>. How many does each child get?`;
        p.answers = [{label:`${item.name} for each child`, value:base}];
        p.hint = `Draw ${p.groups} children. Give one ${item.name === 'toy cars' ? 'car' : 'treasure'} to each child, and keep taking turns until all ${fmt(p.total)} are shared.`;
      } else {
        p.story = `You have <strong>${p.groups} bags</strong> with <strong>${base} ${item.name} in each bag</strong>. How many ${item.name} are there altogether? Then you get <strong>1 more matching bag</strong>. How many do you have now?`;
        p.answers = [{label:`${item.name} in the first ${p.groups} bags`, value:p.total}, {label:'Total after one more bag', value:p.total + base}];
        p.hint = `Add ${base} once for each of the ${p.groups} bags. Then add ${base} one more time for the new bag.`;
      }
    } else if (kind === 'missing') {
      p.known = extra; p.total = base + p.known;
      p.story = `You and ${name} have <strong>${fmt(p.total)} ${item.name} altogether</strong>. You have <strong>${p.known} ${item.name}</strong>. How many does ${name} have?`;
      p.answers = [{label:`${name}’s ${item.name}`, value:base}];
      p.hint = `Start with all ${fmt(p.total)} ${item.name}. Take away your ${p.known}. The rest belong to ${name}.`;
    } else if (kind === 'twoStep') {
      p.start = difficulty === 'easy' ? rand(5, 12) : base;
      p.gained = extra;
      p.before = p.start + p.gained;
      p.gave = rand(1, Math.min(p.before - 1, difficulty === 'easy' ? 8 : hi));
      p.total = p.before - p.gave;
      p.story = `You start with <strong>${p.start} ${item.name}</strong>. ${name} gives you <strong>${p.gained} more</strong>. Then you give <strong>${p.gave}</strong> to a friend. How many do you have before giving some away? How many are left at the end?`;
      p.answers = [{label:'After getting more', value:p.before}, {label:'Left at the end', value:p.total}];
      p.hint = `Do one step at a time: first add ${p.gained} to ${p.start}. Then take away ${p.gave} from that new amount.`;
    } else if (kind === 'count') {
      p.start = rand(0, difficulty === 'easy' ? 5 : 20);
      p.first = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(6, 15) : rand(50, 150);
      p.second = p.first + rand(1, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 12 : 150);
      p.hops = difficulty === 'easy' ? 3 : 4;
      p.before = p.start + p.first * p.hops;
      p.story = `Start at <strong>${p.start}</strong>. Add <strong>${p.first}</strong> each time for <strong>${p.hops} hops</strong>. Then switch to adding <strong>${p.second}</strong>. What number comes after the first hop with the new rule?`;
      p.answers = [{label:'The next number', value:p.before + p.second}];
      p.hint = `Start at ${p.start} and add ${p.first} exactly ${p.hops} times. Then add ${p.second} once.`;
    } else if (kind === 'diffRatio') {
      const k = original ? 3 : rand(2, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
      const baseVal = original ? 4 : rand(lo, difficulty === 'easy' ? 9 : difficulty === 'medium' ? 30 : 100);
      const diffVal = baseVal * (k - 1);
      const nameA = names[rand(0, names.length - 1)];
      let nameB = names[rand(0, names.length - 1)];
      while (nameB === nameA) nameB = names[rand(0, names.length - 1)];
      p.nameA = nameA;
      p.nameB = nameB;
      p.multiplier = k;
      p.base = baseVal;
      p.diff = diffVal;
      p.story = `<strong>${nameB}</strong> has <strong>${k === 2 ? 'twice' : k + ' times'} as many ${item.name} as ${nameA}</strong>. ${nameB} also has <strong>${fmt(diffVal)} more ${item.name}</strong> than ${nameA}.`;
      p.answers = [
        { label: `${nameA}’s ${item.name}`, value: baseVal },
        { label: `${nameB}’s ${item.name}`, value: baseVal * k }
      ];
      p.hint = `Draw 1 box for ${nameA} and ${k} matching boxes for ${nameB}. The ${k - 1} extra ${k - 1 === 1 ? 'box equals' : 'boxes equal'} ${fmt(diffVal)} ${item.name}. Divide ${fmt(diffVal)} by ${k - 1} to find 1 box!`;
    } else if (kind === 'age') {
      const olderRelatives = ['Mom', 'Dad', 'Uncle Dan', 'Aunt Lily', 'Grandpa'];
      const childNames = ['Leo', 'Mia', 'Sam', 'Ava', 'Emma'];
      const older = olderRelatives[rand(0, olderRelatives.length - 1)];
      const child = childNames[rand(0, childNames.length - 1)];
      const k = original ? 3 : rand(2, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
      const targetChildAge = original ? 10 : rand(difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16, difficulty === 'easy' ? 14 : difficulty === 'medium' ? 20 : 28);
      const diffVal = targetChildAge * (k - 1);
      const maxYears = Math.min(targetChildAge - 3, difficulty === 'easy' ? 6 : difficulty === 'medium' ? 9 : 15);
      const years = original ? 3 : rand(2, Math.max(2, maxYears));
      const childAge = targetChildAge - years;
      const olderAge = childAge + diffVal;
      p.older = older;
      p.child = child;
      p.multiplier = k;
      p.targetChildAge = targetChildAge;
      p.targetOlderAge = targetChildAge * k;
      p.diff = diffVal;
      p.years = years;
      p.childAge = childAge;
      p.olderAge = olderAge;
      p.story = `Right now, <strong>${older} is ${olderAge} years old</strong> and <strong>${child} is ${childAge} years old</strong>. In how many years will ${older} be <strong>${k === 2 ? 'twice' : k + ' times'} as old as ${child}</strong>?`;
      p.answers = [
        { label: 'Age difference (always the same)', value: diffVal },
        { label: `Years until ${older} is ${k === 2 ? 'twice' : k + ' times'} as old`, value: years }
      ];
      p.hint = `The age gap never changes! First subtract ${olderAge} − ${childAge} = ${diffVal}. When ${older} is ${k}× as old, the ${k - 1} extra boxes must equal that same ${diffVal}-year gap.`;
    } else if (kind === 'venn') {
      const activities = [
        { name: 'soccer', icon: '⚽' }, { name: 'art club', icon: '🎨' },
        { name: 'swimming', icon: '🏊' }, { name: 'music', icon: '🎵' },
        { name: 'chess club', icon: '♟️' }, { name: 'robotics', icon: '🤖' },
        { name: 'basketball', icon: '🏀' }, { name: 'science club', icon: '🔬' }
      ];
      const idxA = rand(0, activities.length - 1);
      let idxB = rand(0, activities.length - 1);
      while (idxB === idxA) idxB = rand(0, activities.length - 1);
      const actA = activities[idxA], actB = activities[idxB];
      const onlyA = original ? 8 : rand(difficulty === 'easy' ? 4 : difficulty === 'medium' ? 9 : 20, difficulty === 'easy' ? 9 : difficulty === 'medium' ? 18 : 45);
      const onlyB = original ? 6 : rand(difficulty === 'easy' ? 4 : difficulty === 'medium' ? 9 : 20, difficulty === 'easy' ? 9 : difficulty === 'medium' ? 18 : 45);
      const both = original ? 4 : rand(difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 8, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20);
      const neither = difficulty === 'easy' ? 0 : original ? 5 : rand(difficulty === 'medium' ? 3 : 6, difficulty === 'medium' ? 8 : 20);
      const countA = onlyA + both;
      const countB = onlyB + both;
      const total = onlyA + onlyB + both + neither;
      p.actA = actA;
      p.actB = actB;
      p.onlyA = onlyA;
      p.onlyB = onlyB;
      p.both = both;
      p.neither = neither;
      p.countA = countA;
      p.countB = countB;
      p.total = total;
      p.story = `In a school grade, <strong>${countA} children do ${actA.name}</strong> and <strong>${countB} children do ${actB.name}</strong>. <strong>${both} children do both</strong>${neither ? `, and <strong>${neither} children do neither</strong>` : ''}.`;
      p.answers = [
        { label: `Children in ONLY ${actA.name}`, value: onlyA },
        { label: 'Total children altogether', value: total }
      ];
      p.hint = `The ${both} children who do both are counted in both clubs! Subtract them from ${countA} to find ONLY ${actA.name}. Then add: (only ${actA.name}) + (both) + (only ${actB.name})${neither ? ' + (neither)' : ''}.`;
    } else if (kind === 'combo') {
      const variant = original ? 'outfit' : ['outfit', 'digits', 'handshake'][rand(0, 2)];
      p.variant = variant;
      if (variant === 'outfit') {
        const tops = rand(2, difficulty === 'easy' ? 3 : 4);
        const bottoms = rand(2, difficulty === 'easy' ? 3 : 4);
        const hasHats = difficulty !== 'easy' && rand(0, 1) === 1;
        const hats = hasHats ? rand(2, 3) : 0;
        p.tops = tops;
        p.bottoms = bottoms;
        p.hats = hats;
        p.baseCombo = tops * bottoms;
        if (hats > 0) {
          p.story = `${name} is packing clothes for camp: <strong>${tops} shirts</strong>, <strong>${bottoms} pairs of shorts</strong>, and <strong>${hats} caps</strong>. An outfit pairs 1 shirt, 1 pair of shorts, and 1 cap.`;
          p.answers = [
            { label: 'Shirt + shorts combinations', value: tops * bottoms },
            { label: 'Full outfits (shirt + shorts + cap)', value: tops * bottoms * hats }
          ];
          p.hint = `Multiply shirts × shorts (${tops} × ${bottoms} = ${tops * bottoms}). Then multiply by the ${hats} caps!`;
        } else {
          p.story = `${name} has <strong>${tops} shirts</strong> and <strong>${bottoms} pairs of pants</strong>. Every outfit matches 1 shirt and 1 pair of pants. How many outfits can ${name} make? How many if ${name} buys <strong>1 more pair of pants</strong>?`;
          p.answers = [
            { label: 'Shirt + pants outfits', value: tops * bottoms },
            { label: 'Outfits after adding 1 more pair of pants', value: tops * (bottoms + 1) }
          ];
          p.hint = `For each of the ${tops} shirts, you can choose any of the ${bottoms} pants. That makes ${tops} × ${bottoms} outfits.`;
        }
      } else if (variant === 'digits') {
        const digitsPool = [2, 3, 4, 5, 6, 7, 8, 9];
        const picked = [];
        while (picked.length < 3) {
          const d = digitsPool[rand(0, digitsPool.length - 1)];
          if (!picked.includes(d)) picked.push(d);
        }
        picked.sort((a, b) => a - b);
        p.d0 = 0;
        p.d1 = picked[0];
        p.d2 = picked[1];
        p.d3 = picked[2];
        p.allCards = [0, p.d1, p.d2, p.d3];
        const twoDigitCount = 9;
        const startsWithD1 = 3;
        const threeDigitCount = 18;
        p.twoDigitCount = twoDigitCount;
        p.startsWithD1 = startsWithD1;
        p.threeDigitCount = threeDigitCount;
        if (difficulty === 'large') {
          p.story = `You have 4 digit cards: <strong>[0], [${p.d1}], [${p.d2}], and [${p.d3}]</strong>. Each card can only be used once in any number, and a number cannot start with 0.`;
          p.answers = [
            { label: 'Different 2-digit numbers you can make', value: twoDigitCount },
            { label: 'Different 3-digit numbers you can make', value: threeDigitCount }
          ];
          p.hint = `Tens place has 3 choices (no 0). Ones place has 3 cards left. For 3 digits: 3 choices × 3 choices × 2 choices!`;
        } else {
          p.story = `You have 4 digit cards: <strong>[0], [${p.d1}], [${p.d2}], and [${p.d3}]</strong>. (Remember: a 2-digit number cannot have 0 in the tens place!).`;
          p.answers = [
            { label: 'Different 2-digit numbers you can make', value: twoDigitCount },
            { label: `2-digit numbers with [${p.d1}] in the tens place`, value: startsWithD1 }
          ];
          p.hint = `The tens digit cannot be 0, so there are 3 choices. Once the tens card is placed, 3 cards remain for the ones place (3 × 3 = 9).`;
        }
      } else {
        const kids = original ? 5 : rand(difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 7, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 9);
        const firstPlays = kids - 1;
        const totalHandshakes = (kids * (kids - 1)) / 2;
        p.kids = kids;
        p.firstPlays = firstPlays;
        p.totalHandshakes = totalHandshakes;
        p.story = `There are <strong>${kids} friends</strong> at a chess club. Every child plays exactly 1 game with each of the other children. How many games does the first child play? How many games are played in all?`;
        p.answers = [
          { label: 'Games played by the first child', value: firstPlays },
          { label: 'Total games played in all', value: totalHandshakes }
        ];
        p.hint = `Child 1 plays ${kids - 1} games. Child 2 plays ${kids - 2} more games. Add them down to 1: (${kids - 1}) + (${kids - 2}) + ... + 1!`;
      }
    } else if (kind === 'planting') {
      const variant = original ? 'trees' : ['trees', 'saw', 'stairs'][rand(0, 2)];
      p.variant = variant;
      if (variant === 'trees') {
        const gapDist = rand(2, difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 10);
        const gaps = original ? 5 : rand(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 6 : 15, difficulty === 'easy' ? 6 : difficulty === 'medium' ? 12 : 30);
        const roadLen = gaps * gapDist;
        const treesCount = gaps + 1;
        p.gapDist = gapDist;
        p.gaps = gaps;
        p.roadLen = roadLen;
        p.treesCount = treesCount;
        p.story = `A straight path in a park is <strong>${roadLen} meters long</strong>. Trees are planted along one side of the path every <strong>${gapDist} meters</strong>, including a tree at both the start and the end.`;
        p.answers = [
          { label: 'Spaces (gaps) between trees', value: gaps },
          { label: 'Total trees planted', value: treesCount }
        ];
        p.hint = `Divide path length ${roadLen} by ${gapDist} to find the spaces (${gaps}). Since both ends have trees, add 1 for the final tree!`;
      } else if (variant === 'saw') {
        const p1 = original ? 4 : rand(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5, difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8);
        const cuts1 = p1 - 1;
        const timePerCut = rand(2, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12);
        const totalTime1 = cuts1 * timePerCut;
        const p2 = p1 + rand(2, difficulty === 'easy' ? 3 : 5);
        const cuts2 = p2 - 1;
        const totalTime2 = cuts2 * timePerCut;
        p.p1 = p1;
        p.cuts1 = cuts1;
        p.timePerCut = timePerCut;
        p.totalTime1 = totalTime1;
        p.p2 = p2;
        p.cuts2 = cuts2;
        p.totalTime2 = totalTime2;
        p.story = `A carpenter saws a long wooden log into <strong>${p1} pieces</strong> in <strong>${totalTime1} minutes</strong>. Every cut takes the same amount of time. How many minutes does 1 cut take? How long to cut another log into <strong>${p2} pieces</strong>?`;
        p.answers = [
          { label: 'Minutes for 1 cut', value: timePerCut },
          { label: `Minutes to saw into ${p2} pieces`, value: totalTime2 }
        ];
        p.hint = `To get ${p1} pieces, you make ${cuts1} cuts (${p1} − 1). Divide ${totalTime1} ÷ ${cuts1} = ${timePerCut} min per cut. For ${p2} pieces, you need ${cuts2} cuts.`;
      } else {
        const f1 = original ? 4 : rand(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5, difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 7);
        const flights1 = f1 - 1;
        const secPerFlight = rand(difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 18, difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 35);
        const totalSec1 = flights1 * secPerFlight;
        const f2 = f1 + rand(2, difficulty === 'easy' ? 3 : 5);
        const flights2 = f2 - 1;
        const totalSec2 = flights2 * secPerFlight;
        p.f1 = f1;
        p.flights1 = flights1;
        p.secPerFlight = secPerFlight;
        p.totalSec1 = totalSec1;
        p.f2 = f2;
        p.flights2 = flights2;
        p.totalSec2 = totalSec2;
        p.story = `Walking up the stairs from Floor 1 to Floor <strong>${f1}</strong> takes <strong>${totalSec1} seconds</strong> at a steady speed. (Floor 1 is ground level, so Floor 1 to Floor ${f1} is ${flights1} flights). How many seconds for 1 flight? How many seconds from Floor 1 to Floor <strong>${f2}</strong>?`;
        p.answers = [
          { label: 'Seconds for 1 flight of stairs', value: secPerFlight },
          { label: `Seconds to reach Floor ${f2}`, value: totalSec2 }
        ];
        p.hint = `Floor 1 to Floor ${f1} is ${flights1} flights. Divide ${totalSec1} ÷ ${flights1} = ${secPerFlight} seconds per flight. From Floor 1 to Floor ${f2} is ${flights2} flights.`;
      }
    } else if (kind === 'backwards') {
      const endVal = original ? 5 : rand(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 8 : 20, difficulty === 'easy' ? 8 : difficulty === 'medium' ? 20 : 50);
      const b = original ? 4 : rand(difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 12, difficulty === 'easy' ? 6 : difficulty === 'medium' ? 15 : 35);
      const a = original ? 3 : rand(difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 8, difficulty === 'easy' ? 4 : difficulty === 'medium' ? 10 : 25);
      const midVal = endVal + b;
      const halfVal = midVal + a;
      const startVal = halfVal * 2;
      p.nameA = names[rand(0, names.length - 1)];
      let nameB = names[rand(0, names.length - 1)];
      while (nameB === p.nameA) nameB = names[rand(0, names.length - 1)];
      p.nameB = nameB;
      p.a = a;
      p.b = b;
      p.endVal = endVal;
      p.midVal = midVal;
      p.halfVal = halfVal;
      p.startVal = startVal;
      p.story = `You have a secret collection of <strong>${item.name}</strong>. First, you give <strong>half</strong> of your collection to ${p.nameA}, and then give <strong>${a} more</strong> to ${nameB}. Next, you give <strong>${b}</strong> to a classroom library. You are left with <strong>${endVal} ${item.name}</strong>. How many did you have right before giving to the classroom library? How many did you start with?`;
      p.answers = [
        { label: `Before giving ${b} to the library`, value: midVal },
        { label: 'Starting amount at the beginning', value: startVal }
      ];
      p.hint = `Rewind the story backwards: Start with ${endVal}. Add back ${b} (${endVal} + ${b} = ${midVal}). Then add back ${a} (${midVal} + ${a} = ${halfVal}). That was half your collection, so double it!`;
    } else if (kind === 'chickenRabbit') {
      const heads = original ? 8 : rand(difficulty === 'easy' ? 5 : difficulty === 'medium' ? 12 : 25, difficulty === 'easy' ? 10 : difficulty === 'medium' ? 22 : 55);
      const minRabbits = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 6;
      const maxRabbits = heads - (difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 6);
      const rabbits = original ? 3 : rand(minRabbits, Math.max(minRabbits, maxRabbits));
      const chickens = heads - rabbits;
      const legs = chickens * 2 + rabbits * 4;
      p.heads = heads;
      p.rabbits = rabbits;
      p.chickens = chickens;
      p.legs = legs;
      p.assumedLegs = heads * 2;
      p.extraLegs = legs - (heads * 2);
      p.story = `A farm pen holds <strong>${heads} animals in total</strong> (only chickens and rabbits). Looking at all their feet, there are <strong>${legs} legs altogether</strong>. Every chicken has 2 legs and every rabbit has 4 legs.`;
      p.answers = [
        { label: 'Number of rabbits', value: rabbits },
        { label: 'Number of chickens', value: chickens }
      ];
      p.hint = `Assumption Method: Pretend all ${heads} animals are chickens! That would be ${heads} × 2 = ${heads * 2} legs. Subtract: ${legs} − ${heads * 2} = ${p.extraLegs} extra legs. Each rabbit needs 2 extra legs, so divide ${p.extraLegs} ÷ 2!`;
    } else throw new Error('Unknown problem type: ' + kind);
    return p;
  }

  const row = (label, count, value, extra = 0, aside = false, currency = true) => `<div class="model-row"><span class="model-label">${label}</span><div class="model-parts">${Array.from({length:count}, () => `<div class="part">${value}</div>`).join('')}${extra ? `<div class="extra-part ${aside ? 'aside' : ''}">+ ${currency ? '$' : ''}${extra}</div>` : ''}</div></div>`;
  const brace = text => `<div class="total-brace">${text}</div>`;
  const amountCard = (label, amount, item, removed = 0) => `<div class="treasure-card"><strong>${label}</strong><div class="treasure-pile" role="img" aria-label="${amount === null ? 'Unknown number of' : amount} ${item.name}${removed ? ', ' + removed + ' taken away' : ''}">${amount === null ? '<span class="unknown-treasure">?</span>' : amount > 30 ? `<span class="treasure-number">${item.icon} × ${fmt(amount)}${removed ? ' − ' + fmt(removed) : ''}</span>` : Array.from({length:amount}, (_,i) => `<span aria-hidden="true" class="treasure-token${i < removed ? ' taken' : ''}">${item.icon}</span>`).join('')}</div></div>`;
  const groupCards = (p, reveal, extraBag = false) => `<div class="treasure-groups">${Array.from({length:p.groups + (extraBag ? 1 : 0)}, (_,i) => amountCard(p.kind === 'sharing' ? 'Child ' + (i+1) : i === p.groups ? 'New bag!' : 'Bag ' + (i+1), reveal ? p.base : null, p.item)).join('')}</div>`;
  const totalNote = text => `<div class="whole-total">${text}</div>`;

  function stepsFor(p) {
    const money = n => '$' + fmt(n), unit = p.money ? money : fmt;
    if (p.kind === 'difference' || p.kind === 'ratio' || p.kind === 'extra') {
      const diff = p.kind === 'difference', count = diff ? 1 : p.multiplier;
      const a = diff ? 'Yesterday' : 'You', b = diff ? 'Today' : p.name;
      const parts = count + 1, remainder = p.total - p.extra;
      const model = (value, aside = false) => row(a, 1, value) + row(b, count, value, p.extra, aside, Boolean(p.money));
      const steps = [{title:'See the story', description:`${a} has 1 equal part. ${b} has ${count === 1 ? 'a matching part' : count + ' matching parts'}${p.extra ? ', plus a little extra' : ''}.`, diagram:model('?') + brace(`${unit(p.total)} altogether`), equation:'Matching boxes hold the same amount.'}];
      if (p.extra) steps.push({title:'Put the extra aside', description:`Set aside the extra ${unit(p.extra)}. Now all the boxes are equal.`, diagram:model('?', true) + brace(`${unit(remainder)} in ${parts} equal parts`) + `<div class="aside-note">Save the extra ${unit(p.extra)} for later.</div>`, equation:`${unit(p.total)} − ${unit(p.extra)} = ${unit(remainder)}`});
      steps.push({title:'Find one equal part', description:`Share ${unit(remainder)} equally between ${parts} boxes. Each box holds ${unit(p.base)}.`, diagram:model(unit(p.base), true) + brace(`${parts} equal parts`), equation:`${unit(remainder)} ÷ ${parts} = ${unit(p.base)}`});
      steps.push({title:p.extra ? 'Give the extra back' : 'Count each person’s parts', description:`${a}: ${unit(p.base)}. ${b}: ${unit(p.base * count + p.extra)}. ${p.extra ? 'Remember to add the extra back!' : `${b} gets ${count} equal parts.`}`, diagram:model(unit(p.base)) + brace(`${unit(p.base)} + ${unit(p.base * count + p.extra)} = ${unit(p.total)} ✓`), equation:`${count === 1 ? unit(p.base) : count + ' × ' + unit(p.base)}${p.extra ? ' + ' + unit(p.extra) : ''} = ${unit(p.base * count + p.extra)}`});
      return steps;
    }
    if (p.kind === 'shop') {
      const parts = p.fries + p.burgers * p.multiplier;
      const m = p.menu;
      const model = value => row(`${m.a} Items`, p.fries, value) + Array.from({length:p.burgers}, (_,i) => row(`${m.b} Item ${i+1}`, p.multiplier, value)).join('');
      return [
        {title:'Turn items into boxes', description:`Each ${m.first} is 1 box. Each ${m.second} is ${p.multiplier} matching boxes.`, diagram:model('?') + brace(`${money(p.total)} altogether`), equation:`${p.fries} + (${p.burgers} × ${p.multiplier}) = ${parts} boxes`},
        {title:`Find the price of one ${m.first}`, description:`Share ${money(p.total)} between ${parts} equal boxes. One box is the price of one ${m.first}.`, diagram:model(money(p.base)) + brace(`${parts} boxes, ${money(p.base)} in each`), equation:`${money(p.total)} ÷ ${parts} = ${money(p.base)}`},
        {title:`Find the price of one ${m.second}`, description:`One ${m.second} has ${p.multiplier} boxes. Add their prices together.`, diagram:row(`${m.a} 1 item`, 1, money(p.base)) + row(`${m.b} 1 item`, p.multiplier, money(p.base)), equation:`${p.multiplier} × ${money(p.base)} = ${money(p.base * p.multiplier)}`},
        {title:'Build the new order', description:`${p.buyFries} ${m.plural} cost ${money(p.buyFries * p.base)}. ${p.buyBurgers} ${m.secondPlural} cost ${money(p.buyBurgers * p.base * p.multiplier)}. Add the two costs.`, diagram:`<div class="receipt-line"><span>${m.a} ${p.buyFries} × ${money(p.base)}</span><strong>${money(p.buyFries * p.base)}</strong></div><div class="receipt-line"><span>${m.b} ${p.buyBurgers} × ${money(p.base * p.multiplier)}</span><strong>${money(p.buyBurgers * p.base * p.multiplier)}</strong></div><div class="receipt-line"><span>Total to pay</span><strong>${money(p.answers[1].value)}</strong></div>`, equation:`${money(p.buyFries * p.base)} + ${money(p.buyBurgers * p.base * p.multiplier)} = ${money(p.answers[1].value)}`}
      ];
    }
    if (p.kind === 'sharing') return [
      {title:'See what we’re sharing', description:`There are ${fmt(p.total)} ${p.item.name} and ${p.groups} children. Every child should get the same amount.`, diagram:amountCard('All the treasures', p.total, p.item) + groupCards(p, false), equation:`${fmt(p.total)} treasures → ${p.groups} equal shares`},
      {title:'Take turns giving one to each child', description:`Give each child one treasure, then go around again. After ${p.base} rounds, everyone has ${p.base}.`, diagram:groupCards(p, true) + totalNote(`${p.groups} equal shares of ${p.base}`), equation:`${fmt(p.total)} ÷ ${p.groups} = ${p.base}`},
      {title:'Check the fair shares', description:`Each child gets ${p.base} ${p.item.name}. Add the shares back together to check that none are left over.`, diagram:groupCards(p, true) + totalNote(`${p.groups} × ${p.base} = ${fmt(p.total)} ✓`), equation:`${Array.from({length:p.groups}, () => p.base).join(' + ')} = ${fmt(p.total)}`}
    ];
    if (p.kind === 'groups') return [
      {title:'Look inside each bag', description:`There are ${p.groups} bags. Each matching bag has ${p.base} ${p.item.name}.`, diagram:groupCards(p, true), equation:`Add ${p.base} once for each bag.`},
      {title:'Add the equal groups', description:`Count every bag once. The first ${p.groups} bags hold ${fmt(p.total)} treasures altogether.`, diagram:groupCards(p, true) + totalNote(`${fmt(p.total)} ${p.item.name} altogether`), equation:`${Array.from({length:p.groups}, () => p.base).join(' + ')} = ${fmt(p.total)}`},
      {title:'Add one more matching bag', description:`The new bag has ${p.base} more ${p.item.name}. Add them to the total you already found.`, diagram:groupCards(p, true, true) + totalNote(`${fmt(p.total + p.base)} treasures now`), equation:`${fmt(p.total)} + ${p.base} = ${fmt(p.total + p.base)}`}
    ];
    if (p.kind === 'missing') return [
      {title:'Spot the missing part', description:`Together you have ${fmt(p.total)} ${p.item.name}. Your ${p.known} are known. ${p.name}’s amount is the missing piece.`, diagram:amountCard('Your part', p.known, p.item) + amountCard(`${p.name}’s part`, null, p.item) + totalNote(`${fmt(p.total)} altogether`), equation:`${p.known} + ? = ${fmt(p.total)}`},
      {title:'Take your part away', description:`Start with all ${fmt(p.total)} treasures. Cross out your ${p.known}. Count the treasures still showing.`, diagram:amountCard('All treasures, with your part crossed out', p.total, p.item, p.known), equation:`${fmt(p.total)} − ${p.known} = ${p.base}`},
      {title:'Check the missing piece', description:`${p.name} has ${p.base} ${p.item.name}. Your part plus that missing part makes the total.`, diagram:amountCard('Your part', p.known, p.item) + amountCard(`${p.name}’s part`, p.base, p.item), equation:`${p.known} + ${p.base} = ${fmt(p.total)} ✓`}
    ];
    if (p.kind === 'twoStep') return [
      {title:'Start with what you have', description:`You begin with ${p.start} ${p.item.name}. The story tells you to get more first, then give some away.`, diagram:amountCard('At the start', p.start, p.item) + totalNote(`First +${p.gained} → then −${p.gave}`), equation:'Follow the story one step at a time.'},
      {title:'First, add the new treasures', description:`${p.name} gives you ${p.gained} more. Now you have ${fmt(p.before)}, before giving any away.`, diagram:amountCard('After getting more', p.before, p.item), equation:`${p.start} + ${p.gained} = ${fmt(p.before)}`},
      {title:'Then, take away what you give', description:`Give away ${p.gave} from your new amount. Cross those out. You have ${fmt(p.total)} ${p.item.name} left!`, diagram:amountCard('Cross out what you give away', p.before, p.item, p.gave) + totalNote(`${fmt(p.total)} left`), equation:`${fmt(p.before)} − ${p.gave} = ${fmt(p.total)}`}
    ];
    if (p.kind === 'count') {
      const hops = reveal => `<div class="hops">${Array.from({length:p.hops + 2}, (_,i) => `<div class="hop"><span class="hop-arrow">${i === 0 ? 'Start' : '+' + (i <= p.hops ? p.first : p.second) + ' →'}</span><span class="hop-number ${i === p.hops + 1 ? 'current' : ''}">${i === 0 ? p.start : i === p.hops + 1 ? reveal > 1 ? fmt(p.answers[0].value) : '?' : reveal > 0 ? fmt(p.start + i * p.first) : '?'}</span></div>`).join('')}</div>`;
      return [
        {title:'Follow the two rules', description:`First hop by ${p.first}, ${p.hops} times. Then take one hop of ${p.second}. Each circle is a landing spot.`, diagram:hops(0), equation:`${p.hops} small hops, then 1 bigger hop`},
        {title:'Take the first hops', description:`Begin at ${p.start}. Add ${p.first} each time. After ${p.hops} hops, you land on ${fmt(p.before)}.`, diagram:hops(1), equation:`${p.start} + (${p.hops} × ${p.first}) = ${fmt(p.before)}`},
        {title:'Switch to the new rule', description:`Now add ${p.second} once. That is your next landing spot!`, diagram:hops(2), equation:`${fmt(p.before)} + ${p.second} = ${fmt(p.answers[0].value)}`}
      ];
    }
    if (p.kind === 'diffRatio') {
      const extraBoxes = p.multiplier - 1;
      const diffRow = (showVal, highlightExtra) => {
        const rowA = row(p.nameA, 1, showVal);
        const partsB = Array.from({length: p.multiplier}, (_, i) => {
          const isExtra = i >= 1;
          const cls = isExtra && highlightExtra ? 'part diff-highlight' : 'part';
          return `<div class="${cls}">${showVal}</div>`;
        }).join('');
        const rowB = `<div class="model-row"><span class="model-label">${p.nameB}</span><div class="model-parts">${partsB}</div></div>`;
        return rowA + rowB;
      };
      return [
        {
          title: 'See the difference with boxes',
          description: `${p.nameA} has 1 equal box. ${p.nameB} has ${p.multiplier} matching boxes. The difference between them is ${extraBoxes} ${extraBoxes === 1 ? 'box' : 'boxes'}.`,
          diagram: diffRow('?', false) + `<div class="diff-summary"><span class="diff-badge">${extraBoxes} extra ${extraBoxes === 1 ? 'box' : 'boxes'} = ${fmt(p.diff)} ${p.item.name}</span></div>`,
          equation: `${p.multiplier} boxes − 1 box = ${extraBoxes} extra ${extraBoxes === 1 ? 'box' : 'boxes'}`
        },
        {
          title: 'Match the extra boxes to the difference',
          description: `${p.nameB} has ${fmt(p.diff)} more ${p.item.name} than ${p.nameA}. Those ${fmt(p.diff)} extra ${p.item.name} fill exactly the ${extraBoxes} extra ${extraBoxes === 1 ? 'box' : 'boxes'}.`,
          diagram: diffRow('?', true) + `<div class="diff-summary"><span class="diff-badge">⚡ ${extraBoxes} ${extraBoxes === 1 ? 'box' : 'boxes'} = ${fmt(p.diff)} ${p.item.name}</span></div>`,
          equation: `${extraBoxes} ${extraBoxes === 1 ? 'box' : 'boxes'} = ${fmt(p.diff)} ${p.item.name}`
        },
        {
          title: 'Divide to find one equal box',
          description: `Share the ${fmt(p.diff)} difference equally among the ${extraBoxes} extra ${extraBoxes === 1 ? 'box' : 'boxes'}. Each box holds ${fmt(p.base)}!`,
          diagram: diffRow(fmt(p.base), true) + `<div class="diff-summary"><span class="diff-badge">${fmt(p.diff)} ÷ ${extraBoxes} = ${fmt(p.base)} in each box</span></div>`,
          equation: `${fmt(p.diff)} ÷ ${extraBoxes} = ${fmt(p.base)} (${p.nameA}’s amount)`
        },
        {
          title: 'Find both totals and check',
          description: `${p.nameA} has 1 box = ${fmt(p.base)}. ${p.nameB} has ${p.multiplier} boxes = ${fmt(p.base * p.multiplier)}. Check: ${fmt(p.base * p.multiplier)} − ${fmt(p.base)} = ${fmt(p.diff)} ✓`,
          diagram: diffRow(fmt(p.base), false) + totalNote(`${p.nameA}: ${fmt(p.base)} · ${p.nameB}: ${fmt(p.base * p.multiplier)} (Difference: ${fmt(p.diff)} ✓)`),
          equation: `${p.multiplier} × ${fmt(p.base)} = ${fmt(p.base * p.multiplier)} (${p.nameB}’s amount) ✓`
        }
      ];
    }
    if (p.kind === 'age') {
      const extraBoxes = p.multiplier - 1;
      return [
        {
          title: 'The age gap never changes',
          description: `Every year, both ${p.child} and ${p.older} grow 1 year older. Their age difference NEVER changes! Today: ${p.olderAge} − ${p.childAge} = ${p.diff} years.`,
          diagram: `
            <div class="age-diagram">
              <div class="age-bar-row"><span class="age-person">${p.child}</span><div class="age-track"><div class="age-segment child-bar">${p.childAge} yrs</div></div></div>
              <div class="age-bar-row"><span class="age-person">${p.older}</span><div class="age-track"><div class="age-segment child-bar">${p.childAge} yrs</div><div class="age-segment gap-bar">+ ${p.diff} yrs gap</div></div></div>
              <div class="age-constant-note">⭐ The ${p.diff}-year difference stays the same every single year!</div>
            </div>
          `,
          equation: `${p.olderAge} − ${p.childAge} = ${p.diff} years difference`
        },
        {
          title: 'Picture the future ratio',
          description: `In the target year, ${p.child} has 1 box and ${p.older} has ${p.multiplier} boxes. The gap between them is ${extraBoxes} ${extraBoxes === 1 ? 'box' : 'boxes'}.`,
          diagram: `
            <div class="model-row"><span class="model-label">${p.child}</span><div class="model-parts"><div class="part">?</div></div></div>
            <div class="model-row"><span class="model-label">${p.older}</span><div class="model-parts">${Array.from({length: p.multiplier}, (_, i) => `<div class="${i >= 1 ? 'part diff-highlight' : 'part'}">?</div>`).join('')}</div></div>
            <div class="diff-summary"><span class="diff-badge">${extraBoxes} extra parts must equal the ${p.diff}-year gap!</span></div>
          `,
          equation: `${p.multiplier} parts − 1 part = ${extraBoxes} extra parts`
        },
        {
          title: `Find how old ${p.child} will be`,
          description: `The ${extraBoxes} extra parts equal the unchanging ${p.diff}-year gap. Divide ${p.diff} by ${extraBoxes}. Each part is ${p.targetChildAge} years!`,
          diagram: `
            <div class="model-row"><span class="model-label">${p.child}</span><div class="model-parts"><div class="part">${p.targetChildAge}</div></div></div>
            <div class="model-row"><span class="model-label">${p.older}</span><div class="model-parts">${Array.from({length: p.multiplier}, () => `<div class="part">${p.targetChildAge}</div>`).join('')}</div></div>
            <div class="diff-summary"><span class="diff-badge">${p.child} will be ${p.targetChildAge} years old</span></div>
          `,
          equation: `${p.diff} ÷ ${extraBoxes} = ${p.targetChildAge} years old`
        },
        {
          title: 'Find how many years from now',
          description: `${p.child} is ${p.childAge} today and will be ${p.targetChildAge}. That is ${p.years} ${p.years === 1 ? 'year' : 'years'} from now! (Check: ${p.older} will be ${p.targetOlderAge}, exactly ${p.multiplier}×).`,
          diagram: `
            <div class="timeline-visual">
              <div class="timeline-row"><span class="timeline-who">${p.child}</span><span class="timeline-val">${p.childAge} yrs</span><span class="timeline-arrow">+ ${p.years} yrs →</span><span class="timeline-val future">${p.targetChildAge} yrs</span></div>
              <div class="timeline-row"><span class="timeline-who">${p.older}</span><span class="timeline-val">${p.olderAge} yrs</span><span class="timeline-arrow">+ ${p.years} yrs →</span><span class="timeline-val future">${p.targetOlderAge} yrs</span></div>
              <div class="timeline-check">Check: ${p.targetOlderAge} ÷ ${p.targetChildAge} = ${p.multiplier}× as old! ✓</div>
            </div>
          `,
          equation: `${p.targetChildAge} − ${p.childAge} = ${p.years} ${p.years === 1 ? 'year' : 'years'} from now ✓`
        }
      ];
    }
    if (p.kind === 'venn') {
      const svgVenn = active => {
        const fA = active === 'onlyA' || active === 'sum' ? '#b8d69f' : 'rgba(203, 220, 187, 0.45)';
        const fB = active === 'onlyB' || active === 'sum' ? '#f5bca0' : 'rgba(245, 210, 183, 0.45)';
        const sA = active === 'onlyA' ? '#27521f' : '#4a6f44';
        const sB = active === 'onlyB' ? '#913b10' : '#b86b3f';
        const swA = active === 'onlyA' ? '3' : '2';
        const swB = active === 'onlyB' ? '3' : '2';
        const valA = active === 'onlyA' || active === 'sum' ? p.onlyA : `${p.countA} all`;
        const valB = active === 'onlyB' || active === 'sum' ? p.onlyB : `${p.countB} all`;
        return `
          <div class="venn-container">
            <svg viewBox="0 0 360 160" class="venn-svg">
              ${p.neither ? `<rect x="6" y="6" width="348" height="148" rx="10" fill="#fff9" stroke="#b0bda6" stroke-dasharray="4 3"/><text x="18" y="142" font-size="11" font-weight="700" fill="#66746a">Neither: ${p.neither}</text>` : ''}
              <circle cx="138" cy="80" r="58" fill="${fA}" stroke="${sA}" stroke-width="${swA}" />
              <circle cx="222" cy="80" r="58" fill="${fB}" stroke="${sB}" stroke-width="${swB}" />
              <text x="100" y="30" font-size="12" font-weight="700" fill="#2d4a25" text-anchor="middle">${p.actA.icon} ${p.actA.name}</text>
              <text x="260" y="30" font-size="12" font-weight="700" fill="#803816" text-anchor="middle">${p.actB.icon} ${p.actB.name}</text>
              <text x="105" y="85" font-size="15" font-weight="800" fill="#254320" text-anchor="middle">${valA}</text>
              <text x="180" y="80" font-size="15" font-weight="800" fill="#5c4412" text-anchor="middle">${p.both}</text>
              <text x="180" y="95" font-size="9" font-weight="700" fill="#66522b" text-anchor="middle">BOTH</text>
              <text x="255" y="85" font-size="15" font-weight="800" fill="#752c0e" text-anchor="middle">${valB}</text>
            </svg>
            <div class="venn-legend">
              <span class="legend-pill green">Only ${p.actA.name}: ${p.onlyA}</span>
              <span class="legend-pill yellow">Both: ${p.both}</span>
              <span class="legend-pill peach">Only ${p.actB.name}: ${p.onlyB}</span>
              ${p.neither ? `<span class="legend-pill gray">Neither: ${p.neither}</span>` : ''}
            </div>
          </div>
        `;
      };
      return [
        {
          title: 'See the two overlapping circles',
          description: `${p.countA} do ${p.actA.name} and ${p.countB} do ${p.actB.name}. The ${p.both} in the middle belong to BOTH circles and would be counted twice if we simply add!`,
          diagram: svgVenn('none'),
          equation: `${p.actA.name}: ${p.countA} · ${p.actB.name}: ${p.countB} · Both: ${p.both}`
        },
        {
          title: `Find who does ONLY ${p.actA.name}`,
          description: `Start with all ${p.countA} children in ${p.actA.name}. Take away the ${p.both} who also do ${p.actB.name}. That leaves ${p.onlyA} who ONLY do ${p.actA.name}.`,
          diagram: svgVenn('onlyA'),
          equation: `${p.countA} − ${p.both} = ${p.onlyA} (only ${p.actA.name})`
        },
        {
          title: `Find who does ONLY ${p.actB.name}`,
          description: `Start with all ${p.countB} children in ${p.actB.name}. Take away the ${p.both} who also do ${p.actA.name}. That leaves ${p.onlyB} who ONLY do ${p.actB.name}.`,
          diagram: svgVenn('onlyB'),
          equation: `${p.countB} − ${p.both} = ${p.onlyB} (only ${p.actB.name})`
        },
        {
          title: 'Combine all separate parts',
          description: `Add the three non-overlapping groups: ${p.onlyA} (only ${p.actA.name}) + ${p.both} (both) + ${p.onlyB} (only ${p.actB.name})${p.neither ? ` + ${p.neither} (neither)` : ''} = ${p.total} total children!`,
          diagram: svgVenn('sum') + totalNote(`Total children = ${p.total} ✓`),
          equation: `${p.onlyA} + ${p.both} + ${p.onlyB}${p.neither ? ` + ${p.neither}` : ''} = ${p.total} children in all ✓`
        }
      ];
    }
    if (p.kind === 'combo') {
      if (p.variant === 'outfit') {
        const topIcons = ['🔴 Shirt', '🔵 Shirt', '🟢 Shirt', '🟡 Shirt'].slice(0, p.tops);
        const bottomIcons = ['👖 Jeans', '🩳 Shorts', '👗 Skirt', '🥋 Pants'].slice(0, p.bottoms);
        return [
          {
            title: 'List the items you can wear',
            description: `You have ${p.tops} shirts and ${p.bottoms} bottoms${p.hats ? ` and ${p.hats} caps` : ''}. Every outfit pairs 1 top with 1 bottom.`,
            diagram: `
              <div class="combo-slots">
                <div class="combo-slot"><strong>Tops (${p.tops})</strong><span>${topIcons.join(' · ')}</span></div>
                <div class="combo-slot"><strong>Bottoms (${p.bottoms})</strong><span>${bottomIcons.join(' · ')}</span></div>
              </div>
            `,
            equation: `${p.tops} shirts × ${p.bottoms} bottoms`
          },
          {
            title: 'Branch each top to every bottom',
            description: `For the 1st shirt, you can wear any of the ${p.bottoms} bottoms. For the 2nd shirt, you also get ${p.bottoms} bottoms!`,
            diagram: `
              <div class="combo-list-box">
                ${topIcons.map(t => `<span class="combo-item-chip">${t} → ${p.bottoms} ways</span>`).join('')}
              </div>
            `,
            equation: `Each shirt branches ${p.bottoms} ways`
          },
          {
            title: 'Multiply using the Product Rule',
            description: `Multiply ${p.tops} tops × ${p.bottoms} bottoms = ${p.baseCombo} different outfits.`,
            diagram: `
              <div class="diff-summary"><span class="diff-badge">✨ ${p.tops} × ${p.bottoms} = ${p.baseCombo} top + bottom outfits</span></div>
            `,
            equation: `${p.tops} × ${p.bottoms} = ${p.baseCombo} outfits`
          },
          {
            title: p.hats ? 'Multiply by caps for full outfits' : 'What if you get 1 more pair of pants?',
            description: p.hats ? `Each of the ${p.baseCombo} outfits can be paired with any of the ${p.hats} caps! Total = ${p.baseCombo * p.hats}.` : `If you buy 1 more pair of pants (${p.bottoms + 1} bottoms), you get ${p.tops} × ${p.bottoms + 1} = ${p.tops * (p.bottoms + 1)} outfits!`,
            diagram: totalNote(p.hats ? `Full outfits with cap: ${p.baseCombo} × ${p.hats} = ${p.answers[1].value} ✓` : `New total outfits: ${p.tops} × ${p.bottoms + 1} = ${p.answers[1].value} ✓`),
            equation: p.hats ? `${p.baseCombo} × ${p.hats} = ${p.answers[1].value} full outfits ✓` : `${p.tops} × ${p.bottoms + 1} = ${p.answers[1].value} outfits ✓`
          }
        ];
      }
      if (p.variant === 'digits') {
        const cardsHtml = p.allCards.map(c => `<span class="combo-card ${c === 0 ? 'zero' : ''}">${c}</span>`).join('');
        return [
          {
            title: 'Inspect the digit cards',
            description: `You have 4 cards: [0], [${p.d1}], [${p.d2}], [${p.d3}]. Important rule: 0 CANNOT go in the tens place, or it wouldn't be a 2-digit number!`,
            diagram: `<div class="combo-card-row">${cardsHtml}</div><div class="diff-summary"><span class="diff-badge">⚠️ Zero cannot lead a 2-digit number</span></div>`,
            equation: `Tens place: [${p.d1}], [${p.d2}], or [${p.d3}] (3 choices)`
          },
          {
            title: 'Choices for the tens place',
            description: `There are 3 valid choices for the tens place: ${p.d1}, ${p.d2}, or ${p.d3}.`,
            diagram: `
              <div class="combo-slots">
                <div class="combo-slot"><strong>Tens place</strong><span>3 choices (${p.d1}, ${p.d2}, ${p.d3})</span></div>
                <div class="combo-slot"><strong>Ones place</strong><span>?</span></div>
              </div>
            `,
            equation: `Tens place = 3 choices`
          },
          {
            title: 'Choices for the ones place',
            description: `After picking a tens digit, 3 cards remain (including 0!). So there are 3 choices for the ones place.`,
            diagram: `
              <div class="combo-slots">
                <div class="combo-slot"><strong>Tens place</strong><span>3 choices</span></div>
                <div class="combo-slot"><strong>Ones place</strong><span>3 choices</span></div>
              </div>
            `,
            equation: `3 tens choices × 3 ones choices = 9 numbers`
          },
          {
            title: 'List the 9 numbers',
            description: `Starting with ${p.d1}: ${p.d1}0, ${p.d1}${p.d2}, ${p.d1}${p.d3} (3). Same for ${p.d2} (3) and ${p.d3} (3). Total = 9!`,
            diagram: `
              <div class="combo-list-box">
                <span class="combo-item-chip">${p.d1}0, ${p.d1}${p.d2}, ${p.d1}${p.d3}</span>
                <span class="combo-item-chip">${p.d2}0, ${p.d2}${p.d1}, ${p.d2}${p.d3}</span>
                <span class="combo-item-chip">${p.d3}0, ${p.d3}${p.d1}, ${p.d3}${p.d2}</span>
              </div>
            ` + totalNote(`Total = ${p.answers[0].value} different 2-digit numbers ✓`),
            equation: `3 × 3 = ${p.twoDigitCount} 2-digit numbers ✓`
          }
        ];
      }
      // handshake
      const lines = [];
      for (let i = 1; i < p.kids; i++) {
        lines.push(`<div class="stair-step"><span>Friend ${i} shakes with ${p.kids - i} remaining</span><strong>+${p.kids - i}</strong></div>`);
      }
      return [
        {
          title: 'Every friend shakes hands once',
          description: `There are ${p.kids} friends. Nobody shakes hands with themselves, and you only count each handshake once!`,
          diagram: `<div class="diff-summary"><span class="diff-badge">🤝 ${p.kids} friends in a circle</span></div>`,
          equation: `Friend 1 shakes with ${p.kids - 1} others`
        },
        {
          title: 'Count friend by friend (staircase)',
          description: `Friend 1 shakes with ${p.kids - 1} friends. Friend 2 already shook with Friend 1, so Friend 2 shakes with ${p.kids - 2} remaining friends.`,
          diagram: `<div class="stairs-stack">${lines.slice(0, 2).join('')}</div>`,
          equation: `(${p.kids - 1}) + (${p.kids - 2}) + ...`
        },
        {
          title: 'Add down to 1',
          description: `Keep adding until the last pair: ${Array.from({length: p.kids - 1}, (_, i) => p.kids - 1 - i).join(' + ')}.`,
          diagram: `<div class="stairs-stack">${lines.join('')}</div>`,
          equation: `${Array.from({length: p.kids - 1}, (_, i) => p.kids - 1 - i).join(' + ')} = ${p.totalHandshakes}`
        },
        {
          title: 'Handshake shortcut formula',
          description: `Formula: ${p.kids} friends × (${p.kids} − 1) ÷ 2 = ${p.totalHandshakes} games/handshakes!`,
          diagram: totalNote(`Total handshakes = ${p.totalHandshakes} ✓`),
          equation: `(${p.kids} × ${p.kids - 1}) ÷ 2 = ${p.totalHandshakes} games altogether ✓`
        }
      ];
    }
    if (p.kind === 'planting') {
      if (p.variant === 'trees') {
        const spots = Math.min(p.treesCount, 6);
        return [
          {
            title: 'Path length and spacing',
            description: `The path is ${p.roadLen} meters long. Trees are placed every ${p.gapDist} meters, with a tree at both the start and the end.`,
            diagram: `
              <div class="path-visual">
                <div class="trees-row">
                  ${Array.from({length: spots}, (_, i) => `<div class="tree-spot"><span class="tree-icon">🌲</span><span class="tree-label">${i * p.gapDist}m</span></div>`).join('')}
                </div>
                <div class="road-line"></div>
                <div class="gaps-indicator">Total length = ${p.roadLen} meters</div>
              </div>
            `,
            equation: `${p.roadLen} meters ÷ ${p.gapDist} meters spacing`
          },
          {
            title: 'Divide to find the spaces (gaps)',
            description: `Divide ${p.roadLen} by ${p.gapDist}. There are ${p.gaps} spaces (gaps) along the path.`,
            diagram: `<div class="diff-summary"><span class="diff-badge">📏 ${p.roadLen} ÷ ${p.gapDist} = ${p.gaps} spaces</span></div>`,
            equation: `${p.roadLen} ÷ ${p.gapDist} = ${p.gaps} spaces`
          },
          {
            title: 'Why Trees = Spaces + 1',
            description: `Every space starts with a tree. Plus, there is 1 extra tree planted at the very end of the path!`,
            diagram: `<div class="diff-summary"><span class="diff-badge">🌲 Trees = ${p.gaps} spaces + 1 = ${p.treesCount}</span></div>`,
            equation: `Trees = Spaces + 1`
          },
          {
            title: 'Check the total tree count',
            description: `There are ${p.gaps} spaces and ${p.treesCount} trees planted in all!`,
            diagram: totalNote(`${p.gaps} spaces · ${p.treesCount} trees planted ✓`),
            equation: `${p.gaps} + 1 = ${p.treesCount} trees ✓`
          }
        ];
      }
      if (p.variant === 'saw') {
        return [
          {
            title: 'Cuts vs Pieces',
            description: `Cutting a log into ${p.p1} pieces only requires ${p.cuts1} cuts! (1 cut makes 2 pieces, 2 cuts make 3 pieces, etc.)`,
            diagram: `
              <div class="log-visual">
                ${Array.from({length: p.p1}, (_, i) => `<div class="log-piece">Part ${i+1}</div>${i < p.cuts1 ? '<span class="cut-marker">🪚</span>' : ''}`).join('')}
              </div>
            `,
            equation: `${p.p1} pieces − 1 = ${p.cuts1} cuts`
          },
          {
            title: 'Find the time for 1 cut',
            description: `${p.cuts1} cuts took ${p.totalTime1} minutes. Divide ${p.totalTime1} by ${p.cuts1} to find the time for each cut.`,
            diagram: `<div class="diff-summary"><span class="diff-badge">⏱️ ${p.totalTime1} min ÷ ${p.cuts1} cuts = ${p.timePerCut} min per cut</span></div>`,
            equation: `${p.totalTime1} ÷ ${p.cuts1} = ${p.timePerCut} minutes per cut`
          },
          {
            title: `How many cuts for ${p.p2} pieces?`,
            description: `To get ${p.p2} pieces, you need ${p.p2} − 1 = ${p.cuts2} cuts.`,
            diagram: `<div class="diff-summary"><span class="diff-badge">🪚 ${p.p2} pieces need ${p.cuts2} cuts</span></div>`,
            equation: `${p.p2} − 1 = ${p.cuts2} cuts`
          },
          {
            title: `Calculate total time for ${p.p2} pieces`,
            description: `${p.cuts2} cuts × ${p.timePerCut} minutes per cut = ${p.totalTime2} minutes!`,
            diagram: totalNote(`${p.cuts2} cuts × ${p.timePerCut} min = ${p.totalTime2} minutes ✓`),
            equation: `${p.cuts2} × ${p.timePerCut} = ${p.totalTime2} minutes ✓`
          }
        ];
      }
      // stairs
      return [
        {
          title: 'Floors vs Flights of stairs',
          description: `Floor 1 is ground level! Walking from Floor 1 to Floor ${p.f1} is only ${p.flights1} flights of stairs.`,
          diagram: `
            <div class="stairs-stack">
              <div class="stair-step"><span>Floor ${p.f1}</span><span>Top</span></div>
              <div class="stair-step"><span>...</span><span>${p.flights1} flights</span></div>
              <div class="stair-step ground"><span>Floor 1 (Ground)</span><span>Start (0 flights)</span></div>
            </div>
          `,
          equation: `Floor ${p.f1} − 1 = ${p.flights1} flights`
        },
        {
          title: 'Find the seconds for 1 flight',
          description: `Climbing ${p.flights1} flights took ${p.totalSec1} seconds. Divide ${p.totalSec1} ÷ ${p.flights1} = ${p.secPerFlight} seconds per flight.`,
          diagram: `<div class="diff-summary"><span class="diff-badge">⏱️ ${p.totalSec1}s ÷ ${p.flights1} = ${p.secPerFlight} seconds per flight</span></div>`,
          equation: `${p.totalSec1} ÷ ${p.flights1} = ${p.secPerFlight} seconds per flight`
        },
        {
          title: `How many flights to Floor ${p.f2}?`,
          description: `Floor 1 to Floor ${p.f2} is ${p.f2} − 1 = ${p.flights2} flights of stairs.`,
          diagram: `<div class="diff-summary"><span class="diff-badge">🪜 Floor ${p.f2} needs ${p.flights2} flights</span></div>`,
          equation: `Floor ${p.f2} − 1 = ${p.flights2} flights`
        },
        {
          title: 'Calculate total climbing time',
          description: `${p.flights2} flights × ${p.secPerFlight} seconds per flight = ${p.totalSec2} seconds.`,
          diagram: totalNote(`${p.flights2} flights × ${p.secPerFlight}s = ${p.totalSec2} seconds ✓`),
          equation: `${p.flights2} × ${p.secPerFlight} = ${p.totalSec2} seconds ✓`
        }
      ];
    }
    if (p.kind === 'backwards') {
      return [
        {
          title: 'Trace the story chain',
          description: `The story went: Start [?] → gave half → gave ${p.a} more → gave ${p.b} → left with ${p.endVal}. To find the start, we run it in reverse!`,
          diagram: `
            <div class="flow-diagram">
              <div class="flow-track">
                <span class="flow-box start">?</span>
                <span class="flow-arrow-pill">÷ 2</span>
                <span class="flow-box">?</span>
                <span class="flow-arrow-pill">− ${p.a}</span>
                <span class="flow-box">?</span>
                <span class="flow-arrow-pill">− ${p.b}</span>
                <span class="flow-box end">${p.endVal}</span>
              </div>
            </div>
          `,
          equation: `[?] → ÷ 2 → −${p.a} → −${p.b} → ${p.endVal}`
        },
        {
          title: `Rewind the last step (add back ${p.b})`,
          description: `Before giving away ${p.b}, you had ${p.endVal} + ${p.b} = ${p.midVal} ${p.item.name}.`,
          diagram: `
            <div class="flow-diagram">
              <div class="flow-track">
                <span class="flow-box active">${p.midVal}</span>
                <span class="flow-arrow-pill reverse">+ ${p.b} ←</span>
                <span class="flow-box end">${p.endVal}</span>
              </div>
            </div>
          `,
          equation: `${p.endVal} + ${p.b} = ${p.midVal}`
        },
        {
          title: `Rewind the second step (add back ${p.a})`,
          description: `Before giving away ${p.a}, you had ${p.midVal} + ${p.a} = ${p.halfVal}. That was half of your original collection!`,
          diagram: `
            <div class="flow-diagram">
              <div class="flow-track">
                <span class="flow-box active">${p.halfVal} (half)</span>
                <span class="flow-arrow-pill reverse">+ ${p.a} ←</span>
                <span class="flow-box">${p.midVal}</span>
              </div>
            </div>
          `,
          equation: `${p.midVal} + ${p.a} = ${p.halfVal} (half of start)`
        },
        {
          title: 'Double the half to find the start',
          description: `If half of your collection was ${p.halfVal}, you started with ${p.halfVal} × 2 = ${p.startVal} ${p.item.name}! Check forward: ${p.startVal} ÷ 2 = ${p.halfVal}, − ${p.a} = ${p.midVal}, − ${p.b} = ${p.endVal} ✓`,
          diagram: `
            <div class="flow-diagram">
              <div class="flow-track">
                <span class="flow-box start active">${p.startVal}</span>
                <span class="flow-arrow-pill reverse">× 2 ←</span>
                <span class="flow-box">${p.halfVal}</span>
              </div>
            </div>
          ` + totalNote(`Started with ${p.startVal} ${p.item.name} ✓`),
          equation: `${p.halfVal} × 2 = ${p.startVal} ${p.item.name} at the start ✓`
        }
      ];
    }
    if (p.kind === 'chickenRabbit') {
      return [
        {
          title: 'Count heads and legs',
          description: `There are ${p.heads} animals in all (chickens 🐔 have 2 legs, rabbits 🐰 have 4 legs). Altogether they have ${p.legs} legs.`,
          diagram: `
            <div class="barn-visual">
              <div class="animal-split-row">
                <div class="animal-card"><span class="avatar">🐔</span><span class="count">2 legs</span><span class="legs-info">Chickens</span></div>
                <div class="animal-card"><span class="avatar">🐰</span><span class="count">4 legs</span><span class="legs-info">Rabbits (2 + 2)</span></div>
              </div>
              <div class="legs-calc-box">Total: <strong>${p.heads} heads</strong> and <strong>${p.legs} legs</strong></div>
            </div>
          `,
          equation: `Chickens (2 legs) + Rabbits (4 legs) = ${p.legs} legs`
        },
        {
          title: 'Assumption: Pretend all are chickens!',
          description: `If all ${p.heads} animals were chickens, each would have 2 legs. That would be ${p.heads} × 2 = ${p.assumedLegs} legs.`,
          diagram: `
            <div class="diff-summary"><span class="diff-badge">🐔 ${p.heads} animals × 2 legs = ${p.assumedLegs} base legs</span></div>
          `,
          equation: `${p.heads} × 2 = ${p.assumedLegs} legs if all chickens`
        },
        {
          title: 'Find the extra legs',
          description: `The pen actually has ${p.legs} legs. That is ${p.legs} − ${p.assumedLegs} = ${p.extraLegs} extra legs!`,
          diagram: `
            <div class="diff-summary"><span class="diff-badge">⚡ ${p.legs} − ${p.assumedLegs} = ${p.extraLegs} extra legs</span></div>
          `,
          equation: `${p.legs} − ${p.assumedLegs} = ${p.extraLegs} extra legs`
        },
        {
          title: 'Give 2 extra legs to make rabbits',
          description: `Each rabbit needs 2 extra legs (4 − 2 = 2). Divide ${p.extraLegs} ÷ 2 = ${p.rabbits} rabbits! The remaining ${p.heads} − ${p.rabbits} = ${p.chickens} are chickens. Check: (${p.chickens} × 2) + (${p.rabbits} × 4) = ${p.legs} ✓`,
          diagram: `
            <div class="barn-visual">
              <div class="animal-split-row">
                <div class="animal-card"><span class="avatar">🐰</span><span class="count">${p.rabbits}</span><span class="legs-info">Rabbits (4 legs)</span></div>
                <div class="animal-card"><span class="avatar">🐔</span><span class="count">${p.chickens}</span><span class="legs-info">Chickens (2 legs)</span></div>
              </div>
              <div class="legs-calc-box">(${p.chickens} × 2) + (${p.rabbits} × 4) = <strong>${p.legs} legs ✓</strong></div>
            </div>
          `,
          equation: `${p.extraLegs} ÷ 2 = ${p.rabbits} rabbits · ${p.heads} − ${p.rabbits} = ${p.chickens} chickens ✓`
        }
      ];
    }
    throw new Error('Unknown problem kind: ' + p.kind);
  }

  function renderStep() {
    const steps = stepsFor(problem), current = steps[step];
    $('visual-title').textContent = current.title;
    $('step-description').textContent = current.description;
    $('diagram').innerHTML = current.diagram;
    const slots = problem.kind === 'difference' ? 1 : problem.kind === 'shop' ? Math.max(problem.fries, problem.multiplier) : problem.kind === 'diffRatio' ? problem.multiplier : problem.multiplier || 4;
    $('diagram').style.setProperty('--slots', slots);
    $('diagram').style.setProperty('--reserve', ['difference', 'extra'].includes(problem.kind) ? '54px' : '0px');
    $('equation').textContent = current.equation;
    $('step-dots').innerHTML = steps.map((_,i) => `<button class="step-dot" data-step="${i}" aria-label="Step ${i+1}: ${steps[i].title}" ${i === step ? 'aria-current="step"' : ''}></button>`).join('');
    $('previous-step').disabled = step === 0;
    $('next-step').textContent = step === steps.length - 1 ? 'Try a new problem ↻' : 'Show the next step →';
    $('visual-note').textContent = `Step ${step+1} of ${steps.length} · ${step === steps.length - 1 ? 'Try the answers, or start another adventure.' : 'Take your time. Try an answer whenever you’re ready.'}`;
    document.querySelector('.picture-badge').textContent =
      problem.kind === 'count' ? 'One circle = one landing spot' :
      ['sharing','missing','groups','twoStep'].includes(problem.kind) ? 'Pictures show the treasures' :
      problem.kind === 'shop' && step === steps.length - 1 ? 'Add the two item totals' :
      problem.kind === 'diffRatio' ? 'Extra boxes equal the difference' :
      problem.kind === 'age' ? 'The age gap stays the same forever' :
      problem.kind === 'venn' ? 'Overlapping circles show who does both' :
      problem.kind === 'combo' ? 'Branch out to count every way' :
      problem.kind === 'planting' ? 'Gaps between are one less than markers' :
      problem.kind === 'backwards' ? 'Reverse each step to find the start' :
      problem.kind === 'chickenRabbit' ? 'Assume all one kind, then fix the legs' :
      'One box = one equal part';
  }

  function renderProblem() {
    step = 0; solved = false;
    const meta = topics[topic];
    $('topic-caption').textContent = meta.caption;
    const storyIcon = problem.icon || (problem.menu ? problem.menu.a : ['count', 'diffRatio', 'age', 'venn', 'combo', 'planting', 'chickenRabbit'].includes(problem.kind) || problem.money ? meta.icon : (problem.item ? problem.item.icon : meta.icon));
    $('story-icon').textContent = storyIcon;
    $('problem-title').textContent = meta.title;
    $('story').innerHTML = problem.story;
    $('answer-fields').innerHTML = problem.answers.map((a,i) => `<div class="answer-row"><label for="answer-${i}">${a.label}</label><div class="input-wrap">${a.money ? '<span aria-hidden="true">$</span>' : ''}<input id="answer-${i}" name="answer-${i}" type="text" inputmode="numeric" autocomplete="off" placeholder="?" aria-describedby="feedback" aria-invalid="false"></div></div>`).join('');
    $('feedback').textContent = ''; $('feedback').className = 'feedback';
    $('hint').hidden = true; $('hint-button').setAttribute('aria-expanded', 'false');
    $('hint-button').setAttribute('aria-controls', 'hint'); $('hint').textContent = problem.hint;
    document.querySelectorAll('.topic').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
    renderStep();
  }

  function nextProblem() {
    const previous = JSON.stringify(problem.answers);
    for (let i = 0; i < 12; i++) {
      problem = generate(topic, level);
      if (JSON.stringify(problem.answers) !== previous) break;
    }
    renderProblem();
  }

  function updateStars() {
    if (!$('star-count')) return;
    $('star-count').textContent = fmt(stars);
    const progress = stars && stars % 10 === 0 ? 10 : stars % 10;
    $('progress-fill').style.width = progress * 10 + '%';
    document.querySelector('.progress-track').setAttribute('aria-label', `${progress} of 10 stars toward a celebration`);
  }

  if (typeof document !== 'undefined') {
    $('answer-form').addEventListener('submit', event => {
      event.preventDefault();
      let allCorrect = true, empty = false, firstWrong;
      problem.answers.forEach((answer,i) => {
        const input = $('answer-' + i), raw = input.value.trim().replace(/[$,\s]/g, '');
        const valid = /^\d+(\.0+)?$/.test(raw);
        const correct = valid && Number(raw) === answer.value;
        if (!raw) empty = true;
        input.setAttribute('aria-invalid', String(!correct));
        if (!correct) { allCorrect = false; firstWrong ??= input; }
      });
      if (allCorrect) {
        $('feedback').className = 'feedback success';
        $('feedback').textContent = solved ? '✓ You’ve already earned a star for this one. Try a new problem!' : '★ You got it! Great thinking. One shiny star for you.';
        if (!solved) {
          solved = true; stars++; updateStars();
          try { localStorage.setItem('little-big-math-stars', String(stars)); } catch (_) {}
          if (stars % 10 === 0) {
            $('celebration').textContent = `🌟 ${fmt(stars)} stars! Look how much your thinking has grown! 🌱`;
            $('celebration').classList.add('visible');
            setTimeout(() => $('celebration').classList.remove('visible'), 5000);
          }
        }
      } else {
        $('feedback').className = 'feedback try';
        $('feedback').textContent = empty ? 'Fill in each answer box, then let’s check together.' : 'A little rethink! Check the highlighted answer. The picture or hint can help you find the next step.';
        firstWrong.focus();
      }
    });
    document.querySelectorAll('.topic').forEach(button => button.addEventListener('click', () => { topic = button.dataset.topic; history.replaceState(null, '', '#' + topic); nextProblem(); }));
    $('difficulty').addEventListener('change', event => { level = event.target.value; nextProblem(); });
    $('new-button').addEventListener('click', nextProblem);
    $('mix-button').addEventListener('click', () => { const choices = Object.keys(topics).filter(kind => kind !== topic); topic = choices[rand(0, choices.length - 1)]; history.replaceState(null, '', '#' + topic); nextProblem(); });
    $('hint-button').addEventListener('click', () => { $('hint').hidden = !$('hint').hidden; $('hint-button').setAttribute('aria-expanded', String(!$('hint').hidden)); });
    $('previous-step').addEventListener('click', () => { if (step > 0) { step--; renderStep(); } });
    $('next-step').addEventListener('click', () => { if (step < stepsFor(problem).length - 1) { step++; renderStep(); } else nextProblem(); });
    $('step-dots').addEventListener('click', event => { const button = event.target.closest('[data-step]'); if (button) { step = Number(button.dataset.step); renderStep(); } });

    const linked = decodeURIComponent(location.hash.slice(1));
    if (Object.hasOwn(topics, linked)) { topic = linked; problem = generate(topic, level); }
    else problem = generate(topic, level, true);
    renderProblem(); updateStars();
  }

  if (typeof window !== 'undefined') {
    window.MathPlayground = { generate, stepsFor, getState: () => ({topic, level, problem, step, solved, stars}) };
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generate, stepsFor, topics };
  }
})();
