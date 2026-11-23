// Copyright (C) 2026 Roberto Fichera

import { registry } from "@web/core/registry";

// The palette lives in the body classes the server renders (res.users
// _liquid_glass_body_classes): this is the only module that changes them.

/** Dispatched on window when the palette changes: canvases must be redrawn. */
export const PALETTE_EVENT = "lg-palette-changed";

const SCHEME_PREFIX = "o_lg_scheme_";

function changeBody(update) {
    const before = document.body.className;
    update(document.body.classList);
    if (document.body.className !== before) {
        window.dispatchEvent(new Event(PALETTE_EVENT));
    }
}

export function setScheme(name) {
    changeBody((classList) => {
        const current = SCHEME_PREFIX + name;
        const stale = [...classList].filter(
            (cls) => cls.startsWith(SCHEME_PREFIX) && cls !== current
        );
        classList.remove(...stale);
        classList.add(current);
    });
}

export function setBackground(value) {
    changeBody((classList) => classList.toggle("o_lg_gradient", value === "gradient"));
}

export function setMode(value) {
    changeBody((classList) => {
        classList.toggle("o_lg_light", value === "light");
        classList.toggle("o_lg_auto", value === "auto");
    });
}

const systemLight = () => window.matchMedia("(prefers-color-scheme: light)");

/** Whether the page is shown in light mode, whatever the reason. */
export function isLight() {
    const { classList } = document.body;
    return (
        classList.contains("o_lg_light") ||
        (classList.contains("o_lg_auto") && systemLight().matches)
    );
}

// The stylesheet follows the system by itself; canvases have to be told.
registry.category("services").add("liquid_glass_palette", {
    start() {
        systemLight().addEventListener("change", () => {
            if (document.body.classList.contains("o_lg_auto")) {
                window.dispatchEvent(new Event(PALETTE_EVENT));
            }
        });
    },
});
