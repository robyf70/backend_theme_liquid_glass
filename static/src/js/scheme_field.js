// Copyright (C) 2026 Roberto Fichera

import { user } from "@web/core/user";
import { patch } from "@web/core/utils/patch";
import { registry } from "@web/core/registry";
import { RadioField, radioField } from "@web/views/fields/radio/radio_field";
import { FormController } from "@web/views/form/form_controller";
import { onWillUnmount, useEffect } from "@odoo/owl";
import { setBackground, setMode, setScheme } from "./palette";

const APPLY = {
    liquid_glass_mode: setMode,
    liquid_glass_scheme: setScheme,
    liquid_glass_background: setBackground,
};

function isOwnUser(record) {
    return record.resModel === "res.users" && record.resId === user.userId;
}

/** Radio previewed live, when the record is the user's own. */
export class PreviewRadioField extends RadioField {
    setup() {
        super.setup();
        useEffect(
            (isOwn, value) => {
                if (isOwn && value) {
                    this.apply(value);
                }
            },
            () => [isOwnUser(this.props.record), this.value]
        );
        onWillUnmount(() => {
            // back to the saved value: the form may still hold an unsaved one
            const { record, name } = this.props;
            const saved = record._values[name];
            if (isOwnUser(record) && saved) {
                this.apply(saved);
            }
        });
    }

    apply(value) {
        APPLY[this.props.name]?.(value);
    }
}

/** Preview radio with one swatch per scheme. */
export class SchemeField extends PreviewRadioField {
    static template = "backend_theme_liquid_glass.SchemeField";
}

export const previewRadioField = {
    ...radioField,
    component: PreviewRadioField,
    supportedTypes: ["selection"],
};

export const schemeField = { ...previewRadioField, component: SchemeField };

registry.category("fields").add("liquid_glass_preview", previewRadioField);
registry.category("fields").add("liquid_glass_scheme", schemeField);

// The form can be saved while the picker is on a hidden page, so not mounted.
patch(FormController.prototype, {
    async onRecordSaved(record) {
        if (isOwnUser(record)) {
            for (const [name, apply] of Object.entries(APPLY)) {
                if (record.data[name]) {
                    apply(record.data[name]);
                }
            }
        }
        return super.onRecordSaved(...arguments);
    },
});
