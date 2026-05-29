# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website hosted via GitHub Pages at omsoni.github.io.

## Architecture

Static, build-free site for GitHub Pages. Content is **data-driven**: pages are
thin HTML shells that render from a single config.

- `content.js` — **the file to edit.** A `SITE` object holds the profile, shared
  nav, and per-page content. Sections support `body` (plain paragraphs),
  `markdown` (headings/bold/`code`/bullet lists), `links`, `diagrams`, and optional
  live GitHub `repos`. Adding a link, diagram, or doc means editing this list — no HTML.
- `render.js` — rendering engine. Builds the header/nav/footer, renders sections,
  renders markdown, fetches GitHub repos, and encodes PlantUML. Rarely needs changes.
- `style.css` — shared clean-professional-light theme (CSS variables at top).
- `*.html` — one shell per page. Each sets `<body data-page="KEY">` matching a key
  in `SITE.pages` and a `key` in `SITE.nav`; loads `content.js` then `render.js`.

Pages: `index.html` (home/hero + GitHub repos), `architectures.html`,
`ai-ml.html`, `enterprise-architecture.html`, `platform-architectures.html`
(landing page that links to platform sub-pages), and
`personalization-platform-architecture.html` (a Platform Architectures sub-page).

### Nav & dropdowns
`SITE.nav` is the shared top nav. A nav entry with a `children: [...]` array renders
as a hover/focus dropdown (used for Platform Architectures → its sub-pages). A parent
is highlighted active when it or any child is the current page.

### Link types
`type` on a link is `"github"`, `"external"` (opens new tab), or `"internal"`
(another page on this site). Each gets a colored badge.

### Markdown sections
A section may set `markdown: "..."` for structured docs. The minimal renderer in
`render.js` supports `#`/`##` headings, `- ` bullet lists, `**bold**`, and `` `code` ``.
Use this for capability lists, goals, NFRs, etc.

### PlantUML diagrams
Rendered live via the plantuml.com server with **no build step**. `render.js`
encodes the source with DEFLATE + PlantUML base64 (via the browser `CompressionStream`
API) and requests `…/plantuml/<fmt>/<encoded>`; it falls back to hex (`~h`) if
`CompressionStream` is unavailable. Deflate keeps URLs short — important because the
server rejects oversized request headers, so hex alone fails on large diagrams.
Configure server and `svg`/`png` via `SITE.plantumlServer` / `SITE.plantumlFormat`.
For large diagrams with `\n` label line-breaks, author the `source` with
`` String.raw`...` `` so the `\n` survives into PlantUML. Any external image works
too via `{ type: "image", src: "https://…" }`.

### Adding a page
1. Add a key under `SITE.pages` in `content.js`.
2. Add a `SITE.nav` entry with matching `key` (or a `children` entry for a sub-page).
3. Copy an existing `*.html`, change `<title>` and `data-page`.

## Local preview
`python3 -m http.server 8000` then open http://127.0.0.1:8000 (a server is needed
so the GitHub `fetch` and relative scripts work; opening the file directly won't).
