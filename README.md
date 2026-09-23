# Sarvesh Nair — Portfolio

A 4-page personal portfolio built with plain HTML, CSS and JavaScript — no
frameworks, no build step. Open `index.html` in a browser and it works;
upload the folder to any static host and it works there too.

## Structure

```
index.html          Home — hero, about, skills, certifications, experience, projects
resume.html          Résumé — full write-up + "Download PDF" button
blog.html            Blog — 4 expandable posts
contact.html         Contact — email CTA, copy-to-clipboard, phone/LinkedIn/GitHub
css/style.css         All styling (one file, organized in numbered sections)
js/script.js          All behaviour (nav, tooltips, carousel, accordion, etc.)
assets/
  Sarvesh-Nair-Resume.pdf   Downloadable résumé (linked from resume.html)
  favicon.svg / favicon.png Site icon
```

Each HTML page repeats its own header/nav/footer markup rather than loading
a shared partial with JavaScript. That's intentional: `fetch()`-based
partials silently fail when a page is opened directly from disk
(`file://…`) instead of through a server, and the goal here is a site that
works the moment you double-click `index.html` — no local server required.

## Editing content

Everything is plain text inside the HTML files — search for the text you
want to change and edit it directly. A few spots you'll likely want to
revisit:

- **Email / phone** — appears in each page's footer and nav ("Email me"),
  and on `contact.html` / `resume.html`. It's currently
  `sarveshnair2003@gmail.com` and `+91 75061 71031`.
- **Skill comments** — in `index.html`, search for `skill-tip`; each skill
  pill has one `<span class="skill-tip">` with the text shown on hover/tap.
- **Certifications carousel** — search for `cert-card` in `index.html`;
  each `<article>` is one slide.
- **Blog posts** — `blog.html`, one `<article class="blog-post">` per post.
- **Résumé PDF** — `assets/Sarvesh-Nair-Resume.pdf` is a generated file, not
  hand-edited. If you update your résumé content, either regenerate a PDF
  from your own tools and replace that file (keep the same filename), or
  ask to have it regenerated from updated content.
- **Photo** — there's no headshot yet; the hero uses a small "console"
  graphic instead. To add one, drop an image into `assets/` and swap it in
  for the `.console` block in `index.html`.

## Deploying

Any static host works. Two quick options:

- **GitHub Pages** — push this folder to a repo, then enable Pages for it
  (Settings → Pages → deploy from branch). No build step needed.
- **Netlify / Vercel** — drag-and-drop the folder onto their dashboard, or
  connect the repo. Framework preset: "None" / "Static".

## Notes on the design

The visual language ("Ops Console") leans on the terminal/monitoring
vocabulary of systems and cloud work — a dark ink background, a signal-amber
accent, IBM Plex Sans for text and IBM Plex Mono for status-style details
(the hero panel, tags, labels). Fonts load from Google Fonts via the `<link>`
tags in each page's `<head>`; if that request ever fails (e.g. no internet
access), the page falls back to the system font stack automatically — the
layout doesn't depend on the web font loading.

Accessibility basics are built in: skip-to-content link, visible focus
states, semantic headings/landmarks, keyboard-operable skill tooltips and
carousel, and `prefers-reduced-motion` support (the hero's typing animation
and the carousel's auto-play both turn off automatically for anyone with
that preference set).
