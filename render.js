/* =========================================================================
   render.js — turns the SITE data (content.js) into rendered pages.
   You normally never need to edit this file; edit content.js instead.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- small DOM helpers ---------- */
  function el(tag, props, children) {
    const node = document.createElement(tag);
    if (props) {
      for (const k in props) {
        if (k === "class") node.className = props[k];
        else if (k === "html") node.innerHTML = props[k];
        else if (k === "text") node.textContent = props[k];
        else if (k.startsWith("on") && typeof props[k] === "function")
          node.addEventListener(k.slice(2), props[k]);
        else if (props[k] != null) node.setAttribute(k, props[k]);
      }
    }
    (Array.isArray(children) ? children : children != null ? [children] : [])
      .forEach((c) => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  }
  const mount = (parent, child) => { if (child) parent.appendChild(child); return parent; };

  /* ---------- PlantUML encoding (no external library) ----------
     Primary: DEFLATE + PlantUML base64 — compact, handles large diagrams.
     Fallback: hex (~h) for browsers without CompressionStream.            */
  function plantumlEnc6(b) {
    b &= 0x3f;
    if (b < 10) return String.fromCharCode(48 + b);
    b -= 10; if (b < 26) return String.fromCharCode(65 + b);
    b -= 26; if (b < 26) return String.fromCharCode(97 + b);
    b -= 26; return b === 0 ? "-" : b === 1 ? "_" : "?";
  }
  function plantumlEncode64(data) {
    const a3 = (b1, b2, b3) =>
      plantumlEnc6(b1 >> 2) +
      plantumlEnc6(((b1 & 0x3) << 4) | (b2 >> 4)) +
      plantumlEnc6(((b2 & 0xf) << 2) | (b3 >> 6)) +
      plantumlEnc6(b3 & 0x3f);
    let r = "";
    for (let i = 0; i < data.length; i += 3) {
      if (i + 2 === data.length) r += a3(data[i], data[i + 1], 0);
      else if (i + 1 === data.length) r += a3(data[i], 0, 0);
      else r += a3(data[i], data[i + 1], data[i + 2]);
    }
    return r;
  }
  async function plantumlUrl(source) {
    const fmt = SITE.plantumlFormat === "png" ? "png" : "svg";
    const bytes = new TextEncoder().encode(source);
    if (typeof CompressionStream !== "undefined") {
      try {
        const cs = new CompressionStream("deflate-raw");
        const w = cs.writable.getWriter();
        w.write(bytes); w.close();
        const buf = new Uint8Array(await new Response(cs.readable).arrayBuffer());
        return `${SITE.plantumlServer}/${fmt}/${plantumlEncode64(buf)}`;
      } catch (e) { /* fall through to hex */ }
    }
    let hex = "";
    for (const b of bytes) hex += b.toString(16).padStart(2, "0");
    return `${SITE.plantumlServer}/${fmt}/~h${hex}`;
  }

  /* ---------- links ---------- */
  function linkTypeLabel(type) {
    return type === "github" ? "GitHub" : type === "internal" ? "Internal" : "External";
  }
  function renderLink(link) {
    const type = link.type || "external";
    const external = type !== "internal";
    const badge = el("span", { class: `link-badge link-badge--${type}`, text: linkTypeLabel(type) });
    const label = el("span", { text: link.label || link.url });
    const arrow = el("span", { class: "link-arrow", text: external ? "↗" : "→" });
    const a = el(
      "a",
      external
        ? { href: link.url, target: "_blank", rel: "noopener noreferrer" }
        : { href: link.url },
      [badge, label, arrow]
    );
    return el("li", { class: "link-item" }, a);
  }
  function renderLinks(links) {
    if (!links || !links.length) return null;
    return el("ul", { class: "links" }, links.map(renderLink));
  }

  /* ---------- diagrams / images ----------
     Adds a zoom/pan viewport: zoom in/out, fit-to-width, actual size,
     drag-to-pan, ctrl/⌘+wheel zoom, double-click zoom, and open-full-size.
     Returns the "Open ↗" anchor so the caller can set its href.          */
  function attachZoomControls(fig, img) {
    fig.classList.add("figure--zoom");
    const viewport = el("div", { class: "figure__viewport" });
    viewport.appendChild(img);

    const label = el("span", { class: "figure__zoomlevel", text: "—" });
    const btn = (txt, title, on) =>
      el("button", { class: "figure__btn", type: "button", title: title, "aria-label": title, onclick: on, text: txt });
    const openLink = el("a", {
      class: "figure__btn", target: "_blank", rel: "noopener noreferrer",
      text: "Open ↗", title: "Open full size in a new tab",
    });

    let scale = 1, natW = 0;
    const apply = () => {
      if (natW) { img.style.width = natW * scale + "px"; img.style.maxWidth = "none"; }
      label.textContent = natW ? Math.round(scale * 100) + "%" : "—";
    };
    const zoom = (f) => { scale = Math.max(0.1, Math.min(8, scale * f)); apply(); };
    const fit = () => { if (natW) { scale = Math.max(0.1, (viewport.clientWidth - 4) / natW); apply(); } };

    const toolbar = el("div", { class: "figure__toolbar" }, [
      btn("−", "Zoom out", () => zoom(1 / 1.25)),
      btn("+", "Zoom in", () => zoom(1.25)),
      btn("Fit", "Fit to width", fit),
      btn("1:1", "Actual size", () => { scale = 1; apply(); }),
      label,
      openLink,
    ]);
    fig.appendChild(toolbar);
    fig.appendChild(viewport);

    const onReady = () => { natW = img.naturalWidth || 0; fit(); };
    if (img.complete && img.naturalWidth) onReady();
    else img.addEventListener("load", onReady);

    // drag-to-pan via native scroll
    let drag = false, sx = 0, sy = 0, sl = 0, st = 0;
    viewport.addEventListener("pointerdown", (e) => {
      drag = true;
      try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
      sx = e.clientX; sy = e.clientY; sl = viewport.scrollLeft; st = viewport.scrollTop;
      viewport.classList.add("is-grabbing");
    });
    viewport.addEventListener("pointermove", (e) => {
      if (!drag) return;
      viewport.scrollLeft = sl - (e.clientX - sx);
      viewport.scrollTop = st - (e.clientY - sy);
    });
    const endDrag = () => { drag = false; viewport.classList.remove("is-grabbing"); };
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("wheel", (e) => {
      if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoom(e.deltaY < 0 ? 1.1 : 0.9); }
    }, { passive: false });
    viewport.addEventListener("dblclick", () => zoom(1.3));

    return openLink;
  }

  function renderDiagram(d) {
    if (d.type === "image") {
      const fig = el("figure", { class: "figure" });
      const img = el("img", { alt: d.caption || "image", loading: "lazy" });
      const open = attachZoomControls(fig, img);
      open.href = d.src;
      img.src = d.src;
      if (d.caption) mount(fig, el("figcaption", { text: d.caption }));
      return fig;
    }
    if (d.type === "plantuml") {
      const fig = el("figure", { class: "figure" });
      const fail = function () {
        fig.classList.add("figure--error");
        fig.textContent = "";
        mount(fig, el("p", { text: "Diagram failed to render. PlantUML source:" }));
        mount(fig, el("pre", { text: d.source }));
      };
      const img = el("img", { alt: d.caption || "PlantUML diagram", loading: "lazy", onerror: fail });
      const open = attachZoomControls(fig, img);
      if (d.caption) mount(fig, el("figcaption", { text: d.caption }));
      // collapsible source so the diagram stays editable/inspectable
      mount(fig, el("details", {}, [
        el("summary", { text: "View PlantUML source" }),
        el("pre", { text: d.source }),
      ]));
      plantumlUrl(d.source).then((url) => { img.src = url; open.href = url; }).catch(fail);
      return fig;
    }
    return null;
  }
  function renderDiagrams(diagrams) {
    return (diagrams || []).map(renderDiagram).filter(Boolean);
  }

  /* ---------- GitHub repos (live) ---------- */
  async function renderRepos(container, opts) {
    const o = opts === true ? {} : opts || {};
    const user = SITE.profile.githubUsername;
    const loading = el("p", { class: "figure figure--loading", text: "Loading GitHub repositories…" });
    container.appendChild(loading);
    try {
      const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`);
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      let repos = await res.json();
      if (!Array.isArray(repos)) throw new Error("Unexpected GitHub response");
      if (o.includeForks === false) repos = repos.filter((r) => !r.fork);
      if (o.sort === "stars") repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
      else repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
      if (o.limit) repos = repos.slice(0, o.limit);

      loading.remove();
      if (!repos.length) { container.appendChild(el("p", { text: "No public repositories yet." })); return; }

      const grid = el("div", { class: "repos" });
      repos.forEach((r) => {
        const card = el("div", { class: "repo" }, [
          el("h3", {}, el("a", { href: r.html_url, target: "_blank", rel: "noopener noreferrer", text: r.name })),
          el("p", { text: r.description || "No description" }),
        ]);
        const meta = el("div", { class: "repo__meta" });
        if (r.language) mount(meta, el("span", { class: "repo__lang", text: r.language }));
        mount(meta, el("span", { text: `★ ${r.stargazers_count}` }));
        if (r.forks_count) mount(meta, el("span", { text: `⑂ ${r.forks_count}` }));
        mount(card, meta);
        grid.appendChild(card);
      });
      container.appendChild(grid);
    } catch (err) {
      loading.className = "figure figure--error";
      loading.textContent = `Couldn't load repositories (${err.message}). `;
      mount(loading, el("a", { href: `https://github.com/${user}`, target: "_blank", rel: "noopener noreferrer", text: "View on GitHub ↗" }));
    }
  }

  /* ---------- minimal markdown (headings, bold, code, bullet lists) ---------- */
  function mdInline(text) {
    // escape, then apply **bold** and `code`
    const span = el("span");
    let html = text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+?)`/g, "<code>$1</code>");
    span.innerHTML = html;
    return span;
  }
  function renderMarkdown(md) {
    const frag = document.createDocumentFragment();
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    let i = 0, para = [], list = null;
    const flushPara = () => {
      if (para.length) { mount(frag, el("p", {}, mdInline(para.join(" ")))); para = []; }
    };
    const flushList = () => { if (list) { frag.appendChild(list); list = null; } };
    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) { flushPara(); flushList(); }
      else if (/^#{1,6}\s/.test(line)) {
        flushPara(); flushList();
        const level = line.match(/^#+/)[0].length;
        mount(frag, el("h" + Math.min(level + 2, 6), {}, mdInline(line.replace(/^#+\s/, ""))));
      } else if (/^[-*]\s+/.test(line)) {
        flushPara();
        if (!list) list = el("ul", { class: "md-list" });
        mount(list, el("li", {}, mdInline(line.replace(/^[-*]\s+/, ""))));
      } else { flushList(); para.push(line); }
      i++;
    }
    flushPara(); flushList();
    return frag;
  }

  /* ---------- sections ---------- */
  function renderSection(section) {
    const card = el("article", { class: "card" });
    if (section.heading) mount(card, el("h2", { text: section.heading }));
    if (section.body) {
      (Array.isArray(section.body) ? section.body : [section.body]).forEach((p) =>
        mount(card, el("p", { text: p }))
      );
    }
    if (section.markdown) card.appendChild(renderMarkdown(section.markdown));
    renderDiagrams(section.diagrams).forEach((fig) => mount(card, fig));
    mount(card, renderLinks(section.links));
    if (section.repos) renderRepos(card, section.repos);
    return card;
  }

  /* ---------- header / footer ---------- */
  function flatNav() {
    const out = [];
    SITE.nav.forEach((n) => { out.push(n); (n.children || []).forEach((c) => out.push(c)); });
    return out;
  }
  function currentPageKey() {
    const body = document.body;
    if (body.dataset.page) return body.dataset.page;
    const file = location.pathname.split("/").pop() || "index.html";
    const match = flatNav().find((n) => n.href === file);
    return match ? match.key : "home";
  }
  // a top-level item is active if it OR one of its children is the current page
  function isBranchActive(item, activeKey) {
    return item.key === activeKey || (item.children || []).some((c) => c.key === activeKey);
  }

  function renderNavItem(item, activeKey) {
    if (item.children && item.children.length) {
      const trigger = el("a", {
        href: item.href,
        class: "site-nav__top" + (isBranchActive(item, activeKey) ? " is-active" : ""),
      }, [item.label + " ", el("span", { class: "site-nav__caret", text: "▾" })]);
      const submenu = el("div", { class: "site-nav__submenu" },
        item.children.map((c) =>
          el("a", { href: c.href, class: c.key === activeKey ? "is-active" : "", text: c.label })
        )
      );
      return el("div", { class: "site-nav__group" }, [trigger, submenu]);
    }
    return el("a", { href: item.href, class: item.key === activeKey ? "is-active" : "", text: item.label });
  }

  function renderHeader(activeKey) {
    const host = document.getElementById("site-header");
    if (!host) return;
    const nav = el("nav", { class: "site-nav" }, SITE.nav.map((n) => renderNavItem(n, activeKey)));
    host.appendChild(
      el("header", { class: "site-header" },
        el("div", { class: "site-header__inner" }, [
          el("a", { class: "site-header__brand", href: "index.html", text: SITE.profile.name }),
          nav,
        ])
      )
    );
  }

  function renderFooter() {
    const host = document.getElementById("site-footer");
    if (!host) return;
    host.appendChild(
      el("footer", { class: "site-footer" }, [
        el("span", { text: `© ${new Date().getFullYear()} ${SITE.profile.name}` }),
        document.createTextNode(" · "),
        el("a", { href: `https://github.com/${SITE.profile.githubUsername}`, target: "_blank", rel: "noopener noreferrer", text: "GitHub" }),
      ])
    );
  }

  /* ---------- hero (home) ---------- */
  function renderHero(app) {
    const p = SITE.profile;
    const hero = el("section", { class: "hero" }, [
      el("h1", { text: p.name }),
      el("p", { class: "role", text: p.role }),
      el("p", { class: "blurb", text: p.blurb }),
    ]);
    if (p.links && p.links.length) {
      mount(hero, el("ul", { class: "links hero__links" }, p.links.map(renderLink)));
    }
    app.appendChild(hero);
  }

  /* ---------- page ---------- */
  function renderPage() {
    const key = currentPageKey();
    const page = SITE.pages[key];
    renderHeader(key);
    renderFooter();

    const app = document.getElementById("app");
    if (!app) return;
    if (!page) { app.appendChild(el("p", { text: `No content defined for "${key}".` })); return; }

    if (page.hero) renderHero(app);
    else if (page.title) {
      app.appendChild(
        el("div", { class: "page-head" }, [
          el("h1", { text: page.title }),
          page.intro ? el("p", { class: "intro", text: page.intro }) : null,
        ].filter(Boolean))
      );
    }
    (page.sections || []).forEach((s) => app.appendChild(renderSection(s)));
    document.title = (page.title || "Home") + " · " + SITE.profile.name;
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", renderPage);
  else renderPage();
})();
