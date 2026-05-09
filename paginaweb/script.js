/* ══════════════════════════════════════
   WEBFORGE — SCRIPTS
   ══════════════════════════════════════ */

/* ── CANVAS PARTICLES ── */
(function(){
  const c = document.getElementById('bg-canvas');
  const ctx = c.getContext('2d');
  let W, H, pts = [];

  function isLight() {
    return document.body.classList.contains('light-mode');
  }

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    init();
  }

  function init() {
    pts = [];
    const n = Math.floor((W * H) / 22000);
    for (let i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .15,
        vy: (Math.random() - .5) * .15,
        r: isLight() ? (Math.random() * 1.2 + .3) : (Math.random() * 2.5 + .8),
        a: Math.random() * .5 + .2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const light = isLight();

    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = light
        ? `rgba(20,20,20,${p.a})`
        : `rgba(255,255,255,${p.a})`;
      ctx.fill();
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = light
            ? `rgba(37,99,235,${.04 * (1 - d / 120)})`
            : `rgba(37,99,235,${.08 * (1 - d / 120)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  const observer = new MutationObserver(() => { init(); });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* ── HERO ENTRANCE ANIMATION ── */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.classList.add('visible');
  }, 100);
});


/* ── THEME TOGGLE ── */
function toggleTheme() {
  const body = document.body;
  const iconSun = document.getElementById('theme-icon-sun');
  const iconMoon = document.getElementById('theme-icon-moon');
  const text = document.getElementById('theme-text');

  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');

  iconSun.style.display = isLight ? 'block' : 'none';
  iconMoon.style.display = isLight ? 'none' : 'block';
  text.textContent = isLight ? 'Oscuro' : 'Claro';
}


/* ── NAVBAR SCROLL EFFECT ── */
(function(){
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
})();


/* ── SCROLL REVEAL ── */
(function(){
  const revealElements = document.querySelectorAll(
    '.app-card, .article-card, .about-content, .about-visual, .section-header'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
})();


/* ── SMOOTH SCROLL FOR NAV LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── TILT EFFECT ON APP CARDS (Solo las activas) ── */
(function(){
  const cards = document.querySelectorAll('.app-card[data-tilt]:not(.coming-soon)');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();