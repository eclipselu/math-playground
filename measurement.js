/**
 * Little Big Math — Time, Calendar, Money & Scales Lab
 * Covers:
 * - Bellevue IM Unit 6 (time intervals, L/mL, g/kg)
 * - China PEP Math 3A/3B (时分秒, 测量, 年月日, 24时计时法)
 * - Ontario Math Grade 3 Strand E & Strand F (Time, Metric units, Financial Literacy)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MeasurementLab = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // ---------- Data & Reference Tables ----------
  const topics = {
    elapsedTime: {
      caption: 'TIME JUMPER',
      icon: '🕒',
      title: 'Hop across the hour mark',
      badge: 'Timeline bridge hop'
    },
    calendar: {
      caption: 'CALENDAR DETECTIVE',
      icon: '📅',
      title: 'Months, leap years, and days of the week',
      badge: '7 days = 1 week cycle'
    },
    scalesBeakers: {
      caption: 'SCALES & BEAKERS',
      icon: '⚖️',
      title: 'Weigh it, pour it, convert the units',
      badge: '1 L = 1000 mL · 1 kg = 1000 g'
    },
    changeMaker: {
      caption: 'CHANGE MAKER',
      icon: '💵',
      title: 'Pay at the counter and count the change',
      badge: 'Fewest bills & coins: $20, $10, $5, $2, $1'
    }
  };

  const names = ['Tom', 'Mia', 'Sam', 'Ava', 'Leo', 'Maya', 'Lucas', 'Zoe', 'Noah', 'Elena'];

  const activities = [
    { name: 'baking banana muffins', icon: '🧁' },
    { name: 'soccer practice', icon: '⚽' },
    { name: 'reading an adventure story', icon: '📖' },
    { name: 'painting a landscape', icon: '🎨' },
    { name: 'building a wooden treehouse', icon: '🪵' },
    { name: 'playing a chess tournament', icon: '♟️' },
    { name: 'hiking the forest trail', icon: '🌲' },
    { name: 'a cartoon movie', icon: '🎬' }
  ];

  const MONTHS = [
    { name: 'January', days: 31 },
    { name: 'February', days: 28 }, // 29 in leap year
    { name: 'March', days: 31 },
    { name: 'April', days: 30 },
    { name: 'May', days: 31 },
    { name: 'June', days: 30 },
    { name: 'July', days: 31 },
    { name: 'August', days: 31 },
    { name: 'September', days: 30 },
    { name: 'October', days: 31 },
    { name: 'November', days: 30 },
    { name: 'December', days: 31 }
  ];

  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const storeItems = [
    { name: 'Sketchbook', icon: '📓', priceLo: 4, priceHi: 14 },
    { name: 'Color pencils', icon: '✏️', priceLo: 3, priceHi: 9 },
    { name: 'Watercolor kit', icon: '🎨', priceLo: 7, priceHi: 22 },
    { name: 'Board game', icon: '🎲', priceLo: 12, priceHi: 32 },
    { name: 'Storybook', icon: '📚', priceLo: 6, priceHi: 18 },
    { name: 'Toy robot', icon: '🤖', priceLo: 15, priceHi: 38 },
    { name: 'Puzzle box', icon: '🧩', priceLo: 5, priceHi: 16 },
    { name: 'Warm hoodie', icon: '🧥', priceLo: 18, priceHi: 42 }
  ];

  const scaleItems = [
    { name: 'giant watermelon', icon: '🍉', minG: 1200, maxG: 3500 },
    { name: 'golden pumpkin', icon: '🎃', minG: 800, maxG: 2800 },
    { name: 'sack of flour', icon: '🌾', minG: 1000, maxG: 3000 },
    { name: 'basket of apples', icon: '🍎', minG: 600, maxG: 2200 },
    { name: 'sweet honeydew melon', icon: '🍈', minG: 900, maxG: 2500 }
  ];

  // ---------- Helpers ----------
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = list => list[rand(0, list.length - 1)];
  const pad2 = n => String(n).padStart(2, '0');
  const fmt = n => Number(n).toLocaleString('en-US');

  function isLeapYear(year) {
    if (year % 400 === 0) return true;
    if (year % 100 === 0) return false;
    return year % 4 === 0;
  }

  function getDaysInMonth(monthIndex, year) {
    if (monthIndex === 1) return isLeapYear(year) ? 29 : 28;
    return MONTHS[monthIndex].days;
  }

  // Greedy coin change for standard Canadian / dollar denominations
  function decomposeChange(amount) {
    const denoms = [20, 10, 5, 2, 1];
    const pieces = [];
    let rem = amount;
    for (const d of denoms) {
      while (rem >= d) {
        pieces.push(d);
        rem -= d;
      }
    }
    return pieces;
  }

  // ---------- Problem Generators ----------
  function generate(kind, difficulty, original = false) {
    const name = original ? 'Mia' : pick(names);
    const p = { kind, difficulty, name };

    // ==========================================
    // 1. Elapsed Time: Clock & Timeline Jumper
    // ==========================================
    if (kind === 'elapsedTime') {
      const mode = original ? 'findEnd' : (Math.random() < 0.5 ? 'findEnd' : 'findDuration');
      p.mode = mode;
      const act = pick(activities);
      p.activity = act;

      if (difficulty === 'easy') {
        // Start hour 1-10, minute 25, 35, 40, 45, 50
        const startH = original ? 2 : rand(1, 10);
        const startM = original ? 40 : pick([25, 35, 40, 45, 50]);
        // Duration crosses the hour mark (e.g. 25-55 mins)
        const minToNext = 60 - startM;
        const durM = original ? 45 : (minToNext + pick([10, 15, 20, 25, 30]));
        const endTotalMin = startM + durM;
        const endH = startH + Math.floor(endTotalMin / 60);
        const endM = endTotalMin % 60;

        p.startH = startH;
        p.startM = startM;
        p.durM = durM;
        p.endH = endH;
        p.endM = endM;
        p.minToNext = minToNext;
        p.remAfterNext = endM;

        if (mode === 'findEnd') {
          p.story = `${name} starts <strong>${act.name}</strong> at <strong>${startH}:${pad2(startM)}</strong>. The activity lasts <strong>${durM} minutes</strong>. At what time does ${name} finish?`;
          p.answers = [
            { label: 'End hour', value: endH, suffix: '' },
            { label: 'End minute', value: endM, suffix: '' }
          ];
          p.hint = `First hop to the next o'clock (${startH + 1}:00). That takes ${minToNext} minutes. Then hop the leftover ${endM} minutes.`;
        } else {
          p.story = `${name} starts <strong>${act.name}</strong> at <strong>${startH}:${pad2(startM)}</strong> and finishes at <strong>${endH}:${pad2(endM)}</strong>. How long did the activity last?`;
          p.answers = [
            { label: 'Minutes to reach the next o’clock (' + (startH + 1) + ':00)', value: minToNext, suffix: 'min' },
            { label: 'Total minutes elapsed', value: durM, suffix: 'min' }
          ];
          p.hint = `From ${startH}:${pad2(startM)} to ${startH + 1}:00 is ${minToNext} minutes. From ${startH + 1}:00 to ${endH}:${pad2(endM)} is ${endM} minutes. Add them together.`;
        }
      } else if (difficulty === 'medium') {
        // Multi-hour or hour + minutes duration (e.g. 1 hr 25 min to 2 hr 15 min)
        const startH = rand(1, 9);
        const startM = pick([15, 20, 25, 35, 40, 45, 50]);
        const durHours = rand(1, 2);
        const durExtraM = pick([15, 20, 25, 30, 35, 40, 45]);
        const totalDurM = durHours * 60 + durExtraM;
        const minToNext = 60 - startM;
        const endTotalMin = startM + totalDurM;
        const endH = startH + Math.floor(endTotalMin / 60);
        const endM = endTotalMin % 60;

        p.startH = startH;
        p.startM = startM;
        p.durHours = durHours;
        p.durExtraM = durExtraM;
        p.durM = totalDurM;
        p.endH = endH;
        p.endM = endM;
        p.minToNext = minToNext;
        p.remAfterNext = endM;

        if (mode === 'findEnd') {
          p.story = `${name} starts <strong>${act.name}</strong> at <strong>${startH}:${pad2(startM)}</strong>. It lasts <strong>${durHours} hour${durHours > 1 ? 's' : ''} and ${durExtraM} minutes</strong> (total of <strong>${totalDurM} minutes</strong>). What time does it finish?`;
          p.answers = [
            { label: 'End hour', value: endH },
            { label: 'End minute', value: endM }
          ];
          p.hint = `Hop ${minToNext} minutes to reach ${startH + 1}:00. Then jump the full hours, and add the remaining minutes.`;
        } else {
          p.story = `${name} starts <strong>${act.name}</strong> at <strong>${startH}:${pad2(startM)}</strong> and wraps up at <strong>${endH}:${pad2(endM)}</strong>. Find the duration!`;
          p.answers = [
            { label: 'Minutes to reach the next o’clock (' + (startH + 1) + ':00)', value: minToNext, suffix: 'min' },
            { label: 'Total minutes elapsed', value: totalDurM, suffix: 'min' }
          ];
          p.hint = `Hop to ${startH + 1}:00 (${minToNext} min). Count the full hours from ${startH + 1}:00 to ${endH}:00 (${endH - startH - 1} hr = ${(endH - startH - 1) * 60} min). Then add ${endM} min.`;
        }
      } else {
        // large: 24-hour clock & afternoon crossover!
        const startH12 = rand(1, 4); // PM
        const startM = pick([25, 35, 40, 45, 50, 55]);
        const startH24 = startH12 + 12;
        const durHours = rand(1, 2);
        const durExtraM = pick([15, 25, 35, 45]);
        const totalDurM = durHours * 60 + durExtraM;
        const minToNext = 60 - startM;
        const endTotalMin = startM + totalDurM;
        const endH12 = startH12 + Math.floor(endTotalMin / 60);
        const endH24 = endH12 + 12;
        const endM = endTotalMin % 60;

        p.startH = startH12;
        p.startH24 = startH24;
        p.startM = startM;
        p.durHours = durHours;
        p.durExtraM = durExtraM;
        p.durM = totalDurM;
        p.endH = endH12;
        p.endH24 = endH24;
        p.endM = endM;
        p.minToNext = minToNext;
        p.is24h = true;

        if (mode === 'findEnd') {
          p.story = `${name} begins <strong>${act.name}</strong> at <strong>${startH12}:${pad2(startM)} PM</strong> (which is <strong>${startH24}:${pad2(startM)}</strong> in 24-hour time). It lasts <strong>${durHours} hour${durHours > 1 ? 's' : ''} and ${durExtraM} minutes</strong>. What is the end time in both 12-hour and 24-hour clocks?`;
          p.answers = [
            { label: 'End hour (12-hour clock)', value: endH12 },
            { label: 'End minute', value: endM },
            { label: 'End hour in 24-hour clock (PM = hour + 12)', value: endH24 }
          ];
          p.hint = `Add the duration using timeline hops to find ${endH12}:${pad2(endM)} PM. In 24-hour clock, PM hours after noon add 12 to the 12-hour time (${endH12} + 12 = ${endH24}).`;
        } else {
          p.story = `${name} begins at <strong>${startH24}:${pad2(startM)}</strong> (${startH12}:${pad2(startM)} PM) and finishes at <strong>${endH24}:${pad2(endM)}</strong> (${endH12}:${pad2(endM)} PM). How many minutes elapsed?`;
          p.answers = [
            { label: 'Minutes to reach the next o’clock (' + (startH24 + 1) + ':00)', value: minToNext, suffix: 'min' },
            { label: 'Total minutes elapsed', value: totalDurM, suffix: 'min' }
          ];
          p.hint = `Bridge to ${startH24 + 1}:00 with ${minToNext} minutes, then count the remaining full hours and minutes.`;
        }
      }
    }

    // ==========================================
    // 2. Calendar Detective: Months & Days
    // ==========================================
    else if (kind === 'calendar') {
      const mode = original ? 'crossMonth' : (Math.random() < 0.55 ? 'crossMonth' : 'leapYear');
      p.mode = mode;

      if (mode === 'crossMonth') {
        // Month A and Month B (adjacent)
        const monthAIndex = original ? 4 : rand(0, 10); // Jan to Nov
        const monthA = MONTHS[monthAIndex];
        const monthB = MONTHS[monthAIndex + 1];
        const year = 2026; // regular year for stability
        const daysInA = monthAIndex === 1 ? 28 : monthA.days;
        const daysInB = monthB.days;

        // Date in month A: e.g. day 15 to 25
        const dateA = original ? 18 : rand(14, daysInA - 5);
        const remA = daysInA - dateA;
        // Date in month B: day 4 to 18
        const dateB = original ? 10 : rand(4, Math.min(18, daysInB));
        const totalDays = remA + dateB;
        const fullWeeks = Math.floor(totalDays / 7);
        const remDays = totalDays % 7;

        const startWeekdayIdx = original ? 2 : rand(0, 6); // 2 = Tuesday
        const startWeekday = WEEKDAYS[startWeekdayIdx];
        const endWeekdayIdx = (startWeekdayIdx + remDays) % 7;
        const endWeekday = WEEKDAYS[endWeekdayIdx];

        p.monthA = monthA.name;
        p.monthB = monthB.name;
        p.daysInA = daysInA;
        p.daysInB = daysInB;
        p.dateA = dateA;
        p.dateB = dateB;
        p.remA = remA;
        p.totalDays = totalDays;
        p.fullWeeks = fullWeeks;
        p.remDays = remDays;
        p.startWeekday = startWeekday;
        p.endWeekday = endWeekday;

        if (difficulty === 'easy') {
          p.story = `Today is <strong>${monthA.name} ${dateA}</strong> (${monthA.name} has <strong>${daysInA} days</strong>). The school science fair is on <strong>${monthB.name} ${dateB}</strong>. How many days until the fair?`;
          p.answers = [
            { label: 'Days left in ' + monthA.name, value: remA, suffix: 'days' },
            { label: 'Total days to ' + monthB.name + ' ' + dateB, value: totalDays, suffix: 'days' },
            { label: 'Full weeks in those ' + totalDays + ' days', value: fullWeeks }
          ];
          p.hint = `Subtract ${dateA} from ${daysInA} to see how many days are left in ${monthA.name}. Then add the ${dateB} days of ${monthB.name}. Divide by 7 for full weeks.`;
        } else if (difficulty === 'medium') {
          p.story = `<strong>${monthA.name} ${dateA}</strong> is a <strong>${startWeekday}</strong> (${monthA.name} has <strong>${daysInA} days</strong>). How many days until <strong>${monthB.name} ${dateB}</strong>, and what day of the week will it be?`;
          p.answers = [
            { label: 'Total days from ' + monthA.name + ' ' + dateA + ' to ' + monthB.name + ' ' + dateB, value: totalDays, suffix: 'days' },
            { label: 'Extra days beyond full weeks (remainder of total ÷ 7)', value: remDays, suffix: 'days' },
            { type: 'choice', label: 'Day of the week on ' + monthB.name + ' ' + dateB, options: WEEKDAYS, value: endWeekday }
          ];
          p.hint = `Find total days = (${daysInA} − ${dateA}) + ${dateB} = ${totalDays}. Divide by 7: ${fullWeeks} full weeks and ${remDays} extra days. Count forward ${remDays} day${remDays === 1 ? '' : 's'} from ${startWeekday}.`;
        } else {
          // large: spans across TWO full month transitions or Leap year Feb!
          const useLeapFeb = Math.random() < 0.5;
          let m1Idx, m2Idx, yr, dIn1, dIn2, dInMid = 0, midName = '';
          if (useLeapFeb) {
            yr = 2024; // leap year
            m1Idx = 1; // Feb (29 days)
            m2Idx = 2; // March
            dIn1 = 29;
            dIn2 = 31;
          } else {
            yr = 2026;
            m1Idx = 6; // July (31 days)
            midName = 'August'; // 31 days
            dInMid = 31;
            m2Idx = 8; // September (30 days)
            dIn1 = 31;
            dIn2 = 30;
          }
          const dA = rand(15, dIn1 - 3);
          const dB = rand(5, 18);
          const rA = dIn1 - dA;
          const tot = rA + dInMid + dB;
          const fW = Math.floor(tot / 7);
          const rD = tot % 7;
          const sWIdx = rand(0, 6);
          const sW = WEEKDAYS[sWIdx];
          const eW = WEEKDAYS[(sWIdx + rD) % 7];

          p.monthA = MONTHS[m1Idx].name;
          p.monthB = MONTHS[m2Idx].name;
          p.midName = midName;
          p.daysInA = dIn1;
          p.daysInMid = dInMid;
          p.daysInB = dIn2;
          p.dateA = dA;
          p.dateB = dB;
          p.remA = rA;
          p.totalDays = tot;
          p.fullWeeks = fW;
          p.remDays = rD;
          p.startWeekday = sW;
          p.endWeekday = eW;
          p.year = yr;

          p.story = useLeapFeb
            ? `In leap year ${yr}, February has 29 days. <strong>February ${dA}</strong> is a <strong>${sW}</strong>. How many days until <strong>March ${dB}</strong>, and what day of the week will it be?`
            : `<strong>${MONTHS[m1Idx].name} ${dA}</strong> is a <strong>${sW}</strong> (${MONTHS[m1Idx].name} has ${dIn1} days, August has 31 days). How many days until <strong>${MONTHS[m2Idx].name} ${dB}</strong>, and what day of the week is it?`;
          p.answers = [
            { label: 'Total days elapsed', value: tot, suffix: 'days' },
            { label: 'Extra days beyond full weeks (total ÷ 7 remainder)', value: rD, suffix: 'days' },
            { type: 'choice', label: 'Day of the week on ' + p.monthB + ' ' + dB, options: WEEKDAYS, value: eW }
          ];
          p.hint = `Calculate: (${dIn1} − ${dA})${dInMid ? ' + ' + dInMid : ''} + ${dB} = ${tot} days. Divide ${tot} by 7 to get ${fW} full weeks and ${rD} remainder days. Advance ${rD} days from ${sW}.`;
        }
      } else {
        // leapYear puzzle
        const testYears = [
          { y: 2024, leap: true, note: 'divisible by 4' },
          { y: 2026, leap: false, note: 'not divisible by 4' },
          { y: 2028, leap: true, note: 'divisible by 4' },
          { y: 2030, leap: false, note: 'not divisible by 4' },
          { y: 2000, leap: true, note: 'century year divisible by 400' },
          { y: 2100, leap: false, note: 'century year not divisible by 400' }
        ];
        const chosen = pick(testYears);
        const y = chosen.y;
        const leap = isLeapYear(y);
        const febDays = leap ? 29 : 28;
        const totalYearDays = leap ? 366 : 365;
        const q1Days = 31 + febDays + 31; // Jan(31) + Feb + Mar(31)

        p.year = y;
        p.isLeap = leap;
        p.febDays = febDays;
        p.totalYearDays = totalYearDays;
        p.q1Days = q1Days;

        p.story = `Let's investigate the calendar for year <strong>${y}</strong>. A standard year has 365 days with 28 days in February. A leap year has 366 days with 29 days in February. (Rule: A year is a leap year if divisible by 4, but century years ending in '00' must be divisible by 400!)`;
        p.answers = [
          { type: 'choice', label: 'Is year ' + y + ' a leap year?', options: ['Leap year (366 days)', 'Normal year (365 days)'], value: leap ? 'Leap year (366 days)' : 'Normal year (365 days)' },
          { label: 'Days in February in ' + y, value: febDays, suffix: 'days' },
          { label: 'Days in Quarter 1 (Jan + Feb + Mar)', value: q1Days, suffix: 'days' }
        ];
        p.hint = y % 100 === 0
          ? `${y} ends in '00', so test if ${y} ÷ 400 has no remainder. ${leap ? '400 goes into ' + y + ' evenly!' : 'It is NOT divisible by 400!'}`
          : `Divide the last two digits of ${y} by 4: ${y % 4 === 0 ? 'divisible by 4!' : 'remainder of ' + (y % 4) + ', so not a leap year.'} January and March both have 31 days.`;
      }
    }

    // ==========================================
    // 3. Scales & Beakers: Volume and Mass
    // ==========================================
    else if (kind === 'scalesBeakers') {
      const mode = original ? 'beakers' : (Math.random() < 0.5 ? 'beakers' : 'balanceScale');
      p.mode = mode;

      if (mode === 'beakers') {
        // Graduated cylinders (mL and L)
        if (difficulty === 'easy') {
          // Friendly 100 mL multiples
          const v1 = original ? 300 : pick([200, 300, 400, 500]);
          const v2 = original ? 400 : pick([200, 300, 400]);
          const totalV = v1 + v2;
          const need1L = 1000 - totalV;

          p.v1 = v1;
          p.v2 = v2;
          p.totalV = totalV;
          p.targetL = 1;
          p.targetML = 1000;
          p.needML = need1L;

          p.story = `Beaker A holds <strong>${v1} mL</strong> of blue water and Beaker B holds <strong>${v2} mL</strong> of yellow water. Both beakers are poured together into a 1 L container. What is the total volume, and how much more water is needed to reach exactly 1 Liter (1000 mL)?`;
          p.answers = [
            { label: 'Total volume of water in mL', value: totalV, suffix: 'mL' },
            { label: 'More mL needed to reach 1 L (1000 mL)', value: need1L, suffix: 'mL' }
          ];
          p.hint = `First add ${v1} mL + ${v2} mL = ${totalV} mL. Since 1 L = 1000 mL, subtract ${totalV} mL from 1000 mL.`;
        } else if (difficulty === 'medium') {
          const v1 = pick([250, 325, 375, 420, 450]);
          const v2 = pick([225, 275, 350, 380, 425]);
          const totalV = v1 + v2;
          const need1L = 1000 - totalV;

          p.v1 = v1;
          p.v2 = v2;
          p.totalV = totalV;
          p.targetL = 1;
          p.targetML = 1000;
          p.needML = need1L;

          p.story = `Graduated cylinder A contains <strong>${v1} mL</strong> of liquid and cylinder B contains <strong>${v2} mL</strong>. When poured together into a 1-liter measuring jug, what is the combined volume, and how many milliliters are needed to fill it to the 1 L line?`;
          p.answers = [
            { label: 'Total volume in mL', value: totalV, suffix: 'mL' },
            { label: 'More mL needed to reach 1 L (1000 mL)', value: need1L, suffix: 'mL' }
          ];
          p.hint = `Add the two volumes: ${v1} + ${v2} = ${totalV} mL. Remember: 1 L = 1000 mL. Then find 1000 − ${totalV}.`;
        } else {
          // large: Multi-step with repeated cups into a 2 L container
          const startV = pick([650, 750, 850, 920]);
          const numCups = pick([3, 4]);
          const cupV = pick([175, 225, 250]);
          const cupsTotal = numCups * cupV;
          const totalV = startV + cupsTotal;
          const targetML = 2000; // 2 L
          const needML = targetML - totalV;

          p.v1 = startV;
          p.v2 = cupsTotal;
          p.numCups = numCups;
          p.cupV = cupV;
          p.cupsTotal = cupsTotal;
          p.totalV = totalV;
          p.targetL = 2;
          p.targetML = targetML;
          p.needML = needML;

          p.story = `A large 2 L dispenser already holds <strong>${startV} mL</strong> of juice. ${name} pours in <strong>${numCups} cups</strong> of juice, each containing <strong>${cupV} mL</strong>. How many mL are in the dispenser now, and how many more mL are needed to reach 2 L (2000 mL)?`;
          p.answers = [
            { label: 'Total juice in dispenser in mL', value: totalV, suffix: 'mL' },
            { label: 'More mL needed to reach 2 L (2000 mL)', value: needML, suffix: 'mL' }
          ];
          p.hint = `Calculate the cups first: ${numCups} × ${cupV} mL = ${cupsTotal} mL. Add to ${startV} mL = ${totalV} mL. Then subtract from 2000 mL (since 2 L = 2000 mL).`;
        }
      } else {
        // Balance Scale & Mass Conversions
        const item = pick(scaleItems);
        p.scaleItem = item;

        if (difficulty === 'easy') {
          // 1 melon + 200g balances 1000g or 1500g
          const leftWeight = pick([100, 200, 250, 300]);
          const rightKg = pick([1, 2]);
          const rightExtraG = pick([0, 500]);
          const rightTotalG = rightKg * 1000 + rightExtraG;
          const itemWeightG = rightTotalG - leftWeight;

          p.leftWeight = leftWeight;
          p.rightKg = rightKg;
          p.rightExtraG = rightExtraG;
          p.rightTotalG = rightTotalG;
          p.itemWeightG = itemWeightG;
          p.numItems = 1;

          p.story = `On a balanced scale, 1 <strong>${item.name}</strong> and a <strong>${leftWeight} g</strong> brass weight on the left pan balance <strong>${rightKg === 1 ? 'one 1 kg weight' : 'two 1 kg weights'}${rightExtraG ? ' plus a ' + rightExtraG + ' g weight' : ''}</strong> on the right pan. How many grams does the ${item.name} weigh?`;
          p.answers = [
            { label: 'Total weight on the right pan in grams', value: rightTotalG, suffix: 'g' },
            { label: 'Weight of the ' + item.name + ' in grams', value: itemWeightG, suffix: 'g' }
          ];
          p.hint = `Convert kilograms to grams: 1 kg = 1000 g. The right side is ${rightTotalG} g. Take away the ${leftWeight} g weight from both sides.`;
        } else if (difficulty === 'medium') {
          const leftWeight = pick([250, 350, 450, 600]);
          const rightKg = pick([2, 3]);
          const rightExtraG = pick([200, 400, 500]);
          const rightTotalG = rightKg * 1000 + rightExtraG;
          const itemWeightG = rightTotalG - leftWeight;

          p.leftWeight = leftWeight;
          p.rightKg = rightKg;
          p.rightExtraG = rightExtraG;
          p.rightTotalG = rightTotalG;
          p.itemWeightG = itemWeightG;
          p.numItems = 1;

          p.story = `A two-pan balance scale is level. The left pan holds 1 <strong>${item.name}</strong> and a <strong>${leftWeight} g</strong> weight. The right pan holds <strong>${rightKg} kg and ${rightExtraG} g</strong> of weights. What is the mass of the ${item.name} in grams?`;
          p.answers = [
            { label: 'Right pan total in grams (1 kg = 1000 g)', value: rightTotalG, suffix: 'g' },
            { label: 'Weight of the ' + item.name + ' in grams', value: itemWeightG, suffix: 'g' }
          ];
          p.hint = `First convert the right pan to grams: (${rightKg} × 1000) + ${rightExtraG} = ${rightTotalG} g. Then subtract ${leftWeight} g.`;
        } else {
          // large: 2 or 3 identical items on the left side!
          const numItems = pick([2, 3]);
          const singleWeight = pick([450, 600, 750, 800, 950]);
          const itemsTotalG = numItems * singleWeight;
          const leftWeight = pick([200, 300, 400]);
          const rightTotalG = itemsTotalG + leftWeight;
          const rightKg = Math.floor(rightTotalG / 1000);
          const rightExtraG = rightTotalG % 1000;

          p.leftWeight = leftWeight;
          p.numItems = numItems;
          p.singleWeight = singleWeight;
          p.itemsTotalG = itemsTotalG;
          p.rightKg = rightKg;
          p.rightExtraG = rightExtraG;
          p.rightTotalG = rightTotalG;
          p.itemWeightG = singleWeight;

          p.story = `On a balance scale, <strong>${numItems} identical ${item.name}s</strong> plus a <strong>${leftWeight} g</strong> weight balance <strong>${rightKg} kg and ${rightExtraG} g</strong> on the other side. What is the mass of one ${item.name} in grams?`;
          p.answers = [
            { label: 'Right pan total in grams', value: rightTotalG, suffix: 'g' },
            { label: 'Total weight of all ' + numItems + ' ' + item.name + 's in grams', value: itemsTotalG, suffix: 'g' },
            { label: 'Weight of ONE ' + item.name + ' in grams', value: singleWeight, suffix: 'g' }
          ];
          p.hint = `Right pan is ${rightTotalG} g. Remove the ${leftWeight} g extra weight to get ${itemsTotalG} g for all ${numItems} ${item.name}s. Divide by ${numItems}.`;
        }
      }
    }

    // ==========================================
    // 4. Change Maker: Coin & Bill Change Maker
    // ==========================================
    else if (kind === 'changeMaker') {
      const itemA = pick(storeItems);
      let itemB = pick(storeItems);
      while (itemB.name === itemA.name) itemB = pick(storeItems);

      let billPaid, costA, costB;

      if (difficulty === 'easy') {
        billPaid = 20;
        costA = original ? 7 : rand(itemA.priceLo, Math.min(itemA.priceHi, 9));
        costB = original ? 5 : rand(itemB.priceLo, Math.min(itemB.priceHi, 8));
        // Ensure total <= 18 so change >= 2
        while (costA + costB >= 19) {
          costA = Math.max(2, costA - 1);
          costB = Math.max(2, costB - 1);
        }
      } else if (difficulty === 'medium') {
        billPaid = 50;
        costA = rand(itemA.priceLo, itemA.priceHi);
        costB = rand(itemB.priceLo, itemB.priceHi);
        // Ensure total is between 22 and 46
        const total = costA + costB;
        if (total < 22) { costA += 10; }
        if (total > 46) { costA = Math.floor(costA * 0.7); costB = Math.floor(costB * 0.7); }
      } else {
        // large: $100 bill
        billPaid = 100;
        costA = rand(22, 48);
        costB = rand(20, 44);
        while (costA + costB >= 96) {
          costA -= 4;
          costB -= 4;
        }
      }

      const totalCost = costA + costB;
      const changeDue = billPaid - totalCost;
      const pieces = decomposeChange(changeDue);

      p.billPaid = billPaid;
      p.itemA = itemA;
      p.costA = costA;
      p.itemB = itemB;
      p.costB = costB;
      p.totalCost = totalCost;
      p.changeDue = changeDue;
      p.pieces = pieces;
      p.fewestPieces = pieces.length;

      p.story = `${name} goes to the counter and buys a <strong>${itemA.name} ($${costA})</strong> and a <strong>${itemB.name} ($${costB})</strong>. ${name} pays with a <strong>$${billPaid} bill</strong>. (Available bills and coins: $20, $10, $5 bills, and $2 toonie, $1 loonie coins). Find the total cost, change due, and fewest bills/coins needed!`;
      p.answers = [
        { label: 'Total cost of items', value: totalCost, prefix: '$' },
        { label: 'Change you get back', value: changeDue, prefix: '$' },
        { label: 'Fewest bills & coins to make that change', value: pieces.length }
      ];
      p.hint = `1) Add $${costA} + $${costB} = $${totalCost}. 2) Subtract $${totalCost} from $${billPaid} = $${changeDue} change. 3) Greedily choose the largest denomination that fits ($20, $10, $5, $2, $1).`;
    }

    else {
      throw new Error('Unknown measurement topic kind: ' + kind);
    }

    return p;
  }

  // ---------- Visual Step Builders ----------
  function renderSvgClock(h, m, label, isMystery = false) {
    const radius = 54;
    const cx = 70;
    const cy = 70;
    const hourAngle = ((h % 12) + m / 60) * 30; // 30 deg per hour
    const minAngle = m * 6; // 6 deg per minute

    // Ticks around the clock face
    let ticksHtml = '';
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const isQuarter = i % 3 === 0;
      const tx = cx + Math.cos(angle) * (radius - 12);
      const ty = cy + Math.sin(angle) * (radius - 12);
      ticksHtml += `<text x="${tx.toFixed(1)}" y="${(ty + 3.5).toFixed(1)}" text-anchor="middle" font-size="${isQuarter ? '10' : '8'}" font-weight="${isQuarter ? '700' : '500'}" fill="#4a5d52">${i}</text>`;
    }

    if (isMystery) {
      return `
        <div class="analog-clock-wrap">
          <svg class="analog-clock" viewBox="0 0 140 140" aria-label="${label}">
            <circle cx="${cx}" cy="${cy}" r="${radius}" fill="#fffdfa" stroke="#b8c6b6" stroke-width="3"/>
            ${ticksHtml}
            <circle cx="${cx}" cy="${cy}" r="4" fill="#a4b3a2"/>
            <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="28" font-weight="800" fill="#dc855a">?</text>
          </svg>
          <div class="clock-label"><strong>${label}</strong></div>
          <div class="clock-digital mystery">-- : --</div>
        </div>
      `;
    }

    // Hands coordinates
    const hRad = (hourAngle - 90) * (Math.PI / 180);
    const mRad = (minAngle - 90) * (Math.PI / 180);
    const hx = cx + Math.cos(hRad) * 28;
    const hy = cy + Math.sin(hRad) * 28;
    const mx = cx + Math.cos(mRad) * 42;
    const my = cy + Math.sin(mRad) * 42;

    return `
      <div class="analog-clock-wrap">
        <svg class="analog-clock" viewBox="0 0 140 140" aria-label="${label}: ${h}:${pad2(m)}">
          <circle cx="${cx}" cy="${cy}" r="${radius}" fill="#fffdfa" stroke="#315b48" stroke-width="3"/>
          ${ticksHtml}
          <!-- Hour hand -->
          <line x1="${cx}" y1="${cy}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#263f37" stroke-width="4.5" stroke-linecap="round"/>
          <!-- Minute hand -->
          <line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#315b48" stroke-width="3" stroke-linecap="round"/>
          <!-- Pivot center -->
          <circle cx="${cx}" cy="${cy}" r="4.5" fill="#f0cd65" stroke="#263f37" stroke-width="1.5"/>
        </svg>
        <div class="clock-label"><strong>${label}</strong></div>
        <div class="clock-digital">${h}:${pad2(m)}</div>
      </div>
    `;
  }

  function renderTimelineSvg(p, showStep) {
    // showStep: 0 = start only, 1 = first hop to next hour, 2 = full hops & end
    const w = 500;
    const yLine = 75;
    const x0 = 50;
    const xBridge = 250;
    const xEnd = 450;

    const startLabel = `${p.startH}:${pad2(p.startM)}`;
    const bridgeLabel = `${p.startH + 1}:00`;
    const endLabel = `${p.endH}:${pad2(p.endM)}`;

    let content = `
      <!-- Baseline -->
      <line x1="${x0 - 20}" y1="${yLine}" x2="${xEnd + 25}" y2="${yLine}" stroke="#8f9e8a" stroke-width="3" stroke-linecap="round"/>
      <!-- Start point -->
      <circle cx="${x0}" cy="${yLine}" r="6" fill="#315b48"/>
      <text x="${x0}" y="${yLine + 22}" text-anchor="middle" font-size="12" font-weight="700" fill="#263f37">${startLabel}</text>
      <text x="${x0}" y="${yLine + 35}" text-anchor="middle" font-size="10" fill="#66746a">Start</text>
    `;

    if (showStep >= 1) {
      // First hop curve
      content += `
        <path d="M ${x0} ${yLine - 6} Q ${(x0 + xBridge) / 2} 20 ${xBridge} ${yLine - 6}" fill="none" stroke="#dc855a" stroke-width="3.5" stroke-dasharray="4,2"/>
        <circle cx="${(x0 + xBridge) / 2}" cy="22" r="14" fill="#f5d2b7" stroke="#dc855a" stroke-width="1.5"/>
        <text x="${(x0 + xBridge) / 2}" y="26" text-anchor="middle" font-size="10" font-weight="800" fill="#8c492a">+${p.minToNext}m</text>
        <!-- Bridge point -->
        <circle cx="${xBridge}" cy="${yLine}" r="6" fill="#dc855a"/>
        <text x="${xBridge}" y="${yLine + 22}" text-anchor="middle" font-size="12" font-weight="700" fill="#8c492a">${bridgeLabel}</text>
        <text x="${xBridge}" y="${yLine + 35}" text-anchor="middle" font-size="10" fill="#66746a">Next hour</text>
      `;
    }

    if (showStep >= 2) {
      // Second hop curve
      const remM = p.durM - p.minToNext;
      content += `
        <path d="M ${xBridge} ${yLine - 6} Q ${(xBridge + xEnd) / 2} 20 ${xEnd} ${yLine - 6}" fill="none" stroke="#315b48" stroke-width="3.5"/>
        <circle cx="${(xBridge + xEnd) / 2}" cy="22" r="14" fill="#dcebea" stroke="#315b48" stroke-width="1.5"/>
        <text x="${(xBridge + xEnd) / 2}" y="26" text-anchor="middle" font-size="10" font-weight="800" fill="#234636">+${remM}m</text>
        <!-- End point -->
        <circle cx="${xEnd}" cy="${yLine}" r="6" fill="#315b48"/>
        <text x="${xEnd}" y="${yLine + 22}" text-anchor="middle" font-size="12" font-weight="700" fill="#263f37">${endLabel}</text>
        <text x="${xEnd}" y="${yLine + 35}" text-anchor="middle" font-size="10" fill="#66746a">Finish</text>
      `;
    }

    return `
      <div class="timeline-container">
        <svg class="timeline-svg" viewBox="0 0 520 125" role="img" aria-label="Timeline from ${startLabel} to ${endLabel}">
          ${content}
        </svg>
      </div>
    `;
  }

  function renderBeakersSvg(v1, v2, targetML, revealCombined = false) {
    const scale = (ml, max) => (ml / max) * 110;
    const h1 = scale(v1, 1000);
    const h2 = scale(v2, 1000);
    const maxCombo = targetML || 1000;
    const comboH = scale(v1 + v2, maxCombo);

    // Graduated cylinder tick marks
    const ticksForMax = max => {
      let t = '';
      const step = max === 2000 ? 500 : 200;
      for (let m = step; m <= max; m += step) {
        const y = 140 - scale(m, max);
        t += `<line x1="38" y1="${y}" x2="48" y2="${y}" stroke="#7e9487" stroke-width="1.5"/><text x="34" y="${y + 3}" text-anchor="end" font-size="8" fill="#52685c">${m}</text>`;
      }
      return t;
    };

    return `
      <div class="beaker-stage">
        <!-- Beaker A -->
        <div class="beaker-unit">
          <svg viewBox="0 0 90 160" class="cylinder-svg" aria-label="Beaker A: ${v1} mL">
            <rect x="25" y="20" width="50" height="120" rx="6" fill="#f4f7f2" stroke="#8fa89b" stroke-width="2.5"/>
            <!-- Liquid -->
            <rect x="27" y="${140 - h1}" width="46" height="${h1}" rx="3" fill="#6eaee5" opacity="0.85"/>
            <ellipse cx="50" cy="${140 - h1}" rx="23" ry="3.5" fill="#5798d1"/>
            ${ticksForMax(1000)}
            <text x="50" y="15" text-anchor="middle" font-size="10" font-weight="700" fill="#2b4739">Beaker A</text>
          </svg>
          <div class="beaker-reading"><strong>${v1} mL</strong></div>
        </div>

        <div class="beaker-plus">+</div>

        <!-- Beaker B -->
        <div class="beaker-unit">
          <svg viewBox="0 0 90 160" class="cylinder-svg" aria-label="Beaker B: ${v2} mL">
            <rect x="25" y="20" width="50" height="120" rx="6" fill="#f4f7f2" stroke="#8fa89b" stroke-width="2.5"/>
            <!-- Liquid -->
            <rect x="27" y="${140 - h2}" width="46" height="${h2}" rx="3" fill="#f2c94c" opacity="0.85"/>
            <ellipse cx="50" cy="${140 - h2}" rx="23" ry="3.5" fill="#dfb332"/>
            ${ticksForMax(1000)}
            <text x="50" y="15" text-anchor="middle" font-size="10" font-weight="700" fill="#2b4739">Beaker B</text>
          </svg>
          <div class="beaker-reading"><strong>${v2} mL</strong></div>
        </div>

        <div class="beaker-arrow">→</div>

        <!-- Combined Beaker -->
        <div class="beaker-unit combo">
          <svg viewBox="0 0 110 160" class="cylinder-svg" aria-label="Combined: ${revealCombined ? v1 + v2 + ' mL' : '?'}">
            <rect x="25" y="20" width="60" height="120" rx="8" fill="#f4f7f2" stroke="#315b48" stroke-width="3"/>
            ${revealCombined ? `
              <!-- Combined liquid -->
              <rect x="28" y="${140 - comboH}" width="54" height="${comboH}" rx="4" fill="#52a084" opacity="0.85"/>
              <ellipse cx="55" cy="${140 - comboH}" rx="27" ry="4" fill="#3e836b"/>
              <!-- Gap to top mark -->
              <rect x="28" y="20" width="54" height="${120 - comboH}" fill="#e8eee5" stroke="#dc855a" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6"/>
            ` : `
              <text x="55" y="85" text-anchor="middle" font-size="28" font-weight="800" fill="#dc855a">?</text>
            `}
            ${ticksForMax(maxCombo)}
            <text x="55" y="15" text-anchor="middle" font-size="10" font-weight="700" fill="#2b4739">${maxCombo === 2000 ? '2 L (2000 mL)' : '1 L (1000 mL)'}</text>
          </svg>
          <div class="beaker-reading"><strong>${revealCombined ? (v1 + v2) + ' mL' : 'Combined'}</strong></div>
        </div>
      </div>
    `;
  }

  function renderBalanceScaleSvg(p, revealKgAsG = false, isolateItem = false) {
    const leftText = isolateItem ? '' : `+ ${p.leftWeight} g`;
    const rightDisplay = revealKgAsG
      ? `${p.rightTotalG} g`
      : `${p.rightKg} kg${p.rightExtraG ? ' ' + p.rightExtraG + ' g' : ''}`;

    return `
      <div class="balance-stage">
        <svg viewBox="0 0 460 210" class="balance-svg" aria-label="Two pan balance scale">
          <!-- Fulcrum triangle -->
          <polygon points="230,135 210,185 250,185" fill="#667a6e" stroke="#263f37" stroke-width="2.5"/>
          <rect x="180" y="185" width="100" height="12" rx="4" fill="#315b48"/>
          <!-- Pointer -->
          <line x1="230" y1="135" x2="230" y2="90" stroke="#dc855a" stroke-width="3" stroke-linecap="round"/>
          <circle cx="230" cy="135" r="5" fill="#f0cd65" stroke="#263f37" stroke-width="1.5"/>

          <!-- Horizontal Beam -->
          <line x1="70" y1="110" x2="390" y2="110" stroke="#263f37" stroke-width="5" stroke-linecap="round"/>

          <!-- Left Pan assembly -->
          <line x1="70" y1="110" x2="35" y2="155" stroke="#7e9487" stroke-width="2"/>
          <line x1="70" y1="110" x2="105" y2="155" stroke="#7e9487" stroke-width="2"/>
          <ellipse cx="70" cy="155" rx="45" ry="10" fill="#d9e3d8" stroke="#315b48" stroke-width="2.5"/>

          <!-- Left Pan items -->
          <text x="55" y="148" font-size="28" text-anchor="middle">${p.scaleItem.icon}</text>
          ${p.numItems > 1 ? `<text x="75" y="148" font-size="18" font-weight="800" fill="#263f37">×${p.numItems}</text>` : ''}
          ${!isolateItem ? `
            <!-- Left extra brass weight -->
            <rect x="86" y="132" width="22" height="18" rx="3" fill="#e0b853" stroke="#8c6a1e" stroke-width="1.5"/>
            <text x="97" y="144" font-size="7" font-weight="800" text-anchor="middle" fill="#4d3b10">${p.leftWeight}g</text>
          ` : `
            <!-- Cross out indicator -->
            <text x="97" y="144" font-size="10" font-weight="800" text-anchor="middle" fill="#dc855a">✓ isolated</text>
          `}

          <!-- Right Pan assembly -->
          <line x1="390" y1="110" x2="355" y2="155" stroke="#7e9487" stroke-width="2"/>
          <line x1="390" y1="110" x2="425" y2="155" stroke="#7e9487" stroke-width="2"/>
          <ellipse cx="390" cy="155" rx="45" ry="10" fill="#d9e3d8" stroke="#315b48" stroke-width="2.5"/>

          <!-- Right Weights -->
          <rect x="365" y="122" width="30" height="28" rx="4" fill="#d4af37" stroke="#705b18" stroke-width="2"/>
          <text x="380" y="138" font-size="9" font-weight="800" text-anchor="middle" fill="#3d300a">${p.rightKg} kg</text>
          ${p.rightExtraG ? `
            <rect x="400" y="132" width="22" height="18" rx="3" fill="#e0b853" stroke="#8c6a1e" stroke-width="1.5"/>
            <text x="411" y="144" font-size="7" font-weight="800" text-anchor="middle" fill="#4d3b10">${p.rightExtraG}g</text>
          ` : ''}

          <!-- Labels under pans -->
          <text x="70" y="180" text-anchor="middle" font-size="11" font-weight="700" fill="#263f37">Left Pan ${leftText}</text>
          <text x="390" y="180" text-anchor="middle" font-size="11" font-weight="700" fill="#263f37">Right: ${rightDisplay}</text>
        </svg>
      </div>
    `;
  }

  function renderReceiptAndMoney(p, stepNum) {
    const pieces = p.pieces;
    const pieceBadges = pieces.map(piece => {
      if (piece >= 5) {
        const bgClass = piece === 20 ? 'bill-20' : piece === 10 ? 'bill-10' : 'bill-5';
        return `<span class="cash-bill ${bgClass}">$${piece}</span>`;
      }
      return `<span class="cash-coin coin-${piece}">$${piece}</span>`;
    }).join(' ');

    return `
      <div class="money-visual-wrap">
        <!-- Store Receipt -->
        <div class="store-receipt">
          <div class="receipt-header">
            <strong>★ CORNER SHOP ★</strong>
            <small>Official Cash Receipt</small>
          </div>
          <div class="receipt-line">
            <span>${p.itemA.icon} ${p.itemA.name}</span>
            <strong>$${p.costA}</strong>
          </div>
          <div class="receipt-line">
            <span>${p.itemB.icon} ${p.itemB.name}</span>
            <strong>$${p.costB}</strong>
          </div>
          <div class="receipt-line total-line">
            <span>Total Cost</span>
            <strong>$${p.totalCost}</strong>
          </div>
          <div class="receipt-line">
            <span>Paid (Bill)</span>
            <strong>$${p.billPaid}</strong>
          </div>
          <div class="receipt-line change-line">
            <span>Change Due</span>
            <strong>$${p.changeDue}</strong>
          </div>
        </div>

        <!-- Cash Count Breakdown -->
        <div class="money-breakdown">
          ${stepNum >= 2 ? `
            <div class="cash-tokens-card">
              <strong>Fewest bills & coins (${pieces.length} pieces):</strong>
              <div class="cash-tokens-row">${pieceBadges}</div>
              <small>Decomposed greedily from largest ($20, $10, $5) to smallest ($2, $1).</small>
            </div>
          ` : `
            <div class="counting-up-card">
              <strong>Counting up trick:</strong>
              <div class="count-up-line">
                <span class="count-spot">$${p.totalCost}</span>
                <span class="count-arrow">→ +$${p.changeDue} →</span>
                <span class="count-spot target">$${p.billPaid}</span>
              </div>
              <small>Start at Total Cost and add up until you reach what was paid.</small>
            </div>
          `}
        </div>
      </div>
    `;
  }

  function stepsFor(p) {
    // ----------------------------------------------------
    // 1. elapsedTime Steps
    // ----------------------------------------------------
    if (p.kind === 'elapsedTime') {
      const startClock = renderSvgClock(p.startH, p.startM, 'Start Clock');
      const endClock = renderSvgClock(p.endH, p.endM, 'Finish Clock', false);
      const mysteryClock = renderSvgClock(p.endH, p.endM, 'Finish Clock', true);

      return [
        {
          title: 'See the starting clock',
          description: `${p.name} starts ${p.activity.name} at ${p.startH}:${pad2(p.startM)}. Look at the clock hands and see how many minutes remain until the hour strikes ${p.startH + 1}:00.`,
          diagram: `<div class="clock-duo">${startClock} ${p.mode === 'findEnd' ? mysteryClock : endClock}</div>`,
          equation: `60 minutes in a full hour`
        },
        {
          title: 'Bridge to the next whole hour',
          description: `Hop from ${p.startH}:${pad2(p.startM)} to ${p.startH + 1}:00. It takes exactly 60 − ${p.startM} = ${p.minToNext} minutes to reach the top of the hour.`,
          diagram: renderTimelineSvg(p, 1),
          equation: `60 min − ${p.startM} min = ${p.minToNext} min (to reach ${p.startH + 1}:00)`
        },
        {
          title: 'Hop the remaining minutes',
          description: `After reaching ${p.startH + 1}:00, take the remaining hop of ${p.durM - p.minToNext} minutes to reach ${p.endH}:${pad2(p.endM)}.`,
          diagram: renderTimelineSvg(p, 2),
          equation: `${p.minToNext} min + ${p.durM - p.minToNext} min = ${p.durM} min total duration`
        },
        {
          title: 'Verify the finish time',
          description: `The start time ${p.startH}:${pad2(p.startM)} plus ${p.durM} minutes brings us cleanly to ${p.endH}:${pad2(p.endM)}${p.is24h ? ` (${p.endH24}:${pad2(p.endM)} in 24-hour time)` : ''}!`,
          diagram: `<div class="clock-duo">${startClock} ${endClock}</div>`,
          equation: `${p.startH}:${pad2(p.startM)} + ${p.durM} min = ${p.endH}:${pad2(p.endM)} ✓`
        }
      ];
    }

    // ----------------------------------------------------
    // 2. calendar Steps
    // ----------------------------------------------------
    if (p.kind === 'calendar') {
      if (p.mode === 'crossMonth') {
        const monthList = [
          'Jan (31)', 'Feb (28/29)', 'Mar (31)', 'Apr (30)',
          'May (31)', 'Jun (30)', 'Jul (31)', 'Aug (31)',
          'Sep (30)', 'Oct (31)', 'Nov (30)', 'Dec (31)'
        ];
        const monthChips = monthList.map(m => `<span class="month-chip ${m.includes('31') ? 'big-month' : 'small-month'}">${m}</span>`).join('');

        return [
          {
            title: 'Count days left in the start month',
            description: `${p.monthA} has ${p.daysInA} days. We are at ${p.monthA} ${p.dateA}. Subtract ${p.dateA} from ${p.daysInA} to find how many days are left in ${p.monthA}.`,
            diagram: `
              <div class="calendar-visual-box">
                <div class="month-rule-chips">${monthChips}</div>
                <div class="date-hop-card">
                  <div class="hop-col"><strong>${p.monthA} ${p.dateA}</strong><span>Start date</span></div>
                  <div class="hop-arrow-col"><span>+${p.remA} days left</span>→</div>
                  <div class="hop-col"><strong>${p.monthA} ${p.daysInA}</strong><span>End of month</span></div>
                </div>
              </div>
            `,
            equation: `${p.daysInA} days in ${p.monthA} − ${p.dateA} = ${p.remA} days remaining`
          },
          {
            title: 'Add the days in the target month',
            description: `Now add the days up to ${p.monthB} ${p.dateB}. Total days = ${p.remA} (from ${p.monthA}) + ${p.dateB} (in ${p.monthB}) = ${p.totalDays} days.`,
            diagram: `
              <div class="calendar-visual-box">
                <div class="date-hop-card highlight">
                  <div class="hop-col"><strong>${p.remA} days</strong><span>Left in ${p.monthA}</span></div>
                  <div class="hop-arrow-col"><span>+</span></div>
                  <div class="hop-col"><strong>${p.dateB} days</strong><span>In ${p.monthB}</span></div>
                  <div class="hop-arrow-col"><span>=</span></div>
                  <div class="hop-col"><strong>${p.totalDays} days</strong><span>Total elapsed</span></div>
                </div>
              </div>
            `,
            equation: `${p.remA} + ${p.dateB} = ${p.totalDays} total days`
          },
          {
            title: 'Group into 7-day week cycles',
            description: `Every 7 days returns to the exact same day of the week! Divide ${p.totalDays} by 7: ${p.totalDays} ÷ 7 = ${p.fullWeeks} full weeks with a remainder of ${p.remDays} extra days.`,
            diagram: `
              <div class="calendar-visual-box">
                <div class="week-cycles">
                  ${Array.from({ length: p.fullWeeks }, (_, i) => `<div class="week-block"><span>Week ${i + 1}</span><strong>7 days</strong></div>`).join('')}
                  ${p.remDays ? `<div class="week-block remainder"><span>Remainder</span><strong>+${p.remDays} days</strong></div>` : ''}
                </div>
              </div>
            `,
            equation: `${p.totalDays} days = (${p.fullWeeks} × 7) + ${p.remDays}`
          },
          {
            title: 'Advance to the target weekday',
            description: `Since ${p.fullWeeks} full weeks land back on ${p.startWeekday}, advance forward by the ${p.remDays} extra days: ${p.startWeekday} + ${p.remDays} days = ${p.endWeekday}!`,
            diagram: `
              <div class="weekday-flow">
                <span class="day-node start">${p.startWeekday}</span>
                <span class="day-arrow">+${p.remDays} days →</span>
                <span class="day-node end">${p.endWeekday}</span>
              </div>
            `,
            equation: `${p.startWeekday} + ${p.remDays} day${p.remDays === 1 ? '' : 's'} = ${p.endWeekday} ✓`
          }
        ];
      } else {
        // Leap year puzzle steps
        return [
          {
            title: 'Check the leap year rule',
            description: `Most years have 365 days and February has 28 days. A leap year has 366 days and February has 29 days. Years divisible by 4 are leap years (century years ending in 00 must be divisible by 400).`,
            diagram: `
              <div class="leap-rule-card">
                <div class="rule-box ${p.isLeap ? 'active' : ''}">
                  <strong>${p.year}</strong>
                  <span>${p.isLeap ? 'Divisible by ' + (p.year % 100 === 0 ? '400' : '4') + '!' : 'Not a leap year'}</span>
                </div>
              </div>
            `,
            equation: `${p.year} is a ${p.isLeap ? 'Leap Year (366 days)' : 'Normal Year (365 days)'}`
          },
          {
            title: 'Determine February days',
            description: `In ${p.year}, February has ${p.febDays} days. This extra leap day is added to keep the calendar in sync with Earth's orbit around the sun.`,
            diagram: `
              <div class="feb-card">
                <strong>February in ${p.year}</strong>
                <span class="big-day-count">${p.febDays} days</span>
              </div>
            `,
            equation: `February ${p.year} = ${p.febDays} days`
          },
          {
            title: 'Calculate Quarter 1 total',
            description: `Quarter 1 consists of January (31 days) + February (${p.febDays} days) + March (31 days).`,
            diagram: `
              <div class="date-hop-card">
                <div class="hop-col"><strong>31</strong><span>Jan</span></div>
                <div class="hop-arrow-col">+</div>
                <div class="hop-col"><strong>${p.febDays}</strong><span>Feb</span></div>
                <div class="hop-arrow-col">+</div>
                <div class="hop-col"><strong>31</strong><span>Mar</span></div>
                <div class="hop-arrow-col">=</div>
                <div class="hop-col"><strong>${p.q1Days}</strong><span>Quarter 1</span></div>
              </div>
            `,
            equation: `31 + ${p.febDays} + 31 = ${p.q1Days} days in Quarter 1 ✓`
          }
        ];
      }
    }

    // ----------------------------------------------------
    // 3. scalesBeakers Steps
    // ----------------------------------------------------
    if (p.kind === 'scalesBeakers') {
      if (p.mode === 'beakers') {
        return [
          {
            title: 'Read each graduated beaker',
            description: `Beaker A holds ${p.v1} mL and Beaker B holds ${p.v2} mL. Each small mark shows 100 mL of liquid.`,
            diagram: renderBeakersSvg(p.v1, p.v2, p.targetML, false),
            equation: `Beaker A: ${p.v1} mL · Beaker B: ${p.v2} mL`
          },
          {
            title: 'Pour them together into one container',
            description: `Add the two liquid volumes: ${p.v1} mL + ${p.v2} mL = ${p.totalV} mL total.`,
            diagram: renderBeakersSvg(p.v1, p.v2, p.targetML, true),
            equation: `${p.v1} mL + ${p.v2} mL = ${p.totalV} mL`
          },
          {
            title: 'Convert liters to milliliters',
            description: `Recall the metric golden rule: 1 Liter = 1000 milliliters. So ${p.targetL} L = ${p.targetML} mL.`,
            diagram: `
              <div class="conversion-pill">
                <strong>1 L = 1000 mL</strong>
                <span>${p.targetL} L = ${p.targetML} mL</span>
              </div>
            `,
            equation: `${p.targetL} L = ${p.targetML} mL`
          },
          {
            title: 'Find how much more to fill it',
            description: `To reach the ${p.targetL} L (${p.targetML} mL) mark, subtract the current liquid from the goal: ${p.targetML} − ${p.totalV} = ${p.needML} mL!`,
            diagram: renderBeakersSvg(p.v1, p.v2, p.targetML, true),
            equation: `${p.targetML} mL − ${p.totalV} mL = ${p.needML} mL needed ✓`
          }
        ];
      } else {
        // Balance scale steps
        return [
          {
            title: 'See the balanced scale',
            description: `The scale is in perfect balance! That means the total mass on the left pan equals the total mass on the right pan.`,
            diagram: renderBalanceScaleSvg(p, false, false),
            equation: `Left Pan (${p.numItems} ${p.scaleItem.name}${p.numItems > 1 ? 's' : ''} + ${p.leftWeight} g) = Right Pan (${p.rightKg} kg${p.rightExtraG ? ' ' + p.rightExtraG + ' g' : ''})`
          },
          {
            title: 'Convert the right pan to grams',
            description: `1 kilogram = 1000 grams. So ${p.rightKg} kg = ${p.rightKg * 1000} g. Total on the right is (${p.rightKg} × 1000) + ${p.rightExtraG || 0} = ${p.rightTotalG} g.`,
            diagram: renderBalanceScaleSvg(p, true, false),
            equation: `(${p.rightKg} × 1000 g) + ${p.rightExtraG || 0} g = ${p.rightTotalG} g`
          },
          {
            title: 'Remove the extra weight from both pans',
            description: `Take away the ${p.leftWeight} g weight from both sides of the balance. The scale stays balanced!`,
            diagram: renderBalanceScaleSvg(p, true, true),
            equation: `${p.rightTotalG} g − ${p.leftWeight} g = ${p.itemsTotalG || p.itemWeightG} g`
          },
          {
            title: 'Calculate the weight of one ' + p.scaleItem.name,
            description: p.numItems > 1
              ? `All ${p.numItems} identical ${p.scaleItem.name}s weigh ${p.itemsTotalG} g together. Divide by ${p.numItems} to find the mass of one ${p.scaleItem.name}: ${p.itemsTotalG} ÷ ${p.numItems} = ${p.singleWeight} g.`
              : `The 1 ${p.scaleItem.name} weighs exactly ${p.itemWeightG} g!`,
            diagram: renderBalanceScaleSvg(p, true, true),
            equation: p.numItems > 1
              ? `${p.itemsTotalG} g ÷ ${p.numItems} = ${p.singleWeight} g ✓`
              : `1 ${p.scaleItem.name} = ${p.itemWeightG} g ✓`
          }
        ];
      }
    }

    // ----------------------------------------------------
    // 4. changeMaker Steps
    // ----------------------------------------------------
    if (p.kind === 'changeMaker') {
      const pieceDetails = p.pieces.map(pc => `$${pc}`).join(' + ');

      return [
        {
          title: 'Calculate the total purchase cost',
          description: `Add the prices of both items together: $${p.costA} for the ${p.itemA.name} + $${p.costB} for the ${p.itemB.name} = $${p.totalCost}.`,
          diagram: renderReceiptAndMoney(p, 1),
          equation: `$${p.costA} + $${p.costB} = $${p.totalCost} total cost`
        },
        {
          title: 'Subtract from the bill paid',
          description: `${p.name} pays with a $${p.billPaid} bill. Subtract the total cost from the payment to find the change due: $${p.billPaid} − $${p.totalCost} = $${p.changeDue}.`,
          diagram: renderReceiptAndMoney(p, 2),
          equation: `$${p.billPaid} − $${p.totalCost} = $${p.changeDue} change due`
        },
        {
          title: 'Greedy change: fewest bills & coins',
          description: `To hand back the fewest pieces, always pick the largest denomination that fits ($20, $10, $5, $2, $1). Decomposed: ${pieceDetails} = $${p.changeDue} in ${p.pieces.length} pieces.`,
          diagram: renderReceiptAndMoney(p, 3),
          equation: `${pieceDetails} = $${p.changeDue} (${p.pieces.length} bills/coins)`
        },
        {
          title: 'Verify the transaction',
          description: `Total cost ($${p.totalCost}) + Change ($${p.changeDue}) = $${p.billPaid} bill paid. Everything balances to the penny!`,
          diagram: renderReceiptAndMoney(p, 3),
          equation: `$${p.totalCost} + $${p.changeDue} = $${p.billPaid} ✓`
        }
      ];
    }

    return [];
  }

  // ---------- Browser Interactive Logic ----------
  let topic = 'elapsedTime';
  let level = 'easy';
  let problem = null;
  let step = 0;
  let solved = false;
  let stars = 0;

  try {
    stars = Math.max(0, Number(localStorage.getItem('little-big-math-stars')) || 0);
  } catch (_) {}

  function getState() {
    return { topic, level, problem, step, solved, stars };
  }

  // If in pure Node environment (without DOM), return generators and methods
  if (typeof document === 'undefined') {
    return { generate, stepsFor, getState };
  }

  // DOM Elements selector
  const $ = id => document.getElementById(id);

  function updateStars() {
    const starEl = $('star-count');
    if (starEl) starEl.textContent = fmt(stars);
    const progress = stars && stars % 10 === 0 ? 10 : stars % 10;
    const fillEl = $('progress-fill');
    if (fillEl) fillEl.style.width = progress * 10 + '%';
    const track = document.querySelector('.progress-track');
    if (track) track.setAttribute('aria-label', `${progress} of 10 stars toward a celebration`);
  }

  function renderStep() {
    if (!problem) return;
    const steps = stepsFor(problem);
    if (!steps || steps.length === 0) return;
    const current = steps[step];

    const titleEl = $('visual-title');
    if (titleEl) titleEl.textContent = current.title;

    const descEl = $('step-description');
    if (descEl) descEl.textContent = current.description;

    const diagEl = $('diagram');
    if (diagEl) diagEl.innerHTML = current.diagram;

    const eqEl = $('equation');
    if (eqEl) eqEl.textContent = current.equation;

    const dotsEl = $('step-dots');
    if (dotsEl) {
      dotsEl.innerHTML = steps.map((_, i) =>
        `<button class="step-dot" data-step="${i}" aria-label="Step ${i + 1}: ${steps[i].title}" ${i === step ? 'aria-current="step"' : ''}></button>`
      ).join('');
    }

    const prevBtn = $('previous-step');
    if (prevBtn) prevBtn.disabled = step === 0;

    const nextBtn = $('next-step');
    if (nextBtn) nextBtn.textContent = step === steps.length - 1 ? 'Try a new problem ↻' : 'Show the next step →';

    const noteEl = $('visual-note');
    if (noteEl) {
      noteEl.textContent = `Step ${step + 1} of ${steps.length} · ${
        step === steps.length - 1
          ? 'Check your answer, or try another problem.'
          : 'Take your time. You can try an answer at any step.'
      }`;
    }

    const badgeEl = $('picture-badge');
    if (badgeEl) badgeEl.textContent = topics[topic]?.badge || 'Visual math';
  }

  function renderProblem() {
    step = 0;
    solved = false;
    const meta = topics[topic];
    if (!meta) return;

    const captionEl = $('topic-caption');
    if (captionEl) captionEl.textContent = meta.caption;

    const iconEl = $('story-icon');
    if (iconEl) iconEl.textContent = meta.icon;

    const titleEl = $('problem-title');
    if (titleEl) titleEl.textContent = meta.title;

    const storyEl = $('story');
    if (storyEl) storyEl.innerHTML = problem.story;

    const fieldsEl = $('answer-fields');
    if (fieldsEl) {
      fieldsEl.innerHTML = problem.answers.map((a, i) => {
        if (a.type === 'choice') {
          return `
            <div class="answer-row">
              <label for="answer-${i}">${a.label}</label>
              <div class="input-wrap choice-wrap">
                <select id="answer-${i}" name="answer-${i}" class="measurement-select" aria-describedby="feedback" aria-invalid="false">
                  <option value="">Select an answer...</option>
                  ${a.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
              </div>
            </div>
          `;
        }
        return `
          <div class="answer-row">
            <label for="answer-${i}">${a.label}</label>
            <div class="input-wrap">
              ${a.prefix ? `<span aria-hidden="true">${a.prefix}</span>` : ''}
              <input id="answer-${i}" name="answer-${i}" type="text" inputmode="numeric" autocomplete="off" placeholder="?" aria-describedby="feedback" aria-invalid="false">
              ${a.suffix ? `<span class="unit-suffix">${a.suffix}</span>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    const fbEl = $('feedback');
    if (fbEl) {
      fbEl.textContent = '';
      fbEl.className = 'feedback';
    }

    const hintEl = $('hint');
    const hintBtn = $('hint-button');
    if (hintEl && hintBtn) {
      hintEl.hidden = true;
      hintEl.textContent = problem.hint;
      hintBtn.setAttribute('aria-expanded', 'false');
      hintBtn.setAttribute('aria-controls', 'hint');
    }

    document.querySelectorAll('.topic').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.topic === topic));
    });

    renderStep();
  }

  function nextProblem() {
    const previous = problem ? JSON.stringify(problem.answers) : '';
    for (let i = 0; i < 15; i++) {
      problem = generate(topic, level);
      if (JSON.stringify(problem.answers) !== previous) break;
    }
    renderProblem();
  }

  // Answer validation
  const answerForm = $('answer-form');
  if (answerForm) {
    answerForm.addEventListener('submit', event => {
      event.preventDefault();
      let allCorrect = true;
      let empty = false;
      let firstWrong = null;

      problem.answers.forEach((ans, i) => {
        const input = $('answer-' + i);
        if (!input) return;

        let correct = false;
        if (ans.type === 'choice') {
          const val = input.value;
          if (!val) empty = true;
          correct = val === ans.value;
        } else {
          const raw = input.value.trim().replace(/[$,\s]/g, '');
          if (!raw) empty = true;
          const validNum = /^-?\d+(\.0+)?$/.test(raw);
          correct = validNum && Number(raw) === ans.value;
        }

        input.setAttribute('aria-invalid', String(!correct));
        if (!correct) {
          allCorrect = false;
          firstWrong ??= input;
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
            ? 'Fill in each answer, then let’s check together.'
            : 'A little rethink! Check the highlighted answer. The picture or hint can help.';
        }
        if (firstWrong) firstWrong.focus();
      }
    });
  }

  // Topic Buttons
  document.querySelectorAll('.topic').forEach(button => {
    button.addEventListener('click', () => {
      topic = button.dataset.topic;
      history.replaceState(null, '', '#' + topic);
      nextProblem();
    });
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
      const keys = Object.keys(topics).filter(k => k !== topic);
      topic = pick(keys);
      history.replaceState(null, '', '#' + topic);
      nextProblem();
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

  const prevStepBtn = $('previous-step');
  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      if (step > 0) {
        step--;
        renderStep();
      }
    });
  }

  const nextStepBtn = $('next-step');
  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      const steps = stepsFor(problem);
      if (step < steps.length - 1) {
        step++;
        renderStep();
      } else {
        nextProblem();
      }
    });
  }

  const stepDotsEl = $('step-dots');
  if (stepDotsEl) {
    stepDotsEl.addEventListener('click', e => {
      const dot = e.target.closest('[data-step]');
      if (dot) {
        step = Number(dot.dataset.step);
        renderStep();
      }
    });
  }

  // Handle URL hash deep linking
  const hash = decodeURIComponent(location.hash.slice(1));
  if (Object.hasOwn(topics, hash)) {
    topic = hash;
  }
  window.addEventListener('hashchange', () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (Object.hasOwn(topics, h) && h !== topic) {
      topic = h;
      nextProblem();
    }
  });

  // Initial load
  nextProblem();
  updateStars();

  return { generate, stepsFor, getState };
});
