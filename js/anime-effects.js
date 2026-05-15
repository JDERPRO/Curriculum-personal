/* ========================================
   Anime.js — Premium Hero Grid Effect
   Inspired by animejs.com homepage
   Dense dot grid + radial scale stagger +
   mouse-interactive ripple + color waves
   ======================================== */
(function () {
  'use strict';

  if (typeof anime === 'undefined') return;

  /* -------------------------------------------------------
     STAGGERED DOT GRID — Full hero background
     Dense grid of dots with scale/opacity stagger
     radiating from center, reactive to mouse clicks
     and movements. Exact same pattern as animejs.com
     ------------------------------------------------------- */
  function createHeroGrid() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'anime-grid-wrapper';
    wrapper.setAttribute('aria-hidden', 'true');
    hero.insertBefore(wrapper, hero.firstChild);

    const gap = 28;       // space between dots
    let columns, rows, dots = [];
    let currentAnimation = null;

    function buildGrid() {
      const w = hero.offsetWidth;
      const h = hero.offsetHeight;
      columns = Math.floor(w / gap);
      rows = Math.floor(h / gap);

      // Center the grid
      const offsetX = (w - columns * gap) / 2;
      const offsetY = (h - rows * gap) / 2;

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
      }, 400);
    });

    /* --- Radial stagger wave animation --- */
    function animateGrid(fromIndex) {
      if (currentAnimation) currentAnimation.pause();

      currentAnimation = anime({
        targets: dots,
        scale: [
          { value: 1.35, easing: 'easeOutSine', duration: 250 },
          { value: 1, easing: 'easeInOutQuad', duration: 500 },
        ],
        opacity: [
          { value: 0.7, easing: 'easeOutSine', duration: 250 },
          { value: 0.12, easing: 'easeInOutQuad', duration: 500 },
        ],
        delay: anime.stagger(80, {
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
      const offsetX = parseFloat(getComputedStyle(wrapper).getPropertyValue('--offset-x')) || 0;
      const offsetY = parseFloat(getComputedStyle(wrapper).getPropertyValue('--offset-y')) || 0;

      const col = Math.floor((x - offsetX) / gap);
      const row = Math.floor((y - offsetY) / gap);
      const index = Math.min(Math.max(row * columns + col, 0), dots.length - 1);

      animateGrid(index);
    });

    /* --- Mouse move → subtle tracking highlight --- */
    let moveThrottle = 0;
    wrapper.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - moveThrottle < 80) return;
      moveThrottle = now;

      const rect = wrapper.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const offsetX = parseFloat(getComputedStyle(wrapper).getPropertyValue('--offset-x')) || 0;
      const offsetY = parseFloat(getComputedStyle(wrapper).getPropertyValue('--offset-y')) || 0;

      // Highlight dots near mouse
      dots.forEach((dot, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const dx = (col * gap + offsetX + gap / 2) - mx;
        const dy = (row * gap + offsetY + gap / 2) - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          dot.style.opacity = '0.6';
          dot.style.transform = 'scale(1.8)';
          dot.style.background = 'var(--accent)';
        } else if (dist < 150) {
          const t = 1 - (dist - 80) / 70;
          dot.style.opacity = (0.12 + t * 0.25).toFixed(2);
          dot.style.transform = `scale(${1 + t * 0.5})`;
          dot.style.background = '';
        } else {
          dot.style.opacity = '';
          dot.style.transform = '';
          dot.style.background = '';
        }
      });
    });

    wrapper.addEventListener('mouseleave', () => {
      dots.forEach(dot => {
        dot.style.opacity = '';
        dot.style.transform = '';
        dot.style.background = '';
      });
    });

    /* --- Intro: radial entrance from center --- */
    function playIntroAnimation() {
      anime({
        targets: dots,
        scale: [
          { value: 0.2, duration: 0 },
          { value: 1, duration: 800 },
        ],
        opacity: [
          { value: 0, duration: 0 },
          { value: 0.12, duration: 800 },
        ],
        delay: anime.stagger(40, {
          grid: [columns, rows],
          from: 'center',
        }),
        easing: 'easeOutQuad',
      });
    }

    /* --- Ambient breathing pulse (every ~6s) --- */
    function ambientPulse() {
      const fromIdx = Math.floor(Math.random() * dots.length);

      anime({
        targets: dots,
        scale: [
          { value: 1.25, easing: 'easeOutSine', duration: 400 },
          { value: 1, easing: 'easeInOutQuad', duration: 600 },
        ],
        opacity: [
          { value: 0.35, easing: 'easeOutSine', duration: 400 },
          { value: 0.12, easing: 'easeInOutQuad', duration: 600 },
        ],
        delay: anime.stagger(50, {
          grid: [columns, rows],
          from: fromIdx,
        }),
        complete: () => setTimeout(ambientPulse, anime.random(5000, 9000)),
      });
    }

    // Start!
    playIntroAnimation();
    setTimeout(ambientPulse, 4000);
  }

  /* -------------------------------------------------------
     SVG GEOMETRIC FRAME — Architectural corner accents
     with animated line drawing
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
      // Corner brackets
      'M20,100 L20,20 L100,20',
      'M1100,20 L1180,20 L1180,100',
      'M20,700 L20,780 L100,780',
      'M1100,780 L1180,780 L1180,700',
      // Cross-hair accents
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

    // SVG line drawing
    anime({
      targets: paths,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 1200,
      easing: 'easeInOutCubic',
      delay: anime.stagger(120, { start: 600 }),
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
      duration: 800,
      delay: 100,
    });

    tl.add({
      targets: '#heroTitle',
      translateY: [18, 0],
      opacity: [0, 1],
      duration: 650,
    }, '-=500');

    tl.add({
      targets: '.tagline',
      translateY: [12, 0],
      opacity: [0, 1],
      duration: 550,
    }, '-=350');

    tl.add({
      targets: '.hero-photo',
      scale: [0.92, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutQuart',
    }, '-=600');

    tl.add({
      targets: '.hero-buttons .btn',
      translateY: [15, 0],
      opacity: [0, 1],
      duration: 450,
      delay: anime.stagger(60),
    }, '-=350');

    tl.add({
      targets: '.stat-item',
      translateY: [15, 0],
      opacity: [0, 1],
      duration: 450,
      delay: anime.stagger(70),
    }, '-=200');
  }

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */
  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('#heroName,#heroTitle,.tagline,.hero-photo,.hero-buttons .btn,.stat-item')
        .forEach(el => el.style.opacity = '1');
      return;
    }

    setTimeout(() => {
      createHeroGrid();
      createCornerFrames();
      initHeroEntrance();
    }, 50);
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
