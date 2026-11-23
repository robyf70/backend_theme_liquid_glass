// Copyright (C) 2026 Roberto Fichera

import { after, beforeEach, expect, getFixture, test } from "@odoo/hoot";

const WHITE = "rgb(255, 255, 255)";

beforeEach(() => {
    const classes = ["o_web_client", "o_lg_light", "o_lg_scheme_blue"].filter(
        (cls) => !document.body.classList.contains(cls)
    );
    document.body.classList.add(...classes);
    after(() => document.body.classList.remove(...classes));
});

function colorOf(html, selector) {
    const fixture = getFixture();
    fixture.innerHTML = html;
    return getComputedStyle(fixture.querySelector(selector)).color;
}

test.tags("desktop");
test("text on the fill stays white in light mode", () => {
    expect(
        colorOf(
            `<div class="o_form_statusbar"><button class="btn btn-primary o_arrow_button o_arrow_button_current"><span>New</span></button></div>`,
            "span"
        )
    ).toBe(WHITE);
    expect(
        colorOf(
            `<div class="o_form_statusbar"><button class="btn o_arrow_button o_arrow_button_current"><span>New</span></button></div>`,
            "span"
        )
    ).toBe(WHITE);
    expect(
        colorOf(`<div class="badge text-bg-primary"><span>New</span></div>`, "span")
    ).toBe(WHITE);
});

test("text on the accent gradient stays white in light mode", () => {
    for (const cls of ["bg-primary", "o_loading_indicator"]) {
        expect(colorOf(`<div class="${cls}"><span>New</span></div>`, "span")).toBe(WHITE);
    }
});

/** Colour the theme gives to an element while `.o_form_button_create` is hovered. */
function hoverColorOf(el) {
    let color;
    for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
            if (
                rule.selectorText?.includes(".o_form_button_create:hover") &&
                el.matches(rule.selectorText.replaceAll(":hover", "")) &&
                rule.style.getPropertyPriority("color")
            ) {
                color = rule.style.color;
            }
        }
    }
    return color;
}

test("the New button of forms is readable on hover", () => {
    // a real :hover cannot be simulated: look at the rules
    getFixture().innerHTML = `<button class="btn btn-outline-primary o_form_button_create"><span>New</span></button>`;
    expect(hoverColorOf(getFixture().querySelector("button"))).toBe(WHITE);
    expect(hoverColorOf(getFixture().querySelector("span"))).toBe(WHITE);
});

test("the app name follows the palette", () => {
    expect(
        colorOf(
            `<header class="o_navbar"><nav class="o_main_navbar"><a class="o_menu_brand">CRM</a></nav></header>`,
            ".o_menu_brand"
        )
    ).toBe("rgb(30, 41, 59)");
});
