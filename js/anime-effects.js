/* ========================================
   Anime.js — Premium Hero Grid Effect (Optimized)
   Dense dot grid + radial scale stagger +
   mouse-interactive ripple + SVG frames
   ======================================== */
(function () {
  'use strict';

  if (typeof anime === 'undefined') return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('#heroName,#heroTitle,.tagline,.hero-photo,.hero-buttons .btn,.stat-item')
      .forEach(el => { el.style.opacity = '1'; });
    return;
  }

  /* -------------------------------------------------------
     STAGGERED DOT GRID — Full hero background
     ------------------------------------------------------- */
  function createHeroGrid() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const isMobile = window.innerWidth < 768;
    // On mobile screens, skip the heavy interactive dot grid to maximize scroll smoothness
    if (isMobile) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'anime-grid-wrapper';
    wrapper.setAttribute('aria-hidden', 'true');
    hero.insertBefore(wrapper, hero.firstChild);

    const gap = 38; // optimal dot density with ~50% fewer DOM nodes
    let columns = 0, rows = 0, dots = [];
    let offsetX = 0, offsetY = 0;
    let currentAnimation = null;
    let isHeroVisible = true;
    let ambientTimeout = null;

    function buildGrid() {
      const w = hero.offsetWidth;
      const h = hero.offsetHeight;
      columns = Math.floor(w / gap);
      rows = Math.floor(h / gap);

      // Center the grid
      offsetX = (w - columns * gap) / 2;
      offsetY = (h - rows * gap) / 2;

      wrapper.innerHTML = '';
      wrapper.style.setProperty('--cols', columns);
      wrapper.style.setProperty('--gap', gap + 'px');
      wrapper.style.setProperty('--offset-x', offsetX + 'px');
      wrapper.style.setProperty('--offset-y', offsetY + 'px');
      dots = [];

      const total = columns * rows;
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'anime-dot';
        fragment.appendChild(dot);
        dots.push(dot);
      }

      wrapper.appendChild(fragment);
    }

    buildGrid();

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildGrid();
        playIntroAnimation();
      }, 350);
    }, { passive: true });

    /* --- Radial stagger wave animation --- */
    function animateGrid(fromIndex) {
      if (currentAnimation) currentAnimation.pause();

      currentAnimation = anime({
        targets: dots,
        scale: [
          { value: 1.35, easing: 'easeOutSine', duration: 250 },
          { value: 1, easing: 'easeInOutQuad', duration: 450 },
        ],
        opacity: [
          { value: 0.65, easing: 'easeOutSine', duration: 250 },
          { value: 0.12, easing: 'easeInOutQuad', duration: 450 },
        ],
        delay: anime.stagger(60, {
          grid: [columns, rows],
          from: fromIndex,
        }),
      });
    }

    /* --- Mouse click/tap → ripple from that point --- */
    wrapper.addEventListener('click', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const col = Math.floor((x - offsetX) / gap);
      const row = Math.floor((y - offsetY) / gap);
      const index = Math.min(Math.max(row * columns + col, 0), dots.length - 1);

      animateGrid(index);
    });

    /* --- Mouse move → local O(1) neighbor inspection instead of scanning all dots --- */
    let activeDots = [];
    let movePending = false;

    wrapper.addEventListener('mousemove', (e) => {
      if (movePending || !isHeroVisible) return;
      movePending = true;

      requestAnimationFrame(() => {
        movePending = false;
        const rect = wrapper.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const col = Math.floor((mx - offsetX) / gap);
        const row = Math.floor((my - offsetY) / gap);

        // Reset previously active dots
        for (let i = 0; i < activeDots.length; i++) {
          const d = activeDots[i];
          d.style.opacity = '';
          d.style.transform = '';
          d.style.background = '';
        }
        activeDots = [];

        // Check only adjacent 7x7 box around cursor
        const r = 3;
        for (let dy = -r; dy <= r; dy++) {
          const targetRow = row + dy;
          if (targetRow < 0 || targetRow >= rows) continue;
          for (let dx = -r; dx <= r; dx++) {
            const targetCol = col + dx;
            if (targetCol < 0 || targetCol >= columns) continue;

            const idx = targetRow * columns + targetCol;
            const dot = dots[idx];
            if (!dot) continue;

            const dotX = targetCol * gap + offsetX + gap / 2;
            const dotY = targetRow * gap + offsetY + gap / 2;
            const diffX = dotX - mx;
            const diffY = dotY - my;
            const distSq = diffX * diffX + diffY * diffY;

            if (distSq < 6400) { // < 80px
              dot.style.opacity = '0.6';
              dot.style.transform = 'scale(1.8)';
              dot.style.background = 'var(--accent)';
              activeDots.push(dot);
            } else if (distSq < 22500) { // < 150px
              const dist = Math.sqrt(distSq);
              const t = 1 - (dist - 80) / 70;
              dot.style.opacity = (0.12 + t * 0.25).toFixed(2);
              dot.style.transform = `scale(${(1 + t * 0.5).toFixed(2)})`;
              activeDots.push(dot);
            }
          }
        }
      });
    }, { passive: true });

    wrapper.addEventListener('mouseleave', () => {
      for (let i = 0; i < activeDots.length; i++) {
        const d = activeDots[i];
        d.style.opacity = '';
        d.style.transform = '';
        d.style.background = '';
      }
      activeDots = [];
    });

    /* --- Intro: radial entrance from center --- */
    function playIntroAnimation() {
      if (!isHeroVisible) return;
      anime({
        targets: dots,
        scale: [
          { value: 0.2, duration: 0 },
          { value: 1, duration: 700 },
        ],
        opacity: [
          { value: 0, duration: 0 },
          { value: 0.12, duration: 700 },
        ],
        delay: anime.stagger(30, {
          grid: [columns, rows],
          from: 'center',
        }),
        easing: 'easeOutQuad',
      });
    }

    /* --- Ambient breathing pulse --- */
    function scheduleAmbientPulse(delay) {
      clearTimeout(ambientTimeout);
      ambientTimeout = setTimeout(() => {
        if (!isHeroVisible || document.hidden) {
          scheduleAmbientPulse(6000);
          return;
        }

        const fromIdx = Math.floor(Math.random() * dots.length);
        anime({
          targets: dots,
          scale: [
            { value: 1.25, easing: 'easeOutSine', duration: 400 },
            { value: 1, easing: 'easeInOutQuad', duration: 550 },
          ],
          opacity: [
            { value: 0.35, easing: 'easeOutSine', duration: 400 },
            { value: 0.12, easing: 'easeInOutQuad', duration: 550 },
          ],
          delay: anime.stagger(40, {
            grid: [columns, rows],
            from: fromIdx,
          }),
          complete: () => scheduleAmbientPulse(anime.random(6000, 10000)),
        });
      }, delay);
    }

    // Pause heavy hero animations when hero is scrolled out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (!isHeroVisible) {
          if (currentAnimation) currentAnimation.pause();
          clearTimeout(ambientTimeout);
        } else {
          scheduleAmbientPulse(3000);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(hero);

    // Initial play
    playIntroAnimation();
    scheduleAmbientPulse(4000);
  }

  /* -------------------------------------------------------
     SVG GEOMETRIC FRAME — Architectural corner accents
     ------------------------------------------------------- */
  function createCornerFrames() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'anime-corner-frames');
    svg.setAttribute('viewBox', '0 0 1200 800');
    svg.setAttribute('preserveAspectRatio', 'none');

    const pathsData = [
      'M20,100 L20,20 L100,20',
      'M1100,20 L1180,20 L1180,100',
      'M20,700 L20,780 L100,780',
      'M1100,780 L1180,780 L1180,700',
      'M590,15 L610,15',
      'M590,785 L610,785',
      'M15,395 L15,405',
      'M1185,395 L1185,405',
    ];

    const paths = [];
    pathsData.forEach(d => {
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(240,192,64,0.18)');
      path.setAttribute('stroke-width', '1');
      path.setAttribute('stroke-linecap', 'round');
      svg.appendChild(path);
      paths.push(path);
    });

    hero.appendChild(svg);

    anime({
      targets: paths,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 1100,
      easing: 'easeInOutCubic',
      delay: anime.stagger(100, { start: 500 }),
    });
  }

  /* -------------------------------------------------------
     HERO TEXT ENTRANCE — Clean timeline
     ------------------------------------------------------- */
  function initHeroEntrance() {
    const tl = anime.timeline({ easing: 'easeOutCubic' });

    tl.add({
      targets: '#heroName',
      translateY: [25, 0],
      opacity: [0, 1],
      duration: 750,
      delay: 50,
    });

    tl.add({
      targets: '#heroTitle',
      translateY: [18, 0],
      opacity: [0, 1],
      duration: 600,
    }, '-=500');

    tl.add({
      targets: '.tagline',
      translateY: [12, 0],
      opacity: [0, 1],
      duration: 500,
    }, '-=350');

    tl.add({
      targets: '.hero-photo',
      scale: [0.92, 1],
      opacity: [0, 1],
      duration: 750,
      easing: 'easeOutQuart',
    }, '-=550');

    tl.add({
      targets: '.hero-buttons .btn',
      translateY: [15, 0],
      opacity: [0, 1],
      duration: 400,
      delay: anime.stagger(50),
    }, '-=350');

    tl.add({
      targets: '.stat-item',
      translateY: [15, 0],
      opacity: [0, 1],
      duration: 400,
      delay: anime.stagger(60),
    }, '-=200');
  }

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */
  function init() {
    createHeroGrid();
    createCornerFrames();
    initHeroEntrance();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
