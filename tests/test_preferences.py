# Copyright (C) 2026 Roberto Fichera
import re

from lxml import etree

from odoo.exceptions import AccessError
from odoo.tests import HttpCase, new_test_user, tagged


@tagged('post_install', '-at_install')
class TestPreferences(HttpCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = new_test_user(cls.env, login='lg_user')
        cls.other = new_test_user(cls.env, login='lg_other')

    def test_default(self):
        self.assertEqual(self.user.liquid_glass_scheme, 'teal')
        self.assertEqual(self.user._liquid_glass_body_classes(), "o_web_client o_lg_scheme_teal")

    def test_self_write(self):
        self.user.with_user(self.user).write({'liquid_glass_scheme': 'blue'})
        self.assertEqual(self.user.liquid_glass_scheme, 'blue')
        with self.assertRaises(AccessError):
            self.other.with_user(self.user).write({'liquid_glass_scheme': 'blue'})

    def test_body_classes(self):
        schemes = [value for value, _label in self.user._fields['liquid_glass_scheme'].selection]
        self.assertEqual(len(schemes), 11)
        for scheme in schemes:
            for mode in ('dark', 'light'):
                with self.subTest(scheme=scheme, mode=mode):
                    self.user.write({'liquid_glass_scheme': scheme, 'liquid_glass_mode': mode})
                    classes = self.user._liquid_glass_body_classes().split()
                    self.assertIn(f'o_lg_scheme_{scheme}', classes)
                    self.assertEqual('o_lg_light' in classes, mode == 'light')

    def test_bootstrap(self):
        self.user.liquid_glass_scheme = 'blue'
        self.authenticate('lg_user', 'lg_user')
        body = re.search(r'<body[^>]*>', self.url_open('/odoo').text).group()
        self.assertIn('o_lg_scheme_blue', body)

    def test_share_hidden(self):
        arch = self.env['res.users'].get_view(self.env.ref('base.view_users_form').id, 'form')['arch']
        nodes = etree.fromstring(arch).xpath("//field[@name='liquid_glass_scheme']")
        self.assertEqual([node.get('invisible') for node in nodes], ['share'])
