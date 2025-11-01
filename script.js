// Smooth active nav, form validation, dynamic year
(function () {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [...document.querySelectorAll('section')];
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contactForm');

  // Footer year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Click nav: smooth scroll with header offset
  function scrollToId(id) {
    const target = document.querySelector(id);
    if (!target) return;
    const headerH = header ? header.offsetHeight : 0;
    const rect = target.getBoundingClientRect();
    const y = window.pageYOffset + rect.top - headerH - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  navLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        scrollToId(href);
      }
    });
  });

  // Active link on scroll (IntersectionObserver)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === id));
        }
      });
    },
    { rootMargin: '-50% 0px -45% 0px', threshold: 0 }
  );
  sections.forEach((s) => observer.observe(s));

  // Reveal animations for values section and titles
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('reveal');
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.slide-up, .fade-in').forEach((el) => revealObserver.observe(el));

  // Ensure hero chips animate with stagger
  (function animateChips() {
    const chips = document.querySelectorAll('.chips .chip');
    chips.forEach((chip, i) => {
      chip.classList.add('fade-in');
      if (i === 1) chip.classList.add('article-delay-1');
      if (i === 2) chip.classList.add('article-delay-2');
      if (i === 3) chip.classList.add('article-delay-3');
      revealObserver.observe(chip);
    });
  })();

  // Hero slider
  (function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = slider.querySelector('.slider-dots');
    const prevBtn = slider.querySelector('.slider-arrow.prev');
    const nextBtn = slider.querySelector('.slider-arrow.next');

    let index = slides.findIndex((s) => s.classList.contains('active'));
    if (index < 0) index = 0;
    let timer = null;

    // Build dots
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Aller à l'image ${i + 1}`);
      b.addEventListener('click', () => go(i));
      dotsWrap.appendChild(b);
    });

    function update() {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      dotsWrap.querySelectorAll('button').forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
    }

    function go(i) { index = (i + slides.length) % slides.length; update(); restart(); }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    // Arrows
    prevBtn && prevBtn.addEventListener('click', prev);
    nextBtn && nextBtn.addEventListener('click', next);

    // Autoplay
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, 4000);
    }
    restart();

    // Pause on hover/focus
    slider.addEventListener('mouseenter', () => timer && clearInterval(timer));
    slider.addEventListener('mouseleave', restart);
    slider.addEventListener('focusin', () => timer && clearInterval(timer));
    slider.addEventListener('focusout', restart);

    // Swipe support
    let startX = 0, startY = 0, swiping = false;
    slider.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY; swiping = true;
    }, { passive: true });
    slider.addEventListener('touchmove', (e) => {
      if (!swiping) return;
      const t = e.touches[0];
      const dx = t.clientX - startX; const dy = Math.abs(t.clientY - startY);
      if (Math.abs(dx) > 40 && dy < 40) {
        swiping = false;
        dx < 0 ? next() : prev();
      }
    }, { passive: true });
    slider.addEventListener('touchend', () => { swiping = false; });

    update();
  })();

  // ---- Fake data: Articles -----
  const articlesData = [
    { title: "La mise en demeure: mode d'emploi", excerpt: "Définition, cadre légal et erreurs fréquentes avant toute action.", category: "Procédure", date: "12 oct. 2025", read: 4 },
    { title: "5 clauses clés d'un contrat commercial", excerpt: "Confidentialité, non-concurrence, résiliation: comment sécuriser.", category: "Contrats", date: "29 sept. 2025", read: 6 },
    { title: "Contentieux urgent: premiers réflexes", excerpt: "Conserver les preuves, consigner les faits, alerter vos conseils.", category: "Contentieux", date: "10 sept. 2025", read: 5 },
    { title: "RGPD en PME: par où commencer?", excerpt: "Cartographie des données, mentions d'information, registre.", category: "RGPD", date: "22 août 2025", read: 7 },
    { title: "Rupture des pourparlers: quels risques?", excerpt: "La responsabilité délictuelle en cas de négociations rompues.", category: "Affaires", date: "6 août 2025", read: 5 },
    { title: "Cession de fonds: check-list pratique", excerpt: "Bail, salariés, stock, prix: points d'attention avant signature.", category: "Affaires", date: "18 juil. 2025", read: 8 },
    { title: "Injonction de payer: utile ou pas?", excerpt: "Procédure simple pour créances certaines, liquides et exigibles.", category: "Procédure", date: "2 juil. 2025", read: 3 },
    { title: "Email pro: valeur de preuve", excerpt: "Force probante, horodatage et conservation des correspondances.", category: "Preuve", date: "15 juin 2025", read: 4 }
  ];

  function renderArticles() {
    const grid = document.querySelector('.articles-grid');
    if (!grid) return;
    grid.innerHTML = articlesData
      .map((a, i) => `
        <article class="card">
          <div class="card-meta" style="display:flex; gap:10px; align-items:center; color:#475569; font-size:13px; margin-bottom:8px;">
            <span style="background: rgba(182,140,90,0.15); color:#0f172a; padding:3px 8px; border-radius:999px; font-weight:600;">${a.category}</span>
            <span>•</span>
            <span>${a.date}</span>
            <span>•</span>
            <span>${a.read} min</span>
          </div>
          <h3>${a.title}</h3>
          <p>${a.excerpt}</p>
          <a href="article.html?id=${i}" class="btn btn-outline" role="button">Lire l'article</a>
        </article>
      `)
      .join('');

    // Add animation classes post-render and observe
    const cards = Array.from(grid.querySelectorAll('.card'));
    cards.forEach((card, i) => {
      card.classList.add('fade-in');
      if (i % 3 === 1) card.classList.add('article-delay-1');
      if (i % 3 === 2) card.classList.add('article-delay-2');
      revealObserver.observe(card);
      // Also observe description paragraph for smooth reveal
      const p = card.querySelector('p');
      p && revealObserver.observe(p);
    });
  }
  renderArticles();

  // Form validation
  function setError(name, message) {
    const span = form.querySelector(`.error[data-for="${name}"]`);
    if (span) span.textContent = message || '';
  }

  function validateEmail(email) {
    return /^[\w.!#$%&'*+/=?`{|}~^-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  }

  if (form) {
    const success = document.getElementById('formSuccess');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      setError('name');
      setError('email');
      setError('message');
      success && (success.hidden = true);

      if (name.length < 2) {
        setError('name', 'Veuillez saisir un nom valide.');
        ok = false;
      }
      if (!validateEmail(email)) {
        setError('email', 'Veuillez saisir un email valide.');
        ok = false;
      }
      if (message.length < 10) {
        setError('message', 'Le message doit contenir au moins 10 caractères.');
        ok = false;
      }

      if (!ok) return;

      // Simulate success (no backend)
      success && (success.hidden = false);
      form.reset();
    });
  }
})();
