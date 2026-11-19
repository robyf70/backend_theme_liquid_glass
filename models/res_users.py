# Copyright (C) 2026 Roberto Fichera
from odoo import fields, models


class ResUsers(models.Model):
    _inherit = 'res.users'

    liquid_glass_mode = fields.Selection(
        [('dark', "Dark"), ('light', "Light")],
        string="Theme Mode",
        default='dark',
        required=True,
        help="Liquid Glass backend theme appearance for this user.",
    )

    @property
    def SELF_READABLE_FIELDS(self):
        return super().SELF_READABLE_FIELDS + ['liquid_glass_mode']

    @property
    def SELF_WRITEABLE_FIELDS(self):
        return super().SELF_WRITEABLE_FIELDS + ['liquid_glass_mode']
