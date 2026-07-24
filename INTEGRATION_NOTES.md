# MOSAIC Framework Website v1.1 — ATLAS Integration

## Integration result

The original MOSAIC framework website remains the primary public presentation layer. Its MOSAIC, TRIAD, SCOPE, and Research pages were retained.

The previous lightweight assessment preview was replaced with the complete ATLAS/MOSAIC public assessment application.

## Added or changed

- Replaced `/assessment/` with the 490-question public assessment runtime.
- Added `/privacy.html`, `/terms.html`, and `/about.html`.
- Added GitHub Pages `CNAME` and `.nojekyll` files.
- Added `_headers` for hosts that support declarative security headers.
- Added public build manifest and prelaunch checklist.
- Updated framework-page calls to action from “Profile preview” to “Take assessment.”
- Added legal/support links to existing framework-page footers.
- Updated sitemap and robots metadata for `mosaicsexuality.online`.

## Publishing

Upload the contents of this directory to the root of the GitHub Pages publishing branch. Do not upload the enclosing directory as an additional nested level.


## v0.6.1 slider hotfix

- Slider movement now immediately removes the “Not answered” state.
- Numeric companion fields remain synchronized.
- Range controls use one continuous input handler plus a change-event fallback for mobile/browser release behavior.
- JavaScript syntax validation passed.

## v0.6.2 dependent-question population fix

- Corrected questions whose rows or choices are populated from an earlier multi-select answer.
- D03 now lists the substantive identity terms selected in D01.
- D04 creates one independent fit slider for each substantive D01 selection.
- D05 creates one meaning-matrix row for each substantive D01 selection.
- Applied the same dependency handling to C01 → C03/C04 and SCOPE B01 → B03/B04/B05.
- Removed stale literal placeholder keys created by earlier builds while preserving still-valid per-item answers.
- When an upstream selection is removed, dependent rows and obsolete stored values are removed immediately.
- Added a headless Chromium regression test covering seven D01 selections, dynamic row removal, MOSAIC C dependencies, and SCOPE B dependencies.
- Added a version query to `assessment/src/app.js` so GitHub Pages visitors receive the corrected runtime instead of a cached copy.
