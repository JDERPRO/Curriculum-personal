/* ========================================
   CV Professional — Rendering Engine
   Reads cv-data.json and renders the CV
   ======================================== */

(async function () {
  'use strict';

  /* --- Load Data --- */
  let DATA;
  try {
    const res = await fetch('data/cv-data.json');
    DATA = await res.json();
  } catch (e) {
    console.error('Error loading CV data:', e);
    document.body.innerHTML = '<p style="color:red;text-align:center;margin-top:40vh">Error cargando datos del CV.</p>';
    return;
  }

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* --- Hero --- */
  function renderHero() {
    const p = DATA.personal;
    const nameEl = $('#heroName');
    nameEl.innerHTML = `${p.name.replace('Jorge', '<span class="accent">Jorge</span>')}`;

    $('#heroTitle').textContent = `${p.title} | ${p.subtitle}`;

    // Photo — fallback to placeholder
    const photo = $('#heroPhoto');
    photo.src = p.photo;
    photo.onerror = () => {
      photo.src = 'https://ui-avatars.com/api/?name=Jorge+Ramirez&size=280&background=f0c040&color=0a0a0f&font-size=0.35&bold=true';
    };

    // Buttons
    const btns = $('#heroButtons');
    btns.innerHTML = `
      <a href="#contact" class="btn btn-primary">📬 Contactar</a>
      <a href="${p.linkedin}" target="_blank" rel="noopener" class="btn btn-outline">in LinkedIn</a>
      <a href="${p.github}" target="_blank" rel="noopener" class="btn btn-outline">⟨/⟩ GitHub</a>
      <a href="${p.website}" target="_blank" rel="noopener" class="btn btn-outline">⚡ Bitform</a>
    `;
  }

  /* --- Stats --- */
  function renderStats() {
    const bar = $('#statsBar');
    bar.innerHTML = DATA.about.stats.map(s => `
      <div class="stat-item reveal">
        <span class="stat-value">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `).join('');
  }

  /* --- About --- */
  function renderAbout() {
    $('#aboutSummary').textContent = DATA.about.summary;
    $('#aboutHighlights').innerHTML = DATA.about.highlights.map(h => `
      <li style="padding-left:20px;position:relative;color:var(--text-secondary);font-size:0.9rem;">
        <span style="position:absolute;left:0;color:var(--accent);">▸</span>${h}
      </li>
    `).join('');
  }

  /* --- Experience Timeline --- */
  function renderExperience() {
    const tl = $('#timeline');
    tl.innerHTML = DATA.experience.map(exp => `
      <div class="timeline-item reveal">
        <div class="card">
          <div class="timeline-period">${exp.period}</div>
          <div class="timeline-role">${exp.role}</div>
          <div class="timeline-company">${exp.company}</div>
          <div class="timeline-location">${exp.location} · ${exp.type}</div>
          <p class="timeline-desc">${exp.description}</p>
          ${exp.achievements ? `
            <ul class="timeline-achievements">
              ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
          ` : ''}
          <div class="timeline-tags">
            ${exp.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  /* --- Education --- */
  function renderEducation() {
    const grid = $('#educationGrid');
    grid.innerHTML = DATA.education.map(edu => `
      <div class="card edu-card ${edu.highlight ? 'highlight' : ''} reveal">
        <div class="edu-icon"><span>${edu.icon}</span></div>
        <div>
          <div class="edu-degree">
            ${edu.degree}
            ${edu.highlight ? '<span class="badge-progress">EN CURSO</span>' : ''}
          </div>
          <div class="edu-institution">${edu.institution}</div>
          <div class="edu-period">${edu.period}</div>
          ${edu.note ? `<div class="edu-note">${edu.note}</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  /* --- Certifications --- */
  function renderCertifications() {
    const container = $('#certificationsContainer');
    const tiers = [
      { label: 'Certificaciones Destacadas', tier: 1 },
      { label: 'Certificaciones Complementarias', tier: 2 },
      { label: 'Cursos y Formación', tier: 3 }
    ];

    container.innerHTML = tiers.map(({ label, tier }) => {
      const certs = DATA.certifications.filter(c => c.tier === tier);
      if (!certs.length) return '';
      return `
        <div class="certs-section-label">${label}</div>
        <div class="certs-grid">
          ${certs.map(c => `
            <div class="card cert-card reveal">
              <div class="cert-icon">${c.icon}</div>
              <div>
                <div class="cert-name">${c.name}</div>
                <div class="cert-issuer">${c.issuer}</div>
                <div class="cert-date">${c.date}</div>
                ${c.skills ? `
                  <div class="cert-skills">
                    ${c.skills.map(s => `<span class="tag blue">${s}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  /* --- Skills --- */
  function renderSkills() {
    const grid = $('#skillsGrid');
    grid.innerHTML = DATA.skills.categories.map(cat => `
      <div class="card skill-category reveal">
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

  /* --- Projects --- */
  function renderProjects() {
    const grid = $('#projectsGrid');
    grid.innerHTML = DATA.projects.map(proj => `
      <div class="card project-card reveal">
        <div class="project-icon">${proj.icon}</div>
        <h3>${proj.name}</h3>
        <p>${proj.description}</p>
        <div class="timeline-tags" style="margin-bottom:14px;">
          ${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        ${proj.url !== '#' ? `<a href="${proj.url}" target="_blank" rel="noopener" class="project-link">Ver proyecto →</a>` : '<span style="color:var(--text-muted);font-size:0.82rem;">Próximamente</span>'}
      </div>
    `).join('');
  }

  /* --- Awards --- */
  function renderAwards() {
    const grid = $('#awardsGrid');
    grid.innerHTML = DATA.awards.map(aw => `
      <div class="card award-card reveal">
        <div class="award-icon">${aw.icon}</div>
        <div>
          <div class="award-title">${aw.title}</div>
          <div class="award-issuer">${aw.issuer}</div>
          ${aw.url ? `<a href="${aw.url}" target="_blank" rel="noopener" style="font-size:0.8rem;">Ver video →</a>` : ''}
        </div>
      </div>
    `).join('');
  }

  /* --- Contact --- */
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
    const grid = $('#contactGrid');
    grid.innerHTML = items.map(item => `
      <div class="card contact-item">
        <div class="contact-icon">${item.icon}</div>
        <div>
          <div class="contact-label">${item.label}</div>
          ${item.href
            ? `<a href="${item.href}" target="_blank" rel="noopener" class="contact-value">${item.value}</a>`
            : `<div class="contact-value">${item.value}</div>`
          }
        </div>
      </div>
    `).join('');
  }

  /* --- Footer --- */
  function renderFooter() {
    const p = DATA.personal;
    $('#year').textContent = new Date().getFullYear();
    $('#footerLinks').innerHTML = `
      <a href="${p.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="${p.github}" target="_blank" rel="noopener">GitHub</a>
      <a href="${p.youtube}" target="_blank" rel="noopener">YouTube</a>
      <a href="${p.website}" target="_blank" rel="noopener">Bitform</a>
      <a href="${p.blog}" target="_blank" rel="noopener">Blog</a>
    `;
  }

  /* --- Scroll Reveal --- */
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Animate skill bars within this element
          const bars = entry.target.querySelectorAll('.skill-bar-fill');
          bars.forEach(bar => {
            setTimeout(() => {
              bar.style.width = bar.dataset.level + '%';
            }, 200);
          });
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach(el => observer.observe(el));
  }

  /* --- Mobile Nav --- */
  function initNav() {
    const toggle = $('#navToggle');
    const links = $('#navLinks');
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('active'));
    });
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const navbar = $('#navbar');
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        navbar.style.padding = '10px 0';
      } else {
        navbar.style.padding = '16px 0';
      }
      lastScroll = scrollTop;
    });
  }

  /* --- Active nav link highlight --- */
  function initActiveNav() {
    const sections = $$('.section, .hero');
    const navLinks = $$('.nav-links a');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${id}`
              ? 'var(--accent)'
              : '';
          });
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(sec => observer.observe(sec));
  }

  /* --- Render All --- */
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

  // Init after DOM is painted
  requestAnimationFrame(() => {
    initScrollReveal();
    initNav();
    initActiveNav();
  });

})();
