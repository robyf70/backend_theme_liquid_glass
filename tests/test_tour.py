# Copyright (C) 2026 Roberto Fichera
from unittest.mock import patch

from odoo.exceptions import UserError
from odoo.tests import HttpCase, new_test_user, tagged


@tagged('post_install', '-at_install')
class TestTour(HttpCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = new_test_user(cls.env, login='lg_user')

    def test_scheme(self):
        self.start_tour('/odoo', 'lg_scheme_tour', login='lg_user')
        self.assertEqual(self.user.liquid_glass_scheme, 'blue')

    def test_mode(self):
        self.start_tour('/odoo', 'lg_mode_tour', login='lg_user')
        self.assertEqual(self.user.liquid_glass_mode, 'auto')

    def test_background(self):
        self.start_tour('/odoo', 'lg_background_tour', login='lg_user')
        self.assertEqual(self.user.liquid_glass_background, 'photo')

    def test_scheme_admin(self):
        self.env.ref('base.user_admin').liquid_glass_scheme = 'teal'
        self.start_tour(
            f'/odoo/action-base.action_res_users/{self.user.id}', 'lg_scheme_admin_tour', login='admin')
        self.assertEqual(self.user.liquid_glass_scheme, 'teal')

    def test_scheme_own_form(self):
        admin = self.env.ref('base.user_admin')
        admin.liquid_glass_scheme = 'teal'
        self.start_tour(
            f'/odoo/action-base.action_res_users/{admin.id}', 'lg_scheme_own_form_tour', login='admin')
        self.assertEqual(admin.liquid_glass_scheme, 'violet')

    def test_scheme_failed_save(self):
        ResUsers = self.registry['res.users']
        origin = ResUsers.write

        def write(records, vals):
            if 'liquid_glass_scheme' in vals:
                raise UserError("No scheme for you")
            return origin(records, vals)

        with patch.object(ResUsers, 'write', write):
            self.start_tour('/odoo', 'lg_scheme_failed_save_tour', login='lg_user')
        self.assertEqual(self.user.liquid_glass_scheme, 'teal')
