/* ========================================
   CV Professional — PRO Rendering Engine
   v3.0 – Clean, no-emoji, PDF export
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
      <a href="#contact" class="btn btn-primary"><span>Contactar</span></a>
      <a href="${p.linkedin}" target="_blank" class="btn btn-outline">LinkedIn</a>
      <a href="${p.github}" target="_blank" class="btn btn-outline">GitHub</a>
      <a href="${p.website}" target="_blank" class="btn btn-outline">
        <img src="Logo_BitForm3.png" alt="Bitform" style="height:18px;width:auto;display:inline-block;vertical-align:middle;margin-right:4px;filter:brightness(1.2);">Bitform
      </a>
      <button class="btn btn-outline" id="downloadPdfBtn" onclick="generatePDF()">Descargar CV</button>
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
        if (charIdx === current.length) { setTimeout(() => { deleting = true; type(); }, 2200); return; }
        setTimeout(type, 50 + Math.random() * 30);
      } else {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
        setTimeout(type, 25);
      }
    }
    type();
  }

  /* ============ STATS ============ */
  function renderStats() {
    $('#statsBar').innerHTML = DATA.about.stats.map((s, i) => `
      <div class="stat-item reveal reveal-delay-${i % 4}">
        <span class="stat-value">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `).join('');
  }

  /* ============ ABOUT ============ */
  function renderAbout() {
    $('#aboutSummary').textContent = DATA.about.summary;
    $('#aboutHighlights').innerHTML = DATA.about.highlights.map(h => `
      <li style="padding-left:22px;position:relative;color:var(--text-secondary);font-size:0.9rem;">
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
    const icons = { 'true': '◈', 'false': '◇' };
    $('#educationGrid').innerHTML = DATA.education.map(edu => `
      <div class="card edu-card ${edu.highlight ? 'highlight' : ''} reveal">
        <div class="card-glow"></div>
        <div class="edu-icon"><span style="font-size:1.4rem;${edu.highlight ? 'filter:none;' : ''}">${edu.highlight ? '◈' : '◇'}</span></div>
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
              <div class="cert-icon" style="font-size:1rem;color:var(--accent);font-weight:bold;">◆</div>
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
    const catIcons = ['◈', '◇', '◆', '◉'];
    $('#skillsGrid').innerHTML = DATA.skills.categories.map((cat, i) => `
      <div class="card skill-category reveal">
        <div class="card-glow"></div>
        <h3><span style="color:var(--accent)">${catIcons[i]}</span> ${cat.name}</h3>
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
    const projIcons = ['<img src="Logo_BitForm3.png" alt="Bitform" style="height:36px;width:auto;">', '▶', '◈', '≡'];
    $('#projectsGrid').innerHTML = DATA.projects.map((proj, i) => `
      <div class="card project-card reveal">
        <div class="card-glow"></div>
        <div class="project-icon">${projIcons[i] || '◆'}</div>
        <h3>${proj.name}</h3>
        <p>${proj.description}</p>
        <div class="timeline-tags" style="margin-bottom:14px;">${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        ${proj.url !== '#' ? `<a href="${proj.url}" target="_blank" class="project-link">Ver proyecto →</a>` : '<span style="color:var(--text-muted);font-size:0.82rem;">Próximamente</span>'}
      </div>
    `).join('');
  }

  /* ============ AWARDS ============ */
  function renderAwards() {
    const awardIcons = ['★', '✦', '◈', '▶'];
    $('#awardsGrid').innerHTML = DATA.awards.map((aw, i) => `
      <div class="card award-card reveal">
        <div class="card-glow"></div>
        <div class="award-icon" style="color:var(--accent);font-size:1.4rem;">${awardIcons[i]}</div>
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
      { icon: '✉', label: 'Email', value: p.email, href: `mailto:${p.email}` },
      { icon: '☎', label: 'Teléfono', value: p.phone, href: `tel:${p.phone.replace(/[^+\d]/g, '')}` },
      { icon: '⌖', label: 'Ubicación', value: p.location },
      { icon: 'in', label: 'LinkedIn', value: 'Ver perfil', href: p.linkedin },
      { icon: '⟨/⟩', label: 'GitHub', value: 'Ver repos', href: p.github },
      { icon: '▶', label: 'YouTube', value: 'Ver canal', href: p.youtube }
    ];
    $('#contactGrid').innerHTML = items.map(i => `
      <div class="card contact-item reveal">
        <div class="card-glow"></div>
        <div class="contact-icon" style="font-family:var(--font-heading);font-weight:700;font-size:1rem;">${i.icon}</div>
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

  /* ============ PDF GENERATION ============ */
  window.generatePDF = function() {
    const btn = $('#downloadPdfBtn');
    btn.textContent = 'Generando...';
    btn.disabled = true;

    const printWindow = window.open('', '_blank');
    const d = DATA;
    const p = d.personal;

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>CV - ${p.name}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family:'Inter',sans-serif; color:#1a1a2e; font-size:10.5pt; line-height:1.5; padding:32px 40px; }
      .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #f0c040; padding-bottom:16px; margin-bottom:20px; }
      .header h1 { font-size:22pt; font-weight:700; color:#0a0a1a; margin-bottom:2px; }
      .header .subtitle { font-size:11pt; color:#555; }
      .header .contact-info { text-align:right; font-size:9pt; color:#444; line-height:1.7; }
      h2 { font-size:12pt; font-weight:700; color:#0a0a1a; border-bottom:1.5px solid #e0e0e0; padding-bottom:4px; margin:18px 0 10px; text-transform:uppercase; letter-spacing:1.5px; }
      .exp-item { margin-bottom:14px; }
      .exp-header { display:flex; justify-content:space-between; }
      .exp-role { font-weight:600; font-size:10.5pt; }
      .exp-company { color:#555; font-size:9.5pt; }
      .exp-period { font-size:9pt; color:#888; text-align:right; }
      .exp-desc { font-size:9.5pt; color:#333; margin-top:3px; }
      .exp-achievements { margin-top:4px; padding-left:16px; }
      .exp-achievements li { font-size:9pt; color:#444; margin-bottom:2px; }
      .two-col { display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; }
      .cert-item { font-size:9pt; margin-bottom:4px; }
      .cert-item strong { font-weight:600; }
      .cert-item span { color:#888; }
      .skill-group { margin-bottom:10px; }
      .skill-group h3 { font-size:10pt; font-weight:600; margin-bottom:4px; }
      .skill-bar-wrap { display:flex; align-items:center; gap:6px; margin-bottom:3px; }
      .skill-label { font-size:8.5pt; width:110px; }
      .skill-bar-bg { flex:1; height:5px; background:#eee; border-radius:3px; }
      .skill-bar-fg { height:100%; background:linear-gradient(90deg,#f0c040,#3b82f6); border-radius:3px; }
      .skill-pct { font-size:8pt; color:#888; width:30px; text-align:right; }
      .proj-item { margin-bottom:6px; }
      .proj-item strong { font-weight:600; font-size:9.5pt; }
      .proj-item span { font-size:9pt; color:#555; }
      .badge { display:inline-block; background:#f0c040; color:#0a0a1a; font-size:7.5pt; font-weight:700; padding:1px 6px; border-radius:8px; margin-left:6px; }
      @media print { body { padding:20px 28px; } @page { margin:0.5cm; } }
    </style></head><body>
    <div class="header">
      <div>
        <h1>${p.name}</h1>
        <div class="subtitle">${p.title} | ${p.subtitle}</div>
      </div>
      <div class="contact-info">
        ${p.email}<br>${p.phone}<br>${p.location}<br>
        <a href="${p.linkedin}" style="color:#0077b5;">LinkedIn</a> · 
        <a href="${p.github}" style="color:#333;">GitHub</a> ·
        <a href="${p.website}" style="color:#f0c040;">Bitform</a><br>
        <a href="https://jderpro.github.io/Curriculum-personal/" style="color:#3b82f6;font-weight:600;">jderpro.github.io/Curriculum-personal</a>
      </div>
    </div>

    <h2>Perfil Profesional</h2>
    <p style="font-size:9.5pt;color:#333;">${d.about.summary}</p>

    <h2>Experiencia Profesional</h2>
    ${d.experience.map(e => `
      <div class="exp-item">
        <div class="exp-header">
          <div><span class="exp-role">${e.role}</span> <span class="exp-company">— ${e.company}</span></div>
          <div class="exp-period">${e.period}</div>
        </div>
        <div class="exp-desc">${e.location} · ${e.type}</div>
        ${e.achievements ? `<ul class="exp-achievements">${e.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}

    <h2>Educación</h2>
    ${d.education.map(e => `
      <div class="exp-item">
        <div class="exp-header">
          <div><span class="exp-role">${e.degree}</span>${e.highlight ? '<span class="badge">EN CURSO</span>' : ''}</div>
          <div class="exp-period">${e.period}</div>
        </div>
        <div class="exp-desc">${e.institution}${e.note ? ' — ' + e.note : ''}</div>
      </div>
    `).join('')}

    <h2>Certificaciones</h2>
    <div class="two-col">
      ${d.certifications.filter(c => c.tier <= 2).map(c => `
        <div class="cert-item"><strong>${c.name}</strong> — ${c.issuer} <span>(${c.date})</span></div>
      `).join('')}
    </div>

    <h2>Habilidades Técnicas</h2>
    <div class="two-col">
      ${d.skills.categories.map(cat => `
        <div class="skill-group">
          <h3>${cat.name}</h3>
          ${cat.items.map(s => `
            <div class="skill-bar-wrap">
              <span class="skill-label">${s.name}</span>
              <div class="skill-bar-bg"><div class="skill-bar-fg" style="width:${s.level}%"></div></div>
              <span class="skill-pct">${s.level}%</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>

    <h2>Proyectos</h2>
    ${d.projects.map(pr => `
      <div class="proj-item"><strong>${pr.name}</strong> — <span>${pr.description}</span></div>
    `).join('')}

    <h2>Reconocimientos</h2>
    ${d.awards.map(a => `
      <div class="proj-item"><strong>${a.title}</strong> — <span>${a.issuer}</span></div>
    `).join('')}

    <script>
      window.onload = () => { setTimeout(() => { window.print(); }, 500); };
    <\/script>
    </body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      btn.textContent = 'Descargar CV';
      btn.disabled = false;
    }, 2000);
  };

  /* ============ SCROLL REVEAL ============ */
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
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

  /* ============ 3D TILT + GLOW ============ */
  function initCardTilt() {
    $$('.card').forEach(card => {
      const glow = card.querySelector('.card-glow');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        card.style.transform = `perspective(800px) rotateX(${(y - cy) / cy * -4}deg) rotateY(${(x - cx) / cx * 4}deg) translateY(-3px)`;
        if (glow) { glow.style.left = x + 'px'; glow.style.top = y + 'px'; }
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ============ SCROLL PROGRESS ============ */
  function initScrollProgress() {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      $('#scrollProgress').style.width = (window.scrollY / h * 100) + '%';
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

  /* ============ ACTIVE NAV ============ */
  function initActiveNav() {
    const sections = $$('.section, .hero');
    const navLinks = $$('.nav-links a');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => observer.observe(s));
  }

  /* ============ LANGUAGES ============ */
  function renderLanguages() {
    if (!DATA.languages) return;
    $('#languagesGrid').innerHTML = DATA.languages.map(l => `
      <div class="card lang-card reveal">
        <div class="card-glow"></div>
        <span style="font-weight:600;">${l.name}</span>
        <span class="lang-level">${l.level}</span>
      </div>
    `).join('');
  }

  /* ============ SEMINARS ============ */
  function renderSeminars() {
    if (!DATA.seminars) return;
    $('#seminarsList').innerHTML = DATA.seminars.map(s => `
      <div class="seminar-item">${s}</div>
    `).join('');
  }

  /* ============ SECTION NUMBERS ============ */
  function addSectionNumbers() {
    const sectionIds = ['about', 'experience', 'education', 'certifications', 'skills', 'projects', 'awards', 'contact'];
    sectionIds.forEach((id, i) => {
      const title = document.querySelector(`#${id} .section-title`);
      if (title) {
        const num = document.createElement('div');
        num.className = 'section-number';
        num.textContent = `0${i + 1}`;
        title.parentElement.insertBefore(num, title);
      }
    });
  }

  /* ============ BACK TO TOP ============ */
  function initBackToTop() {
    const btn = $('#backToTop');
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============ ANIMATED COUNTERS ============ */
  function initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-value').forEach(el => {
            const text = el.textContent;
            const match = text.match(/(\+?)(\d+)(.*)/);
            if (!match) return;
            const prefix = match[1], target = parseInt(match[2]), suffix = match[3];
            let current = 0;
            const step = Math.max(1, Math.floor(target / 40));
            const timer = setInterval(() => {
              current += step;
              if (current >= target) { current = target; clearInterval(timer); }
              el.textContent = prefix + current + suffix;
            }, 30);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    const bar = $('#statsBar');
    if (bar) observer.observe(bar);
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
  renderLanguages();
  renderSeminars();
  renderFooter();
  addSectionNumbers();

  requestAnimationFrame(() => {
    initTyping();
    initScrollReveal();
    initCardTilt();
    initScrollProgress();
    initNav();
    initActiveNav();
    initBackToTop();
    initCounters();
  });

})();
