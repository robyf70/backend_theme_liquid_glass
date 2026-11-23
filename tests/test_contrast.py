# Copyright (C) 2026 Roberto Fichera
import re

import sass

from odoo.tests import TransactionCase, tagged
from odoo.tools import file_path

NAMED = {'white': (255, 255, 255), 'black': (0, 0, 0)}
COLOR = re.compile(r'#[0-9a-f]{3,6}\b|rgb\([^)]*\)', re.I)
DARK_SURFACES = ('#202630', '#373f48')
LIGHT_SURFACE = '#eef2f7'

# Teal is the look users already have: these values must not change.
TEAL_DARK = {
    '--lg-bg-light': 'rgba(255, 255, 255, 0.15)',
    '--lg-bg-medium': 'rgba(255, 255, 255, 0.10)',
    '--lg-bg-dark': 'rgba(255, 255, 255, 0.08)',
    '--lg-bg-darker': 'rgba(255, 255, 255, 0.05)',
    '--lg-dropdown': 'rgba(55, 63, 72, 0.94)',
    '--lg-solid': 'rgb(32, 38, 48)',
    '--lg-border': 'rgba(255, 255, 255, 0.18)',
    '--lg-border-light': 'rgba(255, 255, 255, 0.25)',
    '--lg-primary': 'rgb(6, 190, 160)',
    '--lg-primary-text': 'rgb(45, 212, 191)',
    '--lg-primary-gradient': 'linear-gradient(90deg, rgb(4, 120, 101), rgb(6, 100, 88))',
    '--lg-hover-bg': 'rgba(255, 255, 255, 0.18)',
    '--lg-focus-ring': 'rgb(94, 234, 212)',
    '--lg-text': '#ffffff',
    '--lg-text-muted': 'rgba(255, 255, 255, 0.72)',
    '--lg-text-hover': 'rgba(255, 255, 255, 0.85)',
    '--lg-scrollbar': 'rgba(255, 255, 255, 0.25)',
    '--lg-btn-close-filter': 'invert(1)',
    '--lg-bg-image': 'url("/backend_theme_liquid_glass/static/src/img/bg-img.svg")',
    '--lg-bg-color': '#000511',
}
TEAL_LIGHT = {
    '--lg-bg-light': 'rgba(255, 255, 255, 0.62)',
    '--lg-bg-medium': 'rgba(255, 255, 255, 0.52)',
    '--lg-bg-dark': 'rgba(255, 255, 255, 0.42)',
    '--lg-bg-darker': 'rgba(255, 255, 255, 0.32)',
    '--lg-dropdown': 'rgba(255, 255, 255, 0.96)',
    '--lg-solid': '#ffffff',
    '--lg-border': 'rgba(15, 23, 42, 0.12)',
    '--lg-border-light': 'rgba(15, 23, 42, 0.18)',
    '--lg-primary': 'rgb(4, 128, 108)',
    '--lg-primary-text': 'rgb(4, 110, 93)',
    '--lg-primary-gradient': 'linear-gradient(90deg, rgb(4, 128, 108), rgb(6, 112, 96))',
    '--lg-hover-bg': 'rgba(15, 23, 42, 0.07)',
    '--lg-focus-ring': 'rgb(4, 110, 93)',
    '--lg-text': '#1e293b',
    '--lg-text-muted': '#475569',
    '--lg-text-hover': '#0f172a',
    '--lg-scrollbar': 'rgba(15, 23, 42, 0.25)',
    '--lg-btn-close-filter': 'none',
    '--lg-bg-image': 'linear-gradient(135deg, #e0f2f1 0%, #eef2ff 45%, #fdf2f8 100%)',
    '--lg-bg-color': '#eef2f7',
}


def colors(value):
    return COLOR.findall(value)


def rgb(color):
    if color in NAMED:
        return NAMED[color]
    if color.startswith('#'):
        digits = color[1:]
        if len(digits) == 3:
            digits = ''.join(c * 2 for c in digits)
        return tuple(int(digits[i:i + 2], 16) for i in (0, 2, 4))
    return tuple(float(n) for n in re.findall(r'[\d.]+', color)[:3])


def luminance(color):
    channels = [
        c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
        for c in (n / 255 for n in rgb(color))
    ]
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]


def contrast(a, b):
    low, high = sorted((luminance(a), luminance(b)))
    return (high + 0.05) / (low + 0.05)


@tagged('post_install', '-at_install')
class TestContrast(TransactionCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.schemes = [v for v, _l in cls.env['res.users']._fields['liquid_glass_scheme'].selection]
        with open(file_path('backend_theme_liquid_glass/static/src/scss/variables.scss')) as f:
            cls.css = sass.compile(string=f.read())
        cls.rules = cls.parse(cls.css)

    @staticmethod
    def parse(css):
        rules = {}
        for selectors, block in re.findall(r'([^{}]+)\{([^{}]*)\}', css):
            declarations = dict(re.findall(r'(--lg-[\w-]+):\s*([^;]+?)\s*;', block))
            for selector in selectors.split(','):
                rules.setdefault(selector.strip(), {}).update(declarations)
        return rules

    def palette(self, scheme, light=False):
        """Custom properties on the body, in cascade order (the base palette is teal)."""
        selectors = [':root', f'body.o_lg_scheme_{scheme}']
        if light:
            selectors += ['body.o_lg_light', f'body.o_lg_light.o_lg_scheme_{scheme}']
        palette = {}
        for selector in selectors:
            if scheme != 'teal':
                self.assertIn(selector, self.rules)
            palette.update(self.rules.get(selector, {}))
        return palette

    def assertContrast(self, a, b, minimum=4.5):
        ratio = contrast(a, b)
        self.assertGreaterEqual(ratio, minimum, f"{a} on {b}: {ratio:.2f}")

    def each_scheme(self):
        for scheme in self.schemes:
            for light in (False, True):
                with self.subTest(scheme=scheme, light=light):
                    yield light, self.palette(scheme, light)

    def test_white_on_fill(self):
        for _light, palette in self.each_scheme():
            self.assertContrast('white', palette['--lg-primary-fill'])

    def test_white_on_gradient(self):
        for _light, palette in self.each_scheme():
            stops = colors(palette['--lg-primary-gradient'])
            self.assertEqual(len(stops), 2)
            for stop in stops:
                self.assertContrast('white', stop)

    def test_primary_text(self):
        for light, palette in self.each_scheme():
            surfaces = DARK_SURFACES
            if light:
                stops = colors(palette['--lg-bg-image'])
                self.assertEqual(len(stops), 3)
                surfaces = [LIGHT_SURFACE, *stops]
            for surface in surfaces:
                self.assertContrast(palette['--lg-primary-text'], surface)

    def test_text_on_accent(self):
        """Tags without a colour: their text sits on the accent itself."""
        for _light, palette in self.each_scheme():
            self.assertContrast(palette['--lg-on-primary'], palette['--lg-primary'])

    def test_focus_ring(self):
        for light, palette in self.each_scheme():
            surface = LIGHT_SURFACE if light else DARK_SURFACES[0]
            self.assertContrast(palette['--lg-focus-ring'], surface, 3.0)

    def test_scheme_rules_cover_the_same_variables(self):
        """Same specificity as body.o_lg_light: a dark value must never survive in light mode."""
        for scheme in set(self.schemes) - {'teal'}:
            dark = self.rules.get(f'body.o_lg_scheme_{scheme}', {})
            light = self.rules.get(f'body.o_lg_light.o_lg_scheme_{scheme}', {})
            self.assertTrue(dark, scheme)
            self.assertFalse(set(dark) - set(light), scheme)

    def test_teal_is_unchanged(self):
        for light, expected, on_primary in ((False, TEAL_DARK, '#000000'), (True, TEAL_LIGHT, '#ffffff')):
            palette = self.palette('teal', light)
            self.assertEqual(palette, {
                **expected,
                '--lg-primary-fill': '#047865',
                '--lg-on-primary': on_primary,
            })
