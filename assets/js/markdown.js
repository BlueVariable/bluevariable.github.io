/* Blue Variable Studio — tiny dependency-free markdown renderer.
   Supports: h1-h4, paragraphs, bold, italic, links, images, inline code,
   fenced code blocks, ul/ol, blockquotes, hr. Input is HTML-escaped first. */
(function (global) {
  "use strict";

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function safeUrl(url) {
    var u = url.trim();
    if (/^(https?:\/\/|mailto:|#|\/|\.\/|\.\.\/)/i.test(u)) return u;
    if (/^[\w.\-\/]+$/.test(u)) return u; // bare relative path
    return "#";
  }

  function inline(text) {
    // images before links
    text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, alt, src) {
      return '<img src="' + safeUrl(src) + '" alt="' + alt + '" loading="lazy">';
    });
    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, href) {
      var external = /^https?:\/\//i.test(href);
      return '<a href="' + safeUrl(href) + '"' +
        (external ? ' target="_blank" rel="noopener"' : "") + ">" + label + "</a>";
    });
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>");
    text = text.replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>");
    return text;
  }

  function render(md) {
    var src = md.replace(/\r\n/g, "\n");
    var lines = src.split("\n");
    var html = [];
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];

      // fenced code block
      var fence = line.match(/^```(\w*)\s*$/);
      if (fence) {
        var code = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) {
          code.push(lines[i]);
          i++;
        }
        i++; // closing fence
        html.push(
          '<pre><code' + (fence[1] ? ' class="lang-' + fence[1] + '"' : "") + ">" +
          escapeHtml(code.join("\n")) + "</code></pre>"
        );
        continue;
      }

      if (/^\s*$/.test(line)) { i++; continue; }

      if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
        html.push("<hr>");
        i++;
        continue;
      }

      var h = line.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        var lvl = h[1].length;
        html.push("<h" + lvl + ">" + inline(escapeHtml(h[2])) + "</h" + lvl + ">");
        i++;
        continue;
      }

      if (/^\s*>\s?/.test(line)) {
        var quote = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          quote.push(lines[i].replace(/^\s*>\s?/, ""));
          i++;
        }
        html.push("<blockquote>" + render(quote.join("\n")) + "</blockquote>");
        continue;
      }

      if (/^\s*[-*+]\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          items.push("<li>" + inline(escapeHtml(lines[i].replace(/^\s*[-*+]\s+/, ""))) + "</li>");
          i++;
        }
        html.push("<ul>" + items.join("") + "</ul>");
        continue;
      }

      if (/^\s*\d+[.)]\s+/.test(line)) {
        var oitems = [];
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
          oitems.push("<li>" + inline(escapeHtml(lines[i].replace(/^\s*\d+[.)]\s+/, ""))) + "</li>");
          i++;
        }
        html.push("<ol>" + oitems.join("") + "</ol>");
        continue;
      }

      // paragraph: consume consecutive plain lines
      var para = [];
      while (
        i < lines.length &&
        !/^\s*$/.test(lines[i]) &&
        !/^(#{1,4})\s|^```|^\s*[-*+]\s+|^\s*\d+[.)]\s+|^\s*>\s?|^(-{3,}|\*{3,})\s*$/.test(lines[i])
      ) {
        para.push(lines[i]);
        i++;
      }
      html.push("<p>" + inline(escapeHtml(para.join(" "))) + "</p>");
    }

    return html.join("\n");
  }

  global.BVSMarkdown = { render: render };
})(window);
