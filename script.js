// ── SCHEDULE DATA ──────────────────────────────────────
const classes = [
  { time: '6:30',  ampm: 'AM', name: 'Morning Flow Vinyasa',    instructor: 'Andrea Murphy',      duration: '60 min', spots: 'open',  level: 'beginner' },
  { time: '8:00',  ampm: 'AM', name: 'Sunrise Hatha',           instructor: 'McKenzie Nash',      duration: '45 min', spots: 'few',   level: 'beginner' },
  { time: '9:30',  ampm: 'AM', name: 'Power Vinyasa',           instructor: 'Savannah Carpenter', duration: '75 min', spots: 'open',  level: 'intermediate' },
  { time: '11:00', ampm: 'AM', name: 'Gentle & Restorative',    instructor: 'Andrea Murphy',      duration: '60 min', spots: 'full',  level: 'beginner' },
  { time: '12:30', ampm: 'PM', name: 'Lunchtime Core Flow',     instructor: 'McKenzie Nash',      duration: '45 min', spots: 'open',  level: 'intermediate' },
  { time: '5:00',  ampm: 'PM', name: 'Advanced Inversions',     instructor: 'Savannah Carpenter', duration: '90 min', spots: 'few',   level: 'advanced' },
  { time: '6:30',  ampm: 'PM', name: 'Evening Yin Yoga',        instructor: 'McKenzie Nash',      duration: '60 min', spots: 'open',  level: 'beginner' },
  { time: '8:00',  ampm: 'PM', name: 'Breathwork & Meditation', instructor: 'Andrea Murphy',      duration: '45 min', spots: 'open',  level: 'beginner' },
];
const spotsLabel = { open: 'Spots Available', few: 'Few Spots Left', full: 'Class Full' };

function buildSchedule() {
  const list = document.getElementById('scheduleList');
  if (!list) return;
  list.innerHTML = classes.map((c) => `
    <div class="schedule-item level-${c.level}" onclick="selectClass(this)">
      <div class="schedule-time">${c.time}<br><span class="ampm">${c.ampm}</span></div>
      <div class="schedule-info">
        <h4>${c.name}</h4>
        <div class="meta">
          <span>👤 ${c.instructor}</span>
          <span>⏱ ${c.duration}</span>
        </div>
      </div>
      <div class="schedule-right-col">
        <span class="spots-badge spots-${c.spots}">${spotsLabel[c.spots]}</span>
        <button class="book-btn" ${c.spots === 'full' ? 'disabled' : ''} onclick="bookClass(event, this)">
          ${c.spots === 'full' ? 'Full' : 'Book →'}
        </button>
      </div>
    </div>`).join('');
}

function selectClass(el) {
  document.querySelectorAll('.schedule-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

function bookClass(e, btn) {
  e.stopPropagation();
  if (btn.disabled) return;
  const orig = btn.textContent;
  btn.textContent = '✓ Booked!';
  btn.style.background = 'var(--color-1)';
  btn.style.color = '#fff';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
  }, 2500);
}

// ── PRICING BUTTONS ────────────────────────────────────
function initPricingButtons() {
  document.querySelectorAll('.btn-price').forEach(btn => {
    btn.addEventListener('click', function () {
      const orig = this.textContent;
      this.textContent = '✓ Selected!';
      this.style.background = '#fff';
      this.style.color = 'var(--color-2)';
      setTimeout(() => {
        this.textContent = orig;
        this.style.background = '';
        this.style.color = '';
      }, 2000);
      // Scroll to newsletter to capture email
      document.getElementById('newsletter').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ── HAMBURGER / MOBILE MENU ────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileClose.addEventListener('click', closeMobileMenu);

  // Close menu when any mobile link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Close on backdrop click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });
}

// ── SMOOTH SCROLL ──────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = document.querySelector('nav').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ── NEWSLETTER FORM ────────────────────────────────────
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const btn = document.getElementById('newsletterBtn');
    const email = emailInput.value.trim();

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.style.outline = '2px solid #e07070';
      emailInput.placeholder = 'Please enter a valid email address';
      setTimeout(() => {
        emailInput.style.outline = '';
        emailInput.placeholder = 'Enter your email address';
      }, 2500);
      return;
    }

    // Loading state
    btn.textContent = 'Subscribing...';
    btn.disabled = true;
    emailInput.disabled = true;

    // Show confirmation after short delay (simulates server processing)
    setTimeout(() => {
      // Hide the form
      form.style.display = 'none';

      // Personalise the message using the email name
      const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const confirm = document.getElementById('newsletterConfirm');
      document.getElementById('confirmMsg').textContent =
        `Hi ${name}! A confirmation has been sent to ${email}. ` +
        `Thank you for joining the Yogi community — we can't wait to share our classes, tips and exclusive offers with you.`;

      confirm.classList.add('show');
    }, 900);
  });
}

// ── NAV SCROLL SHADOW ──────────────────────────────────
function initNavScroll() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
  }, { passive: true });
}

// ── ACTIVE NAV HIGHLIGHT ───────────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
}

// ── INIT ALL ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildSchedule();
  initPricingButtons();
  initMobileMenu();
  initSmoothScroll();
  initNewsletter();
  initNavScroll();
  initActiveNav();
  initAnimations();
});

// ── ANIMATION ENGINE ──────────────────────────────
function initAnimations() {

  // 1. Hero content entrance (fires after page curtain lifts)
  const heroContent = document.getElementById('heroContent');
  if (heroContent) {
    setTimeout(() => heroContent.classList.add('animate'), 500);
  }

  // 2. Scroll-reveal observer
  const srObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        srObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.sr').forEach(el => srObserver.observe(el));

  // 3. Divider line draw
  const divObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('drawn');
        divObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.divider-line').forEach(el => divObserver.observe(el));

  // 4. Image reveal on scroll
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('img-revealed');
        imgObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.schedule-photo-wrap, .instructor-photo, .class-thumb').forEach(el => imgObserver.observe(el));

  // 5. Schedule items stagger in
  const schedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.schedule-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('sched-in'), i * 80);
        });
        schedObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const schedList = document.getElementById('scheduleList');
  if (schedList) schedObserver.observe(schedList);

  // Re-run stagger whenever schedule is rebuilt
  const origBuild = window.buildSchedule;
  window.buildSchedule = function() {
    origBuild();
    setTimeout(() => {
      const items = document.querySelectorAll('.schedule-item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('sched-in'), i * 80);
      });
    }, 50);
  };

  // 6. Animated number counters (about stats)
  function animateCounter(el, target, suffix) {
    const duration = 1400;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(ease * target);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else {
        el.textContent = target + suffix;
        el.classList.add('pop');
      }
    };
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.num');
        nums.forEach(num => {
          const text = num.textContent;
          const match = text.match(/(\d+)(\+?)/);
          if (match) {
            const val = parseInt(match[1]);
            const suffix = match[2] || '';
            animateCounter(num, val, suffix);
          }
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const aboutNumbers = document.querySelector('.about-number');
  if (aboutNumbers) counterObserver.observe(aboutNumbers);

  // 7. Scroll-to-top button
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 8. Re-observe schedule items after buildSchedule populates them
  setTimeout(() => {
    const list = document.getElementById('scheduleList');
    if (list) schedObserver.observe(list);
  }, 200);
}
