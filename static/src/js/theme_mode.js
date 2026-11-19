/** @odoo-module **/
// Copyright (C) 2026 Roberto Fichera

import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { user } from "@web/core/user";
import { browser } from "@web/core/browser/browser";

// The mode lives on res.users (liquid_glass_mode) and is rendered as a body class,
// so this item only flips the field and reloads.
function themeModeItem(env) {
    const isLight = document.body.classList.contains("o_lg_light");
    return {
        type: "item",
        id: "liquid_glass_mode",
        description: isLight ? _t("Dark Mode") : _t("Light Mode"),
        callback: async () => {
            await env.services.orm.write("res.users", [user.userId], {
                liquid_glass_mode: isLight ? "dark" : "light",
            });
            browser.location.reload();
        },
        sequence: 55,
    };
}

registry.category("user_menuitems").add("liquid_glass_mode", themeModeItem);
