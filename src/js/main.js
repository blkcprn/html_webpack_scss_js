import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


class Fixed {
    constructor(options={}) {
        this.triggerSelector = options.triggerSelector ?? "[data-open-btn]";
        this.closeSelector = options.closeSelector ?? "[data-close-btn]";
        this.overlaySelector = options.overlaySelector ?? ".overlay";
        this.activeClass = options.activeClass ?? "active";
        this.fixedTriggers = document.querySelectorAll(this.triggerSelector);
        this.overlay = document.querySelector(this.overlaySelector);
        this.setup();
    }
    setup() {
        if (this.fixedTriggers.length > 0) {
            this.setEvents();
        }
    }
    setEvents() {
        this.fixedTriggers.forEach((elem) => {
            elem.addEventListener("click", (e) => {
                if (elem !== e.target) return;
                this.toggle(elem);
            });
        });
    }
    toggleFixed(elem, show) {
        if (show) {
            elem.classList.add(this.activeClass);
            this.overlay.classList.add(this.activeClass);
            this.getLinks(elem).forEach((link) => {
                this.setTabindex(link, true);
            }); 
        } else {
            elem.classList.remove(this.activeClass);
            this.overlay.classList.remove(this.activeClass);
            this.getLinks(elem).forEach((link) => {
                this.setTabindex(link, false);
            });
        }
    }
    getLinks(elem) {
        let links = [];
        switch (elem.id) {
            case "mobileMenu":
                const menuLinks = elem.querySelectorAll(".mobile-menu__list > li > a, .mobile-menu__list > li > h3 > a");
                const enterlinks = elem.querySelectorAll(".enter a");
                links = [...menuLinks, ...enterlinks];
                break;
            default:
                links = elem.querySelectorAll("a[tabindex]");
                break;
        }
        return links;
    }
    setTabindex(link, show, exceptClass=this.activeClass) {
        if (!link.classList.contains(exceptClass)) {
            link.setAttribute("tabindex", (show == true)? "0" : "-1");
        }
    }
    toggle(elem) {
        const fixedId = elem.dataset.target;
        const fixedElem = document.querySelector(`#${fixedId}`);
        this.toggleFixed(fixedElem, true);
        const closeBtn = fixedElem.querySelector(this.closeSelector);
        closeBtn.addEventListener("click", () => {
            this.toggleFixed(fixedElem, false);
        });
        this.overlay.addEventListener("click", () => {
            this.toggleFixed(fixedElem, false);
        });
    }
}


class Dropdown {
    constructor(options={}) {
        this.dropdownSelector = options.dropdownSelector ?? ".dropdown";
        this.toggleSelector = options.toggleSelector ?? ".dropdown__toggle";
        this.contentSelector = options.contentSelector ?? ".dropdown__content";
        this.accordionSelector = options.accordionSelector ?? "accordion-content";
        this.activeClass = options.activeClass ?? "active";
        this.dropdownElems = document.querySelectorAll(this.dropdownSelector);
        this.setup();
    }
    setup() {
        if (this.dropdownElems.length > 0) {
            this.setEvents();
        }
    }
    setEvents() {
        for(let elem of this.dropdownElems) {
            if (elem.dataset.exceptEvent === "hover") continue;
            elem.addEventListener("mouseenter", (e) => {
                if (elem !== e.target) return;
                this.hoverEvent(elem, true);
            });
            elem.addEventListener("mouseleave", (e) => {
                if (elem !== e.target) return;
                this.hoverEvent(elem, false);
            });
        }
        for(let elem of this.dropdownElems) {
            if (elem.dataset.exceptEvent === "click") continue;
            const toggle = elem.querySelector(this.toggleSelector);
            toggle.addEventListener("click", (e) => {
                if (toggle !== e.target) return;
                const content = elem.querySelector(this.contentSelector);
                const show = toggle.getAttribute("aria-expanded") == "false";
                this.clickEvent(toggle, content, show);
            });
        }
    }
    hoverEvent(node, show) {
        const toggle = node.querySelector(this.toggleSelector);
        const content = node.querySelector(this.contentSelector);
        this.setDropdownAttributes(toggle, content, show);
        this.toggleContentVisible(content, show);
        this.setToggleActive(toggle, show);
    }
    clickEvent(toggle, content, show) {
        this.setDropdownAttributes(toggle, content, show);
        this.toggleContentVisible(content, show);
        this.setToggleActive(toggle, show);
    }
    setToggleActive(toggle, show) {
        if (show) {
            if (!toggle.classList.contains(this.activeClass)) {
                toggle.classList.add(this.activeClass);
            }
        } else {
            if (toggle.classList.contains(this.activeClass)) {
                toggle.classList.remove(this.activeClass);
            }
        }
    }
    setDropdownAttributes(toggle, content, show) {
        const expanded = (show == true)? "true" : "false";
        const hidden = (show == true)? "false" : "true";
        toggle.setAttribute("aria-expanded", expanded);
        content.setAttribute("aria-hidden", hidden);

        if (content.classList.contains(this.accordionSelector)) {
            const liElems = content.querySelectorAll(":scope > li");
            liElems.forEach((el) => {
                const aElem = el.querySelector("a[tabindex], h3 > a[tabindex]");
                this.setTabindex(aElem, show);
            });
        } else {
            const links = content.querySelectorAll("a[tabindex]");
            links.forEach((el) => {
                this.setTabindex(el, show);
            });
        }        
    }
    toggleContentVisible(content, show) {
        if (show) {
            if (!content.classList.contains(this.activeClass)) {
                if (content.classList.contains("tree-content") && content.dataset.level > 0) {
                    const fitClass = this.getElemFitClass(content);
                    content.classList.add(fitClass);
                }
                content.classList.add(this.activeClass);
            }
        } else {
            if (content.classList.contains(this.activeClass)) {
                content.classList.remove(this.activeClass);
            }
        }
    }
    getElemFitClass(elem) {
        let fitClass = "to-right";
        const contentRect = elem.getBoundingClientRect();
        const windowWidth  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (contentRect.x - contentRect.width < 0) {
            fitClass = "to-right";
        }
        if (contentRect.x + contentRect.width > windowWidth) {
            fitClass = "to-left";
        }
        return fitClass;
    }
    setTabindex(link, show, exceptClass=this.activeClass) {
        if (!link.classList.contains(exceptClass)) {
            link.setAttribute("tabindex", (show == true)? "0" : "-1");
        }
    }
    toggle(elem) {
        const node = elem.closest(this.dropdownSelector);
        const toggle = node.querySelector(this.toggleSelector);
        const content = node.querySelector(this.contentSelector);
        const show = toggle.getAttribute("aria-expanded") == "false";
        this.setDropdownAttributes(toggle, content, show);
        this.toggleContentVisible(content, show);
    }
}


class Mode {
    constructor(options={}) {
        this.modeElem = document.querySelector("html");
        this.btnSelector = options.btnSelector ?? "#mode-btn";
        this.modeBtn = document.querySelector(this.btnSelector);
        this.modes = ["light", "dark"];
        this.mode = options.default ?? "light";
        this.setup();
    }
    setup() {
        let modeKey = localStorage.getItem("mode");
        if (modeKey != null && modeKey != this.mode) {
            this.mode = modeKey;
            this.set(this.mode);
        }
        this.changeIcon(this.mode);
        this.setClick();
    }
    setClick() {
        this.modeBtn.addEventListener("change", (e) => {
            const modeKey = this.getMode(e.target.checked);
            this.setMode(modeKey);
        });
        this.modeBtn.addEventListener("keydown", (e) => {
            if (e.keyCode == 13 || e.which === 13) {
                e.target.checked = !e.target.checked;
                const modeKey = this.getMode(e.target.checked);
                this.setMode(modeKey);
            }
        });
    }
    getMode(isChecked) {
        return isChecked ? "dark" : "light";
    }
    setMode(modeKey) {
        if (modeKey) {
            this.to(modeKey);
        } else {
            this.to();
        }
    }
    setElemAttributes(elem) {
        elem.setAttribute("aria-pressed", elem.checked === true ? "true" : "false");
    }
    getValidmodeKey(key) {
        let modeKey = key
        const modesKeys = Object.keys(this.modes)
        if (!modesKeys.includes(key)) {
            modeKey = this.mode
        }
        return modeKey
    }
    set(key) {
        let modeKey = this.getValidmodeKey(key)
        this.modeElem.setAttribute("data-mode", modeKey);
    }
    get() {
        return this.mode;
    }
    next() {
        /* If mode key is null - get next obj from modes obj */
        const modesKeys = Object.keys(this.modes);
        let modeInd = modesKeys.indexOf(this.mode);
        const nextInd = (modeInd + 1) % modesKeys.length;
        return modesKeys[nextInd];
    }
    to(key=null) {
        /* if key if null. set next mode from modes */
        if (this.mode == key) {return;}
        const modeKey = (key == null)? this.next() : key;
        this.set(modeKey);
        this.modeElem.setAttribute("data-mode", modeKey);
        localStorage.setItem("mode", modeKey);
        this.mode = modeKey;
        this.changeIcon(modeKey);
    }
    changeIcon(key) {
        if (this.iconHandler) {
            this.iconHandler(this.mode);
        } else {
            this.modeBtn.checked = (key == "dark") ? true : false;
            this.setElemAttributes(this.modeBtn);
        }
    }
}


window.addEventListener("DOMContentLoaded", () => {
    const mode = new Mode();
    const dropdown = new Dropdown();
    const fixed = new Fixed();
    const swiper = new Swiper(".swiper", {
        modules: [Navigation, Pagination],
        direction: "horizontal",
        loop: true,
        pagination: {
            el: ".swiper-pagination",
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        scrollbar: {
            el: ".swiper-scrollbar",
        },
    });
});

