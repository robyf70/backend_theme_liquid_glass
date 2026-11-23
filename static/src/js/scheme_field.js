// Copyright (C) 2026 Roberto Fichera

import { user } from "@web/core/user";
import { registry } from "@web/core/registry";
import { RadioField, radioField } from "@web/views/fields/radio/radio_field";
import { onWillUnmount, useEffect } from "@odoo/owl";
import { setScheme } from "./palette";

// Last saved value, kept here because the field is unmounted and mounted again
// with unsaved changes when the user moves between the pages of the form.
let savedScheme;

/** Radio with one swatch per scheme, previewed live on the user's own record. */
export class SchemeField extends RadioField {
    static template = "backend_theme_liquid_glass.SchemeField";

    setup() {
        super.setup();
        useEffect(
            (isOwn, value, dirty) => {
                if (!isOwn || !value) {
                    return;
                }
                if (!dirty) {
                    savedScheme = value;
                }
                setScheme(value);
            },
            () => [this.isOwnRecord, this.value, this.props.record.dirty]
        );
        onWillUnmount(() => {
            if (this.isOwnRecord && savedScheme) {
                setScheme(this.props.record.dirty ? savedScheme : this.value);
            }
        });
    }

    get isOwnRecord() {
        return this.props.record.resId === user.userId;
    }
}

export const schemeField = {
    ...radioField,
    component: SchemeField,
    supportedTypes: ["selection"],
};

registry.category("fields").add("liquid_glass_scheme", schemeField);
