/* ========================================
   Particle System — Canvas-based (Optimized)
   Batched draws + distance-squared comparisons
   ======================================== */
(function () {
  'use strict';

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  let W = 0, H = 0, particles = [], mouse = { x: -1000, y: -1000 };
  let animId = null;

  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 28 : 48;
  const CONNECTION_DIST = 135;
  const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
  const MOUSE_DIST = 160;
  const MOUSE_DIST_SQ = MOUSE_DIST * MOUSE_DIST;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  }, { passive: true });

  if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
  }

  class Particle {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 1.6 + 0.5;
      this.baseAlpha = Math.random() * 0.25 + 0.1;
      this.alpha = this.baseAlpha;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;

      // Mouse repulsion (only active when mouse is on screen)
      if (mouse.x > -500) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_DIST_SQ) {
          const dist = Math.sqrt(distSq);
          const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.025;
          this.vx += dx * force;
          this.vy += dy * force;
          this.alpha = Math.min(0.65, this.baseAlpha + 0.3);
        } else {
          this.alpha += (this.baseAlpha - this.alpha) * 0.04;
        }
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 192, 64, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Highly optimized batched line drawing
  function drawConnections() {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(240, 192, 64, 0.08)';
    ctx.lineWidth = 0.6;

    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < len; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < CONNECTION_DIST_SQ) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
    }
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      p.update();
      p.draw();
    }
    drawConnections();
    animId = requestAnimationFrame(animate);
  }

  // Pause when tab is hidden to save CPU and battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    } else {
      if (!animId) {
        animId = requestAnimationFrame(animate);
      }
    }
  });

  animId = requestAnimationFrame(animate);
})();
