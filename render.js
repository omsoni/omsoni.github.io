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

  /* ---------- PlantUML: encode source as hex (~h), no library needed ---------- */
  function plantumlUrl(source) {
    const bytes = new TextEncoder().encode(source);
    let hex = "";
    for (const b of bytes) hex += b.toString(16).padStart(2, "0");
    const fmt = SITE.plantumlFormat === "png" ? "png" : "svg";
    return { url: `${SITE.plantumlServer}/${fmt}/~h${hex}`, fmt };
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

  /* ---------- diagrams / images ---------- */
  function renderDiagram(d) {
    if (d.type === "image") {
      const fig = el("figure", { class: "figure" }, el("img", { src: d.src, alt: d.caption || "image", loading: "lazy" }));
      if (d.caption) mount(fig, el("figcaption", { text: d.caption }));
      return fig;
    }
    if (d.type === "plantuml") {
      const { url } = plantumlUrl(d.source);
      const fig = el("figure", { class: "figure" });
      const img = el("img", {
        src: url,
        alt: d.caption || "PlantUML diagram",
        loading: "lazy",
        onerror: function () {
          fig.classList.add("figure--error");
          fig.textContent = "";
          mount(fig, el("p", { text: "Diagram failed to render. PlantUML source:" }));
          mount(fig, el("pre", { text: d.source }));
        },
      });
      mount(fig, img);
      if (d.caption) mount(fig, el("figcaption", { text: d.caption }));
      // collapsible source so the diagram stays editable/inspectable
      const details = el("details", {}, [
        el("summary", { text: "View PlantUML source" }),
        el("pre", { text: d.source }),
      ]);
      mount(fig, details);
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

  /* ---------- sections ---------- */
  function renderSection(section) {
    const card = el("article", { class: "card" });
    if (section.heading) mount(card, el("h2", { text: section.heading }));
    if (section.body) {
      (Array.isArray(section.body) ? section.body : [section.body]).forEach((p) =>
        mount(card, el("p", { text: p }))
      );
    }
    renderDiagrams(section.diagrams).forEach((fig) => mount(card, fig));
    mount(card, renderLinks(section.links));
    if (section.repos) renderRepos(card, section.repos);
    return card;
  }

  /* ---------- header / footer ---------- */
  function currentPageKey() {
    const body = document.body;
    if (body.dataset.page) return body.dataset.page;
    const file = location.pathname.split("/").pop() || "index.html";
    const match = SITE.nav.find((n) => n.href === file);
    return match ? match.key : "home";
  }

  function renderHeader(activeKey) {
    const host = document.getElementById("site-header");
    if (!host) return;
    const nav = el(
      "nav",
      { class: "site-nav" },
      SITE.nav.map((n) =>
        el("a", { href: n.href, class: n.key === activeKey ? "is-active" : "", text: n.label })
      )
    );
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
