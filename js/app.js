/* ========================================
   CV Professional — PRO Rendering Engine
   v2.0 with effects
   ======================================== */
(async function () {
  'use strict';

  let DATA;
  try {
    const res = await fetch('data/cv-data.json');
    DATA = await res.json();
  } catch (e) {
    document.body.innerHTML = '<p style="color:red;text-align:center;margin-top:40vh">Error cargando datos del CV.</p>';
    return;
  }

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  /* ============ HERO ============ */
  function renderHero() {
    const p = DATA.personal;
    $('#heroName').innerHTML = p.name.replace('Jorge', '<span class="accent">Jorge</span>');
    $('#heroTitle').textContent = `${p.title} | ${p.subtitle}`;

    const photo = $('#heroPhoto');
    photo.src = p.photo;
    photo.onerror = () => {
      photo.src = `https://ui-avatars.com/api/?name=Jorge+Ramirez&size=300&background=f0c040&color=0a0a0f&font-size=0.33&bold=true`;
    };

    $('#heroButtons').innerHTML = `
      <a href="#contact" class="btn btn-primary"><span>📬 Contactar</span></a>
      <a href="${p.linkedin}" target="_blank" class="btn btn-outline">in LinkedIn</a>
      <a href="${p.github}" target="_blank" class="btn btn-outline">⟨/⟩ GitHub</a>
      <a href="${p.website}" target="_blank" class="btn btn-outline">⚡ Bitform</a>
    `;
  }

  /* ============ TYPING EFFECT ============ */
  function initTyping() {
    const phrases = [
      '// automatizando el futuro de la construcción',
      '// Revit API · Python · C# · Dynamo',
      '// +50h de ahorro mensual por proyecto',
      '// creando plugins que hablan por mí'
    ];
    const el = $('#typingText');
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          setTimeout(() => { deleting = true; type(); }, 2200);
          return;
        }
        setTimeout(type, 50 + Math.random() * 30);
      } else {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 25);
      }
    }
    type();
  }

  /* ============ STATS with counter animation ============ */
  function renderStats() {
    const bar = $('#statsBar');
    bar.innerHTML = DATA.about.stats.map((s, i) => `
      <div class="stat-item reveal reveal-delay-${i % 4}">
        <span class="stat-value" data-target="${s.value}">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `).join('');
  }

  /* ============ ABOUT ============ */
  function renderAbout() {
    $('#aboutSummary').textContent = DATA.about.summary;
    $('#aboutHighlights').innerHTML = DATA.about.highlights.map(h => `
      <li style="padding-left:22px;position:relative;color:var(--text-secondary);font-size:0.9rem;transition:var(--transition);">
        <span style="position:absolute;left:0;color:var(--accent);font-weight:bold;">▹</span>${h}
      </li>
    `).join('');
  }

  /* ============ EXPERIENCE ============ */
  function renderExperience() {
    $('#timeline').innerHTML = DATA.experience.map(exp => `
      <div class="timeline-item reveal">
        <div class="card">
          <div class="card-glow"></div>
          <div class="timeline-period">${exp.period}</div>
          <div class="timeline-role">${exp.role}</div>
          <div class="timeline-company">${exp.company}</div>
          <div class="timeline-location">${exp.location} · ${exp.type}</div>
          <p class="timeline-desc">${exp.description}</p>
          ${exp.achievements ? `<ul class="timeline-achievements">${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
          <div class="timeline-tags">${exp.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
      </div>
    `).join('');
  }

  /* ============ EDUCATION ============ */
  function renderEducation() {
    $('#educationGrid').innerHTML = DATA.education.map(edu => `
      <div class="card edu-card ${edu.highlight ? 'highlight' : ''} reveal">
        <div class="card-glow"></div>
        <div class="edu-icon"><span>${edu.icon}</span></div>
        <div>
          <div class="edu-degree">${edu.degree}${edu.highlight ? '<span class="badge-progress">EN CURSO</span>' : ''}</div>
          <div class="edu-institution">${edu.institution}</div>
          <div class="edu-period">${edu.period}</div>
          ${edu.note ? `<div class="edu-note">${edu.note}</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  /* ============ CERTIFICATIONS ============ */
  function renderCertifications() {
    const tiers = [
      { label: 'Certificaciones Destacadas', tier: 1 },
      { label: 'Certificaciones Complementarias', tier: 2 },
      { label: 'Cursos y Formación', tier: 3 }
    ];
    $('#certificationsContainer').innerHTML = tiers.map(({ label, tier }) => {
      const certs = DATA.certifications.filter(c => c.tier === tier);
      if (!certs.length) return '';
      return `
        <div class="certs-section-label">${label}</div>
        <div class="certs-grid">
          ${certs.map(c => `
            <div class="card cert-card reveal">
              <div class="card-glow"></div>
              <div class="cert-icon">${c.icon}</div>
              <div>
                <div class="cert-name">${c.name}</div>
                <div class="cert-issuer">${c.issuer}</div>
                <div class="cert-date">${c.date}</div>
                ${c.skills ? `<div class="cert-skills">${c.skills.map(s => `<span class="tag blue">${s}</span>`).join('')}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  /* ============ SKILLS ============ */
  function renderSkills() {
    $('#skillsGrid').innerHTML = DATA.skills.categories.map(cat => `
      <div class="card skill-category reveal">
        <div class="card-glow"></div>
        <h3>${cat.icon} ${cat.name}</h3>
        ${cat.items.map(skill => `
          <div class="skill-item">
            <div class="skill-header">
              <span class="skill-name">${skill.name}</span>
              <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-bar-fill" data-level="${skill.level}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  /* ============ PROJECTS ============ */
  function renderProjects() {
    $('#projectsGrid').innerHTML = DATA.projects.map(proj => `
      <div class="card project-card reveal">
        <div class="card-glow"></div>
        <div class="project-icon">${proj.icon}</div>
        <h3>${proj.name}</h3>
        <p>${proj.description}</p>
        <div class="timeline-tags" style="margin-bottom:14px;">${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        ${proj.url !== '#' ? `<a href="${proj.url}" target="_blank" class="project-link">Ver proyecto →</a>` : '<span style="color:var(--text-muted);font-size:0.82rem;">🔜 Próximamente</span>'}
      </div>
    `).join('');
  }

  /* ============ AWARDS ============ */
  function renderAwards() {
    $('#awardsGrid').innerHTML = DATA.awards.map(aw => `
      <div class="card award-card reveal">
        <div class="card-glow"></div>
        <div class="award-icon">${aw.icon}</div>
        <div>
          <div class="award-title">${aw.title}</div>
          <div class="award-issuer">${aw.issuer}</div>
          ${aw.url ? `<a href="${aw.url}" target="_blank" style="font-size:0.8rem;">Ver video →</a>` : ''}
        </div>
      </div>
    `).join('');
  }

  /* ============ CONTACT ============ */
  function renderContact() {
    const p = DATA.personal;
    const items = [
      { icon: '📧', label: 'Email', value: p.email, href: `mailto:${p.email}` },
      { icon: '📱', label: 'Teléfono', value: p.phone, href: `tel:${p.phone.replace(/[^+\d]/g, '')}` },
      { icon: '📍', label: 'Ubicación', value: p.location },
      { icon: '💼', label: 'LinkedIn', value: 'Ver perfil', href: p.linkedin },
      { icon: '⟨/⟩', label: 'GitHub', value: 'Ver repos', href: p.github },
      { icon: '🎥', label: 'YouTube', value: 'Ver canal', href: p.youtube }
    ];
    $('#contactGrid').innerHTML = items.map(i => `
      <div class="card contact-item reveal">
        <div class="card-glow"></div>
        <div class="contact-icon">${i.icon}</div>
        <div>
          <div class="contact-label">${i.label}</div>
          ${i.href ? `<a href="${i.href}" target="_blank" class="contact-value">${i.value}</a>` : `<div class="contact-value">${i.value}</div>`}
        </div>
      </div>
    `).join('');
  }

  /* ============ FOOTER ============ */
  function renderFooter() {
    const p = DATA.personal;
    $('#year').textContent = new Date().getFullYear();
    $('#footerLinks').innerHTML = `
      <a href="${p.linkedin}" target="_blank">LinkedIn</a>
      <a href="${p.github}" target="_blank">GitHub</a>
      <a href="${p.youtube}" target="_blank">YouTube</a>
      <a href="${p.website}" target="_blank">Bitform</a>
      <a href="${p.blog}" target="_blank">Blog</a>
    `;
  }

  /* ============ SCROLL REVEAL ============ */
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Animate skill bars
          entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            setTimeout(() => {
              bar.style.width = bar.dataset.level + '%';
              setTimeout(() => bar.classList.add('animated'), 1400);
            }, 200);
          });
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    $$('.reveal').forEach(el => observer.observe(el));
  }

  /* ============ 3D TILT + GLOW FOLLOW ============ */
  function initCardTilt() {
    $$('.card').forEach(card => {
      const glow = card.querySelector('.card-glow');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = (y - cy) / cy * -4;
        const rotateY = (x - cx) / cx * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        if (glow) {
          glow.style.left = x + 'px';
          glow.style.top = y + 'px';
        }
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============ SCROLL PROGRESS BAR ============ */
  function initScrollProgress() {
    const bar = $('#scrollProgress');
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / h) * 100;
      bar.style.width = pct + '%';
    });
  }

  /* ============ NAVBAR ============ */
  function initNav() {
    const toggle = $('#navToggle');
    const links = $('#navLinks');
    toggle.addEventListener('click', () => links.classList.toggle('active'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('active')));

    window.addEventListener('scroll', () => {
      $('#navbar').classList.toggle('scrolled', window.scrollY > 80);
    });
  }

  /* ============ ACTIVE NAV HIGHLIGHT ============ */
  function initActiveNav() {
    const sections = $$('.section, .hero');
    const navLinks = $$('.nav-links a');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => observer.observe(s));
  }

  /* ============ RENDER ALL ============ */
  renderHero();
  renderStats();
  renderAbout();
  renderExperience();
  renderEducation();
  renderCertifications();
  renderSkills();
  renderProjects();
  renderAwards();
  renderContact();
  renderFooter();

  requestAnimationFrame(() => {
    initTyping();
    initScrollReveal();
    initCardTilt();
    initScrollProgress();
    initNav();
    initActiveNav();
  });

})();
