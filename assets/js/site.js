(function () {
  'use strict';

  var doc = document, root = doc.documentElement, main = doc.getElementById('main');
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && matchMedia('(pointer: fine)').matches;

  var DOT = {
    splat: { count: [13, 15], size: [16.7, 37], distance: [53.6, 134], life: 200 },
    trail: { size: [7.2, 16], spread: 6, sway: 14, drift: [5.4, 27], every: 20, minMove: 6, max: 23, life: 1500 }
  };
  var BLUE = 'rgb(85, 142, 255)';
  var COVER_MS = 480, LEAVE_MS = 480, QUICK_MS = 330, SETTLE_MS = 1500, HINT_MS = 800, ARRIVE_MS = 1000, SPLASH_FADE_MS = 400;
  var TILT = { degrees: 7, ease: .18 };
  var TICKER_MS = 4000, TICKER_LEAVE_MS = 600;

  var wait = function (ms) { return new Promise(function (res) { setTimeout(res, ms); }); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var between = function (range) { return rnd(range[0], range[1]); };
  var deg = function () { return Math.round(Math.random() * 360) + 'deg'; };
  var px = function (n) { return 'calc(' + n.toFixed(1) + ' * var(--px))'; };
  var closest = function (target, selector) { return target && target.closest ? target.closest(selector) : null; };
  var parseUrl = function (href) { try { return new URL(href, location.href); } catch (e) { return null; } };
  var trimSlash = function (path) { return path.replace(/\/+$/, '') || '/'; };

  var navDot = initNavDot();
  var updateHeader = initHeader();
  var closeMenu = initMenu();
  var refreshSections = initSectionLabels();
  var refreshReveal = initReveal();
  initTicker();
  initNewsletter();
  initEntries();
  initVideoModal();
  initContactForm();
  initRouter();
  initDot();
  initTilt();
  initTunerBridge();
  initSplash();
  refreshSections();
  refreshReveal();

  function initNavDot() {
    var nav = doc.querySelector('.site-nav'), dot = nav && nav.querySelector('.site-nav__dot');
    if (!dot) return { place: function () {}, track: function () {} };
    var frame = 0;
    var place = function () {
      var link = nav.querySelector('.site-nav__link.is-active');
      dot.classList.toggle('is-off', !link);
      if (!link) return;
      var em = parseFloat(getComputedStyle(link).fontSize), size = em * .3;
      dot.style.setProperty('--size', size.toFixed(1) + 'px');
      dot.style.setProperty('--x', (link.offsetLeft + link.offsetWidth + em * .1 + size / 2).toFixed(1) + 'px');
      dot.style.setProperty('--y', (link.offsetTop + em * 1.03 - size / 2).toFixed(1) + 'px');
    };
    var track = function (ms) {
      var end = performance.now() + ms;
      cancelAnimationFrame(frame);
      dot.classList.add('is-tracking');
      var step = function (now) {
        place();
        if (now < end) frame = requestAnimationFrame(step);
        else dot.classList.remove('is-tracking');
      };
      frame = requestAnimationFrame(step);
    };
    dot.classList.add('is-tracking');
    place();
    void dot.offsetWidth;
    dot.classList.remove('is-tracking');
    window.addEventListener('resize', place);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(place);
    return { place: place, track: track };
  }

  function initHeader() {
    var header = doc.querySelector('[data-header]');
    if (!header) return function () {};
    var compact = false, threshold = 80;
    var update = function () {
      var y = window.scrollY || root.scrollTop;
      var next = compact ? y > threshold - 30 : y > threshold;
      if (next === compact) return;
      compact = next;
      root.classList.toggle('header-compact', compact);
      navDot.track(400);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return update;
  }

  function initTicker() {
    var ticker = doc.querySelector('[data-ticker]');
    if (!ticker) return;
    var lines = ticker.querySelectorAll('.tagline__line');
    if (lines.length < 2) return;
    var current = 0, timer = 0;
    var schedule = function () {
      clearTimeout(timer);
      if (!reduceMotion) timer = setTimeout(advance, TICKER_MS);
    };
    var advance = function () {
      var prev = lines[current];
      current = (current + 1) % lines.length;
      var next = lines[current];
      if (next.classList.contains('is-leaving')) {
        next.style.transition = 'none';
        next.classList.remove('is-leaving');
        void next.offsetWidth;
        next.style.transition = '';
      }
      prev.classList.remove('is-current'); prev.classList.add('is-leaving');
      next.classList.add('is-current');
      setTimeout(function () { prev.classList.remove('is-leaving'); }, TICKER_LEAVE_MS);
      schedule();
    };
    ticker.addEventListener('click', advance);
    schedule();
  }

  function initMenu() {
    var toggle = doc.querySelector('[data-nav-toggle]');
    var menu = doc.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) return function () {};
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.hidden = !open;
      doc.body.classList.toggle('menu-open', open);
      if (open) { var first = menu.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); } });
    matchMedia('(min-width: 900px)').addEventListener('change', function (e) { if (e.matches) setOpen(false); });
    return function () { if (!menu.hidden) setOpen(false); };
  }

  function initSectionLabels() {
    var observer = null;
    return function () {
      if (observer) { observer.disconnect(); observer = null; }
      if (!main || !window.IntersectionObserver) return;
      var labels = main.querySelectorAll('.side-labels a[href^="#"]');
      if (!labels.length) return;
      var labelFor = {};
      labels.forEach(function (a) {
        var id = a.getAttribute('href').slice(1);
        if (doc.getElementById(id)) labelFor[id] = a;
      });
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          labels.forEach(function (a) { a.classList.toggle('is-current', a === labelFor[entry.target.id]); });
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      Object.keys(labelFor).forEach(function (id) { observer.observe(doc.getElementById(id)); });
    };
  }

  function initReveal() {
    var observer = null;
    return function () {
      if (observer) { observer.disconnect(); observer = null; }
      if (!main) return;
      var sections = main.querySelectorAll('[data-reveal]');
      if (!sections.length) return;
      if (!window.IntersectionObserver || reduceMotion) {
        sections.forEach(function (section) { section.classList.add('is-revealed'); });
        return;
      }
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -15% 0px', threshold: 0 });
      sections.forEach(function (section) { observer.observe(section); });
    };
  }

  function initNewsletter() {
    var form = doc.querySelector('[data-newsletter]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.newsletter__note'), input = form.querySelector('input');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
        note.textContent = 'that doesn’t look like an email :3';
        input.focus();
        return;
      }
      note.textContent = 'newsletter coming soon — say hi on discord for now!';
      input.value = '';
    });
  }

  function initEntries() {
    doc.addEventListener('click', function (e) {
      var button = closest(e.target, '[data-expand]');
      var entry = button && button.closest('[data-entry]');
      if (!entry) return;
      var open = entry.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.textContent = open ? 'see less' : 'see more';
    });
  }

  function initVideoModal() {
    var modal = doc.querySelector('[data-video-modal]');
    if (!modal || typeof modal.showModal !== 'function') return;
    var frame = modal.querySelector('[data-video-frame]');
    var open = function (url) {
      var match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
      if (!match) return;
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + match[1] + '?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      modal.showModal();
    };
    doc.addEventListener('click', function (e) {
      var button = closest(e.target, '[data-video]');
      if (button) open(button.getAttribute('data-video') || '');
      else if (e.target === modal || closest(e.target, '[data-video-close]')) modal.close();
    });
    modal.addEventListener('close', function () { frame.innerHTML = ''; });
  }

  function initContactForm() {
    var noteTimer = 0;
    doc.addEventListener('submit', function (e) {
      var form = closest(e.target, '[data-contact-form]');
      if (!form) return;
      e.preventDefault();
      var value = function (name) { return form.elements.namedItem(name).value.trim(); };
      var name = value('name'), email = value('email'), message = value('message');
      var to = form.getAttribute('action').replace('mailto:', '');
      var body = message + '\n\n— ' + name + ' (' + email + ')';
      var note = form.querySelector('.contact-form__note');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Hello from ' + name) + '&body=' + encodeURIComponent(body);
      note.textContent = 'opening your mail app… if nothing opens, use the address below';
      clearTimeout(noteTimer);
      noteTimer = setTimeout(function () { note.textContent = ''; }, 8000);
    });
  }

  function initRouter() {
    var wipe = doc.querySelector('[data-wipe]');
    if (!wipe || !main || reduceMotion || !window.fetch || !window.DOMParser || !history.pushState) return;
    var navLinks = doc.querySelectorAll('[data-nav]');
    var navigating = false, queued = null, cache = {}, hintTimer = 0, arriveTimer = 0;
    var currentKey = location.pathname + location.search;
    try { history.scrollRestoration = 'manual'; } catch (e) {}

    var isPage = function (url) {
      return url.origin === location.origin && (!/\.[a-z0-9]+$/i.test(url.pathname) || /\.html?$/i.test(url.pathname));
    };
    var samePage = function (url) {
      return trimSlash(url.pathname) === trimSlash(location.pathname) && url.search === location.search;
    };
    var load = function (href) {
      if (!cache[href]) {
        cache[href] = fetch(href, { credentials: 'same-origin' }).then(function (r) {
          if (!r.ok || !/text\/html/i.test(r.headers.get('content-type') || '')) throw new Error('not a page');
          return r.text();
        });
        cache[href].catch(function () { delete cache[href]; });
      }
      return cache[href];
    };
    var inView = function (el) {
      var r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight;
    };
    var settle = function (scope) {
      var pending = [];
      scope.querySelectorAll('img').forEach(function (img) {
        if (img.complete || !inView(img)) return;
        pending.push(new Promise(function (res) {
          img.addEventListener('load', res, { once: true });
          img.addEventListener('error', res, { once: true });
        }));
      });
      if (doc.fonts && doc.fonts.ready) pending.push(doc.fonts.ready);
      return Promise.race([Promise.all(pending), wait(SETTLE_MS)]);
    };
    var activate = function (key) {
      navLinks.forEach(function (link) {
        var on = link.getAttribute('data-nav') === key;
        link.classList.toggle('is-active', on);
        if (on) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
      });
      navDot.place();
    };
    var keyFor = function (url) {
      var key = null;
      navLinks.forEach(function (link) {
        if (trimSlash(new URL(link.href).pathname) === trimSlash(url.pathname)) key = link.getAttribute('data-nav');
      });
      return key;
    };
    var swap = function (html) {
      var next = new DOMParser().parseFromString(html, 'text/html');
      var nextMain = next.getElementById('main');
      if (!nextMain) throw new Error('no main');
      doc.title = next.title;
      var desc = doc.querySelector('meta[name="description"]'), nextDesc = next.querySelector('meta[name="description"]');
      if (desc && nextDesc) desc.setAttribute('content', nextDesc.getAttribute('content'));
      doc.body.className = next.body.className + (doc.body.classList.contains('menu-open') ? ' menu-open' : '');
      var page = /\bpage-([\w-]+)/.exec(next.body.className);
      activate(page ? page[1] : null);
      main.innerHTML = nextMain.innerHTML;
      main.setAttribute('tabindex', '-1');
      refreshSections();
      refreshReveal();
    };
    var placeScroll = function (url, y) {
      var target = url.hash ? doc.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
      if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
      else window.scrollTo({ top: y || 0, behavior: 'instant' });
    };
    var arrive = function () {
      clearTimeout(arriveTimer);
      main.classList.remove('is-arriving');
      void main.offsetWidth;
      main.classList.add('is-arriving');
      arriveTimer = setTimeout(function () { main.classList.remove('is-arriving'); }, ARRIVE_MS);
    };
    var reset = function () {
      clearTimeout(hintTimer);
      wipe.classList.remove('is-covering', 'is-leaving', 'is-waiting', 'is-quick');
      root.classList.remove('is-navigating');
      navigating = false;
    };
    var drop = function (quick) {
      arrive();
      wipe.classList.add('is-leaving');
      return wait(quick ? QUICK_MS : LEAVE_MS).then(function () {
        reset();
        if (queued) { var q = queued; queued = null; go(q.url, q.opts); }
      });
    };
    var go = function (url, opts) {
      if (navigating) { queued = { url: url, opts: opts }; return; }
      navigating = true;
      root.classList.add('is-navigating');
      activate(keyFor(url));
      closeMenu();
      wipe.classList.toggle('is-quick', !!opts.quick);
      wipe.classList.remove('is-leaving');
      wipe.classList.add('is-covering');
      hintTimer = setTimeout(function () { wipe.classList.add('is-waiting'); }, HINT_MS);
      Promise.all([wait(opts.quick ? QUICK_MS : COVER_MS), load(url.href)]).then(function (r) {
        clearTimeout(hintTimer);
        wipe.classList.remove('is-waiting');
        delete cache[url.href];
        if (opts.push) {
          history.replaceState({ scroll: window.scrollY }, '');
          history.pushState({ scroll: 0 }, '', url.href);
        }
        swap(r[1]);
        currentKey = url.pathname + url.search;
        placeScroll(url, opts.scroll);
        updateHeader();
        main.focus({ preventScroll: true });
        return settle(main);
      }).then(function () {
        return drop(opts.quick);
      }).then(null, function () {
        location.href = url.href;
      });
    };

    doc.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = closest(e.target, 'a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.getAttribute('href').charAt(0) === '#') return;
      var url = parseUrl(a.href);
      if (!url || !isPage(url)) return;
      if (samePage(url)) {
        if (url.hash) return;
        e.preventDefault();
        closeMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      e.preventDefault();
      go(url, { push: true, scroll: 0 });
    });
    doc.addEventListener('pointerenter', function (e) {
      var a = closest(e.target, 'a[href]');
      if (!a || a.target === '_blank') return;
      var url = parseUrl(a.href);
      if (!url || !isPage(url) || url.pathname + url.search === currentKey) return;
      load(url.href).catch(function () {});
    }, true);
    window.addEventListener('popstate', function (e) {
      var url = new URL(location.href);
      if (url.pathname + url.search === currentKey) return;
      go(url, { push: false, scroll: (e.state && e.state.scroll) || 0, quick: true });
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) reset(); });
  }

  function initDot() {
    var blueEl = null, blueHit = false;
    var onBlue = function (el) {
      if (el === blueEl) return blueHit;
      blueEl = el; blueHit = false;
      for (; el && el.nodeType === 1 && el !== root; el = el.parentElement) {
        var bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') { blueHit = bg === BLUE; break; }
      }
      return blueHit;
    };
    var droplet = function (vars) {
      var el = doc.createElement('i');
      Object.keys(vars).forEach(function (k) { el.style.setProperty('--' + k, vars[k]); });
      el.style.setProperty('--r', deg());
      return el;
    };

    if (!reduceMotion) {
      doc.addEventListener('pointerdown', function (e) {
        if (e.button !== 0 || !e.isPrimary) return;
        var splat = doc.createElement('div');
        splat.className = 'splat' + (onBlue(e.target) ? ' is-white' : '');
        splat.style.left = e.clientX + 'px'; splat.style.top = e.clientY + 'px';
        var n = Math.round(between(DOT.splat.count));
        for (var i = 0; i < n; i++) {
          var angle = (i / n) * Math.PI * 2 + rnd(-.35, .35), dist = between(DOT.splat.distance);
          splat.appendChild(droplet({ dx: px(Math.cos(angle) * dist), dy: px(Math.sin(angle) * dist), s: px(between(DOT.splat.size)) }));
        }
        doc.body.appendChild(splat);
        setTimeout(function () { splat.remove(); }, DOT.splat.life);
      }, { passive: true });
    }

    if (!finePointer) return;
    var cursor = null, trail = null, live = 0, lastX = 0, lastY = 0, lastEmit = 0;
    var emit = function (x, y, white) {
      var t = DOT.trail;
      var p = droplet({
        x: 'calc(' + x.toFixed(1) + 'px + ' + px(rnd(-t.spread, t.spread)) + ')',
        y: 'calc(' + y.toFixed(1) + 'px + ' + px(rnd(-t.spread, t.spread)) + ')',
        dx: px(rnd(-t.sway, t.sway)),
        dy: px(between(t.drift)),
        s: px(between(t.size))
      });
      if (white) p.className = 'is-white';
      trail.appendChild(p); live++;
      setTimeout(function () { p.remove(); live--; }, t.life);
    };
    doc.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      if (!cursor) {
        cursor = doc.createElement('div'); cursor.className = 'cursor'; doc.body.appendChild(cursor);
        trail = doc.createElement('div'); trail.className = 'trail'; doc.body.appendChild(trail);
        root.classList.add('has-cursor');
        lastX = e.clientX; lastY = e.clientY;
      }
      cursor.style.setProperty('--x', e.clientX + 'px'); cursor.style.setProperty('--y', e.clientY + 'px');
      cursor.classList.toggle('is-hidden', !!closest(e.target, 'input, textarea, select'));
      cursor.classList.toggle('is-link', !!closest(e.target, 'a, button, [role="button"], label, summary, [data-ticker]'));
      var white = onBlue(e.target);
      cursor.classList.toggle('is-white', white);
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (!reduceMotion && live < DOT.trail.max && e.timeStamp - lastEmit > DOT.trail.every && Math.hypot(dx, dy) > DOT.trail.minMove) {
        emit(e.clientX - dx * .6, e.clientY - dy * .6, white);
        lastEmit = e.timeStamp;
      }
      lastX = e.clientX; lastY = e.clientY;
    }, { passive: true });
    doc.addEventListener('pointerover', function (e) {
      if (cursor && e.target.tagName === 'IFRAME') cursor.classList.add('is-hidden');
    }, true);
    doc.addEventListener('pointerdown', function (e) { if (cursor && e.pointerType !== 'touch') cursor.classList.add('is-down'); }, { passive: true });
    doc.addEventListener('pointerup', function () { if (cursor) cursor.classList.remove('is-down'); }, { passive: true });
    root.addEventListener('mouseleave', function () { if (cursor) cursor.classList.add('is-hidden'); });
    root.addEventListener('mouseenter', function () { if (cursor) cursor.classList.remove('is-hidden'); });
  }

  function initTilt() {
    if (!finePointer || reduceMotion) return;
    var el = null, frame = 0, targetX = 0, targetY = 0, x = 0, y = 0;
    var clear = function (node) { node.style.removeProperty('--tilt-x'); node.style.removeProperty('--tilt-y'); };
    var render = function () {
      x += (targetX - x) * TILT.ease; y += (targetY - y) * TILT.ease;
      var settled = Math.abs(targetX - x) < .02 && Math.abs(targetY - y) < .02;
      if (settled) { x = targetX; y = targetY; }
      if (!el) { frame = 0; return; }
      if (settled && !targetX && !targetY) { clear(el); el = null; frame = 0; return; }
      el.style.setProperty('--tilt-x', x.toFixed(2) + 'deg');
      el.style.setProperty('--tilt-y', y.toFixed(2) + 'deg');
      frame = settled ? 0 : requestAnimationFrame(render);
    };
    var kick = function () { if (!frame) frame = requestAnimationFrame(render); };
    doc.addEventListener('pointermove', function (e) {
      var node = closest(e.target, '[data-tilt]');
      if (!node) return;
      if (node !== el) { if (el) clear(el); el = node; x = 0; y = 0; }
      var r = node.getBoundingClientRect();
      targetX = -((e.clientY - r.top) / r.height - .5) * TILT.degrees;
      targetY = ((e.clientX - r.left) / r.width - .5) * TILT.degrees;
      kick();
    }, { passive: true });
    doc.addEventListener('pointerout', function (e) {
      var node = closest(e.target, '[data-tilt]');
      if (!node || node.contains(e.relatedTarget)) return;
      targetX = 0; targetY = 0;
      kick();
    });
  }

  function initTunerBridge() {
    if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'bv-dot' && d.dot) {
        ['splat', 'trail'].forEach(function (group) {
          if (!d.dot[group]) return;
          Object.keys(d.dot[group]).forEach(function (key) { if (key in DOT[group]) DOT[group][key] = d.dot[group][key]; });
        });
        return;
      }
      if (d.type !== 'bv-tear' || !d.vars) return;
      Object.keys(d.vars).forEach(function (k) {
        var v = String(d.vars[k]);
        if (/^--tear-(b|t|l|r|line|bl|br|dot)[123]$/.test(k) && /^url\("data:image\/svg\+xml,[^"]*"\)$/.test(v)) root.style.setProperty(k, v);
        if (k === '--cursor-size' && /^calc\(\d+(\.\d+)? \* var\(--px\)\)$/.test(v)) root.style.setProperty(k, v);
      });
      root.style.animation = 'none'; void root.offsetWidth; root.style.animation = '';
    });
  }

  function initSplash() {
    var splash = doc.querySelector('[data-splash]');
    if (!splash || !root.classList.contains('splash-pending')) return;
    var logoBox = splash.querySelector('[data-splash-logo]'), pop = splash.querySelector('[data-splash-pop]');
    var popped = false, done = false, revealTimer = 0;
    var finish = function () {
      if (done) return;
      done = true;
      clearTimeout(failSafe); clearTimeout(revealTimer);
      doc.removeEventListener('pointerdown', skip); doc.removeEventListener('keydown', skip);
      try { sessionStorage.setItem('bv-splash', '1'); } catch (e) {}
      splash.classList.add('is-done');
      setTimeout(function () { root.classList.remove('splash-pending'); }, SPLASH_FADE_MS);
    };
    var popFrom = function (x, y) {
      if (popped) return;
      popped = true;
      clearTimeout(revealTimer);
      pop.style.left = x + 'px'; pop.style.top = y + 'px';
      var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      pop.classList.add('is-popping');
      requestAnimationFrame(function () { pop.style.transform = 'scale(' + ((r * 2) / 40 + 1) + ')'; });
      setTimeout(finish, 720);
    };
    var findDot = function (svg) {
      var dot = svg.querySelector('.drop path'), bestArea = 0;
      if (dot) return dot;
      svg.querySelectorAll('[fill="#558eff"]').forEach(function (el) {
        if (el.closest('.pnt, .drp, [class^="dp"]')) return;
        var r = el.getBoundingClientRect(), area = r.width * r.height;
        if (area > bestArea) { bestArea = area; dot = el; }
      });
      return dot;
    };
    var popFromDot = function () {
      var svg = logoBox.querySelector('svg'), dot = svg && findDot(svg), box = dot && dot.getBoundingClientRect();
      if (box && box.width) popFrom(box.left + box.width / 2, box.top + box.height / 2);
      else popFrom(innerWidth / 2, innerHeight / 2);
    };
    var skip = function () { popFromDot(); };
    var run = function (svgText) {
      logoBox.innerHTML = svgText;
      revealTimer = setTimeout(popFromDot, 2300);
    };
    var failSafe = setTimeout(finish, 6000);
    doc.addEventListener('pointerdown', skip);
    doc.addEventListener('keydown', skip);
    fetch(splash.getAttribute('data-src'))
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(function (t) { clearTimeout(failSafe); run(t); })
      .catch(finish);
  }
})();
