# MOSAIC Human Sexuality Frameworks Website

A production-ready, zero-install static website for:

- **MOSAIC** — Multidimensional Orientation of Sexuality, Attraction, Identity, and Conduct
- **TRIAD** — Triadic Relational Interests, Attractions, and Dynamics
- **SCOPE** — Structure, Consent, Openness, Power, and Entanglement

## Included pages

- `index.html` — MOSAIC landing page and model overview
- `triad/index.html` — TRIAD framework page with interactive topology explorer
- `scope/index.html` — SCOPE framework page with relationship-ecology explorer
- `assessment/index.html` — complete browser-only ATLAS/MOSAIC assessment
- `research/index.html` — evidentiary status, validation roadmap, ethics, limits, and privacy

## Run locally

### Fastest method

Double-click `index.html`. Most features work directly from the file system.

### Recommended local server

Windows:

```bat
serve.bat
```

macOS/Linux:

```bash
./serve.sh
```

Then open `http://localhost:8080`.

## Deploy

This folder can be deployed as-is to:

- GitHub Pages
- Netlify
- Cloudflare Pages
- Azure Static Web Apps
- Any standard static web host

No build step, package installation, database, API key, or runtime framework is required.

## Privacy and assessment status

The integrated assessment runs in the browser using session-only storage by default. It is a research-informed public preview, not a validated psychological test, diagnosis, readiness certification, identity adjudicator, compatibility verdict, or clinical tool.

## Project structure

```text
mosaic-framework-site/
├── index.html
├── triad/
├── scope/
├── assessment/
├── research/
├── assets/
│   ├── css/styles.css
│   ├── js/app.js
│   ├── js/profile-demo.js
│   ├── js/assessment.js
│   └── img/logo.svg
├── favicon.svg
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── serve.bat
└── serve.sh
```

## Customization

The visual design system is centralized in `assets/css/styles.css`. Update the CSS variables at the top of that file to change colors, typography, surface treatments, spacing, and layout widths.

## v1.1 ATLAS integration

The former six-dimension profile preview has been replaced by the complete ATLAS/MOSAIC public assessment runtime under `assessment/`.

The integrated assessment includes:

- 490 rendered question controls across MOSAIC, TRIAD, and SCOPE
- browser-session-only response handling
- sensitive-content notices and optional-detail gating
- deterministic scoring and narrative guardrails
- deployment/privacy configuration files
- public privacy, terms, and about pages
- GitHub Pages `CNAME` and `.nojekyll` files

The public assessment remains a research-informed preview and is not a diagnosis, clinical instrument, identity adjudicator, compatibility verdict, or consent/readiness certification.
