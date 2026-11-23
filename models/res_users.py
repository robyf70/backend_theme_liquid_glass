# Copyright (C) 2026 Roberto Fichera
from odoo import fields, models

LIQUID_GLASS_FIELDS = ['liquid_glass_mode', 'liquid_glass_scheme', 'liquid_glass_background']


class ResUsers(models.Model):
    _inherit = 'res.users'

    liquid_glass_mode = fields.Selection(
        [('dark', "Dark"), ('light', "Light"), ('auto', "Auto")],
        string="Theme Mode",
        default='dark',
        required=True,
        help="Liquid Glass backend theme appearance for this user.",
    )

    liquid_glass_scheme = fields.Selection(
        [
            ('teal', "Teal"),
            ('blue', "Blue"),
            ('indigo', "Indigo"),
            ('violet', "Violet"),
            ('fuchsia', "Fuchsia"),
            ('rose', "Rose"),
            ('orange', "Orange"),
            ('amber', "Amber"),
            ('green', "Green"),
            ('cyan', "Cyan"),
            ('slate', "Slate"),
        ],
        string="Theme Colors",
        default='teal',
        required=True,
        help="Accent colors of the Liquid Glass backend theme for this user.",
    )
    liquid_glass_background = fields.Selection(
        [('photo', "Photo"), ('gradient', "Gradient")],
        string="Background",
        default='photo',
        required=True,
        help="Dark mode background of the Liquid Glass backend theme for this user.",
    )

    @property
    def SELF_READABLE_FIELDS(self):
        return super().SELF_READABLE_FIELDS + LIQUID_GLASS_FIELDS

    @property
    def SELF_WRITEABLE_FIELDS(self):
        return super().SELF_WRITEABLE_FIELDS + LIQUID_GLASS_FIELDS

    def _liquid_glass_body_classes(self):
        """Body classes of the web client for this user's theme preferences."""
        self.ensure_one()
        classes = ['o_web_client']
        if self.liquid_glass_mode == 'light':
            classes.append('o_lg_light')
        elif self.liquid_glass_mode == 'auto':
            classes.append('o_lg_auto')
        if self.liquid_glass_background == 'gradient':
            classes.append('o_lg_gradient')
        classes.append(f'o_lg_scheme_{self.liquid_glass_scheme}')
        return ' '.join(classes)
