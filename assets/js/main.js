/* Blue Variable Studio — intro sequence + menu-driven views */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var intro = document.getElementById("intro");

  function seenIntro() {
    try { return sessionStorage.getItem("bvsIntroSeen") === "1"; }
    catch (e) { return false; }
  }
  function markSeen() {
    try { sessionStorage.setItem("bvsIntroSeen", "1"); } catch (e) {}
  }

  function finishInstantly() {
    if (intro) intro.classList.add("is-hidden");
    document.body.classList.add("ready");
    markSeen();
  }

  /* ---------- intro: reveal -> dot flood -> unveil ---------- */
  function runIntro() {
    var flood = intro.querySelector(".intro-flood");
    var logo = intro.querySelector(".intro-logo");
    var done = false;

    // Force the flood to always start from the wordmark's blue dot.
    function positionFlood() {
      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      var dot = intro.querySelector(".drop");
      if (dot && dot.getBoundingClientRect) {
        var r = dot.getBoundingClientRect();
        if (r.width > 0) {
          cx = r.left + r.width / 2;
          cy = r.top + r.height / 2;
        }
      }
      flood.style.left = cx + "px";
      flood.style.top = cy + "px";
      // Scale a 24px circle until it covers the farthest viewport corner.
      var far = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(window.innerWidth - cx, cy),
        Math.hypot(cx, window.innerHeight - cy),
        Math.hypot(window.innerWidth - cx, window.innerHeight - cy)
      );
      flood.style.setProperty("--flood-scale", String((far * 2) / 24 * 1.05));
    }

    function startFlood() {
      if (done) return;
      positionFlood();
      intro.classList.add("is-flooding");
      window.setTimeout(startUnveil, 780);
    }

    function startUnveil() {
      if (done) return;
      // Screen is solid blue now: swap to a blue overlay, then collapse it.
      intro.style.background = "#558eff";
      logo.style.visibility = "hidden";
      flood.style.display = "none";
      intro.classList.add("is-unveiling");
      document.body.classList.add("ready");
      markSeen();
      // small hold on the blue frame, then clip away
      window.setTimeout(function () {
        intro.classList.add("clip-out");
      }, 220);
      intro.addEventListener("transitionend", hideIntro);
      window.setTimeout(hideIntro, 1400); // fallback
    }

    function hideIntro() {
      if (done) return;
      done = true;
      intro.classList.add("is-hidden");
    }

    function skip() {
      if (done) return;
      done = true;
      intro.classList.add("is-hidden");
      document.body.classList.add("ready");
      markSeen();
    }

    intro.addEventListener("click", skip);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    });

    // Reveal animation ends ~2.2s in; give it a short hold, then flood.
    window.setTimeout(startFlood, 2600);
  }

  if (intro) {
    if (reducedMotion || seenIntro()) {
      finishInstantly();
    } else {
      runIntro();
    }
  } else {
    document.body.classList.add("ready");
  }

  /* ---------- menu-driven views (no page scrolling) ---------- */
  var mainEl = document.querySelector("main");
  var views = Array.prototype.slice.call(document.querySelectorAll("main .view"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));

  function showView(id) {
    var target = document.getElementById(id);
    if (!target || views.indexOf(target) === -1) return; // unknown hash: keep current view
    views.forEach(function (v) {
      v.classList.toggle("is-active", v === target);
    });
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    mainEl.scrollTop = 0;
  }

  function routeView() {
    var hash = window.location.hash || "#studio";
    showView(hash.slice(1));
  }

  if (views.length) {
    window.addEventListener("hashchange", routeView);
    routeView();
  }
})();
