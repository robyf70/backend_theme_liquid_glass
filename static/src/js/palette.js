// Copyright (C) 2026 Roberto Fichera

// The palette lives in the body classes the server renders (res.users
// _liquid_glass_body_classes): this is the only module that changes them.

/** Dispatched on window when the palette changes: canvases must be redrawn. */
export const PALETTE_EVENT = "lg-palette-changed";

const SCHEME_PREFIX = "o_lg_scheme_";

export function setScheme(name) {
    const { classList } = document.body;
    const stale = [...classList].filter(
        (cls) => cls.startsWith(SCHEME_PREFIX) && cls !== SCHEME_PREFIX + name
    );
    if (!stale.length && classList.contains(SCHEME_PREFIX + name)) {
        return;
    }
    classList.remove(...stale);
    classList.add(SCHEME_PREFIX + name);
    window.dispatchEvent(new Event(PALETTE_EVENT));
}
