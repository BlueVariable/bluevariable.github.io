/* Blue Variable Studio — intro sequence + page behaviors */
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

  /* ---------- sticky header hairline ---------- */
  var head = document.querySelector(".site-head");
  if (head) {
    var onScroll = function () {
      head.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- scroll-triggered reveals ---------- */
  var revealables = document.querySelectorAll(".reveal-on-scroll");
  if (revealables.length && "IntersectionObserver" in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- devlog teaser (homepage) ---------- */
  var teaser = document.getElementById("devlog-teaser");
  if (teaser) {
    fetch("devlogs/index.json")
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (posts) {
        posts.slice(0, 2).forEach(function (post) {
          var a = document.createElement("a");
          a.className = "post-card";
          a.href = "devlogs.html#/" + encodeURIComponent(post.slug);

          var t = document.createElement("time");
          t.dateTime = post.date;
          t.textContent = post.date;

          var mid = document.createElement("div");
          var title = document.createElement("p");
          title.className = "post-title";
          title.textContent = post.title;
          var sum = document.createElement("p");
          sum.className = "post-summary";
          sum.textContent = post.summary || "";
          mid.appendChild(title);
          mid.appendChild(sum);

          var arrow = document.createElement("span");
          arrow.className = "arrow";
          arrow.textContent = "→";

          a.appendChild(t);
          a.appendChild(mid);
          a.appendChild(arrow);
          teaser.appendChild(a);
        });
      })
      .catch(function () {
        teaser.innerHTML = '<p class="empty-note">Devlogs are coming soon.</p>';
      });
  }
})();
