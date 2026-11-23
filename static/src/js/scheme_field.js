// Copyright (C) 2026 Roberto Fichera

import { user } from "@web/core/user";
import { registry } from "@web/core/registry";
import { RadioField, radioField } from "@web/views/fields/radio/radio_field";
import { onWillUnmount, useEffect } from "@odoo/owl";
import { setBackground, setMode, setScheme } from "./palette";

const APPLY = {
    liquid_glass_mode: setMode,
    liquid_glass_scheme: setScheme,
    liquid_glass_background: setBackground,
};

// Last saved value of each preference, kept here because the field is unmounted and
// mounted again with unsaved changes when the user moves between the pages of the form.
const saved = {};

/** Radio previewed live, when the record is the user's own. */
export class PreviewRadioField extends RadioField {
    setup() {
        super.setup();
        useEffect(
            (isOwn, value, dirty) => {
                if (!isOwn || !value) {
                    return;
                }
                if (!dirty) {
                    saved[this.props.name] = value;
                }
                this.apply(value);
            },
            () => [this.isOwnRecord, this.value, this.props.record.dirty]
        );
        onWillUnmount(() => {
            const value = saved[this.props.name];
            if (this.isOwnRecord && value) {
                this.apply(this.props.record.dirty ? value : this.value);
            }
        });
    }

    get isOwnRecord() {
        return this.props.record.resId === user.userId;
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
