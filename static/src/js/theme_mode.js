/** @odoo-module **/
// Copyright (C) 2026 Roberto Fichera

import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { user } from "@web/core/user";
import { browser } from "@web/core/browser/browser";
import { isLight } from "./palette";

// The mode lives on res.users (liquid_glass_mode) and is rendered as a body class, so
// this item only sets the field to the opposite of what is shown and reloads.
function themeModeItem(env) {
    const light = isLight();
    return {
        type: "item",
        id: "liquid_glass_mode",
        description: light ? _t("Dark Mode") : _t("Light Mode"),
        callback: async () => {
            await env.services.orm.write("res.users", [user.userId], {
                liquid_glass_mode: light ? "dark" : "light",
            });
            browser.location.reload();
        },
        sequence: 55,
    };
}

registry.category("user_menuitems").add("liquid_glass_mode", themeModeItem);
