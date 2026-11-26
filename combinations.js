(() => {
  'use strict';

  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  const $ = id => isBrowser ? document.getElementById(id) : null;

  const topics = {
    mealCombo: {
      caption: 'CLASSIC MEAL COMBO',
      icon: '🍔',
      title: 'Pick 1 from every group',
      badge: 'Multiply the choices in each group'
    },
    atLeastOne: {
      caption: 'AT LEAST ONE ITEM',
      icon: '🍟',
      title: 'Order at least one item from the menu',
      badge: 'Add a Skip card, then subtract the empty tray'
    },
    pickTwo: {
      caption: 'PICK A PAIR',
      icon: '🍦',
      title: 'Choose 2 different items (order doesn’t matter)',
      badge: 'Count pairs without double-counting'
    },
    toppings: {
      caption: 'BUILD YOUR BURGER',
      icon: '🧀',
      title: 'Say Yes or No to each topping',
      badge: '2 choices (Yes or No) per topping'
    },
    menuRule: {
      caption: 'MENU WITH A RULE',
      icon: '🚫',
      title: 'Count combos with a special menu rule',
      badge: 'Total combos minus blocked combos'
    },
    routeCode: {
      caption: 'PATHS, CODES & LINEUPS',
      icon: '🔐',
      title: 'Count ways when order DOES matter',
      badge: 'Multiply choices slot by slot'
    }
  };

  // ---------- Concrete Pools ----------
  const BURGERS = [
    { icon: '🍔', name: 'Cheeseburger' },
    { icon: '🍗', name: 'McChicken' },
    { icon: '🍔', name: 'Big Burger' },
    { icon: '🐟', name: 'Filet-O-Fish' },
    { icon: '🌶️', name: 'Spicy Crispy' },
    { icon: '🥬', name: 'Veggie Deluxe' }
  ];
  const FRIES = [
    { icon: '🍟', name: 'Regular Fries' },
    { icon: '🌀', name: 'Curly Fries' },
    { icon: '🍎', name: 'Apple Slices' },
    { icon: '🧅', name: 'Onion Rings' },
    { icon: '🥗', name: 'Side Salad' }
  ];
  const DRINKS = [
    { icon: '🥤', name: 'Cola' },
    { icon: '🧃', name: 'Apple Juice' },
    { icon: '🍋', name: 'Lemonade' },
    { icon: '🥛', name: 'Milkshake' },
    { icon: '🧊', name: 'Iced Tea' }
  ];
  const DESSERTS = [
    { icon: '🍦', name: 'Vanilla Cone' },
    { icon: '🥧', name: 'Apple Pie' },
    { icon: '🍪', name: 'Choc Cookie' },
    { icon: '🍩', name: 'Glazed Donut' }
  ];
  const TOPPINGS = [
    { icon: '🧀', name: 'Cheese' },
    { icon: '🥬', name: 'Lettuce' },
    { icon: '🍅', name: 'Tomato' },
    { icon: '🥓', name: 'Bacon' },
    { icon: '🥒', name: 'Pickles' },
    { icon: '🧅', name: 'Onions' }
  ];
  const FLAVORS = [
    { icon: '🍫', name: 'Chocolate' },
    { icon: '🍦', name: 'Vanilla' },
    { icon: '🍓', name: 'Strawberry' },
    { icon: '🥭', name: 'Mango' },
    { icon: '🍵', name: 'Matcha' },
    { icon: '🍪', name: 'Cookie Crunch' },
    { icon: '🫐', name: 'Blueberry' },
    { icon: '🥜', name: 'Caramel' },
    { icon: '🍌', name: 'Banana' }
  ];
  const SAUCES = [
    { icon: '🍅', name: 'Ketchup' },
    { icon: '🍯', name: 'Honey Mustard' },
    { icon: '🌶️', name: 'Spicy Buffalo' },
    { icon: '🧄', name: 'Garlic Ranch' },
    { icon: '🍖', name: 'Smoky BBQ' },
    { icon: '🧀', name: 'Cheddar Dip' },
    { icon: '🌿', name: 'Herb Mayo' },
    { icon: '🍋', name: 'Sweet & Sour' }
  ];
  const PATTIES = ['Single Beef', 'Double Beef', 'Crispy Chicken', 'Veggie'];
  const NAMES = ['Leo', 'Mia', 'Sam', 'Ava', 'Noah'];

  // ---------- Helpers ----------
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = list => list[rand(0, list.length - 1)];
  const fmt = n => n.toLocaleString('en-US');

  function renderMenuBoard(cats, opts = {}) {
    const { showSkip = false, blockedIndices = {}, soldIndices = {} } = opts;
    return `<div class="menu-board">${cats
      .map((cat, ci) => {
        const blockedSet = new Set(blockedIndices[ci] || []);
        const soldSet = new Set(soldIndices[ci] || []);
        const countLabel = showSkip
          ? `${cat.items.length} + 1`
          : soldSet.size
            ? `${cat.items.length - soldSet.size} left`
            : `${cat.items.length}`;
        const itemsHtml = cat.items
          .map((item, ii) => {
            const isSold = soldSet.has(ii);
            const isBlocked = blockedSet.has(ii);
            const cls = isSold || isBlocked ? 'menu-item blocked-item' : 'menu-item';
            return `<div class="${cls}"><span aria-hidden="true">${item.icon}</span><span>${item.name}${isSold ? ' (sold out)' : ''}</span></div>`;
          })
          .join('');
        const skipHtml = showSkip
          ? `<div class="menu-item skip-item"><span aria-hidden="true">❌</span><span>Skip ${cat.singular}</span></div>`
          : '';
        return `<div class="menu-col">
          <div class="menu-col-head"><span>${cat.icon} ${cat.name}</span><span class="menu-col-count">${countLabel}</span></div>
          <div class="menu-col-items">${itemsHtml}${skipHtml}</div>
        </div>`;
      })
      .join('')}</div>`;
  }

  function renderSlots(slots, totalVal = null, totalLabel = 'Total') {
    const parts = slots
      .map((s, i) => {
        const op = i > 0 ? '<span class="slot-op">×</span>' : '';
        return `${op}<div class="slot-card${s.highlight ? ' is-highlight' : ''}">
          <span class="slot-label">${s.label}</span>
          <span class="slot-val">${fmt(s.val)}</span>
          ${s.sub ? `<span class="slot-sub">${s.sub}</span>` : ''}
        </div>`;
      })
      .join('');
    const tail = totalVal !== null
      ? `<span class="slot-op">=</span><div class="slot-card is-total"><span class="slot-label">${totalLabel}</span><span class="slot-val">${fmt(totalVal)}</span></div>`
      : '';
    return `<div class="slot-row">${parts}${tail}</div>`;
  }

  // ---------- Problem Generator ----------
  function generate(kind, difficulty = 'easy', original = false) {
    const p = { kind, difficulty };
    const name = pick(NAMES);

    // 1. mealCombo — Classic 1-from-each Meal Combo
    if (kind === 'mealCombo') {
      let b, f, d, s = 0;
      if (difficulty === 'easy') {
        b = rand(2, 4); f = rand(2, 3); d = rand(2, 3);
      } else if (difficulty === 'medium') {
        b = rand(3, 5); f = rand(2, 4); d = rand(3, 5);
      } else {
        b = rand(3, 5); f = rand(2, 4); d = rand(3, 4); s = rand(2, 3);
      }

      const cats = [
        { name: 'Burgers', singular: 'burger', icon: '🍔', items: BURGERS.slice(0, b) },
        { name: 'Fries & Sides', singular: 'side', icon: '🍟', items: FRIES.slice(0, f) },
        { name: 'Drinks', singular: 'drink', icon: '🥤', items: DRINKS.slice(0, d) }
      ];
      if (s > 0) {
        cats.push({ name: 'Desserts', singular: 'dessert', icon: '🍦', items: DESSERTS.slice(0, s) });
      }

      const bf = b * f;
      const bfd = bf * d;
      const full = s > 0 ? bfd * s : bfd;

      p.cats = cats;
      p.counts = cats.map(c => c.items.length);
      p.bf = bf;
      p.bfd = bfd;
      p.total = full;

      p.story = s > 0
        ? `At the Burger Shop, a Happy Feast includes <strong>1 burger</strong> (from ${b}), <strong>1 side</strong> (from ${f}), <strong>1 drink</strong> (from ${d}), and <strong>1 dessert</strong> (from ${s}). How many different meals can ${name} order?`
        : `At the Burger Shop, a Classic Meal includes <strong>1 burger</strong> (from ${b} choices), <strong>1 side</strong> (from ${f} choices), and <strong>1 drink</strong> (from ${d} choices). How many unique meals can ${name} order?`;

      p.answers = s > 0
        ? [
            { label: 'Burger + side + drink combos (before dessert)', value: bfd },
            { label: 'Full 4-item feast combos', value: full }
          ]
        : [
            { label: 'Burger + side pairs', value: bf },
            { label: 'Full 3-item meal combos', value: full }
          ];
      p.hint = `Multiply the number of choices in each column: ${p.counts.join(' × ')} = ${fmt(full)}.`;
    }

    // 2. atLeastOne — McDonald's "At Least One" Optional-Category Meals
    else if (kind === 'atLeastOne') {
      let counts;
      if (original) {
        counts = [3, 2, 2]; // Signature McDonald's 3 burgers, 2 fries, 2 drinks -> 35
      } else if (difficulty === 'easy') {
        counts = Math.random() < 0.55 ? [rand(2, 4), 0, rand(2, 4)] : [rand(2, 3), 2, 2];
      } else if (difficulty === 'medium') {
        counts = [rand(2, 5), rand(2, 4), rand(2, 4)];
      } else {
        counts = Math.random() < 0.5
          ? [rand(4, 6), rand(3, 5), rand(3, 5)]
          : [rand(2, 4), rand(2, 3), rand(2, 4), rand(2, 3)];
      }

      const defs = [
        { name: 'Burgers', singular: 'burger', icon: '🍔', pool: BURGERS },
        { name: 'Fries', singular: 'fries', icon: '🍟', pool: FRIES },
        { name: 'Drinks', singular: 'drink', icon: '🥤', pool: DRINKS },
        { name: 'Desserts', singular: 'dessert', icon: '🍦', pool: DESSERTS }
      ];
      const cats = [];
      counts.forEach((cnt, idx) => {
        if (cnt > 0) {
          cats.push({
            name: defs[idx].name,
            singular: defs[idx].singular,
            icon: defs[idx].icon,
            items: defs[idx].pool.slice(0, cnt)
          });
        }
      });

      const withSkip = cats.map(c => c.items.length + 1);
      const allTrays = withSkip.reduce((acc, v) => acc * v, 1);
      const uniqueMeals = allTrays - 1;

      p.cats = cats;
      p.withSkip = withSkip;
      p.allTrays = allTrays;
      p.uniqueMeals = uniqueMeals;
      p.total = uniqueMeals;

      const catDesc = cats.map(c => `<strong>${c.items.length} ${c.name.toLowerCase()}</strong>`);
      const joinedDesc = catDesc.length === 2
        ? `${catDesc[0]} and ${catDesc[1]}`
        : `${catDesc.slice(0, -1).join(', ')}, and ${catDesc[catDesc.length - 1]}`;

      p.story = `At McDonald’s, the menu has ${joinedDesc}. ${name} wants to order a meal by choosing <strong>at most 1 item</strong> from each category (or skipping a category), as long as ${name} orders <strong>at least 1 item altogether</strong>. How many unique meals are possible?`;

      if (difficulty === 'easy') {
        p.answers = [
          { label: `${cats[0].name} choices (including Skip)`, value: withSkip[0] },
          { label: 'All tray combinations (including empty tray)', value: allTrays },
          { label: 'Unique meals (at least 1 item ordered)', value: uniqueMeals }
        ];
      } else if (difficulty === 'medium') {
        p.answers = [
          { label: 'All tray combinations (including empty tray)', value: allTrays },
          { label: 'Unique meals (at least 1 item ordered)', value: uniqueMeals }
        ];
      } else {
        p.answers = [
          { label: 'Unique meals (at least 1 item ordered)', value: uniqueMeals }
        ];
      }

      p.hint = `Give each category 1 extra “Skip” option: (${cats.map(c => `${c.items.length} + 1`).join(') × (')}) = ${withSkip.join(' × ')} = ${fmt(allTrays)} trays. Then subtract 1 for the empty tray (skipping everything)!`;
    }

    // 3. pickTwo — Choose 2 Different Items (Order Doesn't Matter)
    else if (kind === 'pickTwo') {
      const useSauces = Math.random() < 0.45;
      const n = difficulty === 'easy' ? rand(4, 6) : difficulty === 'medium' ? rand(6, 9) : rand(5, 8);
      const items = (useSauces ? SAUCES : FLAVORS).slice(0, n);
      const pairs = (n * (n - 1)) / 2;
      const d = difficulty === 'large' ? rand(2, 4) : 0;
      const total = d > 0 ? pairs * d : pairs;

      p.useSauces = useSauces;
      p.items = items;
      p.n = n;
      p.pairs = pairs;
      p.drinkCount = d;
      p.drinks = d > 0 ? DRINKS.slice(0, d) : [];
      p.total = total;

      const noun = useSauces ? 'dipping sauces' : 'ice cream flavors';
      const itemNames = items.map(it => `${it.icon} ${it.name}`).join(', ');
      p.story = d > 0
        ? `A snack box lets you pick <strong>2 different ${noun}</strong> from ${n} choices (${itemNames}) — order doesn’t matter — plus <strong>1 drink</strong> from ${d} drinks. How many snack boxes can you make?`
        : `At the shop, there are <strong>${n} ${noun}</strong>: ${itemNames}. ${name} picks <strong>2 different ${noun}</strong> in one cup (order does not matter — A &amp; B is the same as B &amp; A).`;

      p.answers = d > 0
        ? [
            { label: `Unique 2-${useSauces ? 'sauce' : 'flavor'} pairs`, value: pairs },
            { label: 'Total snack boxes (pair + 1 drink)', value: total }
          ]
        : [
            { label: `Pairs that include ${items[0].name}`, value: n - 1 },
            { label: 'Total unique pairs', value: pairs }
          ];
      p.hint = `Use the handshake staircase: (${n - 1}) + (${n - 2}) + ... + 1 = (${n} × ${n - 1}) ÷ 2 = ${pairs} pairs${d > 0 ? `, then multiply by ${d} drinks!` : '.'}`;
    }

    // 4. toppings — Build Your Burger (Yes/No Subsets 2^n & At Least 1)
    else if (kind === 'toppings') {
      const n = difficulty === 'easy' ? rand(3, 4) : difficulty === 'medium' ? rand(4, 5) : rand(4, 6);
      const requireAtLeastOne = difficulty === 'easy' ? Math.random() < 0.5 : true;
      const patties = difficulty === 'large' ? rand(2, 4) : 1;
      const items = TOPPINGS.slice(0, n);
      const allSubs = Math.pow(2, n);
      const validToppings = requireAtLeastOne ? allSubs - 1 : allSubs;
      const total = patties * validToppings;

      p.n = n;
      p.items = items;
      p.requireAtLeastOne = requireAtLeastOne;
      p.patties = patties;
      p.pattyNames = PATTIES.slice(0, patties);
      p.allSubs = allSubs;
      p.validToppings = validToppings;
      p.total = total;

      const listHtml = items.map(it => `${it.icon} ${it.name}`).join(', ');
      if (patties > 1) {
        p.story = `Choose <strong>1 patty style</strong> (${p.pattyNames.join(', ')}) and customize your burger with <strong>at least 1 topping</strong> from these <strong>${n} toppings</strong>: ${listHtml}. How many custom burgers can ${name} build?`;
        p.answers = [
          { label: 'Topping combos (at least 1 topping)', value: validToppings },
          { label: `Total custom burgers (${patties} patties × topping combos)`, value: total }
        ];
      } else if (requireAtLeastOne) {
        p.story = `${name} is building a custom burger! There are <strong>${n} optional toppings</strong>: ${listHtml}. ${name} can say Yes or No to each topping, as long as there is <strong>at least 1 topping</strong> on the burger (no plain bun!).`;
        p.answers = [
          { label: 'All Yes/No combos (including plain burger)', value: allSubs },
          { label: 'Combos with at least 1 topping', value: validToppings }
        ];
      } else {
        p.story = `${name} is building a burger with <strong>${n} optional toppings</strong>: ${listHtml}. For each topping, ${name} decides either <strong>Yes</strong> or <strong>No</strong> (plain burger with zero toppings is okay too!). How many burgers are possible?`;
        p.answers = [
          { label: 'Total burger combinations', value: total }
        ];
      }

      p.hint = `Each of the ${n} toppings has 2 choices (Yes or No): ${Array(n).fill(2).join(' × ')} = ${allSubs}.${requireAtLeastOne ? ` Subtract 1 for the all-No plain burger → ${validToppings}!` : ''}${patties > 1 ? ` Then multiply by ${patties} patty styles.` : ''}`;
    }

    // 5. menuRule — Menu with a Forbidden Pair or Sold-Out Rule
    else if (kind === 'menuRule') {
      const ruleVariant = pick(['forbiddenPair', 'soldOut']);
      p.ruleVariant = ruleVariant;

      if (ruleVariant === 'forbiddenPair') {
        const b = difficulty === 'easy' ? rand(3, 4) : rand(3, 5);
        const f = difficulty === 'easy' ? 0 : rand(2, 3);
        const d = difficulty === 'easy' ? rand(3, 4) : rand(3, 4);
        const cats = [
          { name: 'Burgers', singular: 'burger', icon: '🍔', items: BURGERS.slice(0, b) },
          ...(f > 0 ? [{ name: 'Fries', singular: 'fries', icon: '🍟', items: FRIES.slice(0, f) }] : []),
          { name: 'Drinks', singular: 'drink', icon: '🥤', items: DRINKS.slice(0, d) }
        ];
        const fullTotal = f > 0 ? b * f * d : b * d;
        const blockedCount = f > 0 ? f : 1;
        const validTotal = fullTotal - blockedCount;
        const badB = BURGERS[0];
        const badD = DRINKS[0];

        p.cats = cats;
        p.b = b; p.f = f; p.d = d;
        p.blockedBurgerIdx = 0;
        p.blockedDrinkIdx = 0;
        p.badBurger = badB;
        p.badDrink = badD;
        p.fullTotal = fullTotal;
        p.blockedCount = blockedCount;
        p.validTotal = validTotal;
        p.total = validTotal;

        p.story = f > 0
          ? `A combo has 1 burger (${b} choices), 1 side (${f} choices), and 1 drink (${d} choices). <strong>Rule:</strong> You may NOT pair the <strong>${badB.name}</strong> with the <strong>${badD.name}</strong>! How many valid meals can you order?`
          : `A snack deal pairs 1 burger (${b} choices) and 1 drink (${d} choices). <strong>Rule:</strong> You may NOT pair the <strong>${badB.name}</strong> with the <strong>${badD.name}</strong>! How many valid meals can you order?`;

        p.answers = difficulty === 'large'
          ? [{ label: 'Valid meal combos allowed', value: validTotal }]
          : [
              { label: 'Total combos without the rule', value: fullTotal },
              { label: 'Valid meal combos allowed', value: validTotal }
            ];
        p.hint = `First find all combos (${cats.map(c => c.items.length).join(' × ')} = ${fullTotal}). Then count how many forbidden meals contain BOTH ${badB.name} and ${badD.name} (${blockedCount}), and subtract!`;
      } else {
        // soldOut
        const b = difficulty === 'easy' ? rand(3, 4) : rand(4, 5);
        const f = difficulty === 'easy' ? 2 : rand(2, 4);
        const d = difficulty === 'easy' ? rand(3, 4) : rand(3, 5);
        const soldB = difficulty === 'large' && b >= 4 ? 2 : 1;
        const soldD = 1;
        const cats = [
          { name: 'Burgers', singular: 'burger', icon: '🍔', items: BURGERS.slice(0, b) },
          { name: 'Fries', singular: 'fries', icon: '🍟', items: FRIES.slice(0, f) },
          { name: 'Drinks', singular: 'drink', icon: '🥤', items: DRINKS.slice(0, d) }
        ];
        const fullTotal = b * f * d;
        const remB = b - soldB;
        const remD = d - soldD;
        const validTotal = remB * f * remD;

        p.cats = cats;
        p.b = b; p.f = f; p.d = d;
        p.soldB = soldB; p.soldD = soldD;
        p.remB = remB; p.remD = remD;
        p.soldBurgers = Array.from({ length: soldB }, (_, i) => i);
        p.soldDrinks = [0];
        p.fullTotal = fullTotal;
        p.validTotal = validTotal;
        p.total = validTotal;

        const soldBurgerNames = p.soldBurgers.map(i => BURGERS[i].name).join(' and ');
        p.story = `The regular menu has <strong>${b} burgers</strong>, <strong>${f} sides</strong>, and <strong>${d} drinks</strong>. Today, <strong>${soldBurgerNames}</strong> and <strong>${DRINKS[0].name}</strong> are sold out! How many 3-item meals can still be ordered?`;
        p.answers = difficulty === 'large'
          ? [{ label: 'Valid meal combos available today', value: validTotal }]
          : [
              { label: 'Normal total combos (nothing sold out)', value: fullTotal },
              { label: 'Valid meal combos available today', value: validTotal }
            ];
        p.hint = `Cross out the sold-out choices first: ${b} − ${soldB} = ${remB} burgers left, ${f} sides, and ${d} − ${soldD} = ${remD} drinks left. Multiply ${remB} × ${f} × ${remD}!`;
      }
    }

    // 6. routeCode — Paths, Secret Codes & Lineups (Order Matters)
    else if (kind === 'routeCode') {
      const variant = pick(['paths', 'code', 'podium']);
      p.variant = variant;

      if (variant === 'paths') {
        const stages = difficulty === 'easy'
          ? [rand(2, 4), rand(2, 4)]
          : difficulty === 'medium'
            ? [rand(2, 4), rand(2, 4), rand(2, 3)]
            : [rand(3, 5), rand(2, 4), rand(2, 4), rand(2, 3)];
        const places = stages.length === 2
          ? ['Home', 'Park', 'Burger Shop']
          : stages.length === 3
            ? ['Home', 'Park', 'Burger Shop', 'School']
            : ['Home', 'Park', 'Library', 'Burger Shop', 'School'];
        const total = stages.reduce((acc, v) => acc * v, 1);

        p.stages = stages;
        p.places = places;
        p.total = total;

        const legsDesc = stages.map((cnt, i) => `<strong>${cnt} paths</strong> from ${places[i]} to ${places[i + 1]}`).join(', ');
        p.story = `${name} walks from ${places[0]} to ${places[places.length - 1]} with stops along the way: ${legsDesc}. How many different routes can ${name} take?`;
        p.answers = [{ label: 'Total different routes', value: total }];
        p.hint = `Multiply the number of paths for each leg of the trip: ${stages.join(' × ')} = ${fmt(total)}.`;
      } else if (variant === 'code') {
        const n = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
        const digitPool = [1, 2, 3, 4, 5, 6, 7, 8, 9].slice(0, n);
        const noRepeat3 = n * (n - 1) * (n - 2);
        const repeat3 = n * n * n;
        const total = difficulty === 'large' ? noRepeat3 : noRepeat3;

        p.n = n;
        p.digitPool = digitPool;
        p.noRepeat3 = noRepeat3;
        p.repeat3 = repeat3;
        p.total = total;

        p.story = difficulty === 'large'
          ? `A treasure lock needs a <strong>3-digit code</strong> made from digits <strong>{${digitPool.join(', ')}}</strong>. How many codes exist if digits <strong>CAN repeat</strong>? How many if all 3 digits must be <strong>different</strong>?`
          : `A bike lock needs a <strong>3-digit code</strong> using digits <strong>{${digitPool.join(', ')}}</strong>, with <strong>no repeated digits</strong>. How many different codes can ${name} make?`;

        p.answers = difficulty === 'large'
          ? [
              { label: 'Codes if digits CAN repeat', value: repeat3 },
              { label: 'Codes if all 3 digits are different', value: noRepeat3 }
            ]
          : [
              { label: 'Choices for 1st digit', value: n },
              { label: 'Total 3-digit codes (no repeats)', value: noRepeat3 }
            ];
        p.hint = `For no repeats: ${n} choices for the 1st digit, ${n - 1} left for the 2nd, and ${n - 2} left for the 3rd → ${n} × ${n - 1} × ${n - 2} = ${noRepeat3}.`;
      } else {
        // podium
        const n = difficulty === 'easy' ? rand(4, 5) : difficulty === 'medium' ? rand(5, 7) : rand(5, 8);
        const spots = difficulty === 'large' ? 3 : 2;
        const total = spots === 2 ? n * (n - 1) : n * (n - 1) * (n - 2);
        p.n = n;
        p.spots = spots;
        p.total = total;

        p.story = spots === 2
          ? `<strong>${n} racers</strong> enter a dash. How many different ways can <strong>1st place (Gold)</strong> and <strong>2nd place (Silver)</strong> medals be awarded?`
          : `<strong>${n} racers</strong> enter a sprint. How many different ways can <strong>1st (Gold)</strong>, <strong>2nd (Silver)</strong>, and <strong>3rd (Bronze)</strong> medals be awarded?`;
        p.answers = [
          { label: 'Choices for 1st place (Gold)', value: n },
          { label: `Total ways to fill top ${spots} spots`, value: total }
        ];
        p.hint = `Order matters here! ${n} racers can win Gold, leaving ${n - 1} racers for Silver${spots === 3 ? `, and ${n - 2} for Bronze` : ''}. Multiply them!`;
      }
    }

    else {
      throw new Error('Unknown problem kind: ' + kind);
    }

    return p;
  }

  // ---------- Visual Explanations (stepsFor) ----------
  function stepsFor(p) {
    if (p.kind === 'mealCombo') {
      const slots = p.cats.map(c => ({ label: c.name, val: c.items.length, sub: c.icon }));
      return [
        {
          title: 'Check every menu column',
          description: `You must pick 1 item from each column: ${p.cats.map(c => `${c.items.length} ${c.name.toLowerCase()}`).join(', ')}.`,
          diagram: renderMenuBoard(p.cats),
          equation: p.counts.join(' × ')
        },
        {
          title: 'Pair burgers with sides',
          description: `Each of the ${p.counts[0]} burgers pairs with any of the ${p.counts[1]} sides: ${p.counts[0]} × ${p.counts[1]} = ${p.bf} pairs.`,
          diagram: renderSlots(slots.slice(0, 2), p.bf, 'Pairs'),
          equation: `${p.counts[0]} × ${p.counts[1]} = ${p.bf}`
        },
        {
          title: p.cats.length > 3 ? 'Multiply by drinks, then desserts' : 'Multiply by the drink choices',
          description: p.cats.length > 3
            ? `Each of the ${p.bf} pairs matches ${p.counts[2]} drinks (${p.bfd}), then ${p.counts[3]} desserts → ${fmt(p.total)} feasts!`
            : `Every burger + side pair can match any of the ${p.counts[2]} drinks: ${p.bf} × ${p.counts[2]} = ${fmt(p.total)} meals!`,
          diagram: renderSlots(slots, p.total, 'Meals'),
          equation: `${p.counts.join(' × ')} = ${fmt(p.total)}`
        },
        {
          title: 'Verify the full menu',
          description: `Multiplying across all ${p.cats.length} columns gives ${fmt(p.total)} unique meals.`,
          diagram: renderSlots(slots, p.total, 'Total ✓') + `<div class="combo-summary-pill">Total = ${fmt(p.total)} unique meals ✓</div>`,
          equation: `${p.counts.join(' × ')} = ${fmt(p.total)} ✓`
        }
      ];
    }

    if (p.kind === 'atLeastOne') {
      const slotsNoSkip = p.cats.map(c => ({ label: c.name, val: c.items.length, sub: 'Menu only' }));
      const slotsWithSkip = p.cats.map(c => ({ label: c.name, val: c.items.length + 1, sub: `${c.items.length} + Skip`, highlight: true }));
      const emptyComboText = p.cats.map(c => `❌ Skip ${c.singular}`).join(' + ');

      return [
        {
          title: 'Spot the twist: skipping is allowed!',
          description: `Unlike a fixed combo, you don’t have to order from every column! You can pick 1 item OR skip a column — as long as your tray isn’t completely empty.`,
          diagram: renderMenuBoard(p.cats, { showSkip: false }),
          equation: `Each column has (items + 1 Skip) choices`
        },
        {
          title: 'Add 1 “Skip” card to every column',
          description: `Pretend “Skip” is an extra item on the menu! Now each column has 1 more choice: ${p.cats.map(c => `${c.items.length} + 1 = ${c.items.length + 1}`).join(', ')}.`,
          diagram: renderMenuBoard(p.cats, { showSkip: true }),
          equation: p.cats.map(c => `(${c.items.length} + 1)`).join(' × ')
        },
        {
          title: 'Multiply all columns with Skip cards',
          description: `Multiply the choices (including Skip): ${p.withSkip.join(' × ')} = ${fmt(p.allTrays)} possible trays.`,
          diagram: renderSlots(slotsWithSkip, p.allTrays, 'All Trays'),
          equation: `${p.withSkip.join(' × ')} = ${fmt(p.allTrays)} trays`
        },
        {
          title: 'Subtract the 1 forbidden empty tray!',
          description: `Out of all ${fmt(p.allTrays)} trays, exactly 1 tray skipped EVERYTHING (${emptyComboText}). Subtract that 1 empty tray: ${fmt(p.allTrays)} − 1 = ${fmt(p.uniqueMeals)} meals!`,
          diagram: renderSlots(slotsWithSkip, p.allTrays, 'All Trays') +
            `<div class="empty-tray-card">🚫 Remove 1 empty tray: <s>${emptyComboText}</s></div>` +
            `<div class="combo-summary-pill">${fmt(p.allTrays)} − 1 = ${fmt(p.uniqueMeals)} unique meals ✓</div>`,
          equation: `${fmt(p.allTrays)} − 1 = ${fmt(p.uniqueMeals)} unique meals ✓`
        }
      ];
    }

    if (p.kind === 'pickTwo') {
      const stairRows = Array.from({ length: p.n - 1 }, (_, i) => {
        const first = p.items[i];
        const partners = p.items.slice(i + 1).map(it => `<span class="pair-chip">${first.icon}+${it.icon}</span>`).join('');
        return `<div class="pair-row"><div class="pair-row-items">${partners}</div><span class="pair-count">+${p.n - 1 - i}</span></div>`;
      });

      return [
        {
          title: 'Count partners without repeating',
          description: `${p.items[0].name} can pair with ${p.n - 1} other choices. ${p.items[1].name} already paired with ${p.items[0].name}, so it gets ${p.n - 2} new partners!`,
          diagram: `<div class="pair-rows">${stairRows.slice(0, 2).join('')}</div>`,
          equation: `(${p.n - 1}) + (${p.n - 2}) + ... + 1`
        },
        {
          title: 'Finish the pair staircase',
          description: `Add every new pair down to 1: ${Array.from({ length: p.n - 1 }, (_, i) => p.n - 1 - i).join(' + ')} = ${p.pairs} unique pairs.`,
          diagram: `<div class="pair-rows">${stairRows.join('')}</div>`,
          equation: `${Array.from({ length: p.n - 1 }, (_, i) => p.n - 1 - i).join(' + ')} = ${p.pairs}`
        },
        {
          title: 'Use the shortcut formula',
          description: `Each of the ${p.n} items pairs with (${p.n} − 1) others, then divide by 2 so A & B isn’t counted twice as B & A: (${p.n} × ${p.n - 1}) ÷ 2 = ${p.pairs}.`,
          diagram: `<div class="combo-summary-pill">(${p.n} × ${p.n - 1}) ÷ 2 = ${p.pairs} unique pairs</div>`,
          equation: `(${p.n} × ${p.n - 1}) ÷ 2 = ${p.pairs}`
        },
        {
          title: p.drinkCount > 0 ? 'Multiply by the drink choices' : 'Verify the total pairs',
          description: p.drinkCount > 0
            ? `Combine any of the ${p.pairs} pairs with ${p.drinkCount} drinks: ${p.pairs} × ${p.drinkCount} = ${fmt(p.total)} snack boxes!`
            : `Total unique 2-item pairs = ${p.pairs}!`,
          diagram: p.drinkCount > 0
            ? renderSlots([{ label: '2-Item Pairs', val: p.pairs }, { label: 'Drinks', val: p.drinkCount }], p.total, 'Boxes ✓')
            : `<div class="combo-summary-pill">Total = ${p.pairs} unique pairs ✓</div>`,
          equation: p.drinkCount > 0 ? `${p.pairs} × ${p.drinkCount} = ${fmt(p.total)} ✓` : `${p.pairs} unique pairs ✓`
        }
      ];
    }

    if (p.kind === 'toppings') {
      const ynCards = `<div class="yesno-row">${p.items
        .map(it => `<div class="yesno-card"><span class="yesno-name">${it.icon} ${it.name}</span><div class="yn-pills"><span class="yn-yes">✓ YES</span><span class="yn-no">✗ NO</span></div></div>`)
        .join('')}</div>`;
      const twoSlots = p.items.map(it => ({ label: it.name, val: 2, sub: 'Yes / No', highlight: true }));

      return [
        {
          title: 'Every topping is a Yes / No switch',
          description: `For each of the ${p.n} toppings, you make 2 choices: put it on (YES) or leave it off (NO).`,
          diagram: ynCards,
          equation: `2 choices per topping`
        },
        {
          title: 'Multiply 2 for every topping',
          description: `Multiply ${p.n} twos together: ${Array(p.n).fill(2).join(' × ')} = ${fmt(p.allSubs)} total Yes/No combinations.`,
          diagram: renderSlots(twoSlots, p.allSubs, 'All Combos'),
          equation: `${Array(p.n).fill(2).join(' × ')} = ${fmt(p.allSubs)}`
        },
        {
          title: p.requireAtLeastOne ? 'Remove the 1 plain (all-NO) burger' : 'Plain burger is allowed!',
          description: p.requireAtLeastOne
            ? `Saying NO to every single topping gives 1 plain bun with 0 toppings. Subtract 1: ${fmt(p.allSubs)} − 1 = ${fmt(p.validToppings)}.`
            : `Saying NO to all toppings gives a plain burger, which IS allowed here — so all ${fmt(p.allSubs)} combos count!`,
          diagram: p.requireAtLeastOne
            ? `<div class="empty-tray-card">🚫 Remove 1 all-NO burger (0 toppings)</div><div class="combo-summary-pill">${fmt(p.allSubs)} − 1 = ${fmt(p.validToppings)} topping combos</div>`
            : `<div class="combo-summary-pill">All ${fmt(p.allSubs)} combinations count!</div>`,
          equation: p.requireAtLeastOne ? `${fmt(p.allSubs)} − 1 = ${fmt(p.validToppings)}` : `${fmt(p.allSubs)} combos`
        },
        {
          title: p.patties > 1 ? 'Multiply by patty styles' : 'Final burger count',
          description: p.patties > 1
            ? `Pair each of the ${p.patties} patties with ${fmt(p.validToppings)} topping combos: ${p.patties} × ${fmt(p.validToppings)} = ${fmt(p.total)} custom burgers!`
            : `Total custom burgers = ${fmt(p.total)}!`,
          diagram: p.patties > 1
            ? renderSlots([{ label: 'Patties', val: p.patties }, { label: 'Topping Combos', val: p.validToppings }], p.total, 'Burgers ✓')
            : `<div class="combo-summary-pill">Total = ${fmt(p.total)} burgers ✓</div>`,
          equation: p.patties > 1 ? `${p.patties} × ${fmt(p.validToppings)} = ${fmt(p.total)} ✓` : `${fmt(p.total)} burgers ✓`
        }
      ];
    }

    if (p.kind === 'menuRule') {
      if (p.ruleVariant === 'forbiddenPair') {
        const slots = p.cats.map(c => ({ label: c.name, val: c.items.length }));
        const lastIdx = p.cats.length - 1;
        return [
          {
            title: 'First count ALL combos without the rule',
            description: `Imagine all items can be paired freely: ${p.cats.map(c => c.items.length).join(' × ')} = ${fmt(p.fullTotal)} total meals.`,
            diagram: renderSlots(slots, p.fullTotal, 'All Meals'),
            equation: `${p.cats.map(c => c.items.length).join(' × ')} = ${fmt(p.fullTotal)}`
          },
          {
            title: 'Spot the forbidden pair',
            description: `${p.badBurger.icon} ${p.badBurger.name} and ${p.badDrink.icon} ${p.badDrink.name} cannot be in the same meal.`,
            diagram: renderMenuBoard(p.cats, { blockedIndices: { 0: [0], [lastIdx]: [0] } }),
            equation: `No ${p.badBurger.name} + ${p.badDrink.name}`
          },
          {
            title: 'Count how many meals break the rule',
            description: p.f > 0
              ? `Fixing ${p.badBurger.name} (1) + ${p.badDrink.name} (1) still pairs with ${p.f} sides → 1 × ${p.f} × 1 = ${p.f} forbidden meals!`
              : `With only burgers and drinks, there is exactly 1 forbidden pair (${p.badBurger.name} + ${p.badDrink.name}).`,
            diagram: `<div class="empty-tray-card">🚫 Broken meals to remove: ${p.blockedCount}</div>`,
            equation: `Broken meals = ${p.blockedCount}`
          },
          {
            title: 'Subtract broken meals from total',
            description: `${fmt(p.fullTotal)} − ${p.blockedCount} = ${fmt(p.validTotal)} valid meals allowed!`,
            diagram: `<div class="combo-summary-pill">${fmt(p.fullTotal)} − ${p.blockedCount} = ${fmt(p.validTotal)} valid meals ✓</div>`,
            equation: `${fmt(p.fullTotal)} − ${p.blockedCount} = ${fmt(p.validTotal)} ✓`
          }
        ];
      } else {
        const remSlots = [
          { label: 'Burgers Left', val: p.remB, sub: `${p.b} − ${p.soldB}`, highlight: true },
          { label: 'Fries', val: p.f },
          { label: 'Drinks Left', val: p.remD, sub: `${p.d} − ${p.soldD}`, highlight: true }
        ];
        return [
          {
            title: 'Count the normal menu first',
            description: `Before anything sold out, there were ${p.b} × ${p.f} × ${p.d} = ${fmt(p.fullTotal)} total meals.`,
            diagram: renderSlots(p.cats.map(c => ({ label: c.name, val: c.items.length })), p.fullTotal, 'Normal'),
            equation: `${p.b} × ${p.f} × ${p.d} = ${fmt(p.fullTotal)}`
          },
          {
            title: 'Cross out sold-out items',
            description: `Cross out ${p.soldB} sold-out burger${p.soldB > 1 ? 's' : ''} and ${p.soldD} sold-out drink.`,
            diagram: renderMenuBoard(p.cats, { soldIndices: { 0: p.soldBurgers, 2: p.soldDrinks } }),
            equation: `Burgers: ${p.b} − ${p.soldB} = ${p.remB}, Drinks: ${p.d} − ${p.soldD} = ${p.remD}`
          },
          {
            title: 'Multiply what is still in stock',
            description: `Now multiply the remaining available choices: ${p.remB} × ${p.f} × ${p.remD} = ${fmt(p.validTotal)}.`,
            diagram: renderSlots(remSlots, p.validTotal, 'Available'),
            equation: `${p.remB} × ${p.f} × ${p.remD} = ${fmt(p.validTotal)}`
          },
          {
            title: 'Verify today’s valid meals',
            description: `${fmt(p.validTotal)} meals can still be ordered today!`,
            diagram: `<div class="combo-summary-pill">${fmt(p.validTotal)} valid meals today ✓</div>`,
            equation: `${fmt(p.validTotal)} valid meals ✓`
          }
        ];
      }
    }

    // 6. routeCode
    if (p.variant === 'paths') {
      const W = 420, H = 155;
      const nNodes = p.places.length;
      const xs = p.places.map((_, i) => 44 + (i * (W - 88)) / (nNodes - 1));
      const edges = p.stages.map((cnt, i) => {
        const x1 = xs[i], x2 = xs[i + 1], midX = (x1 + x2) / 2;
        return Array.from({ length: cnt }, (_, j) => {
          const offset = (j - (cnt - 1) / 2) * 26;
          return `<path d="M ${x1} 75 Q ${midX} ${75 + offset * 1.6} ${x2} 75" fill="none" stroke="#315b48" stroke-width="2.5" stroke-opacity="0.75"/>`;
        }).join('');
      }).join('');
      const nodes = p.places.map((pl, i) => `<circle cx="${xs[i]}" cy="75" r="11" fill="#f0cd65" stroke="#263f37" stroke-width="2"/><text x="${xs[i]}" y="114" text-anchor="middle" font-size="11" font-weight="700" fill="#263f37">${pl}</text>`).join('');
      const svg = `<svg class="path-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Route map">${edges}${nodes}</svg>`;
      const slots = p.stages.map((cnt, i) => ({ label: `Leg ${i + 1}`, val: cnt, sub: `${p.places[i]}→${p.places[i + 1]}` }));

      return [
        { title: 'Draw the stops and paths', description: `Each leg offers independent route choices from ${p.places[0]} to ${p.places[nNodes - 1]}.`, diagram: svg, equation: p.stages.join(' × ') },
        { title: 'Combine the first two legs', description: `${p.stages[0]} paths × ${p.stages[1]} paths = ${p.stages[0] * p.stages[1]} routes so far.`, diagram: renderSlots(slots.slice(0, 2), p.stages[0] * p.stages[1], 'So far'), equation: `${p.stages[0]} × ${p.stages[1]} = ${p.stages[0] * p.stages[1]}` },
        { title: 'Multiply across all legs', description: `Multiply all ${p.stages.length} legs: ${p.stages.join(' × ')} = ${fmt(p.total)}.`, diagram: renderSlots(slots, p.total, 'Routes'), equation: `${p.stages.join(' × ')} = ${fmt(p.total)}` },
        { title: 'Verify total routes', description: `There are ${fmt(p.total)} different routes altogether!`, diagram: svg + `<div class="combo-summary-pill">${fmt(p.total)} routes ✓</div>`, equation: `${fmt(p.total)} routes ✓` }
      ];
    }

    if (p.variant === 'code') {
      const noRepSlots = [
        { label: '1st Digit', val: p.n, sub: 'All free', highlight: true },
        { label: '2nd Digit', val: p.n - 1, sub: '1 used', highlight: true },
        { label: '3rd Digit', val: p.n - 2, sub: '2 used', highlight: true }
      ];
      return [
        { title: 'Check the digit choices', description: `We have ${p.n} digits: {${p.digitPool.join(', ')}}. Order matters for a 3-digit lock code!`, diagram: `<div class="dial-row"><div class="dial-box"><strong>1st Slot</strong><span>${p.n}</span></div><div class="dial-box"><strong>2nd Slot</strong><span>?</span></div><div class="dial-box"><strong>3rd Slot</strong><span>?</span></div></div>`, equation: `1st digit: ${p.n} choices` },
        { title: 'Fill slots with NO repeats', description: `Once you pick the 1st digit (${p.n}), only ${p.n - 1} digits remain for the 2nd slot, and ${p.n - 2} remain for the 3rd slot!`, diagram: renderSlots(noRepSlots, p.noRepeat3, 'No Repeat'), equation: `${p.n} × ${p.n - 1} × ${p.n - 2} = ${fmt(p.noRepeat3)}` },
        { title: p.difficulty === 'large' ? 'Compare with repeats allowed' : 'Multiply slot by slot', description: p.difficulty === 'large' ? `If digits CAN repeat, every slot keeps all ${p.n} choices: ${p.n} × ${p.n} × ${p.n} = ${fmt(p.repeat3)}!` : `Multiply the 3 slots: ${p.n} × ${p.n - 1} × ${p.n - 2} = ${fmt(p.noRepeat3)}.`, diagram: p.difficulty === 'large' ? renderSlots([{ label: '1st', val: p.n }, { label: '2nd', val: p.n }, { label: '3rd', val: p.n }], p.repeat3, 'Repeats OK') : renderSlots(noRepSlots, p.noRepeat3, 'Codes'), equation: p.difficulty === 'large' ? `${p.n} × ${p.n} × ${p.n} = ${fmt(p.repeat3)}` : `${p.n} × ${p.n - 1} × ${p.n - 2} = ${fmt(p.noRepeat3)}` },
        { title: 'Verify lock codes', description: `No-repeat codes = ${fmt(p.noRepeat3)}${p.difficulty === 'large' ? `; Repeat-allowed codes = ${fmt(p.repeat3)}` : ''}.`, diagram: `<div class="combo-summary-pill">No repeats: ${fmt(p.noRepeat3)} codes ✓</div>`, equation: `${fmt(p.noRepeat3)} codes ✓` }
      ];
    }

    // podium
    const podiumSlots = [
      { label: '🥇 1st Place', val: p.n, sub: 'Any racer', highlight: true },
      { label: '🥈 2nd Place', val: p.n - 1, sub: '1 gone', highlight: true },
      ...(p.spots === 3 ? [{ label: '🥉 3rd Place', val: p.n - 2, sub: '2 gone', highlight: true }] : [])
    ];
    const multList = podiumSlots.map(s => s.val).join(' × ');
    return [
      { title: 'Order matters on the podium!', description: `Leo 1st & Mia 2nd is DIFFERENT from Mia 1st & Leo 2nd — so we fill podium spots one by one.`, diagram: `<div class="dial-row"><div class="dial-box"><strong>🥇 1st</strong><span>${p.n}</span></div><div class="dial-box"><strong>🥈 2nd</strong><span>?</span></div></div>`, equation: `${p.n} choices for 1st place` },
      { title: 'Fill 2nd place (and 3rd)', description: `After 1 racer takes Gold, ${p.n - 1} racers remain for Silver${p.spots === 3 ? `, leaving ${p.n - 2} for Bronze` : ''}.`, diagram: renderSlots(podiumSlots), equation: multList },
      { title: 'Multiply the podium slots', description: `Multiply: ${multList} = ${fmt(p.total)} podium lineups.`, diagram: renderSlots(podiumSlots, p.total, 'Lineups'), equation: `${multList} = ${fmt(p.total)}` },
      { title: 'Verify podium ways', description: `There are ${fmt(p.total)} different ways to award the medals!`, diagram: `<div class="combo-summary-pill">${multList} = ${fmt(p.total)} ways ✓</div>`, equation: `${multList} = ${fmt(p.total)} ✓` }
    ];
  }

  // ---------- Application State & Controller ----------
  let topic = 'atLeastOne';
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

  function renderStoryVisual(p) {
    if (!p) return '';
    if (p.kind === 'mealCombo' || p.kind === 'atLeastOne') {
      return renderMenuBoard(p.cats);
    }
    if (p.kind === 'menuRule') {
      if (p.ruleVariant === 'soldOut') {
        return renderMenuBoard(p.cats, { soldIndices: { 0: p.soldBurgers, 2: p.soldDrinks } });
      }
      return renderMenuBoard(p.cats);
    }
    if (p.kind === 'toppings') {
      return `<div class="yesno-row">${p.items
        .map(it => `<div class="yesno-card"><span class="yesno-name">${it.icon} ${it.name}</span><div class="yn-pills"><span class="yn-yes">YES</span><span class="yn-no">NO</span></div></div>`)
        .join('')}</div>`;
    }
    if (p.kind === 'pickTwo') {
      return `<div class="combo-summary-pill" style="background:#fffdf8;border-color:#d4dec9;color:#263f37;">${p.items.map(it => `${it.icon} ${it.name}`).join(' &nbsp;·&nbsp; ')}</div>`;
    }
    if (p.kind === 'routeCode') {
      if (p.variant === 'code') {
        return `<div class="dial-row">${p.digitPool.map(d => `<div class="dial-box"><strong>Digit</strong><span>${d}</span></div>`).join('')}</div>`;
      }
      if (p.variant === 'podium') {
        return `<div class="dial-row"><div class="dial-box"><strong>Racers</strong><span>${p.n} 🏃</span></div><div class="dial-box"><strong>Medals</strong><span>${p.spots === 3 ? '🥇🥈🥉' : '🥇🥈'}</span></div></div>`;
      }
      return `<div class="combo-summary-pill" style="background:#fffdf8;border-color:#d4dec9;color:#263f37;">${p.places.join(' → ')}</div>`;
    }
    return '';
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
    if (sv) sv.innerHTML = renderStoryVisual(problem);

    const af = $('answer-fields');
    af.innerHTML = problem.answers
      .map((a, i) => `<div class="answer-row">
        <label for="answer-${i}">${a.label}</label>
        <div class="input-wrap">
          <input type="text" id="answer-${i}" inputmode="numeric" autocomplete="off" placeholder="?">
        </div>
      </div>`)
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
      });

      if (allCorrect) {
        $('feedback').className = 'feedback success';
        $('feedback').textContent = solved
          ? '✓ You’ve already earned a star for this problem. Try a new one!'
          : '★ You got it! Clever counting. One shiny star for you.';

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
          ? 'Fill in each answer box, then let’s check together.'
          : 'A little rethink! Check the highlighted answer. Step through the picture or hint for help.';
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

    nextProblem(topic === 'atLeastOne');
    updateStars();
  }

  const getState = () => ({ topic, level, problem, step, solved, stars });

  if (typeof window !== 'undefined') {
    window.CombinationsLab = { generate, stepsFor, getState, topics };
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generate, stepsFor, getState, topics };
  }
})();
