/* Blue Variable Studio — site behaviour (no dependencies) */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header: compact after scrolling ---------- */
  var header = doc.querySelector('[data-header]');
  var onScroll = function () {};
  if (header) {
    var compact = false, threshold = 80;
    onScroll = function () {
      var y = window.scrollY || root.scrollTop;
      var next = compact ? y > threshold - 30 : y > threshold; /* hysteresis */
      if (next !== compact) {
        compact = next;
        header.classList.toggle('is-compact', compact);
        root.classList.toggle('header-compact', compact); /* lets the page band stop under the compact bar too */
      }
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
  var closeMenu = function () {};
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.hidden = !open;
      doc.body.classList.toggle('menu-open', open);
      if (open) { var first = menu.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
    };
    closeMenu = function () { if (!menu.hidden) setMenu(false); };
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

  /* ---------- Per-page behaviour: runs on load and again after every in-page navigation ---------- */
  var initContent = function (scope) {
    /* Devlog entries: see more / see less */
    scope.querySelectorAll('[data-expand]').forEach(function (btn) {
      var entry = btn.closest('[data-entry]');
      if (!entry) return;
      btn.addEventListener('click', function () {
        var open = entry.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.textContent = open ? 'see less' : 'see more';
      });
    });

    /* Video modal (YouTube, privacy-enhanced embed) */
    var modal = scope.querySelector('[data-video-modal]');
    if (modal && typeof modal.showModal === 'function') {
      var frame = modal.querySelector('[data-video-frame]');
      var ytId = function (url) {
        var m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
        return m ? m[1] : null;
      };
      scope.querySelectorAll('[data-video]').forEach(function (btn) {
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

    /* Contact form: opens the visitor's mail app (no backend yet) */
    var contactForm = scope.querySelector('[data-contact-form]');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = contactForm.name.value.trim(), email = contactForm.email.value.trim(), msg = contactForm.message.value.trim();
        var note = contactForm.querySelector('.contact-form__note');
        var to = contactForm.getAttribute('action').replace('mailto:', '');
        var subject = 'Hello from ' + name;
        var body = msg + '\n\n— ' + name + ' (' + email + ')';
        window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        note.textContent = 'opening your mail app…';
      });
    }
  };
  var main = doc.getElementById('main');
  initContent(main || doc);

  /* ---------- Page transition ----------
     The blue band rises from the footer up to the navbar; meanwhile the next page is fetched.
     Its content is swapped into <main> under the band (the document never reloads, so nothing
     can flash), images get a moment to arrive, then the band drops away. Same idea as the
     app-style routers on studio sites, done with plain fetch + history. Falls back to a normal
     navigation if anything goes wrong. */
  var wipe = doc.querySelector('[data-wipe]');
  var COVER_MS = 460, LEAVE_MS = 520, SETTLE_MS = 1500;
  if (wipe && main && !reduceMotion && window.fetch && window.DOMParser && history.pushState) {
    var navigating = false;
    var currentKey = location.pathname + location.search;
    var cache = {};
    try { history.scrollRestoration = 'manual'; } catch (e) {}

    var wait = function (ms) { return new Promise(function (res) { setTimeout(res, ms); }); };
    var isInternal = function (url) {
      if (url.origin !== location.origin) return false;
      if (/\.[a-z0-9]+$/i.test(url.pathname) && !/\.html?$/i.test(url.pathname)) return false; /* files (zip, images…) */
      return true;
    };
    var load = function (href) {
      if (!cache[href]) {
        cache[href] = fetch(href, { credentials: 'same-origin', headers: { 'X-Requested-With': 'fetch' } }).then(function (r) {
          if (!r.ok || !/text\/html/i.test(r.headers.get('content-type') || '')) throw new Error('not a page');
          return r.text();
        });
        cache[href].catch(function () { delete cache[href]; });
      }
      return cache[href];
    };
    /* wait for the images (and fonts) of the new content, but never longer than SETTLE_MS */
    var settle = function (scope) {
      var pending = [];
      scope.querySelectorAll('img').forEach(function (img) {
        if (img.complete) return;
        pending.push(new Promise(function (res) { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); }));
      });
      if (doc.fonts && doc.fonts.ready) pending.push(doc.fonts.ready);
      return Promise.race([Promise.all(pending), wait(SETTLE_MS)]);
    };
    var swap = function (html, url) {
      var next = new DOMParser().parseFromString(html, 'text/html');
      var nextMain = next.getElementById('main');
      if (!nextMain) throw new Error('no main');
      doc.title = next.title;
      var desc = doc.querySelector('meta[name="description"]'), nextDesc = next.querySelector('meta[name="description"]');
      if (desc && nextDesc) desc.setAttribute('content', nextDesc.getAttribute('content'));
      doc.body.className = next.body.className + (doc.body.classList.contains('menu-open') ? ' menu-open' : '');
      /* active nav link (desktop + mobile) */
      next.querySelectorAll('.site-nav__link, .mobile-menu__link').forEach(function (link) {
        var mine = doc.querySelector('.' + link.className.split(' ')[0] + '[href="' + link.getAttribute('href') + '"]');
        if (!mine) return;
        mine.classList.toggle('is-active', link.classList.contains('is-active'));
        if (link.hasAttribute('aria-current')) mine.setAttribute('aria-current', 'page'); else mine.removeAttribute('aria-current');
      });
      main.innerHTML = nextMain.innerHTML;
      main.setAttribute('tabindex', '-1');
      initContent(main);
      currentKey = url.pathname + url.search;
    };
    var placeScroll = function (url, scrollY) {
      var target = url.hash ? doc.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
      if (target) { target.scrollIntoView({ block: 'start' }); return; }
      window.scrollTo(0, scrollY || 0);
    };
    var pending = null; /* a link clicked mid-transition is followed once the band is down */
    var go = function (url, opts) {
      if (navigating) { pending = { url: url, opts: opts }; return; }
      navigating = true;
      closeMenu();
      wipe.classList.remove('is-leaving');
      wipe.classList.add('is-covering');
      root.classList.add('wipe-covering');
      var covered = wait(COVER_MS);
      var page = load(url.href);
      Promise.all([covered, page]).then(function (r) {
        delete cache[url.href];
        if (opts.push) {
          history.replaceState({ scroll: window.scrollY }, '');
          history.pushState({ scroll: 0 }, '', url.href);
        }
        swap(r[1], url);
        placeScroll(url, opts.scroll);
        onScroll();
        main.focus({ preventScroll: true });
        return settle(main);
      }).then(function () {
        wipe.classList.add('is-leaving');
        return wait(LEAVE_MS);
      }).then(function () {
        wipe.classList.remove('is-covering'); wipe.classList.remove('is-leaving');
        root.classList.remove('wipe-covering');
        navigating = false;
        if (pending) { var p = pending; pending = null; go(p.url, p.opts); }
      }, function () {
        location.href = url.href; /* fallback: let the browser do it */
      });
    };

    doc.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.getAttribute('href').charAt(0) === '#') return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (!isInternal(url)) return;
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return; /* same-page anchor */
      e.preventDefault();
      go(url, { push: true, scroll: 0 });
    });
    /* warm the cache as soon as a link is hovered / touched, so the swap is instant */
    doc.addEventListener('pointerenter', function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank') return;
      var url; try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (!isInternal(url) || url.pathname + url.search === currentKey) return;
      load(url.href).catch(function () {});
    }, true);
    window.addEventListener('popstate', function (e) {
      var url = new URL(location.href);
      if (url.pathname + url.search === currentKey) return; /* only the hash changed */
      go(url, { push: false, scroll: (e.state && e.state.scroll) || 0 });
    });
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return; /* restored from bfcache: make sure no band is left up */
      wipe.classList.remove('is-covering'); wipe.classList.remove('is-leaving');
      root.classList.remove('wipe-covering');
      navigating = false;
    });
  }

  /* ---------- Click splat: a blue paint splash wherever the page is pressed ---------- */
  if (!reduceMotion) {
    doc.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || !e.isPrimary) return;
      var splat = doc.createElement('div');
      splat.className = 'splat';
      splat.style.left = e.clientX + 'px'; splat.style.top = e.clientY + 'px';
      splat.style.setProperty('--r', Math.round(Math.random() * 360) + 'deg');
      var n = 7 + Math.floor(Math.random() * 3);
      for (var i = 0; i < n; i++) {
        var drop = doc.createElement('i');
        var angle = (i / n) * Math.PI * 2 + (Math.random() - .5) * .7;
        var dist = 22 + Math.random() * 36, size = 4 + Math.random() * 6;
        drop.style.setProperty('--dx', (Math.cos(angle) * dist).toFixed(1) + 'px');
        drop.style.setProperty('--dy', (Math.sin(angle) * dist).toFixed(1) + 'px');
        drop.style.setProperty('--s', size.toFixed(1) + 'px');
        drop.style.setProperty('--r', Math.round(Math.random() * 360) + 'deg');
        splat.appendChild(drop);
      }
      doc.body.appendChild(splat);
      setTimeout(function () { splat.remove(); }, 700);
    }, { passive: true });
  }

  /* ---------- Local preview only: _tools/tear-tuner.html pushes new torn-edge frames into this page ---------- */
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.type !== 'bv-tear' || !d.vars) return;
      Object.keys(d.vars).forEach(function (k) {
        var v = String(d.vars[k]);
        if (/^--tear-(b|t|l|r|line|bl|br)[123]$/.test(k) && /^url\("data:image\/svg\+xml,[^"]*"\)$/.test(v)) root.style.setProperty(k, v);
      });
      /* var() inside @keyframes is resolved when the animation starts, so restart the boil to show the new frames */
      root.style.animation = 'none'; void root.offsetWidth; root.style.animation = '';
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
          /* the blue dot of "blu.e" is the one path inside the .drop group (its animations have settled by now).
             Fallback: the largest #558eff shape that is not part of a paint splash. */
          var dot = svg.querySelector('.drop path');
          if (!dot) {
            var bestArea = 0;
            svg.querySelectorAll('[fill="#558eff"]').forEach(function (el) {
              if (el.closest('.pnt, .drp, [class^="dp"]')) return;
              var r = el.getBoundingClientRect(), a = r.width * r.height;
              if (a > bestArea) { bestArea = a; dot = el; }
            });
          }
          if (dot) { var b = dot.getBoundingClientRect(); x = b.left + b.width / 2; y = b.top + b.height / 2; }
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
