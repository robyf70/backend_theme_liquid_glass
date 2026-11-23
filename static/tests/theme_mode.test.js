// Copyright (C) 2026 Roberto Fichera

import { after, beforeEach, expect, mockMatchMedia, test } from "@odoo/hoot";
import { makeMockEnv, onRpc, patchWithCleanup } from "@web/../tests/web_test_helpers";
import { browser } from "@web/core/browser/browser";
import { registry } from "@web/core/registry";
import { isLight, PALETTE_EVENT, setMode } from "@backend_theme_liquid_glass/js/palette";

beforeEach(() => {
    after(() => document.body.classList.remove("o_lg_light", "o_lg_auto"));
    setMode("dark");
});

const menuItem = (env) => registry.category("user_menuitems").get("liquid_glass_mode")(env);

function countPaletteChanges() {
    const onChange = () => expect.step("palette");
    window.addEventListener(PALETTE_EVENT, onChange);
    after(() => window.removeEventListener(PALETTE_EVENT, onChange));
}

test("auto follows the system", async () => {
    const env = await makeMockEnv();
    setMode("auto");
    mockMatchMedia({ "prefers-color-scheme": "light" });
    expect(isLight()).toBe(true);
    expect(menuItem(env).description.toString()).toBe("Dark Mode");
    mockMatchMedia({ "prefers-color-scheme": "dark" });
    expect(isLight()).toBe(false);
    expect(menuItem(env).description.toString()).toBe("Light Mode");
});

test("explicit modes ignore the system", async () => {
    const env = await makeMockEnv();
    mockMatchMedia({ "prefers-color-scheme": "light" });
    expect(isLight()).toBe(false);
    expect(menuItem(env).description.toString()).toBe("Light Mode");
    setMode("light");
    mockMatchMedia({ "prefers-color-scheme": "dark" });
    expect(isLight()).toBe(true);
    expect(menuItem(env).description.toString()).toBe("Dark Mode");
});

test("the menu item saves the opposite of what is shown", async () => {
    onRpc("res.users", "write", ({ args }) => {
        expect.step(args[1].liquid_glass_mode);
        return true;
    });
    patchWithCleanup(browser.location, { reload: () => expect.step("reload") });
    const env = await makeMockEnv();
    setMode("auto");
    mockMatchMedia({ "prefers-color-scheme": "light" });
    await menuItem(env).callback();
    expect.verifySteps(["dark", "reload"]);
});

test("a system change redraws the canvases, in auto only", async () => {
    mockMatchMedia({ "prefers-color-scheme": "dark" });
    await makeMockEnv();
    countPaletteChanges();
    mockMatchMedia({ "prefers-color-scheme": "light" });
    expect.verifySteps([]);
    setMode("auto");
    expect.verifySteps(["palette"]);
    mockMatchMedia({ "prefers-color-scheme": "dark" });
    expect.verifySteps(["palette"]);
});
