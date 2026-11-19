# Liquid Glass Backend Theme

[![License: LGPL-3](https://img.shields.io/badge/license-LGPL--3-F1972B.svg)](https://www.gnu.org/licenses/lgpl-3.0)
[![Odoo 19.0](https://img.shields.io/badge/Odoo-19.0-F1972B.svg)](https://www.odoo.com)

A glassmorphism backend theme for Odoo 19 (Community and Enterprise), with a per-user light and dark mode.

> **Derived work.** This theme is derived from the *Liquid Glass Backend Theme* by
> [Cybrosys Techno Solutions](https://www.cybrosys.com) (© 2026 Cybrosys Technologies Pvt. Ltd., LGPL-3).
> All original rights stay with Cybrosys. Roberto Fichera's changes are listed in
> [`doc/RELEASE_NOTES.md`](doc/RELEASE_NOTES.md) and [`NOTICE`](NOTICE).

## Features

- Glass navbar, control panel, forms, lists, kanban, dialogs and chatter.
- Apps sidebar opened from the ☰ button in the navbar.
- **Light / Dark mode per user**: *My Preferences > Theme Mode*, or *Light Mode* / *Dark Mode* in the user menu.
- **Accessibility**: visible keyboard focus; the apps sidebar is a modal dialog (labelled, unreachable while closed, focus moved in and back, Escape to close, Tab kept inside); readable focused app and search on the Enterprise home menu; reduced-motion support.

## Changes from the Cybrosys original

- Odoo Enterprise: glass home menu background; the sidebar toggle is added to the Enterprise navbar by the bridge module [`backend_theme_liquid_glass_enterprise`](https://github.com/robyf70/backend_theme_liquid_glass_enterprise).
- Renamed from `theme_liquid_glass` to `backend_theme_liquid_glass`: the `website` module hides every `theme_*` module from Apps.
- Colours moved to CSS custom properties, with a light set and a new `res.users.liquid_glass_mode` field.
- Readable navbar menus and systray icons (they were unreadable in debug mode on Enterprise), command palette, status bar and primary buttons.

## Dependencies

| Module | Source |
|---|---|
| `base`, `web` | Odoo |

On Odoo Enterprise also install [`backend_theme_liquid_glass_enterprise`](https://github.com/robyf70/backend_theme_liquid_glass_enterprise) (it installs automatically when `web_enterprise` is present).

## Installation

Put this directory on the Odoo `addons_path` and install *Liquid Glass Backend Theme* from Apps.

## Configuration

Each user picks *Dark* (default) or *Light* in *My Preferences > Theme Mode*.

## License

[LGPL-3](LICENSE) (supplementing the [GPL-3](COPYING)).

## Credits

**Authors**

* Cybrosys Techno Solutions — original theme
* Roberto Fichera — modifications

**Contributors**

* Cybrosys Techno Solutions — odoo@cybrosys.com
* Roberto Fichera — roby.fichera@gmail.com
