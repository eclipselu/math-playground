(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const topics = {
    difference: { caption: 'A LITTLE MORE', icon: '🍫', title: 'Yesterday and today' },
    ratio: { caption: 'TIMES AS MUCH', icon: '💰', title: 'Let’s share the treasure' },
    extra: { caption: 'A LITTLE EXTRA', icon: '✨', title: 'A treasure with a little extra' },
    shop: { caption: 'LITTLE SHOP', icon: '🍟', title: 'A trip to the little shop' },
    count: { caption: 'NUMBER HOPS', icon: '🐸', title: 'Hop along the number path' },
    sharing: { caption: 'SHARE FAIRLY', icon: '🍓', title: 'A fair share for everyone' },
    missing: { caption: 'THE MISSING PIECE', icon: '🧩', title: 'Find the hidden treasures' },
    groups: { caption: 'BAGS OF TREASURES', icon: '🧸', title: 'Little bags, lots of treasures' },
    twoStep: { caption: 'FIRST… THEN…', icon: '🎈', title: 'One little step at a time' }
  };
  const names = ['Tom', 'Mia', 'Sam', 'Ava', 'Leo'];
  const treasures = [
    {name:'stickers', icon:'⭐'}, {name:'marbles', icon:'🔵'},
    {name:'toy cars', icon:'🚗'}, {name:'shells', icon:'🐚'},
    {name:'blocks', icon:'🧱'}, {name:'cards', icon:'🃏'}
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
  try { stars = Math.max(0, Number(localStorage.getItem('little-big-math-stars')) || 0); } catch (_) {}
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
    const hops = reveal => `<div class="hops">${Array.from({length:p.hops + 2}, (_,i) => `<div class="hop"><span class="hop-arrow">${i === 0 ? 'Start' : '+' + (i <= p.hops ? p.first : p.second) + ' →'}</span><span class="hop-number ${i === p.hops + 1 ? 'current' : ''}">${i === 0 ? p.start : i === p.hops + 1 ? reveal > 1 ? fmt(p.answers[0].value) : '?' : reveal > 0 ? fmt(p.start + i * p.first) : '?'}</span></div>`).join('')}</div>`;
    return [
      {title:'Follow the two rules', description:`First hop by ${p.first}, ${p.hops} times. Then take one hop of ${p.second}. Each circle is a landing spot.`, diagram:hops(0), equation:`${p.hops} small hops, then 1 bigger hop`},
      {title:'Take the first hops', description:`Begin at ${p.start}. Add ${p.first} each time. After ${p.hops} hops, you land on ${fmt(p.before)}.`, diagram:hops(1), equation:`${p.start} + (${p.hops} × ${p.first}) = ${fmt(p.before)}`},
      {title:'Switch to the new rule', description:`Now add ${p.second} once. That is your next landing spot!`, diagram:hops(2), equation:`${fmt(p.before)} + ${p.second} = ${fmt(p.answers[0].value)}`}
    ];
  }
  function renderStep() {
    const steps = stepsFor(problem), current = steps[step];
    $('visual-title').textContent = current.title;
    $('step-description').textContent = current.description;
    $('diagram').innerHTML = current.diagram;
    const slots = problem.kind === 'difference' ? 1 : problem.kind === 'shop' ? Math.max(problem.fries, problem.multiplier) : problem.multiplier;
    $('diagram').style.setProperty('--slots', slots);
    $('diagram').style.setProperty('--reserve', ['difference', 'extra'].includes(problem.kind) ? '54px' : '0px');
    $('equation').textContent = current.equation;
    $('step-dots').innerHTML = steps.map((_,i) => `<button class="step-dot" data-step="${i}" aria-label="Step ${i+1}: ${steps[i].title}" ${i === step ? 'aria-current="step"' : ''}></button>`).join('');
    $('previous-step').disabled = step === 0;
    $('next-step').textContent = step === steps.length - 1 ? 'Try a new problem ↻' : 'Show the next step →';
    $('visual-note').textContent = `Step ${step+1} of ${steps.length} · ${step === steps.length - 1 ? 'Try the answers, or start another adventure.' : 'Take your time. Try an answer whenever you’re ready.'}`;
    document.querySelector('.picture-badge').textContent = problem.kind === 'count' ? 'One circle = one landing spot' : ['sharing','missing','groups','twoStep'].includes(problem.kind) ? 'Pictures show the treasures' : problem.kind === 'shop' && step === steps.length - 1 ? 'Add the two item totals' : 'One box = one equal part';
  }
  function renderProblem() {
    step = 0; solved = false;
    const meta = topics[topic];
    $('topic-caption').textContent = meta.caption;
    $('story-icon').textContent = problem.menu ? problem.menu.a : problem.kind === 'count' || problem.money ? meta.icon : problem.item.icon;
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
    $('star-count').textContent = fmt(stars);
    const progress = stars && stars % 10 === 0 ? 10 : stars % 10;
    $('progress-fill').style.width = progress * 10 + '%';
    document.querySelector('.progress-track').setAttribute('aria-label', `${progress} of 10 stars toward a celebration`);
  }
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
  // Landing-page links can open a specific problem family, e.g. word-problems.html#sharing.
  const linked = decodeURIComponent(location.hash.slice(1));
  if (Object.hasOwn(topics, linked)) { topic = linked; problem = generate(topic, level); }
  else problem = generate(topic, level, true);
  renderProblem(); updateStars();
  // Pure generators also support checking every problem family without clicking hundreds of times.
  window.MathPlayground = { generate, stepsFor, getState: () => ({topic, level, problem, step, solved, stars}) };
})();
