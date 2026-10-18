/* ==========================================================================
   LilB4zyl Portfolio — JavaScript
   Loader, Carousel, Scroll Reveal, Nav Hide/Show
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Page Loader
// --------------------------------------------------------------------------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);
});

// --------------------------------------------------------------------------
// 2. Navbar Hide on Scroll Down, Show on Scroll Up
// --------------------------------------------------------------------------
(() => {
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100 && currentScroll > lastScroll) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastScroll = currentScroll;
  });
})();

// --------------------------------------------------------------------------
// 3. Horizontal Carousel — Drag + Buttons + Progress
// --------------------------------------------------------------------------
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const id = carousel.dataset.carousel;
  const prevBtn = document.querySelector(`.carousel-prev[data-target="${id}"]`);
  const nextBtn = document.querySelector(`.carousel-next[data-target="${id}"]`);
  const progressFill = document.querySelector(`[data-progress="${id}"]`);

  // Scroll by one card width
  const getScrollAmount = () => {
    const card = carousel.querySelector('.project-card');
    if (!card) return 300;
    return card.offsetWidth + 24; // card width + gap
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  // Update progress bar
  const updateProgress = () => {
    if (!progressFill) return;
    const scrollLeft = carousel.scrollLeft;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    // Show at least 15% so the bar is visible
    progressFill.style.width = Math.max(15, progress) + '%';
  };

  carousel.addEventListener('scroll', updateProgress);
  updateProgress();

  // Drag to scroll
  let isDown = false;
  let startX;
  let scrollLeftStart;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeftStart = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => { isDown = false; });
  carousel.addEventListener('mouseup', () => { isDown = false; });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeftStart - walk;
  });
});

// --------------------------------------------------------------------------
// 4. Scroll Reveal — IntersectionObserver
// --------------------------------------------------------------------------
const revealElements = document.querySelectorAll(
  '.gallery-section, .about-inner, .contact-inner'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));
