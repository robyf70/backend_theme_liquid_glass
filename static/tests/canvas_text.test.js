// Copyright (C) 2026 Roberto Fichera

import { expect, test } from "@odoo/hoot";
import { animationFrame } from "@odoo/hoot-mock";
import { defineModels, fields, models, mountView } from "@web/../tests/web_test_helpers";
import { getChart, setupChartJsForTests } from "@web/../tests/views/graph/graph_test_helpers";
import { PALETTE_EVENT } from "@backend_theme_liquid_glass/js/palette";

class Foo extends models.Model {
    name = fields.Char();
    _records = [{ id: 1, name: "one" }];
}
defineModels([Foo]);
setupChartJsForTests();

test("charts use the text colour of the palette and follow it", async () => {
    document.body.style.setProperty("--lg-text", "rgb(1, 2, 3)");
    const view = await mountView({
        type: "graph",
        resModel: "foo",
        arch: `<graph><field name="name"/></graph>`,
    });
    expect(getChart(view).options.scales.x.ticks.color).toBe("rgb(1, 2, 3)");
    expect(getChart(view).legend.legendItems[0].fontColor).toBe("rgb(1, 2, 3)");

    document.body.style.setProperty("--lg-text", "rgb(4, 5, 6)");
    window.dispatchEvent(new Event(PALETTE_EVENT));
    await animationFrame();
    expect(getChart(view).options.scales.x.ticks.color).toBe("rgb(4, 5, 6)");
    expect(getChart(view).legend.legendItems[0].fontColor).toBe("rgb(4, 5, 6)");
    document.body.style.removeProperty("--lg-text");
});
