/** @odoo-module **/

import { NavBar } from "@web/webclient/navbar/navbar";
import { patch } from "@web/core/utils/patch";
import { useEffect, useRef, useState } from "@odoo/owl";

const FOCUSABLE = "a[href], button:not([disabled])";

patch(NavBar.prototype, {
    setup() {
        super.setup();
        this.sidebarState = useState({ isOpen: false });
        this.appsSidebarRef = useRef("appsSidebar");
        this.sidebarToggleRef = useRef("sidebarToggle");
        // after the render that lifts inert, move focus to the current (or first) app;
        // one more frame so the sidebar is visible (focus() on a hidden element is a no-op)
        useEffect(
            (isOpen) => {
                const el = this.appsSidebarRef.el;
                if (!isOpen || !el) {
                    return;
                }
                const frame = requestAnimationFrame(() =>
                    (el.querySelector("[aria-current='page']") ||
                        el.querySelector(".o_apps_sidebar_item"))?.focus()
                );
                return () => cancelAnimationFrame(frame);
            },
            () => [this.sidebarState.isOpen]
        );
    },
    toggleSidebar() {
        if (this.sidebarState.isOpen) {
            this.closeSidebar();
        } else {
            this.sidebarState.isOpen = true;
        }
    },
    closeSidebar() {
        if (!this.sidebarState.isOpen) {
            return;
        }
        this.sidebarState.isOpen = false;
        this.sidebarToggleRef.el?.focus();
    },
    onSidebarKeydown(ev) {
        if (ev.key === "Escape") {
            ev.stopPropagation();
            this.closeSidebar();
        } else if (ev.key === "Tab") {
            // keep focus inside the modal sidebar
            const items = [...this.appsSidebarRef.el.querySelectorAll(FOCUSABLE)];
            const first = items[0];
            const last = items[items.length - 1];
            if (ev.shiftKey && document.activeElement === first) {
                ev.preventDefault();
                last.focus();
            } else if (!ev.shiftKey && document.activeElement === last) {
                ev.preventDefault();
                first.focus();
            }
        }
    },
    onNavBarAppClick(app) {
        this.sidebarState.isOpen = false;
        this.menuService.selectMenu(app);
    },
});
