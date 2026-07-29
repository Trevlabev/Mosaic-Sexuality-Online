#!/usr/bin/env python3
"""Regression test for questions populated from prior multi-select answers."""
from __future__ import annotations

import copy
import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assessment" / "src"
BANK_JS = (SRC / "combined-question-bank.js").read_text(encoding="utf-8")
CONFIG_JS = (SRC / "config.js").read_text(encoding="utf-8")
APP_JS = (SRC / "app.js").read_text(encoding="utf-8")
STORAGE_KEY = "atlas-suite-combined-alpha-v05"

SELECTED_IDENTITIES = [
    "Straight or heterosexual",
    "Mostly straight or mostly heterosexual",
    "Heteroflexible",
    "Bisexual or bi",
    "Pansexual or pan",
    "Demisexual",
    "Sexually fluid or fluid",
]

BASE_STATE = {
    "view": "assessment",
    "sectionIndex": 3,
    "route": "Standard",
    "resultTab": "overview",
    "sensitiveOpened": {},
    "entityRegistry": {
        "people": {"self": {"id": "self", "displayName": "You", "source": "system"}},
        "relationships": {},
        "scenarios": {},
    },
    "answers": {
        "D01": SELECTED_IDENTITIES,
        # Reproduces stale values created by the old literal placeholder row.
        "D04": {"substantive terms selected in D01": 80},
        "D05": {"substantive terms selected in D01": ["Pattern of sexual attraction"]},
    },
    "skipped": {},
    "feedback": {},
    "triadEnabled": False,
    "scopeEnabled": False,
    "scopeMode": "personal",
    "detailedMode": True,
    "compactMatrices": False,
    "search": "",
    "generatedAt": None,
    "importedMosaicBank": False,
    "importedBankName": "",
    "saveMode": "session",
    "aiEndpoint": "",
    "aiIncludeOpenText": False,
    "aiIncludeSensitive": False,
    "aiPermissions": {},
    "exportPermissions": {},
    "aiNarrative": None,
    "narrativeVersions": [],
    "auditLog": [],
    "globalClarification": "",
    "migrationQuarantine": {},
    "modal": None,
}


def load_app(page, state: dict) -> None:
    page.set_content(
        '<html><body><div id="app" aria-live="polite"></div>'
        '<input id="bankImport" type="file"><input id="responseImport" type="file">'
        "</body></html>"
    )
    page.evaluate(
        """() => {
          const sessionData = {}, localData = {};
          window.__sessionData = sessionData;
          const makeStorage = data => ({
            setItem: (key, value) => data[key] = String(value),
            getItem: key => Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null,
            removeItem: key => delete data[key]
          });
          Object.defineProperty(window, 'sessionStorage', {value: makeStorage(sessionData), configurable: true});
          Object.defineProperty(window, 'localStorage', {value: makeStorage(localData), configurable: true});
        }"""
    )
    page.evaluate(
        "([key, payload]) => window.__sessionData[key] = payload",
        [STORAGE_KEY, json.dumps(state)],
    )
    page.add_script_tag(content=BANK_JS)
    page.add_script_tag(content=CONFIG_JS)
    page.add_script_tag(content=APP_JS)


def text_list(locator) -> list[str]:
    return [element.inner_text().strip() for element in locator.all()]


def main() -> None:
    with sync_playwright() as playwright:
        launch_kwargs = {"headless": True, "args": ["--no-sandbox"]}
        if os.path.exists("/usr/bin/chromium"):
            launch_kwargs["executable_path"] = "/usr/bin/chromium"
        browser = playwright.chromium.launch(**launch_kwargs)

        # MOSAIC sexual identity dependencies: D01 -> D03/D04/D05.
        page = browser.new_page()
        load_app(page, copy.deepcopy(BASE_STATE))
        page.wait_for_selector("#question-D04")

        d03 = text_list(page.locator("#question-D03 label.option span"))
        assert all(value in d03 for value in SELECTED_IDENTITIES), d03

        d04 = text_list(page.locator("#question-D04 .matrix-slider-row .row-label"))
        assert d04 == SELECTED_IDENTITIES, d04

        d05 = text_list(page.locator("#question-D05 table.matrix tbody tr td:first-child"))
        assert d05 == SELECTED_IDENTITIES, d05

        stored = json.loads(page.evaluate(f"window.__sessionData['{STORAGE_KEY}']"))
        assert "D04" not in stored["answers"], stored["answers"].get("D04")
        assert "D05" not in stored["answers"], stored["answers"].get("D05")

        page.locator(
            '#question-D01 input[type="checkbox"][value="Pansexual or pan"]'
        ).uncheck()
        d04_after = text_list(page.locator("#question-D04 .matrix-slider-row .row-label"))
        d05_after = text_list(page.locator("#question-D05 table.matrix tbody tr td:first-child"))
        assert len(d04_after) == 6 and "Pansexual or pan" not in d04_after, d04_after
        assert len(d05_after) == 6 and "Pansexual or pan" not in d05_after, d05_after

        # MOSAIC gender identity dependencies: C01 -> C03/C04.
        c_state = copy.deepcopy(BASE_STATE)
        c_state["sectionIndex"] = 2
        c_state["answers"] = {"C01": ["Woman", "Nonbinary", "Genderfluid"]}
        page_c = browser.new_page()
        load_app(page_c, c_state)
        page_c.wait_for_selector("#question-C04")
        c03 = text_list(page_c.locator("#question-C03 label.option span"))
        c04 = text_list(page_c.locator("#question-C04 .matrix-slider-row .row-label"))
        assert all(value in c03 for value in ["Woman", "Nonbinary", "Genderfluid"]), c03
        assert c04 == ["Woman", "Nonbinary", "Genderfluid"], c04

        # SCOPE relationship identity dependencies: B01 -> B03/B04/B05.
        scope_state = copy.deepcopy(BASE_STATE)
        scope_state["route"] = "Comprehensive"
        scope_state["sectionIndex"] = 0
        scope_state["scopeEnabled"] = True
        scope_state["answers"] = {
            "SCOPE.B01": ["Polyamorous", "Solo polyamory", "Relationship anarchy"]
        }
        page_scope = browser.new_page()
        load_app(page_scope, scope_state)
        scope_nav = page_scope.locator("button.section-link", has_text="Identity & History")
        assert scope_nav.count() == 1
        scope_nav.click()
        page_scope.wait_for_selector('[id="question-SCOPE.B04"]')

        expected_scope = ["Polyamorous", "Solo polyamory", "Relationship anarchy"]
        b03 = text_list(page_scope.locator('[id="question-SCOPE.B03"] label.option span'))
        b04 = text_list(
            page_scope.locator('[id="question-SCOPE.B04"] table.matrix tbody tr td:first-child')
        )
        b05 = text_list(
            page_scope.locator('[id="question-SCOPE.B05"] table.matrix tbody tr td:first-child')
        )
        b04_slider_count = page_scope.locator(
            '[id="question-SCOPE.B04"] input[type="range"]'
        ).count()

        assert all(value in b03 for value in expected_scope), b03
        assert b04 == expected_scope, b04
        assert b05 == expected_scope, b05
        assert b04_slider_count == len(expected_scope), b04_slider_count

        result = {
            "status": "PASS",
            "D03_selected_options_present": len(SELECTED_IDENTITIES),
            "D04_rows": len(d04),
            "D05_rows": len(d05),
            "D04_rows_after_upstream_change": len(d04_after),
            "D05_rows_after_upstream_change": len(d05_after),
            "C04_rows": len(c04),
            "SCOPE_B04_rows": len(b04),
            "SCOPE_B04_sliders": b04_slider_count,
            "SCOPE_B05_rows": len(b05),
        }
        print(json.dumps(result, indent=2))
        browser.close()


if __name__ == "__main__":
    main()
