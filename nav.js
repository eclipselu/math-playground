(() => {
  'use strict';

  const ADVENTURES = [
    { href: 'index.html', label: '🏠 Home: All Adventures' },
    { href: 'word-problems.html', label: '📖 Word Problems & Logic' },
    { href: 'multiply-divide.html', label: '🧮 Multiply, Divide & Remainders' },
    { href: 'area-perimeter.html', label: '📐 Area & Perimeter Studio' },
    { href: 'fractions.html', label: '🍰 Fractions & Decimals Lab' },
    { href: 'geometry.html', label: '🔷 Shape Detective' },
    { href: 'measurement.html', label: '🕒 Time, Calendar, Money & Scales' },
    { href: 'data-coding.html', label: '🤖 Data, Compass & Robot Coding' },
    { href: 'probability.html', label: '🎲 Chance Lab' }
  ];

  const practice = document.querySelector('.practice');
  const topicGroups = document.querySelector('.topic-groups');
  const sectionHeading = practice ? practice.querySelector('.section-heading') : null;
  const workspace = document.querySelector('.workspace');
  if (!practice || !topicGroups || !workspace) return;

  const topicButtons = Array.from(topicGroups.querySelectorAll('.topic[data-topic]'));
  if (!topicButtons.length) return;

  const reducedMotion = () =>
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const smoothScrollTo = el => {
    if (!el || typeof el.scrollIntoView !== 'function') return;
    el.scrollIntoView({
      behavior: reducedMotion() ? 'instant' : 'smooth',
      block: 'start'
    });
  };

  // 1. Enhance topbar with a quick Adventure Switcher
  const topbarRight = document.querySelector('.topbar-right');
  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (topbarRight && !topbarRight.querySelector('.adventure-switcher')) {
    const switcher = document.createElement('select');
    switcher.className = 'adventure-switcher';
    switcher.setAttribute('aria-label', 'Switch adventure');
    ADVENTURES.forEach(adv => {
      const opt = document.createElement('option');
      opt.value = adv.href;
      opt.textContent = adv.label;
      if (adv.href.toLowerCase() === currentFile) opt.selected = true;
      switcher.appendChild(opt);
    });
    switcher.addEventListener('change', () => {
      if (switcher.value) location.href = switcher.value;
    });
    topbarRight.insertBefore(switcher, topbarRight.firstChild);
  }

  // 2. Build metadata for each topic button & group
  const groupsMeta = Array.from(topicGroups.querySelectorAll('.topic-group')).map(groupEl => {
    const titleEl = groupEl.querySelector('.topic-group-title');
    const smallEl = titleEl ? titleEl.querySelector('small') : null;
    let groupTitle = titleEl ? titleEl.textContent : 'Topics';
    if (smallEl) {
      groupTitle = groupTitle.replace(smallEl.textContent, '').trim();
    }
    const items = Array.from(groupEl.querySelectorAll('.topic[data-topic]')).map(btn => {
      const key = btn.dataset.topic;
      const iconEl = btn.querySelector('.topic-icon');
      const strongEl = btn.querySelector('strong');
      const icon = iconEl ? iconEl.textContent.trim() : '✦';
      const name = strongEl ? strongEl.textContent.trim() : key;
      return { key, icon, name, btn, groupTitle };
    });
    return { groupTitle, items };
  });

  const flatTopics = groupsMeta.flatMap(g => g.items);

  // 3. Create the Workspace Navigation Bar right above .workspace
  const navBar = document.createElement('nav');
  navBar.className = 'workspace-nav';
  navBar.setAttribute('aria-label', 'Topic navigation');

  const optionsHtml = groupsMeta
    .map(
      g =>
        `<optgroup label="${g.groupTitle.replace(/"/g, '&quot;')}">` +
        g.items
          .map(item => `<option value="${item.key}">${item.icon} ${item.name}</option>`)
          .join('') +
        `</optgroup>`
    )
    .join('');

  const stripHtml = flatTopics
    .map(
      item =>
        `<button type="button" class="strip-chip" data-strip-topic="${item.key}">` +
        `<span aria-hidden="true">${item.icon}</span> <span>${item.name}</span>` +
        `</button>`
    )
    .join('');

  navBar.innerHTML = `
    <div class="workspace-nav-top">
      <button type="button" class="back-to-topics-btn" id="toggle-topics-btn" aria-expanded="true">
        <span class="back-to-topics-icon" aria-hidden="true">⊞</span>
        <span id="toggle-topics-label">All topics</span>
        <span class="topic-count-badge">${flatTopics.length}</span>
      </button>
      <div class="quick-topic-picker">
        <label for="quick-topic-select" class="sr-only">Current topic</label>
        <select id="quick-topic-select" class="quick-topic-select" aria-label="Jump to topic">
          ${optionsHtml}
        </select>
      </div>
      <div class="workspace-nav-actions">
        <button type="button" class="nav-pill-btn" id="prev-topic-btn" aria-label="Previous topic" title="Previous topic">‹ Prev</button>
        <button type="button" class="nav-pill-btn" id="next-topic-btn" aria-label="Next topic" title="Next topic">Next ›</button>
        <button type="button" class="nav-pill-btn surprise-pill" id="workspace-mix-btn" title="Pick a random topic">🎲 Surprise me</button>
      </div>
    </div>
    <div class="quick-topic-strip" id="quick-topic-strip" role=" list" aria-label="Quick topic switcher">
      ${stripHtml}
    </div>
  `;

  topicGroups.insertAdjacentElement('afterend', navBar);

  // 4. Add an inline "← All topics" button right inside .problem-card .card-top (and #solid-explorer)
  const problemCardTop = workspace.querySelector('.problem-card .card-top');
  if (problemCardTop) {
    const captionEl = problemCardTop.querySelector('#topic-caption');
    if (captionEl) {
      const leftWrap = document.createElement('div');
      leftWrap.className = 'card-top-left';
      const inlineBackBtn = document.createElement('button');
      inlineBackBtn.type = 'button';
      inlineBackBtn.className = 'inline-topics-btn';
      inlineBackBtn.innerHTML = '← All topics';
      inlineBackBtn.title = 'Show all topics in this adventure';
      inlineBackBtn.addEventListener('click', () => setTopicsOpen(true, true));
      captionEl.parentNode.insertBefore(leftWrap, captionEl);
      leftWrap.appendChild(inlineBackBtn);
      leftWrap.appendChild(captionEl);
    }
  }

  const solidControls = document.querySelector('#solid-explorer .shape-controls');
  if (solidControls) {
    const inlineSolidBack = document.createElement('button');
    inlineSolidBack.type = 'button';
    inlineSolidBack.className = 'inline-topics-btn';
    inlineSolidBack.innerHTML = '← All topics';
    inlineSolidBack.addEventListener('click', () => setTopicsOpen(true, true));
    solidControls.insertBefore(inlineSolidBack, solidControls.firstChild);
  }

  // Add a "Jump to problem ↓" button in .section-heading when topics are expanded
  let closeHeadingBtn = null;
  if (sectionHeading) {
    const rightGroup = document.createElement('div');
    rightGroup.className = 'section-heading-actions';
    const existingMix = sectionHeading.querySelector('#mix-button');
    closeHeadingBtn = document.createElement('button');
    closeHeadingBtn.type = 'button';
    closeHeadingBtn.className = 'jump-workspace-btn';
    closeHeadingBtn.innerHTML = 'Back to problem ↓';
    closeHeadingBtn.addEventListener('click', () => setTopicsOpen(false, true));
    if (existingMix) {
      sectionHeading.insertBefore(rightGroup, existingMix);
      rightGroup.appendChild(existingMix);
    } else {
      sectionHeading.appendChild(rightGroup);
    }
    rightGroup.appendChild(closeHeadingBtn);
  }

  const toggleBtn = document.getElementById('toggle-topics-btn');
  const toggleLabel = document.getElementById('toggle-topics-label');
  const quickSelect = document.getElementById('quick-topic-select');
  const quickStrip = document.getElementById('quick-topic-strip');
  const prevTopicBtn = document.getElementById('prev-topic-btn');
  const nextTopicBtn = document.getElementById('next-topic-btn');
  const workspaceMixBtn = document.getElementById('workspace-mix-btn');

  function getActiveTopicKey() {
    const pressed = topicButtons.find(b => b.getAttribute('aria-pressed') === 'true');
    if (pressed) return pressed.dataset.topic;
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash && flatTopics.some(t => t.key === hash)) return hash;
    return flatTopics[0].key;
  }

  function syncActiveTopicUI() {
    const activeKey = getActiveTopicKey();
    if (quickSelect && quickSelect.value !== activeKey) {
      quickSelect.value = activeKey;
    }
    if (quickStrip) {
      quickStrip.querySelectorAll('.strip-chip').forEach(chip => {
        const isCurrent = chip.dataset.stripTopic === activeKey;
        chip.setAttribute('aria-pressed', String(isCurrent));
        if (isCurrent && typeof chip.scrollIntoView === 'function') {
          chip.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
        }
      });
    }
  }

  function setTopicsOpen(open, shouldScroll = false) {
    practice.classList.toggle('topics-collapsed', !open);
    document.body.classList.toggle('topics-collapsed-body', !open);
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', String(open));
      toggleBtn.classList.toggle('is-open', open);
    }
    if (toggleLabel) {
      toggleLabel.textContent = open ? 'Hide topic grid' : 'All topics';
    }
    if (shouldScroll) {
      if (open) {
        smoothScrollTo(sectionHeading || topicGroups);
      } else {
        smoothScrollTo(navBar);
      }
    }
  }

  function activateTopicByKey(key, collapseAfter = true, scrollAfter = false) {
    const target = flatTopics.find(t => t.key === key);
    if (!target) return;
    target.btn.click();
    syncActiveTopicUI();
    if (collapseAfter) {
      setTopicsOpen(false, scrollAfter);
    }
  }

  // Event listeners
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentlyOpen = !practice.classList.contains('topics-collapsed');
      setTopicsOpen(!currentlyOpen, true);
    });
  }

  if (quickSelect) {
    quickSelect.addEventListener('change', () => {
      activateTopicByKey(quickSelect.value, true, false);
    });
  }

  if (quickStrip) {
    quickStrip.addEventListener('click', e => {
      const chip = e.target.closest('[data-strip-topic]');
      if (!chip) return;
      activateTopicByKey(chip.dataset.stripTopic, true, false);
    });
  }

  if (prevTopicBtn) {
    prevTopicBtn.addEventListener('click', () => {
      const activeKey = getActiveTopicKey();
      const idx = flatTopics.findIndex(t => t.key === activeKey);
      const prevIdx = (idx - 1 + flatTopics.length) % flatTopics.length;
      activateTopicByKey(flatTopics[prevIdx].key, true, false);
    });
  }

  if (nextTopicBtn) {
    nextTopicBtn.addEventListener('click', () => {
      const activeKey = getActiveTopicKey();
      const idx = flatTopics.findIndex(t => t.key === activeKey);
      const nextIdx = (idx + 1) % flatTopics.length;
      activateTopicByKey(flatTopics[nextIdx].key, true, false);
    });
  }

  if (workspaceMixBtn) {
    workspaceMixBtn.addEventListener('click', () => {
      const origMix = document.getElementById('mix-button');
      if (origMix) origMix.click();
      setTimeout(() => {
        syncActiveTopicUI();
        setTopicsOpen(false, false);
      }, 0);
    });
  }

  // When any .topic card in the big grid is clicked, collapse the big grid and focus the workspace
  topicButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        syncActiveTopicUI();
        setTopicsOpen(false, true);
      }, 0);
    });
  });

  // Also observe aria-pressed changes (e.g. from #mix-button or hashchange or geometry family-switch)
  const observer = new MutationObserver(() => syncActiveTopicUI());
  topicButtons.forEach(btn =>
    observer.observe(btn, { attributes: true, attributeFilter: ['aria-pressed'] })
  );
  window.addEventListener('hashchange', () => {
    setTimeout(() => {
      syncActiveTopicUI();
      if (location.hash.length > 1) setTopicsOpen(false, false);
    }, 0);
  });

  // Initial state:
  // If user arrived with a specific #topic hash (e.g. from index.html chip), collapse the big topic grid immediately
  // so they land right in the workspace. Otherwise keep the topic grid open until they pick a topic.
  syncActiveTopicUI();
  const hasInitialHash = location.hash.length > 1;
  setTopicsOpen(!hasInitialHash, false);
})();
