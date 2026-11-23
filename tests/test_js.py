# Copyright (C) 2026 Roberto Fichera
from odoo.addons.web.tests.test_js import HOOTCommon, unit_test_error_checker
from odoo.tests import HttpCase, tagged


@tagged('post_install', '-at_install')
class TestJs(HttpCase):

    def test_hoot(self):
        suite = HOOTCommon._generate_hash(self, '@backend_theme_liquid_glass')
        self.browser_js(
            f'/web/tests?headless&loglevel=2&preset=desktop&timeout=15000&id={suite}',
            "", "", login='admin', timeout=300,
            success_signal="[HOOT] Test suite succeeded",
            error_checker=unit_test_error_checker,
        )
