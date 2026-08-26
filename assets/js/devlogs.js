/* Blue Variable Studio — devlog list + markdown post reader with #/slug routing */
(function () {
  "use strict";

  var listView = document.getElementById("devlog-list-view");
  var postView = document.getElementById("devlog-post-view");
  var listEl = document.getElementById("devlog-list");
  var articleEl = document.getElementById("devlog-article");
  var metaEl = document.getElementById("devlog-meta");
  var manifest = null;

  function loadManifest() {
    if (manifest) return Promise.resolve(manifest);
    return fetch("devlogs/index.json")
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (posts) {
        manifest = posts;
        return posts;
      });
  }

  function currentSlug() {
    var m = window.location.hash.match(/^#\/(.+)$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function renderList(posts) {
    listEl.textContent = "";
    if (!posts.length) {
      listEl.innerHTML = '<p class="empty-note">No posts yet — first one is on its way.</p>';
      return;
    }
    posts.forEach(function (post) {
      var a = document.createElement("a");
      a.className = "post-card";
      a.href = "#/" + encodeURIComponent(post.slug);

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
      listEl.appendChild(a);
    });
  }

  function showList() {
    postView.hidden = true;
    listView.hidden = false;
    document.title = "Devlogs — Blue Variable Studio";
    window.scrollTo(0, 0);
  }

  function showPost(slug, posts) {
    var post = null;
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].slug === slug) { post = posts[i]; break; }
    }
    listView.hidden = true;
    postView.hidden = false;
    window.scrollTo(0, 0);

    if (!post) {
      metaEl.textContent = "";
      articleEl.innerHTML = '<h1>Post not found</h1><p class="empty-note">That devlog doesn’t exist (yet).</p>';
      document.title = "Devlogs — Blue Variable Studio";
      return;
    }

    metaEl.textContent = post.date;
    document.title = post.title + " — Blue Variable Studio";
    articleEl.innerHTML = '<p class="empty-note">Loading…</p>';

    fetch("devlogs/" + post.slug + ".md")
      .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function (md) {
        articleEl.innerHTML = window.BVSMarkdown.render(md);
      })
      .catch(function () {
        articleEl.innerHTML = '<h1>' + post.title + '</h1><p class="empty-note">Couldn’t load this post. Try again in a bit.</p>';
      });
  }

  function route() {
    loadManifest()
      .then(function (posts) {
        var slug = currentSlug();
        if (slug) {
          showPost(slug, posts);
        } else {
          renderList(posts);
          showList();
        }
      })
      .catch(function () {
        listView.hidden = false;
        postView.hidden = true;
        listEl.innerHTML = '<p class="empty-note">Couldn’t load the devlog index.</p>';
      });
  }

  window.addEventListener("hashchange", route);
  route();
})();
