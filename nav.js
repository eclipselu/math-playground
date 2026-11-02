(() => {
  'use strict';

  const STORAGE_STARS_KEY = 'little-big-math-stars';
  const STORAGE_PROGRESS_KEY = 'little-big-math-progress';

  const ADVENTURES = [
    { href: 'index.html', label: '🏠 Home: All Adventures', short: 'Home' },
    { href: 'word-problems.html', label: '📖 Word Problems & Logic', short: 'Word Problems' },
    { href: 'multiply-divide.html', label: '🧮 Multiply, Divide & Remainders', short: 'Multiply & Divide' },
    { href: 'area-perimeter.html', label: '📐 Area & Perimeter Studio', short: 'Area & Perimeter' },
    { href: 'fractions.html', label: '🍰 Fractions & Decimals Lab', short: 'Fractions & Decimals' },
    { href: 'geometry.html', label: '🔷 Shape Detective', short: 'Shape Detective' },
    { href: 'measurement.html', label: '🕒 Time, Calendar, Money & Scales', short: 'Measurement' },
    { href: 'data-coding.html', label: '🤖 Data, Compass & Robot Coding', short: 'Data & Coding' },
    { href: 'probability.html', label: '🎲 Chance Lab', short: 'Chance Lab' }
  ];

  // ---------- LocalStorage Progress Store ----------
  function getTotalStars() {
    try {
      return Math.max(0, Number(localStorage.getItem(STORAGE_STARS_KEY)) || 0);
    } catch (_) {
      return 0;
    }
  }

  function loadProgress() {
    const fallback = { topics: {}, lastVisited: null, preferredLevel: null };
    try {
      const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return fallback;
      parsed.topics = parsed.topics && typeof parsed.topics === 'object' ? parsed.topics : {};
      return parsed;
    } catch (_) {
      return fallback;
    }
  }

  function saveProgress(data) {
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function getTopicRecord(data, pageFile, topicKey) {
    const id = `${pageFile}#${topicKey}`;
    return data.topics[id] || { solved: 0, levels: { easy: 0, medium: 0, large: 0 }, lastSolvedAt: null };
  }

  function recordSolve(pageFile, topicKey, level = 'easy') {
    if (!pageFile || !topicKey) return null;
    const data = loadProgress();
    const id = `${pageFile}#${topicKey}`;
    const existing = data.topics[id] || { solved: 0, levels: { easy: 0, medium: 0, large: 0 }, lastSolvedAt: null };
    existing.solved = (Number(existing.solved) || 0) + 1;
    existing.levels = existing.levels || { easy: 0, medium: 0, large: 0 };
    if (level && Object.hasOwn(existing.levels, level)) {
      existing.levels[level] = (Number(existing.levels[level]) || 0) + 1;
    }
    existing.lastSolvedAt = Date.now();
    data.topics[id] = existing;
    saveProgress(data);
    return existing;
  }

  function recordVisit(pageFile, topicKey, topicTitle, topicIcon) {
    if (!pageFile || !topicKey) return;
    const data = loadProgress();
    const adv = ADVENTURES.find(a => a.href.toLowerCase() === pageFile.toLowerCase());
    data.lastVisited = {
      href: `${pageFile}#${topicKey}`,
      pageFile,
      topicKey,
      topicTitle: topicTitle || topicKey,
      topicIcon: topicIcon || '✦',
      adventureTitle: adv ? adv.short : pageFile,
      timestamp: Date.now()
    };
    saveProgress(data);
  }

  function resetAllProgress() {
    try {
      localStorage.removeItem(STORAGE_PROGRESS_KEY);
      localStorage.removeItem(STORAGE_STARS_KEY);
    } catch (_) {}
  }

  window.MathProgress = {
    loadProgress,
    saveProgress,
    getTotalStars,
    getTopicRecord,
    recordSolve,
    recordVisit,
    resetAllProgress
  };

  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // =========================================================================
  // HOME PAGE (index.html): Render Per-Topic & Per-Adventure Progress
  // =========================================================================
  const adventuresContainer = document.querySelector('.adventures');
  if (adventuresContainer) {
    function renderHomeProgress() {
      const data = loadProgress();
      const totalStars = getTotalStars();
      const allChipLinks = Array.from(adventuresContainer.querySelectorAll('.chips a[href]'));
      const totalTopicsCount = allChipLinks.length;
      let solvedTopicsCount = 0;

      // 1. Annotate every topic chip with its star count
      allChipLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const rec = data.topics[href];
        const count = rec && rec.solved > 0 ? rec.solved : 0;
        if (count > 0) solvedTopicsCount++;

        link.classList.toggle('chip-solved', count > 0);
        let badge = link.querySelector('.chip-star-badge');
        if (count > 0) {
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'chip-star-badge';
            link.appendChild(badge);
          }
          badge.textContent = `★ ${count}`;
          badge.setAttribute('aria-label', `${count} ${count === 1 ? 'star' : 'stars'} earned in this topic`);
        } else if (badge) {
          badge.remove();
        }
      });

      // 2. Annotate each Adventure card with topics explored & stars earned
      Array.from(adventuresContainer.querySelectorAll('.adventure')).forEach(card => {
        const chipLinks = Array.from(card.querySelectorAll('.chips a[href]'));
        const totalInAdv = chipLinks.length;
        let solvedInAdv = 0;
        let starsInAdv = 0;

        chipLinks.forEach(link => {
          const href = link.getAttribute('href') || '';
          const rec = data.topics[href];
          if (rec && rec.solved > 0) {
            solvedInAdv++;
            starsInAdv += rec.solved;
          }
        });

        const textWrap = card.querySelector('.adventure-text strong');
        if (textWrap) {
          let pill = textWrap.querySelector('.adventure-progress-pill');
          if (!pill) {
            pill = document.createElement('span');
            pill.className = 'adventure-progress-pill';
            textWrap.appendChild(pill);
          }
          const isComplete = totalInAdv > 0 && solvedInAdv === totalInAdv;
          pill.classList.toggle('is-complete', isComplete);
          pill.classList.toggle('has-progress', solvedInAdv > 0);
          pill.innerHTML =
            `${isComplete ? '✓ ' : ''}${solvedInAdv}/${totalInAdv} topics` +
            (starsInAdv > 0 ? ` · ★ ${starsInAdv}` : '');
        }
      });

      // 3. Render or update the Home Progress Dashboard banner
      let dashboard = document.getElementById('home-progress-dashboard');
      if (!dashboard) {
        dashboard = document.createElement('section');
        dashboard.id = 'home-progress-dashboard';
        dashboard.className = 'home-progress-dashboard';
        dashboard.setAttribute('aria-label', 'Your learning progress');
        adventuresContainer.insertAdjacentElement('beforebegin', dashboard);
      }

      const pct = totalTopicsCount > 0 ? Math.round((solvedTopicsCount / totalTopicsCount) * 100) : 0;
      const lv = data.lastVisited;
      const resumeHtml = lv
        ? `<a class="resume-btn" href="${lv.href}">` +
          `<span aria-hidden="true">${lv.topicIcon}</span> ` +
          `<span>Continue <strong>${lv.topicTitle}</strong> <small>(${lv.adventureTitle})</small></span> ` +
          `<span aria-hidden="true">→</span>` +
          `</a>`
        : '';

      dashboard.innerHTML = `
        <div class="dashboard-stats">
          <div class="dashboard-stat-main">
            <span class="dashboard-badge-icon" aria-hidden="true">🏆</span>
            <div>
              <strong>${solvedTopicsCount} of ${totalTopicsCount} topics explored (${pct}%)</strong>
              <span>Total stars earned: <b>★ ${totalStars.toLocaleString('en-US')}</b> · Solve problems in any topic to earn stars!</span>
            </div>
          </div>
          <div class="dashboard-bar-wrap" aria-label="${solvedTopicsCount} of ${totalTopicsCount} topics explored">
            <div class="dashboard-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="dashboard-actions">
          ${resumeHtml}
          ${
            totalStars > 0 || solvedTopicsCount > 0
              ? `<button type="button" class="reset-progress-btn" id="reset-progress-btn">Reset progress</button>`
              : ''
          }
        </div>
      `;

      const resetBtn = document.getElementById('reset-progress-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (window.confirm('Reset all saved stars and topic progress on this browser?')) {
            resetAllProgress();
            const starCountEl = document.getElementById('star-count');
            const progressFillEl = document.getElementById('progress-fill');
            if (starCountEl) starCountEl.textContent = '0';
            if (progressFillEl) progressFillEl.style.width = '0%';
            renderHomeProgress();
          }
        });
      }
    }

    renderHomeProgress();
    return;
  }

  // =========================================================================
  // ADVENTURE PAGES: Streamlined Navigation + Per-Topic Progress Tracking
  // =========================================================================
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
          .map(item => `<option value="${item.key}" data-base-label="${item.icon} ${item.name.replace(/"/g, '&quot;')}">${item.icon} ${item.name}</option>`)
          .join('') +
        `</optgroup>`
    )
    .join('');

  const stripHtml = flatTopics
    .map(
      item =>
        `<button type="button" class="strip-chip" data-strip-topic="${item.key}">` +
        `<span aria-hidden="true">${item.icon}</span> <span class="strip-chip-name">${item.name}</span>` +
        `<span class="strip-chip-stars" hidden></span>` +
        `</button>`
    )
    .join('');

  navBar.innerHTML = `
    <div class="workspace-nav-top">
      <button type="button" class="back-to-topics-btn" id="toggle-topics-btn" aria-expanded="true">
        <span class="back-to-topics-icon" aria-hidden="true">⊞</span>
        <span id="toggle-topics-label">All topics</span>
        <span class="topic-count-badge" id="adventure-topic-progress-badge">${flatTopics.length}</span>
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
    <div class="quick-topic-strip" id="quick-topic-strip" role="list" aria-label="Quick topic switcher">
      ${stripHtml}
    </div>
  `;

  topicGroups.insertAdjacentElement('afterend', navBar);

  // 4. Add inline "← All topics" + per-topic star badge inside .problem-card .card-top
  const problemCardTop = workspace.querySelector('.problem-card .card-top');
  let inlineTopicStarsEl = null;
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

      inlineTopicStarsEl = document.createElement('span');
      inlineTopicStarsEl.className = 'current-topic-stars';
      inlineTopicStarsEl.id = 'current-topic-stars';

      captionEl.parentNode.insertBefore(leftWrap, captionEl);
      leftWrap.appendChild(inlineBackBtn);
      leftWrap.appendChild(captionEl);
      leftWrap.appendChild(inlineTopicStarsEl);
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

  // Add "Back to problem ↓" button in .section-heading when topics are expanded
  if (sectionHeading) {
    const rightGroup = document.createElement('div');
    rightGroup.className = 'section-heading-actions';
    const existingMix = sectionHeading.querySelector('#mix-button');
    const closeHeadingBtn = document.createElement('button');
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
  const advProgressBadge = document.getElementById('adventure-topic-progress-badge');
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

  function getActiveDifficulty() {
    const diffSelect = document.getElementById('difficulty');
    return diffSelect ? diffSelect.value : 'easy';
  }

  function renderAdventureProgressBadges() {
    const data = loadProgress();
    const activeKey = getActiveTopicKey();
    let solvedInAdventure = 0;

    flatTopics.forEach(item => {
      const rec = getTopicRecord(data, currentFile, item.key);
      const count = rec.solved || 0;
      if (count > 0) solvedInAdventure++;

      // 1. Badge on .topic card in .topic-groups
      item.btn.classList.toggle('topic-solved', count > 0);
      let cardBadge = item.btn.querySelector('.topic-star-badge');
      if (count > 0) {
        if (!cardBadge) {
          cardBadge = document.createElement('span');
          cardBadge.className = 'topic-star-badge';
          item.btn.appendChild(cardBadge);
        }
        cardBadge.textContent = `★ ${count}`;
        cardBadge.setAttribute('aria-label', `${count} stars earned in ${item.name}`);
      } else if (cardBadge) {
        cardBadge.remove();
      }

      // 2. Badge on .strip-chip in .quick-topic-strip
      if (quickStrip) {
        const chip = quickStrip.querySelector(`[data-strip-topic="${item.key}"]`);
        if (chip) {
          chip.classList.toggle('strip-chip-solved', count > 0);
          const starSpan = chip.querySelector('.strip-chip-stars');
          if (starSpan) {
            if (count > 0) {
              starSpan.hidden = false;
              starSpan.textContent = `★${count}`;
            } else {
              starSpan.hidden = true;
              starSpan.textContent = '';
            }
          }
        }
      }

      // 3. Option text in <select id="quick-topic-select">
      if (quickSelect) {
        const opt = quickSelect.querySelector(`option[value="${item.key}"]`);
        if (opt) {
          const base = opt.getAttribute('data-base-label') || `${item.icon} ${item.name}`;
          opt.textContent = count > 0 ? `${base} (★ ${count})` : base;
        }
      }
    });

    // 4. Update "All topics" button badge (e.g. "4/16 ✓")
    if (advProgressBadge) {
      advProgressBadge.textContent =
        solvedInAdventure > 0 ? `${solvedInAdventure}/${flatTopics.length} ✓` : `${flatTopics.length}`;
    }

    // 5. Update inline current topic star counter inside .problem-card
    if (inlineTopicStarsEl) {
      const activeRec = getTopicRecord(data, currentFile, activeKey);
      const c = activeRec.solved || 0;
      inlineTopicStarsEl.textContent = c > 0 ? `★ ${c} earned here` : '☆ 0 earned here';
      inlineTopicStarsEl.classList.toggle('has-earned', c > 0);
    }
  }

  function syncActiveTopicUI() {
    const activeKey = getActiveTopicKey();
    const activeMeta = flatTopics.find(t => t.key === activeKey);
    if (activeMeta) {
      recordVisit(currentFile, activeKey, activeMeta.name, activeMeta.icon);
    }
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
    renderAdventureProgressBadges();
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

  // Intercept star increments when any adventure script saves to 'little-big-math-stars'
  let trackedStars = getTotalStars();
  try {
    const origSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      origSetItem.call(this, key, value);
      if (key === STORAGE_STARS_KEY) {
        const nextStars = Number(value) || 0;
        if (nextStars > trackedStars) {
          trackedStars = nextStars;
          const activeKey = getActiveTopicKey();
          recordSolve(currentFile, activeKey, getActiveDifficulty());
          renderAdventureProgressBadges();
        } else {
          trackedStars = nextStars;
        }
      }
    };
  } catch (_) {}

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

  topicButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        syncActiveTopicUI();
        setTopicsOpen(false, true);
      }, 0);
    });
  });

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

  syncActiveTopicUI();
  const hasInitialHash = location.hash.length > 1;
  setTopicsOpen(!hasInitialHash, false);
})();
