/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { GraphRenderer } from "@web/views/graph/graph_renderer";
import { useExternalListener } from "@odoo/owl";
import { PALETTE_EVENT } from "./palette";

// a canvas cannot use a CSS variable: read its current value
function fontColor() {
    return getComputedStyle(document.body).getPropertyValue("--lg-text").trim();
}

patch(GraphRenderer.prototype, {

    setup() {
        super.setup();
        useExternalListener(window, PALETTE_EVENT, () => this.render());
    },

    getScaleOptions() {
        const options = super.getScaleOptions();

        if (options.x?.ticks) {
            options.x.ticks.color = fontColor();
        }
        if (options.x?.title) {
            options.x.title.color = fontColor();
        }

        if (options.y?.ticks) {
            options.y.ticks.color = fontColor();
        }
        if (options.y?.title) {
            options.y.title.color = fontColor();
        }

        return options;
    },

    getLegendOptions() {
        const options = super.getLegendOptions();

        if (options.labels?.generateLabels) {
            const originalGenerateLabels = options.labels.generateLabels;

            options.labels.generateLabels = (chart) => {
                return originalGenerateLabels(chart).map(label => ({
                    ...label,
                    fontColor: fontColor(),
                }));
            };
        }

        return options;
    },

});
