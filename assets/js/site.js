/* Blue Variable Studio — site behaviour (no dependencies) */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header: compact after scrolling ---------- */
  var header = doc.querySelector('[data-header]');
  if (header) {
    var compact = false, threshold = 80;
    var onScroll = function () {
      var y = window.scrollY || root.scrollTop;
      var next = compact ? y > threshold - 30 : y > threshold; /* hysteresis */
      if (next !== compact) { compact = next; header.classList.toggle('is-compact', compact); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Tagline ticker ---------- */
  var ticker = doc.querySelector('[data-ticker]');
  if (ticker && !reduceMotion) {
    var lines = ticker.querySelectorAll('.tagline__line');
    if (lines.length > 1) {
      var current = 0;
      setInterval(function () {
        var prev = lines[current];
        current = (current + 1) % lines.length;
        var next = lines[current];
        prev.classList.remove('is-current'); prev.classList.add('is-leaving');
        next.classList.remove('is-leaving'); next.classList.add('is-current');
        setTimeout(function () { prev.classList.remove('is-leaving'); }, 600);
      }, 4000);
    }
  }

  /* ---------- Mobile menu ---------- */
  var toggle = doc.querySelector('[data-nav-toggle]');
  var menu = doc.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.hidden = !open;
      doc.body.classList.toggle('menu-open', open);
      if (open) { var first = menu.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
    };
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
    matchMedia('(min-width: 900px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------- Newsletter (placeholder until a service is wired) ---------- */
  var newsletter = doc.querySelector('[data-newsletter]');
  if (newsletter) {
    newsletter.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = newsletter.querySelector('.newsletter__note');
      var input = newsletter.querySelector('input');
      if (!input.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
        note.textContent = 'that doesn’t look like an email :3';
        input.focus();
        return;
      }
      note.textContent = 'newsletter coming soon — say hi on discord for now!';
      input.value = '';
    });
  }

  /* ---------- Devlog entries: see more / see less ---------- */
  doc.querySelectorAll('[data-expand]').forEach(function (btn) {
    var entry = btn.closest('[data-entry]');
    if (!entry) return;
    btn.addEventListener('click', function () {
      var open = entry.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'see less' : 'see more';
    });
  });

  /* ---------- Video modal (YouTube, privacy-enhanced embed) ---------- */
  var modal = doc.querySelector('[data-video-modal]');
  if (modal && typeof modal.showModal === 'function') {
    var frame = modal.querySelector('[data-video-frame]');
    var ytId = function (url) {
      var m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
      return m ? m[1] : null;
    };
    doc.querySelectorAll('[data-video]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = ytId(btn.getAttribute('data-video') || '');
        if (!id) return;
        frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
        modal.showModal();
      });
    });
    var closeModal = function () { modal.close(); frame.innerHTML = ''; };
    modal.querySelector('[data-video-close]').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    modal.addEventListener('close', function () { frame.innerHTML = ''; });
  }

  /* ---------- Contact form: opens the visitor's mail app (no backend yet) ---------- */
  var contactForm = doc.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.name.value.trim(), email = contactForm.email.value.trim(), msg = contactForm.message.value.trim();
      var note = contactForm.querySelector('.contact-form__note');
      if (!name || !email || !msg) { note.textContent = 'fill in all three and we’re good :3'; return; }
      var to = contactForm.getAttribute('action').replace('mailto:', '');
      var subject = 'Hello from ' + name;
      var body = msg + '\n\n— ' + name + ' (' + email + ')';
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      note.textContent = 'opening your mail app…';
    });
  }

  /* ---------- Page transition (blue band rises from the footer, then drops away) ---------- */
  var wipe = doc.querySelector('[data-wipe]');
  if (wipe && !reduceMotion) {
    var clearWipe = function () {
      try { sessionStorage.removeItem('bv-wipe'); } catch (e) {}
      if (root.classList.contains('wipe-in')) {
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          wipe.classList.add('is-leaving');
          setTimeout(function () { root.classList.remove('wipe-in'); wipe.classList.remove('is-leaving'); }, 600);
        }); });
      }
    };
    clearWipe();
    window.addEventListener('pageshow', function (e) { if (e.persisted) { wipe.classList.remove('is-covering'); clearWipe(); } });
    doc.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.getAttribute('href').charAt(0) === '#') return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
      e.preventDefault();
      try { sessionStorage.setItem('bv-wipe', '1'); } catch (err) {}
      wipe.classList.add('is-covering');
      setTimeout(function () { location.href = url.href; }, 440);
    });
  }

  /* ---------- Splash: reveal → dot pop → home (first visit per session) ---------- */
  var splash = doc.querySelector('[data-splash]');
  if (splash && root.classList.contains('splash-pending')) {
    var logoBox = splash.querySelector('[data-splash-logo]');
    var pop = splash.querySelector('[data-splash-pop]');
    var finish = function () {
      splash.classList.add('is-done');
      try { sessionStorage.setItem('bv-splash', '1'); } catch (e) {}
      setTimeout(function () { root.classList.remove('splash-pending'); }, 400);
    };
    var popFrom = function (x, y) {
      pop.style.left = x + 'px'; pop.style.top = y + 'px';
      var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var scale = (r * 2) / 40 + 1;
      pop.classList.add('is-popping');
      requestAnimationFrame(function () { pop.style.transform = 'scale(' + scale + ')'; });
      setTimeout(finish, 720);
    };
    var run = function (svgText) {
      logoBox.innerHTML = svgText;
      var svg = logoBox.querySelector('svg');
      setTimeout(function () {
        var x = innerWidth / 2, y = innerHeight / 2;
        if (svg) {
          /* the blue dot of "blu.e": largest #558eff element that isn't a droplet */
          var best = null, bestArea = 0;
          svg.querySelectorAll('[fill="#558eff"]').forEach(function (el) {
            if (/^dp\d/.test(el.getAttribute('class') || '')) return;
            var b = el.getBoundingClientRect(), a = b.width * b.height;
            if (a > bestArea) { bestArea = a; best = b; }
          });
          if (best) { x = best.left + best.width / 2; y = best.top + best.height / 2; }
        }
        popFrom(x, y);
      }, 2300);
    };
    var failSafe = setTimeout(finish, 6000);
    fetch(splash.getAttribute('data-src') || '/assets/blue_logo_reveal.svg')
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(function (t) { clearTimeout(failSafe); run(t); })
      .catch(finish);
  }
})();
