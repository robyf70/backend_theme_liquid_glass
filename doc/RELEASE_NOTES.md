## Module <backend_theme_liquid_glass>

#### 10.02.2026

#### Version 19.0.1.0.0
#### ADD
- Initial commit for Liquid Glass Backend Theme

#### 25.04.2026

#### Version 19.0.1.0.1
#### ADD
- Initial commit for Liquid Glass Backend Theme

#### 17.11.2026

#### Version 19.0.1.0.2
#### FIX
- Odoo Enterprise: glass background on the web_enterprise home menu
- Readable links in info alerts (e.g. the Enterprise database expiration panel)
- Sidebar and toggle moved to named templates (backend_theme_liquid_glass.AppsSidebar / .SidebarToggle) for backend_theme_liquid_glass_enterprise

#### 17.11.2026

#### Version 19.0.1.0.3
#### FIX
- Renamed back to backend_theme_liquid_glass: website hides every theme_* module from Apps

#### 19.11.2026

#### Version 19.0.1.1.0
#### ADD
- Per-user Light / Dark mode: `res.users.liquid_glass_mode` (My Preferences, user form, user menu toggle), rendered as the `o_lg_light` body class; colours are CSS custom properties
- Accessibility: visible keyboard focus, readable focused app on the home menu, apps sidebar as a modal dialog (labels, inert when closed, focus in/out, Escape, Tab trap), reduced-motion support
#### FIX
- Navbar menus and systray icons readable (unreadable in debug mode on Enterprise): the theme now sets Odoo's `--NavBar-entry-*` variables
- Command palette (home menu search, Ctrl+K): input text and active row readable
- Sidebar toggle vertically aligned with the other navbar entries
- White text on primary buttons and the current status bar step in both modes
- Status bar: no white / Odoo-teal chevron outlines (theme now sets `--o-statusbar-*`), square chevrons, rounded glass band
