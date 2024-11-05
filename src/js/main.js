import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


class Fixed {
    constructor(options={}) {
        this.triggerSelector = options.triggerSelector ?? "[data-open-btn]"
        this.fixedTriggers = document.querySelectorAll(this.triggerSelector);
        this.overlay = document.querySelector(".overlay");
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
            elem.classList.add("active");
            this.overlay.classList.add("active");
            this.getLinks(elem).forEach((link) => {
                link.setAttribute("tabindex", "0");
            }); 
        } else {
            elem.classList.remove("active");
            this.overlay.classList.remove("active");
            this.getLinks(elem).forEach((link) => {
                link.setAttribute("tabindex", "-1");
            }); 
        }
    }
    getLinks(elem) {
        let links = [];
        if (!elem.classList.contains("mobile-nav")) {
            links = elem.querySelectorAll("a[tabindex]");
        } else {
            const menuLinks = document.querySelectorAll(".mobile-menu > li > a, .mobile-menu > li > h3 > a");
            const enterlinks = document.querySelectorAll(".enter a");
            links = [...menuLinks, ...enterlinks];
        }
        return links;
    }
    toggle(elem) {
        const fixedId = elem.dataset.fixedTarget;
        const fixedElem = document.querySelector(`#${fixedId}`);
        this.toggleFixed(fixedElem, true);
        const closeBtn = fixedElem.querySelector("[data-close-btn]");
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
        this.toggleSelector = options.toggleSelector ?? ".dropdown-toggle";
        this.contentSelector = options.contentSelector ?? ".dropdown-content";
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
    }
    clickEvent(toggle, content, show) {
        this.setDropdownAttributes(toggle, content, show);
        this.toggleContentVisible(content, show);
    }
    setDropdownAttributes(toggle, content, show) {
        const expanded = (show == true)? "true" : "false";
        const hidden = (show == true)? "false" : "true";
        toggle.setAttribute("aria-expanded", expanded);
        content.setAttribute("aria-hidden", hidden);

        if (content.classList.contains("minmenu-content")) {
            const liElems = content.querySelectorAll(":scope > li");
            liElems.forEach((el) => {
                const aElem = el.querySelector("a[tabindex]");
                aElem.setAttribute("tabindex", (show == true)? "0" : "-1");
            });
        } else {
            const links = content.querySelectorAll("a[tabindex]");
            links.forEach((el) => {
                el.setAttribute("tabindex", (show == true)? "0" : "-1");
            });
        }        
    }
    toggleContentVisible(content, show) {
        if (show) {
            if (!content.classList.contains(this.activeClass)) {
                content.classList.add(this.activeClass);
            }
        } else {
            if (content.classList.contains(this.activeClass)) {
                content.classList.remove(this.activeClass);
            }
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
