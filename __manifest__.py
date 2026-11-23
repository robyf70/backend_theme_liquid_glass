# -*- coding: utf-8 -*-
#############################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#
#    Copyright (C) 2026-TODAY Cybrosys Technologies(<https://www.cybrosys.com>)
#    Author: Cybrosys Techno Solutions(<https://www.cybrosys.com>)
#
#    You can modify it under the terms of the GNU LESSER
#    GENERAL PUBLIC LICENSE (LGPL v3), Version 3.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU LESSER GENERAL PUBLIC LICENSE (LGPL v3) for more details.
#
#    You should have received a copy of the GNU LESSER GENERAL PUBLIC LICENSE
#    (LGPL v3) along with this program.
#    If not, see <http://www.gnu.org/licenses/>.
#
#############################################################################
{
    'name': 'Liquid Glass Backend Theme',
    'version': '19.0.1.3.0',
    'category': 'Theme/Backend',
    'summary': 'Modern glassmorphism backend theme for Odoo',
    'description': """
        Liquid Glass Backend Theme
        A modern, elegant glassmorphism design for Odoo backend
    """,
    # Derived from Cybrosys' Liquid Glass Backend Theme: original rights stay with Cybrosys (see NOTICE)
    'author': 'Cybrosys Techno Solutions, Roberto Fichera',
    'maintainer': 'Roberto Fichera',
    'website': 'https://github.com/robyf70/backend_theme_liquid_glass',
    'license': 'LGPL-3',
    'depends': ['web', 'base'],
    'data': [
        'views/res_users_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'backend_theme_liquid_glass/static/src/scss/variables.scss',
            'backend_theme_liquid_glass/static/src/scss/glass_theme.scss',
            'backend_theme_liquid_glass/static/src/scss/buttons.scss',
            'backend_theme_liquid_glass/static/src/scss/forms.scss',
            'backend_theme_liquid_glass/static/src/scss/lists.scss',
            'backend_theme_liquid_glass/static/src/scss/kanban.scss',
            'backend_theme_liquid_glass/static/src/scss/modals.scss',
            'backend_theme_liquid_glass/static/src/scss/navbar.scss',
            'backend_theme_liquid_glass/static/src/scss/scheme_field.scss',
            'backend_theme_liquid_glass/static/src/js/palette.js',
            'backend_theme_liquid_glass/static/src/js/navbar_sidebar.js',
            'backend_theme_liquid_glass/static/src/js/theme_mode.js',
            'backend_theme_liquid_glass/static/src/js/scheme_field.js',
            'backend_theme_liquid_glass/static/src/xml/scheme_field.xml',
            'backend_theme_liquid_glass/static/src/xml/apps_sidebar.xml',
        ],
        'web.assets_backend_lazy': [
            'backend_theme_liquid_glass/static/src/js/canvas_text.js',
        ],
        'web.assets_unit_tests': [
            'backend_theme_liquid_glass/static/tests/*.test.js',
        ],
        'web.assets_tests': [
            'backend_theme_liquid_glass/static/tests/tours/*.js',
        ],
    },
    'images': [
        'static/description/banner.jpg',
        'static/description/theme_screenshot.jpg',
        'static/description/icon.png'
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
