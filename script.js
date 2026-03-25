/* ── Particle Canvas ─────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#818cf8', '#22d3ee'];
  const COUNT  = 90;
  const LINK_DIST = 130;
  const SPEED  = 0.4;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = SPEED * (0.3 + Math.random() * 0.7);
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  Math.cos(angle) * speed,
      vy:  Math.sin(angle) * speed,
      r:   1 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, randomParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // draw links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${0.18 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + 'cc';
      ctx.fill();

      // move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ── Navbar scroll effect ────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
}, { passive: true });

/* ── Active nav link ─────────────────────────────────────── */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;
  let current = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ── Mobile hamburger ────────────────────────────────────── */
const hamburger = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Typewriter effect ───────────────────────────────────── */
(function () {
  const phrases = [
    'Full Stack Developer',
    'AI Enthusiast',
    'Django Expert',
    'Next.js Builder',
    'Problem Solver',
  ];
  const el = document.getElementById('typewriter');
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 60 : 90);
  }
  setTimeout(type, 800);
})();

/* ── Reveal on scroll ────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Skill bar animation ─────────────────────────────────── */
const barObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sb-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll('.skill-cat-card').forEach(el => barObserver.observe(el));

/* ── Smooth scroll ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
