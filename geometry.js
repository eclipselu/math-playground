(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const G = window.GeometryModel;

  // ==========================================
  // Star Economy & Shared State
  // ==========================================
  let stars = 0;
  try {
    stars = Math.max(0, Number(localStorage.getItem('little-big-math-stars')) || 0);
  } catch (_) {}

  function updateStars() {
    const starEl = $('star-count');
    if (starEl) starEl.textContent = stars.toLocaleString('en-US');
    const fillEl = $('progress-fill');
    if (fillEl) {
      const progress = stars && stars % 10 === 0 ? 10 : stars % 10;
      fillEl.style.width = (progress * 10) + '%';
      const track = document.querySelector('.progress-track');
      if (track) track.setAttribute('aria-label', `${progress} of 10 stars toward a celebration`);
    }
  }

  function showCelebration(totalStars) {
    const cel = $('celebration');
    if (!cel) return;
    cel.textContent = `🌟 ${totalStars.toLocaleString('en-US')} stars! Look how much your thinking has grown! 🌱`;
    cel.classList.add('visible');
    setTimeout(() => cel.classList.remove('visible'), 5000);
  }

  // ==========================================
  // Part 1: 3D Solids Explorer (Prisms & Pyramids)
  // ==========================================
  let family = location.hash === '#pyramid' ? 'pyramid' : 'prism';
  let base = 'triangle', mode = 'shape', lesson = 'build', yaw = -0.55, tilt = 0.42, spread = 0, mystery = false, mysterySolved = false;
  let solid = G.build(family, base), drag = null, suppressClick = false;
  const marked = { faces: new Set(), edges: new Set(), vertices: new Set() };
  const plural = { faces: 'faces', edges: 'edges', vertices: 'vertices' };
  const single = { faces: 'Face', edges: 'Edge', vertices: 'Corner' };
  const counts = () => ({ faces: solid.faces.length, edges: solid.edges.length, vertices: solid.vertices.length });

  function clearMarks() { Object.values(marked).forEach(set => set.clear()); }

  function selectShape(nextFamily, nextBase) {
    family = nextFamily; base = nextBase; solid = G.build(family, base); clearMarks(); spread = 0; $('spread').value = '0';
    $('base-shape').value = base; yaw = -0.55; tilt = 0.42;
    $('guess-faces').value = ''; $('guess-edges').value = ''; $('guess-vertices').value = '';
    ['faces', 'edges', 'vertices'].forEach(kind => $('guess-' + kind).setAttribute('aria-invalid', 'false'));
    $('quiz-feedback').textContent = ''; $('reveal-counts').hidden = true;
    $('quiz-question').textContent = `${mystery ? 'Your mystery is' : 'Explore'} a ${solid.name.toLowerCase()}. How many faces, edges, and vertices does it have?`;
    render();
  }

  function lessons() {
    const n = solid.n, prism = family === 'prism';
    return {
      build: {
        title: prism ? 'Copy the base. Join the corners.' : 'Start with a base. Add one tip.',
        text: prism
          ? `Imagine two matching ${G.bases[base].name.toLowerCase()}s. Lift one above the other and join the matching corners. The bases stay the same shape and size. Each side between them is a rectangle in this prism.`
          : `Imagine a ${G.bases[base].name.toLowerCase()} on the table. Put one tip above it. Join every corner of the base to that tip. Each side you make is a triangle.`,
        equation: prism ? '2 matching bases + rectangle sides' : '1 base + triangle sides + 1 tip'
      },
      faces: {
        title: prism ? 'Two bases, then the sides' : 'One base, then the triangles',
        text: prism
          ? `There are 2 matching bases. The base has ${n} edges, and each one has a rectangle side attached to it. Count ${n} rectangle sides, then add the 2 bases.`
          : `There is 1 base. Its ${n} edges each have a triangle attached to them. Count ${n} triangle sides, then add the base underneath.`,
        equation: prism ? `2 bases + ${n} sides = ${n + 2} faces` : `1 base + ${n} triangles = ${n + 1} faces`
      },
      edges: {
        title: prism ? 'Around, around, then join' : 'Around the base, then up to the tip',
        text: prism
          ? `Trace ${n} edges around the bottom base. Trace ${n} more around the top base. Now count the ${n} edges that join the matching corners. Each edge belongs to two faces, so count the line only once.`
          : `Trace the ${n} edges around the base. Then follow the ${n} edges going from the base corners to the tip. Count each line only once, including the ones hidden at the back.`,
        equation: prism ? `${n} bottom + ${n} top + ${n} joining = ${3 * n} edges` : `${n} base + ${n} to the tip = ${2 * n} edges`
      },
      vertices: {
        title: prism ? 'Corners on both matching bases' : 'Base corners, plus just one tip',
        text: prism
          ? `Tap the ${n} corners of the bottom base. The matching top base has ${n} more. Every marked dot is one vertex. There is no extra corner in the middle of a face.`
          : `Tap the ${n} corners of the base. All the triangle sides share ONE tip, so count that tip only once. A point used by several faces is still just one vertex.`,
        equation: prism ? `${n} bottom + ${n} top = ${2 * n} vertices` : `${n} base corners + 1 tip = ${n + 1} vertices`
      }
    };
  }

  function setMode(next) { mode = next; if (mode !== 'shape') lesson = mode; render(); }

  function mark(index) {
    if (mode === 'shape') return;
    const source = document.activeElement;
    const control = source && source.dataset ? source.dataset.count : undefined;
    const onShape = source && source.dataset ? source.dataset.part : undefined;
    const set = marked[mode];
    if (set.has(index)) set.delete(index); else set.add(index);
    render();
    if (control !== undefined) {
      const button = $('part-buttons').querySelector(`[data-count="${control}"]`);
      if (button) button.focus({ preventScroll: true });
    } else if (onShape !== undefined) {
      const part = $('solid-view').querySelector(`[data-part="${onShape}"]`);
      if (part) part.focus({ preventScroll: true });
    }
  }

  function drawBase() {
    const ring = solid.vertices.slice(0, solid.n);
    const points = ring.map(p => `${85 + p[0] * 40},${60 + p[2] * 35}`).join(' ');
    $('base-preview').innerHTML = `<polygon points="${points}" fill="#efd270" stroke="#917329" stroke-width="2"/>${ring.map((p, i) => `<circle cx="${85 + p[0] * 40}" cy="${60 + p[2] * 35}" r="4" fill="#8057af"/><text x="${85 + p[0] * 48}" y="${65 + p[2] * 44}" text-anchor="middle" font-size="12" fill="#263f37">${i + 1}</text>`).join('')}`;
    $('base-preview').setAttribute('aria-label', `${G.bases[base].name} base with ${solid.n} sides and ${solid.n} corners`);
    $('base-name').textContent = `A ${G.bases[base].name.toLowerCase()} base`;
    $('base-description').textContent = `${solid.n} sides. ${solid.n} corners. The base gives this solid its name. A base can face any direction when you turn the solid.`;
  }

  function renderSolid() {
    const scale = 87 - 24 * spread;
    const project = p => { const r = G.rotate(p, yaw, tilt); return [280 + r[0] * scale, 188 - r[1] * scale, r[2]]; };
    const rotated = solid.vertices.map(project);
    const front = solid.faces.map(face => G.rotate(face.normal, yaw, tilt)[2] > 0.0001);
    const xray = $('xray').checked;
    const colorBases = $('color-bases').checked;
    const pieces = [];
    const faceDraw = solid.faces.map(face => {
      const offset = face.normal.map(v => v * spread * 1.1);
      const points = face.indices.map(i => project(solid.vertices[i].map((v, j) => v + offset[j])));
      const center = project(face.center.map((v, j) => v + offset[j]));
      return { face, points, center, depth: center[2] };
    }).sort((a, b) => a.depth - b.depth);

    for (const { face, points } of faceDraw) {
      if (!front[face.id] && !xray && spread === 0) continue;
      const selected = marked.faces.has(face.id);
      const fill = mode === 'faces' && selected ? '#aa82d0' : face.base && colorBases ? '#ebcd69' : '#b7ce9e';
      const opacity = xray ? (front[face.id] ? 0.48 : 0.2) : front[face.id] ? 0.94 : 0.6;
      const attributes = mode === 'faces' ? `class="solid-part" data-part="${face.id}" role="button" tabindex="0" aria-pressed="${selected}" aria-label="Face ${face.id + 1}: ${face.label}${!front[face.id] ? ', at the back' : ''}"` : '';
      pieces.push(`<polygon points="${points.map(p => p.slice(0, 2).join(',')).join(' ')}" fill="${fill}" fill-opacity="${opacity}" stroke="${spread > 0 ? '#5c7750' : 'none'}" stroke-width="2" ${attributes}/>`);
    }

    if (spread === 0) {
      const sortedEdges = [...solid.edges].sort((a, b) => Number(a.faces.some(f => front[f])) - Number(b.faces.some(f => front[f])));
      sortedEdges.forEach(edge => {
        const a = rotated[edge.a], b = rotated[edge.b], visible = edge.faces.some(f => front[f]);
        const selected = marked.edges.has(edge.id), active = mode === 'edges';
        const color = active ? (selected ? '#b16b39' : '#d19066') : visible ? '#42613c' : '#7f9475';
        const attrs = active ? `class="solid-part" data-part="${edge.id}" role="button" tabindex="0" aria-label="Edge ${edge.id + 1}: ${edge.group}${visible ? '' : ', hidden at the back'}" aria-pressed="${selected}"` : '';
        if (active) pieces.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="transparent" stroke-width="16" ${attrs}/>`);
        pieces.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${active ? selected ? 5 : 3.5 : 2.2}" ${visible ? '' : 'stroke-dasharray="6 6"'} pointer-events="none"/>`);
        if (active) {
          const x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2;
          pieces.push(`<text x="${x + 6}" y="${y - 7}" class="solid-label">${edge.id + 1}${selected ? ' ✓' : ''}</text>`);
        }
      });
    }

    if (mode === 'faces') faceDraw.forEach(({ face, center }) => { if (front[face.id] || xray || spread > 0) pieces.push(`<text x="${center[0]}" y="${center[1] + 4}" text-anchor="middle" class="solid-label">${face.id + 1}${marked.faces.has(face.id) ? ' ✓' : ''}</text>`); });

    if (mode === 'vertices' && spread === 0) rotated.forEach((p, i) => {
      const visible = solid.faces.some(f => f.indices.includes(i) && front[f.id]);
      const selected = marked.vertices.has(i);
      pieces.push(`<circle cx="${p[0]}" cy="${p[1]}" r="${selected ? 9 : 7}" fill="${selected ? '#8057af' : visible ? '#d6c0ec' : '#fffdf6'}" stroke="#8057af" stroke-width="2.5" ${visible ? '' : 'stroke-dasharray="3 2"'} class="solid-part" data-part="${i}" role="button" tabindex="0" aria-label="Corner ${i + 1}${family === 'pyramid' && i === solid.n ? ': the tip' : ''}${visible ? '' : ', at the back'}" aria-pressed="${selected}"/>`);
      pieces.push(`<text x="${p[0] + 12}" y="${p[1] - 9}" class="solid-label">${i + 1}${selected ? ' ✓' : ''}</text>`);
    });

    $('solid-view').innerHTML = pieces.join('');
    $('solid-view').setAttribute('aria-label', `${solid.name}. ${mode === 'shape' ? 'Drag or use arrow keys to turn it.' : `Choose numbered ${plural[mode]} to mark them as counted.`} ${spread > 0 ? 'Faces are pulled apart.' : ''}`);
  }

  function renderCount() {
    $('count-panel').hidden = mode === 'shape';
    if (mode === 'shape') return;
    const total = counts()[mode], amount = marked[mode].size;
    $('count-progress').textContent = `${amount}${mystery ? '' : ' of ' + total} ${plural[mode]} marked${amount === total ? ' · All found!' : ''}`;
    $('count-help').textContent = mode === 'faces' ? 'Tap a face or its button below. Pull the faces apart to find the hidden base and sides.' : mode === 'edges' ? 'Trace a numbered line, then tap it or its button. Dashed lines at the back count too.' : 'Tap every numbered dot or its button. Hollow dots are corners at the back. A pyramid’s tip counts just once.';
    const parts = mode === 'faces' ? solid.faces : mode === 'edges' ? solid.edges : solid.vertices;
    $('part-buttons').innerHTML = parts.map((part, i) => {
      const detail = mode === 'faces' ? part.label : mode === 'edges' ? part.group : family === 'pyramid' && i === solid.n ? 'Tip' : i < solid.n ? 'Bottom corner' : 'Top corner';
      return `<button data-count="${i}" aria-pressed="${marked[mode].has(i)}" aria-label="${single[mode]} ${i + 1}: ${detail}">${i + 1}${marked[mode].has(i) ? ' ✓' : ''}${mode === 'faces' ? ' · ' + detail : ''}</button>`;
    }).join('');
  }

  function render() {
    $('solid-name').textContent = solid.name;
    $('solid-story').textContent = family === 'prism' ? `Like two matching shapes joined together. This prism has ${G.bases[base].name.toLowerCase()} bases and rectangle sides.` : `Like a ${G.bases[base].name.toLowerCase()} with a tip above it. Its triangle sides all meet at that one tip.`;
    document.querySelectorAll('[data-family]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.family === family)));
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    document.querySelectorAll('[data-lesson]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lesson === lesson)));
    drawBase();
    const teaching = lessons()[lesson];
    $('lesson-title').textContent = mystery ? 'Your counting challenge' : teaching.title;
    $('lesson-text').textContent = mystery ? 'Try counting it yourself first. Mark the parts so each one is counted once. You can still rotate the shape and peek behind it.' : teaching.text;
    $('lesson-equation').textContent = mystery ? 'Count bases, sides, lines, and corners.' : teaching.equation;
    Object.entries(counts()).forEach(([kind, value]) => $('total-' + kind).textContent = mystery ? '?' : value);
    $('notice').textContent = base === 'rectangle' || base === 'square' ? `A square and a rectangle both have 4 sides. Their ${family}s have the same numbers of faces, edges, and vertices, even when they look different.` : `Change the base to a ${solid.n === 3 ? 'pentagon' : 'triangle'}. What happens to the number of sides, and then to the solid’s parts?`;
    $('stage-note').textContent = spread > 0 ? 'Faces pulled apart · Turn to peek behind them' : 'Drag to turn · Arrow keys work too';
    renderSolid(); renderCount();
  }

  document.querySelectorAll('[data-family]').forEach(b => b.addEventListener('click', () => { mystery = false; selectShape(b.dataset.family, base); }));
  $('base-shape').addEventListener('change', () => { mystery = false; selectShape(family, $('base-shape').value); });
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { if ((b.dataset.mode === 'edges' || b.dataset.mode === 'vertices') && spread > 0) { spread = 0; $('spread').value = '0'; } setMode(b.dataset.mode); }));
  document.querySelectorAll('[data-lesson]').forEach(b => b.addEventListener('click', () => { lesson = b.dataset.lesson; if (lesson !== 'build') { mode = lesson; spread = 0; $('spread').value = '0'; } render(); }));
  $('color-bases').addEventListener('change', renderSolid); $('xray').addEventListener('change', renderSolid);
  $('spread').addEventListener('input', () => { spread = Number($('spread').value) / 100; if (spread > 0) { mode = 'faces'; lesson = 'faces'; } render(); });
  $('part-buttons').addEventListener('click', event => { const b = event.target.closest('[data-count]'); if (b) mark(Number(b.dataset.count)); });
  $('clear-count').addEventListener('click', () => { marked[mode].clear(); render(); });
  const turn = direction => { if (direction === 'left') yaw -= 0.25; if (direction === 'right') yaw += 0.25; if (direction === 'up') tilt = Math.min(1.45, tilt + 0.18); if (direction === 'down') tilt = Math.max(-1.45, tilt - 0.18); renderSolid(); };
  document.querySelectorAll('[data-turn]').forEach(b => b.addEventListener('click', () => turn(b.dataset.turn)));
  $('reset-view').addEventListener('click', () => { yaw = -0.55; tilt = 0.42; renderSolid(); });

  $('solid-view').addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const part = event.target.closest('[data-part]');
    drag = { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, part: part ? Number(part.dataset.part) : null };
    suppressClick = false;
    $('solid-view').setPointerCapture(event.pointerId);
  });
  $('solid-view').addEventListener('pointermove', event => {
    if (!drag) return;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 6) suppressClick = true;
    if (suppressClick) {
      yaw += (event.clientX - drag.lastX) * 0.012;
      tilt = Math.max(-1.45, Math.min(1.45, tilt + (event.clientY - drag.lastY) * 0.009));
      renderSolid();
    }
    drag.lastX = event.clientX; drag.lastY = event.clientY;
  });
  $('solid-view').addEventListener('pointerup', () => {
    const part = drag && !suppressClick ? drag.part : null;
    drag = null;
    if (part !== null) { mark(part); suppressClick = true; }
  });
  $('solid-view').addEventListener('pointercancel', () => { drag = null; suppressClick = false; });
  $('solid-view').addEventListener('click', event => {
    if (suppressClick) { suppressClick = false; return; }
    const part = event.target.closest('[data-part]');
    if (part) mark(Number(part.dataset.part));
  });
  $('solid-view').addEventListener('keydown', event => {
    const directions = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    if (directions[event.key]) { event.preventDefault(); turn(directions[event.key]); }
    else if (event.key === 'Enter' || event.key === ' ') {
      const part = event.target.closest('[data-part]');
      if (part) { event.preventDefault(); mark(Number(part.dataset.part)); }
    }
  });

  $('new-mystery').addEventListener('click', () => {
    const choices = Object.keys(G.bases).flatMap(b => ['prism', 'pyramid'].map(f => [f, b])).filter(([f, b]) => f !== family || b !== base);
    const choice = choices[Math.floor(Math.random() * choices.length)];
    mystery = true; mysterySolved = false; mode = 'shape'; lesson = 'build'; selectShape(...choice);
    $('quiz-question').textContent = `Your mystery is a ${solid.name.toLowerCase()}. Explore it above. How many faces, edges, and vertices does it have?`;
    $('reveal-counts').hidden = false;
    $('solid-name').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  });

  $('geometry-quiz').addEventListener('submit', event => {
    event.preventDefault();
    let all = true, empty = false, first;
    for (const [kind, total] of Object.entries(counts())) {
      const input = $('guess-' + kind), raw = input.value.trim(), correct = /^\d+$/.test(raw) && Number(raw) === total;
      if (!raw) empty = true;
      input.setAttribute('aria-invalid', String(!correct));
      if (!correct) { all = false; first ??= input; }
    }
    $('quiz-feedback').className = all ? 'success' : 'try';
    if (all) {
      if (mystery && !mysterySolved) {
        mysterySolved = true;
        stars++;
        updateStars();
        try { localStorage.setItem('little-big-math-stars', String(stars)); } catch (_) {}
        if (stars % 10 === 0) showCelebration(stars);
      }
      mystery = false; render();
      $('quiz-feedback').textContent = '★ All three counts are right! One shiny star earned. Now use the counting lessons above to explain how you know.';
    } else {
      $('quiz-feedback').textContent = empty ? 'Fill in all three counts. Take your time and use the picture.' : 'Almost there! Recount the highlighted parts. Check the hidden base, edges at the back, and the shared tip.';
      first.focus();
    }
    $('reveal-counts').hidden = false;
  });

  $('reveal-counts').addEventListener('click', () => {
    mystery = false; lesson = 'faces'; mode = 'faces'; render();
    $('quiz-feedback').className = '';
    $('quiz-feedback').textContent = 'Start with Faces above, then choose Edges and Corners. Each lesson shows a way to count.';
  });


  // ==========================================
  // Part 2: Shape Detective Challenges Workspace
  // ==========================================
  const CHALLENGE_KINDS = ['quads', 'views', 'nets', 'symmetry'];
  let challengeTopic = 'quads';
  let challengeLevel = 'easy';
  let challengeProblem = null;
  let challengeStep = 0;
  let challengeSolved = false;

  function renderChallengeFields() {
    const p = challengeProblem;
    const container = $('answer-fields');
    if (!container) return;

    container.innerHTML = p.answers.map((a, i) => {
      if (a.type === 'choice') {
        return `
          <fieldset class="choice-field" id="field-${i}">
            <legend>${a.label}</legend>
            <div class="choices">
              ${a.options.map((opt, oIdx) => `
                <label class="choice">
                  <input type="radio" name="answer-${i}" value="${opt}" id="ans-${i}-${oIdx}">
                  <span>${opt}</span>
                </label>
              `).join('')}
            </div>
          </fieldset>
        `;
      } else {
        return `
          <div class="answer-row" id="field-${i}">
            <label for="ans-${i}">${a.label}</label>
            <div class="input-wrap">
              <input type="text" id="ans-${i}" inputmode="numeric" autocomplete="off" placeholder="?">
            </div>
          </div>
        `;
      }
    }).join('');
  }

  function renderChallengeStep() {
    const p = challengeProblem;
    const steps = G.stepsFor(p);
    if (!steps || steps.length === 0) return;

    if (challengeStep >= steps.length) challengeStep = steps.length - 1;
    if (challengeStep < 0) challengeStep = 0;

    const current = steps[challengeStep];
    $('step-description').innerHTML = current.description;
    $('diagram').innerHTML = current.diagram;
    $('equation').innerHTML = current.equation || '';

    // Step dots
    $('step-dots').innerHTML = steps.map((_, idx) => `
      <button class="step-dot" data-step="${idx}" aria-label="Step ${idx + 1}" ${idx === challengeStep ? 'aria-current="step"' : ''}></button>
    `).join('');

    $('previous-step').disabled = challengeStep === 0;
    $('next-step').textContent = challengeStep < steps.length - 1 ? 'Show the next step →' : 'Try a new problem ↻';
  }

  function renderChallengeProblem() {
    const p = challengeProblem;
    if (!p) return;

    $('topic-caption').textContent = p.caption;
    $('problem-title').textContent = p.title;
    $('story-icon').textContent = p.icon;
    $('story').innerHTML = p.story;
    $('story-visual').innerHTML = p.storyVisual || '';
    $('picture-badge').textContent = p.badge || 'Look for clues';

    $('hint').textContent = p.hint;
    $('hint').hidden = true;
    $('hint-button').setAttribute('aria-expanded', 'false');

    $('feedback').textContent = '';
    $('feedback').className = 'feedback';

    renderChallengeFields();
    challengeStep = 0;
    renderChallengeStep();

    // Sync difficulty selector
    if ($('difficulty')) $('difficulty').value = challengeLevel;

    // Sync active topic button
    document.querySelectorAll('.topic').forEach(b => {
      const isCurrent = b.dataset.topic === challengeTopic;
      b.setAttribute('aria-pressed', String(isCurrent));
    });
  }

  function nextChallengeProblem() {
    challengeSolved = false;
    challengeProblem = G.generate(challengeTopic, challengeLevel);
    renderChallengeProblem();
  }

  // Answer validation
  $('answer-form').addEventListener('submit', event => {
    event.preventDefault();
    const p = challengeProblem;
    let allCorrect = true;
    let empty = false;
    let firstWrong = null;

    p.answers.forEach((a, i) => {
      let isOk = false;
      let focusEl = null;

      if (a.type === 'choice') {
        const checked = document.querySelector(`input[name="answer-${i}"]:checked`);
        if (!checked) empty = true;
        isOk = Boolean(checked) && checked.value === a.value;
        const fieldset = $(`field-${i}`);
        if (fieldset) fieldset.setAttribute('aria-invalid', String(!isOk));
        focusEl = checked || $(`ans-${i}-0`);
      } else {
        const input = $(`ans-${i}`);
        const raw = input ? input.value.trim() : '';
        if (!raw) empty = true;
        const num = /^-?\d+$/.test(raw) ? Number(raw) : NaN;
        isOk = !isNaN(num) && num === a.value;
        if (input) input.setAttribute('aria-invalid', String(!isOk));
        focusEl = input;
      }

      if (!isOk) {
        allCorrect = false;
        firstWrong ??= focusEl;
      }
    });

    if (allCorrect) {
      $('feedback').className = 'feedback success';
      if (!challengeSolved) {
        challengeSolved = true;
        stars++;
        updateStars();
        try { localStorage.setItem('little-big-math-stars', String(stars)); } catch (_) {}
        if (stars % 10 === 0) showCelebration(stars);
        $('feedback').textContent = '★ You got it! Great shape detective work. One shiny star for you.';
      } else {
        $('feedback').textContent = '✓ You’ve already earned a star for this one. Try a new problem!';
      }
    } else {
      $('feedback').className = 'feedback try';
      $('feedback').textContent = empty
        ? 'Fill in all answers, then let’s check together.'
        : 'A little rethink! Check the highlighted answer. The picture and clues can help.';
      if (firstWrong && typeof firstWrong.focus === 'function') firstWrong.focus();
    }
  });

  // Clear aria-invalid on input
  $('answer-fields').addEventListener('input', e => {
    if (e.target && e.target.hasAttribute('aria-invalid')) {
      e.target.setAttribute('aria-invalid', 'false');
    }
  });
  $('answer-fields').addEventListener('change', e => {
    const fieldset = e.target.closest('.choice-field');
    if (fieldset) fieldset.setAttribute('aria-invalid', 'false');
  });

  // Controls for challenge workspace
  if ($('difficulty')) {
    $('difficulty').addEventListener('change', e => {
      challengeLevel = e.target.value;
      nextChallengeProblem();
    });
  }

  $('new-button').addEventListener('click', nextChallengeProblem);

  $('hint-button').addEventListener('click', () => {
    const isHidden = $('hint').hidden;
    $('hint').hidden = !isHidden;
    $('hint-button').setAttribute('aria-expanded', String(isHidden));
  });

  $('previous-step').addEventListener('click', () => {
    if (challengeStep > 0) {
      challengeStep--;
      renderChallengeStep();
    }
  });

  $('next-step').addEventListener('click', () => {
    const steps = G.stepsFor(challengeProblem);
    if (challengeStep < steps.length - 1) {
      challengeStep++;
      renderChallengeStep();
    } else {
      nextChallengeProblem();
    }
  });

  $('step-dots').addEventListener('click', e => {
    const dot = e.target.closest('[data-step]');
    if (dot) {
      challengeStep = Number(dot.dataset.step);
      renderChallengeStep();
    }
  });

  $('mix-button').addEventListener('click', () => {
    const others = CHALLENGE_KINDS.filter(k => k !== challengeTopic);
    const chosen = others[Math.floor(Math.random() * others.length)];
    setTopic(chosen);
  });

  function setTopic(newTopic, shouldScroll = true) {
    if (newTopic === 'prism' || newTopic === 'pyramid') {
      mystery = false;
      selectShape(newTopic, base);
      history.replaceState(null, '', '#' + newTopic);
      document.querySelectorAll('.topic').forEach(b => {
        b.setAttribute('aria-pressed', String(b.dataset.topic === newTopic));
      });
      if (shouldScroll) {
        const el = $('solid-explorer');
        if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      }
      return;
    }

    if (CHALLENGE_KINDS.includes(newTopic)) {
      challengeTopic = newTopic;
      history.replaceState(null, '', '#' + newTopic);
      nextChallengeProblem();
      if (shouldScroll) {
        const el = $('challenge-workspace');
        if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      }
    }
  }

  document.querySelectorAll('.topic').forEach(b => {
    b.addEventListener('click', () => setTopic(b.dataset.topic));
  });

  // Handle URL hash changes
  function syncHash(shouldScroll = false) {
    const hash = location.hash.slice(1);
    if (hash === 'prism' || hash === 'pyramid') {
      selectShape(hash, base);
      document.querySelectorAll('.topic').forEach(b => {
        b.setAttribute('aria-pressed', String(b.dataset.topic === hash));
      });
      if (shouldScroll) {
        const el = $('solid-explorer');
        if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      }
    } else if (CHALLENGE_KINDS.includes(hash)) {
      challengeTopic = hash;
      nextChallengeProblem();
      if (shouldScroll) {
        const el = $('challenge-workspace');
        if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      }
    }
  }

  window.addEventListener('hashchange', () => syncHash(true));

  // Initialize
  render();
  updateStars();

  const initHash = location.hash.slice(1);
  if (CHALLENGE_KINDS.includes(initHash)) {
    challengeTopic = initHash;
  }
  nextChallengeProblem();

  // Export for automated verification and inspection
  window.ShapeDetective = {
    generate: G.generate,
    stepsFor: G.stepsFor,
    getState: () => ({
      family,
      base,
      mode,
      lesson,
      counts: counts(),
      mystery,
      marked: Object.fromEntries(Object.entries(marked).map(([k, v]) => [k, [...v]])),
      topic: challengeTopic,
      level: challengeLevel,
      problem: challengeProblem,
      step: challengeStep,
      stars,
      solved: challengeSolved
    })
  };
})();
