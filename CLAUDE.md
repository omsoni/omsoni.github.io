# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website hosted via GitHub Pages at omsoni.github.io.

## Architecture

Static, build-free site for GitHub Pages. Content is **data-driven**: pages are
thin HTML shells that render from a single config.

- `content.js` — **the file to edit.** A `SITE` object holds the profile, shared
  nav, and per-page content (sections with `body`, `links`, `diagrams`, optional
  live GitHub `repos`). Adding a link or diagram means editing this list — no HTML.
- `render.js` — rendering engine. Builds the header/nav/footer, renders sections,
  fetches GitHub repos, and encodes PlantUML. Rarely needs changes.
- `style.css` — shared clean-professional-light theme (CSS variables at top).
- `*.html` — one shell per page. Each sets `<body data-page="KEY">` matching a key
  in `SITE.pages` and a `key` in `SITE.nav`; loads `content.js` then `render.js`.

Pages: `index.html` (home/hero + GitHub repos), `software-architecture.html`,
`ai-ml.html`, `enterprise-architecture.html`.

### Link types
`type` on a link is `"github"`, `"external"` (opens new tab), or `"internal"`
(another page on this site). Each gets a colored badge.

### PlantUML diagrams
Rendered live via the plantuml.com server with **no build step**: `render.js`
hex-encodes the source and requests `…/plantuml/<fmt>/~h<hex>`. Configure the
server and `svg`/`png` format via `SITE.plantumlServer` / `SITE.plantumlFormat`.
Any external image works too via `{ type: "image", src: "https://…" }`.

### Adding a page
1. Add a key under `SITE.pages` in `content.js`.
2. Add a `SITE.nav` entry with matching `key`.
3. Copy an existing `*.html`, change `<title>` and `data-page`.

## Local preview
`python3 -m http.server 8000` then open http://127.0.0.1:8000 (a server is needed
so the GitHub `fetch` and relative scripts work; opening the file directly won't).
