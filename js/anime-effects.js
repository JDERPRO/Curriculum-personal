/* ========================================
   Anime.js — Hero Geometric Grid Effect
   Staggered tile grid with mouse-reactive
   ripple wave. Inspired by Hyperplexed.
   Only affects the hero section.
   ======================================== */
(function () {
  'use strict';

  if (typeof anime === 'undefined') return;

  /* -------------------------------------------------------
     STAGGERED DOT GRID — Interactive hero background
     A grid of small geometric dots that react to mouse
     position with a radiating wave effect.
     ------------------------------------------------------- */
  function createHeroGrid() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'anime-grid-wrapper';
    wrapper.setAttribute('aria-hidden', 'true');
    hero.insertBefore(wrapper, hero.firstChild);

    const tileSize = 50;
    let columns, rows, tiles = [];

    function buildGrid() {
      const w = wrapper.offsetWidth || window.innerWidth;
      const h = wrapper.offsetHeight || window.innerHeight;
      columns = Math.ceil(w / tileSize);
      rows = Math.ceil(h / tileSize);

      wrapper.innerHTML = '';
      wrapper.style.setProperty('--cols', columns);
      wrapper.style.setProperty('--tile-size', tileSize + 'px');
      tiles = [];

      for (let i = 0; i < columns * rows; i++) {
        const tile = document.createElement('div');
        tile.className = 'anime-tile';
        wrapper.appendChild(tile);
        tiles.push(tile);
      }
    }

    buildGrid();

    // Throttled resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildGrid, 300);
    });

    // Mouse-reactive ripple wave
    let isAnimating = false;

    wrapper.addEventListener('mousemove', (e) => {
      if (isAnimating) return;
      isAnimating = true;

      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate which tile index the mouse is over
      const col = Math.floor(x / tileSize);
      const row = Math.floor(y / tileSize);
      const index = row * columns + col;

      anime({
        targets: tiles,
        opacity: [
          { value: 0.25, duration: 300 },
          { value: 0.04, duration: 800 },
        ],
        scale: [
          { value: 1.4, duration: 300 },
          { value: 1, duration: 800 },
        ],
        delay: anime.stagger(40, {
          grid: [columns, rows],
          from: index,
        }),
        easing: 'easeInOutQuad',
        complete: () => { isAnimating = false; },
      });
    });

    // Initial entrance ripple from center
    anime({
      targets: tiles,
      opacity: [0, 0.04],
      scale: [0.5, 1],
      delay: anime.stagger(20, {
        grid: [columns, rows],
        from: 'center',
      }),
      duration: 1000,
      easing: 'easeOutQuad',
    });

    // Periodic ambient pulse
    function ambientPulse() {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      anime({
        targets: tiles,
        opacity: [
          { value: 0.12, duration: 600 },
          { value: 0.04, duration: 1000 },
        ],
        delay: anime.stagger(25, {
          grid: [columns, rows],
          from: randomIndex,
        }),
        easing: 'easeInOutSine',
        complete: () => setTimeout(ambientPulse, anime.random(4000, 8000)),
      });
    }
    setTimeout(ambientPulse, 3000);
  }

  /* -------------------------------------------------------
     SVG CORNER FRAMES — Geometric accent lines
     Minimal corner brackets around the hero content
     drawn with stroke-dashoffset animation
     ------------------------------------------------------- */
  function createCornerFrames() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'anime-corner-frames');
    svg.setAttribute('viewBox', '0 0 1200 800');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Corner paths — clean architectural brackets
    const paths = [
      'M30,120 L30,30 L120,30',        // Top-left
      'M1080,30 L1170,30 L1170,120',    // Top-right
      'M30,680 L30,770 L120,770',       // Bottom-left
      'M1080,770 L1170,770 L1170,680',  // Bottom-right
    ];

    const pathElements = [];
    paths.forEach(d => {
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(240,192,64,0.2)');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-linecap', 'round');
      svg.appendChild(path);
      pathElements.push(path);
    });

    // Small diamond accent at center-bottom
    const diamond = document.createElementNS(svgNS, 'path');
    diamond.setAttribute('d', 'M590,760 L600,750 L610,760 L600,770 Z');
    diamond.setAttribute('fill', 'none');
    diamond.setAttribute('stroke', 'rgba(240,192,64,0.15)');
    diamond.setAttribute('stroke-width', '1');
    svg.appendChild(diamond);
    pathElements.push(diamond);

    hero.appendChild(svg);

    // SVG line drawing animation
    anime({
      targets: pathElements,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 1500,
      easing: 'easeInOutCubic',
      delay: anime.stagger(200, { start: 500 }),
    });
  }

  /* -------------------------------------------------------
     HERO TEXT ENTRANCE — Clean fade-up sequence
     Only animates hero elements, nothing else
     ------------------------------------------------------- */
  function initHeroEntrance() {
    const tl = anime.timeline({ easing: 'easeOutCubic' });

    tl.add({
      targets: '#heroName',
      translateY: [25, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 200,
    });

    tl.add({
      targets: '#heroTitle',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 700,
    }, '-=500');

    tl.add({
      targets: '.tagline',
      translateY: [15, 0],
      opacity: [0, 1],
      duration: 600,
    }, '-=400');

    tl.add({
      targets: '.hero-photo',
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 900,
      easing: 'easeOutQuart',
    }, '-=700');

    tl.add({
      targets: '.hero-buttons .btn',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 500,
      delay: anime.stagger(70),
    }, '-=400');

    tl.add({
      targets: '.stat-item',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 500,
      delay: anime.stagger(80),
    }, '-=200');
  }

  /* -------------------------------------------------------
     INITIALIZE — After content is rendered
     ------------------------------------------------------- */
  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setTimeout(() => {
      createHeroGrid();
      createCornerFrames();
      initHeroEntrance();
    }, 80);
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
