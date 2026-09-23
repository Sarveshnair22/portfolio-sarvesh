/* =========================================================================
   Sarvesh Nair — Portfolio
   Vanilla JS only. Every block below guards on the elements it needs, so
   this one file can be safely included, unchanged, on every page.
   ========================================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------------------
     Mobile nav
     --------------------------------------------------------------------- */
  (function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    function closeNav() {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-locked');
    }
    function openNav() {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      document.body.classList.add('nav-locked');
    }

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeNav(); else openNav();
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 860) closeNav();
    });
  })();

  /* -----------------------------------------------------------------------
     Active nav link — matched via body[data-page] against each link's
     data-page, so it works regardless of hosting path/subfolder.
     --------------------------------------------------------------------- */
  (function markActiveNav() {
    var current = document.body.getAttribute('data-page');
    if (!current) return;
    document.querySelectorAll('.nav-link[data-page]').forEach(function (link) {
      if (link.getAttribute('data-page') === current) {
        link.setAttribute('aria-current', 'page');
      }
    });
  })();

  /* -----------------------------------------------------------------------
     Skill tooltips — hover/focus are handled purely by CSS. This only
     adds click/tap-to-toggle for touch devices, one open at a time,
     closing on outside click or Escape.
     --------------------------------------------------------------------- */
  (function initSkillTips() {
    var pills = document.querySelectorAll('.skill-pill');
    if (!pills.length) return;

    function closeAll(except) {
      pills.forEach(function (p) {
        if (p !== except) p.classList.remove('is-open');
      });
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = !pill.classList.contains('is-open');
        closeAll(pill);
        pill.classList.toggle('is-open', willOpen);
      });
    });

    document.addEventListener('click', function () { closeAll(null); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });
  })();

  /* -----------------------------------------------------------------------
     Certification carousel — single card per slide, auto-advance,
     pause on hover/focus, manual controls, dot indicators, swipe.
     --------------------------------------------------------------------- */
  (function initCarousel() {
    var root = document.querySelector('[data-carousel]');
    if (!root) return;

    var track = root.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.cert-card'));
    var dotsWrap = root.querySelector('.carousel-dots');
    var prevBtn = root.querySelector('[data-dir="prev"]');
    var nextBtn = root.querySelector('[data-dir="next"]');
    if (!track || slides.length < 2) return;

    var index = 0;
    var timer = null;
    var AUTO_MS = 4800;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Go to certification ' + (i + 1) + ' of ' + slides.length);
      dot.addEventListener('click', function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function render() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (d, i) {
        d.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      if (prefersReducedMotion) return;
      stop();
      timer = window.setInterval(next, AUTO_MS);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    // Touch swipe
    var touchStartX = null;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
      stop();
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
      touchStartX = null;
      restart();
    }, { passive: true });

    render();
    start();
  })();

  /* -----------------------------------------------------------------------
     Blog accordion
     --------------------------------------------------------------------- */
  (function initBlog() {
    var toggles = document.querySelectorAll('.blog-toggle');
    if (!toggles.length) return;

    toggles.forEach(function (btn) {
      var body = document.getElementById(btn.getAttribute('aria-controls'));
      if (!body) return;
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        body.hidden = isOpen;
      });
    });
  })();

  /* -----------------------------------------------------------------------
     Hero console — typewriter reveal, once, on load. If reduced motion
     is preferred the final text (already in the HTML) is simply left as-is.
     --------------------------------------------------------------------- */
  (function initConsole() {
    var lines = document.querySelectorAll('.console-type');
    if (!lines.length || prefersReducedMotion) return;

    var queue = Array.prototype.map.call(lines, function (el) {
      return { el: el, text: el.textContent };
    });
    queue.forEach(function (item) { item.el.textContent = ''; });

    var li = 0;
    function typeLine() {
      if (li >= queue.length) return;
      var item = queue[li];
      var ci = 0;
      (function typeChar() {
        if (ci <= item.text.length) {
          item.el.textContent = item.text.slice(0, ci);
          ci++;
          window.setTimeout(typeChar, 26);
        } else {
          li++;
          window.setTimeout(typeLine, 260);
        }
      })();
    }
    window.setTimeout(typeLine, 500);
  })();

  /* -----------------------------------------------------------------------
     Contact — copy email to clipboard
     --------------------------------------------------------------------- */
  (function initCopyEmail() {
    var btn = document.querySelector('[data-copy-email]');
    if (!btn) return;
    var email = btn.getAttribute('data-copy-email');
    var label = btn.querySelector('[data-copy-label]');
    var defaultLabel = label ? label.textContent : '';

    btn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(email).then(function () {
        if (!label) return;
        label.textContent = 'Copied';
        window.setTimeout(function () { label.textContent = defaultLabel; }, 1800);
      }).catch(function () { /* clipboard unavailable — mailto link still works */ });
    });
  })();

})();
