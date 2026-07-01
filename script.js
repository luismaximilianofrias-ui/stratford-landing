// ===== LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hide'), 400);
});

// ===== CURSOR GLOW =====
const glow = document.getElementById('cursorGlow');
window.addEventListener('pointermove', (e) => {
  glow.style.transform = `translate(${e.clientX - 190}px, ${e.clientY - 190}px)`;
});

// ===== HEADER SCROLL STATE + SCROLLSPY =====
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  header.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('show', window.scrollY > 500);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

// ===== SCROLL REVEAL (IntersectionObserver) =====
const revealEls = document.querySelectorAll('.fade-up, .fade-in, .fade-in-left, .fade-in-right, .reveal-up, .reveal-down');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.num');
let countersStarted = false;
function animateCounters() {
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    const duration = 1400;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target;
    }
    requestAnimationFrame(update);
  });
}
const statsSection = document.querySelector('.hero-stats');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });
if (statsSection) statsObserver.observe(statsSection);

// ===== CONTACT FORM → WhatsApp =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre   = document.getElementById('fname').value.trim();
  const apellido = document.getElementById('flastname').value.trim();
  const telefono = document.getElementById('fphone').value.trim();
  const curso    = document.getElementById('fcourse').value;
  const mensaje  = document.getElementById('fmessage').value.trim();
  const texto = `Hola! Mi nombre es ${nombre} ${apellido}.\nTeléfono: ${telefono}\nMe interesa: ${curso}${mensaje ? '\n\n' + mensaje : ''}`;
  const url = `https://wa.me/5493865000000?text=${encodeURIComponent(texto)}`;
  formSuccess.classList.add('show');
  setTimeout(() => {
    formSuccess.classList.remove('show');
    form.reset();
    window.open(url, '_blank');
  }, 800);
});

// ===== FOTO ZOOM TOGGLE =====
const isTouchDevice = window.matchMedia('(hover: none)').matches;
document.querySelectorAll('.hero-photo').forEach(photo => {
  if (isTouchDevice) {
    photo.addEventListener('touchend', (e) => {
      e.preventDefault();
      const isZoomed = photo.classList.contains('zoomed');
      document.querySelectorAll('.hero-photo').forEach(p => p.classList.remove('zoomed'));
      if (!isZoomed) photo.classList.add('zoomed');
    });
  } else {
    photo.addEventListener('mouseenter', () => photo.classList.add('zoomed'));
    photo.addEventListener('mouseleave', () => photo.classList.remove('zoomed'));
  }
});

// ===== TESTIMONIALS: rotar imagen de fondo en móvil =====
if (isTouchDevice) {
  const bgHalves = document.querySelectorAll('#testiBg .testi-bg-half');
  if (bgHalves.length > 1) {
    let bgIdx = 0;
    setInterval(() => {
      bgHalves[bgIdx].classList.remove('active');
      bgIdx = (bgIdx + 1) % bgHalves.length;
      bgHalves[bgIdx].classList.add('active');
    }, 3000);
  }
}

// ===== TESTIMONIALS: pause marquee on touch =====
if (isTouchDevice) {
  const testiTrack = document.getElementById('testiTrack');
  if (testiTrack) {
    testiTrack.addEventListener('touchstart', () => { testiTrack.style.animationPlayState = 'paused'; }, { passive: true });
    testiTrack.addEventListener('touchend', () => { testiTrack.style.animationPlayState = 'running'; });
  }
}


// ===== GALLERY =====
(function () {
  const track = document.getElementById('galleryTrack');
  const dotsWrap = document.getElementById('galleryDots');
  if (!track) return;

  const slides = track.querySelectorAll('.gallery-slide');
  const total = slides.length;
  const visible = () => window.innerWidth <= 760 ? 1 : 3;
  let idx = 0;

  function maxIdx() { return Math.max(0, total - visible()); }

  function goTo(n) {
    const max = maxIdx();
    if (n < 0) n = max;
    if (n > max) n = 0;
    idx = n;
    const slideW = slides[0].offsetWidth + 20; // width + gap
    track.style.transform = `translateX(-${idx * slideW}px)`;
    dotsWrap.querySelectorAll('.gallery-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = maxIdx() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === idx ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  buildDots();

  document.getElementById('galleryPrev').addEventListener('click', () => goTo(idx - 1));
  document.getElementById('galleryNext').addEventListener('click', () => goTo(idx + 1));

  // touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(idx + (diff > 0 ? 1 : -1));
  });

  window.addEventListener('resize', () => { buildDots(); goTo(idx); });
})();

// ===== FOOTER YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();
