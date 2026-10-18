/* ==========================================================================
   LilB4zyl Portfolio — Script
   Loader, Nav, Leading Lines, Scroll Reveal, Cursor Coords
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Loader with percentage counter
// --------------------------------------------------------------------------
(() => {
  const loader = document.getElementById('loader');
  const pct = document.getElementById('loader-pct');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 3;
    if (progress > 100) progress = 100;
    if (pct) pct.textContent = progress + '%';
    if (progress === 100) clearInterval(interval);
  }, 120);

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (pct) pct.textContent = '100%';
      setTimeout(() => loader.classList.add('hidden'), 400);
    }, 1400);
  });
})();

// --------------------------------------------------------------------------
// 2. Nav — hide on scroll down, show on scroll up
// --------------------------------------------------------------------------
(() => {
  const nav = document.getElementById('nav');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 120 && y > lastY) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastY = y;
  });
})();

// --------------------------------------------------------------------------
// 3. Cursor coordinate tracker in nav
// --------------------------------------------------------------------------
(() => {
  const coordsEl = document.getElementById('nav-coords');
  if (!coordsEl) return;

  document.addEventListener('mousemove', (e) => {
    const x = String(e.clientX).padStart(4, '0');
    const y = String(e.clientY).padStart(4, '0');
    coordsEl.textContent = `x:${x} y:${y}`;
  });
})();

// --------------------------------------------------------------------------
// 4. HUD Tracker coordinate flicker (randomize periodically)
// --------------------------------------------------------------------------
(() => {
  const trackerCoords = document.querySelectorAll('.tracker-coords');

  setInterval(() => {
    trackerCoords.forEach(el => {
      const x = String(Math.floor(Math.random() * 999)).padStart(3, '0');
      const y = String(Math.floor(Math.random() * 999)).padStart(3, '0');
      el.textContent = `x:${x} y:${y}`;
    });
  }, 2500);
})();

// --------------------------------------------------------------------------
// 5. SVG Leading Lines — draw dynamic lines from trackers to anchor points
// --------------------------------------------------------------------------
(() => {
  const svg = document.getElementById('leading-lines');
  if (!svg) return;

  const trackerIds = ['tracker-red', 'tracker-bw', 'tracker-green', 'tracker-other'];

  // Define anchor points (relative to gallery section) for each tracker's line
  const anchors = {
    'tracker-red':   { type: 'right-edge' },
    'tracker-bw':    { type: 'left-edge' },
    'tracker-green': { type: 'left-edge' },
    'tracker-other': { type: 'right-edge' },
  };

  // Create SVG line elements
  const lines = {};
  trackerIds.forEach(id => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke-dasharray', '6 4');
    svg.appendChild(line);
    lines[id] = line;
  });

  function updateLines() {
    const galleryRect = svg.getBoundingClientRect();

    trackerIds.forEach(id => {
      const tracker = document.getElementById(id);
      if (!tracker) return;

      const box = tracker.querySelector('.tracker-box');
      const boxRect = box.getBoundingClientRect();
      const line = lines[id];

      // Center of the tracker box relative to the SVG
      const cx = boxRect.left + boxRect.width / 2 - galleryRect.left;
      const cy = boxRect.top + boxRect.height / 2 - galleryRect.top;

      let ax, ay;
      const anchor = anchors[id];

      if (anchor.type === 'right-edge') {
        ax = galleryRect.width;
        ay = cy + (Math.sin(Date.now() / 3000) * 20);
      } else {
        ax = 0;
        ay = cy + (Math.cos(Date.now() / 2800) * 15);
      }

      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', ax);
      line.setAttribute('y2', ay);
    });

    requestAnimationFrame(updateLines);
  }

  // Start after loader finishes
  setTimeout(updateLines, 2200);
})();

// --------------------------------------------------------------------------
// 6. Scroll Reveal — IntersectionObserver
// --------------------------------------------------------------------------
(() => {
  const targets = document.querySelectorAll(
    '.scatter-item, .about-inner, .contact-inner'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger reveal for gallery items
          const delay = entry.target.classList.contains('scatter-item')
            ? parseInt(entry.target.className.match(/item-(\d)/)?.[1] || 0) * 80
            : 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();

// --------------------------------------------------------------------------
// 7. Footer live timestamp
// --------------------------------------------------------------------------
(() => {
  const el = document.getElementById('footer-time');
  if (!el) return;

  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s} LOCAL`;
  }

  update();
  setInterval(update, 1000);
})();
