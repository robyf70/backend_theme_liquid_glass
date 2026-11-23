// Copyright (C) 2026 Roberto Fichera

import { registry } from "@web/core/registry";

const FIELD = "div[name='liquid_glass_scheme']";

function openPreferences() {
    return [
        {
            content: "Open the user menu",
            trigger: ".o_user_menu button",
            run: "click",
        },
        {
            content: "Open My Preferences",
            trigger: "[data-menu=preferences]",
            run: "click",
        },
        {
            content: "The preferences are shown, with one swatch per scheme",
            trigger: `.modal ${FIELD}:has(.o_lg_swatch_slate) .o_lg_swatch_violet`,
        },
    ];
}

function pick(scheme) {
    return {
        content: `Pick ${scheme}`,
        trigger: `${FIELD} input[data-value='${scheme}']`,
        run: "click",
    };
}

function shown(scheme) {
    return {
        content: `The page shows ${scheme}`,
        trigger: `body.o_lg_scheme_${scheme}`,
    };
}

const noModal = {
    content: "The dialog is closed",
    trigger: "body:not(:has(.modal))",
};

registry.category("web_tour.tours").add("lg_scheme_tour", {
    steps: () => [
        shown("teal"),
        ...openPreferences(),
        pick("violet"),
        shown("violet"),
        {
            content: "Close without saving",
            trigger: ".modal-header .btn-close",
            run: "click",
        },
        noModal,
        shown("teal"),
        ...openPreferences(),
        pick("violet"),
        shown("violet"),
        {
            content: "Discard",
            trigger: ".modal button[name='preference_cancel']",
            run: "click",
        },
        noModal,
        shown("teal"),
        ...openPreferences(),
        pick("rose"),
        shown("rose"),
        {
            content: "Another page of the same dialog hides the picker: no preview",
            trigger: ".modal .o_notebook a[name='calendar']",
            run: "click",
        },
        shown("teal"),
        {
            content: "Back to the picker: the unsaved choice is previewed again",
            trigger: ".modal .o_notebook a[name='preferences_page']",
            run: "click",
        },
        shown("rose"),
        pick("blue"),
        shown("blue"),
        {
            content: "Save",
            trigger: ".modal button[name='preference_save']",
            run: "click",
            expectUnloadPage: true,
        },
        noModal,
        shown("blue"),
        ...openPreferences(),
        {
            content: "Blue is checked",
            trigger: `.modal ${FIELD} input[data-value='blue']:checked`,
        },
        {
            content: "Discard",
            trigger: ".modal button[name='preference_cancel']",
            run: "click",
        },
        noModal,
        shown("blue"),
    ],
});

registry.category("web_tour.tours").add("lg_scheme_admin_tour", {
    steps: () => [
        {
            content: "Open the preferences of the other user",
            trigger: ".o_notebook a[name='preferences']",
            run: "click",
        },
        pick("rose"),
        {
            content: "The choice is in the form",
            trigger: `${FIELD} input[data-value='rose']:checked`,
        },
        {
            content: "The form is dirty",
            trigger: ".o_form_button_cancel",
        },
        {
            content: "The administrator's own screen is unchanged",
            trigger: "body.o_lg_scheme_teal:not(.o_lg_scheme_rose)",
        },
        {
            content: "Discard",
            trigger: ".o_form_button_cancel",
            run: "click",
        },
        {
            content: "Discarded",
            trigger: `${FIELD} input[data-value='teal']:checked`,
        },
        shown("teal"),
    ],
});

registry.category("web_tour.tours").add("lg_scheme_failed_save_tour", {
    steps: () => [
        ...openPreferences(),
        pick("green"),
        shown("green"),
        {
            content: "Try to save",
            trigger: ".modal button[name='preference_save']",
            run: "click",
        },
        {
            content: "The save is refused",
            trigger: ".modal:contains('No scheme for you') .modal-footer button",
            run: "click",
        },
        {
            content: "Discard",
            trigger: ".modal:not(:contains('No scheme for you')) button[name='preference_cancel']",
            run: "click",
        },
        noModal,
        shown("teal"),
    ],
});

registry.category("web_tour.tours").add("lg_background_tour", {
    steps: () => [
        ...openPreferences(),
        {
            content: "Pick Gradient",
            trigger: ".modal div[name='liquid_glass_background'] input[data-value='gradient']",
            run: "click",
        },
        {
            content: "The gradient is previewed",
            trigger: "body.o_lg_gradient.o_lg_scheme_teal",
        },
        {
            content: "Discard",
            trigger: ".modal button[name='preference_cancel']",
            run: "click",
        },
        noModal,
        {
            content: "The photo is back",
            trigger: "body:not(.o_lg_gradient)",
        },
    ],
});
