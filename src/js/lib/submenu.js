export class SubmenuManager {
    /*
        Submenu manager. Set submenu attributes for submenu buttons and element.
        Show and hide animation is done in CSS.
        Or or by CSS class, (showClass in options),
        or js animate object (animateJsObj in options {keyframes: [], options: {}}).
        Use button or tag with role="button".
        To exclude an event for a specific element add a dataset except-event
        with value (hover or click).
    */
    #allowed_events = ["hover", "click"];
    #def = {
        submenuSelector: ".submenu",
        contentSelector: ".submenu__content",
        toggleSelector: ".submenu__toggle",
        linkSelector: ".submenu__link",
        showClass: null, // ".submenu__content--show",
        events: this.#allowed_events,
        hideInactive: false,
    };
    constructor(options) {
        this.submenuElems = document.querySelectorAll(
            options.submenuSelector ?? this.#def.submenuSelector,
        );
        this.contentSelector = options.contentSelector ?? this.#def.contentSelector;
        this.toggleSelector = options.toggleSelector ?? this.#def.toggleSelector;
        this.linkSelector = options.linkSelector ?? this.#def.linkSelector;
        this.showClass = options.showClass ?? this.#def.showClass;
        this.events = options.events ?? this.#def.events;
        this.hideInactive = options.hideInactive ?? this.#def.hideInactive;
        this.animateJsObj = options.animateJsObj ?? null;
        this.check();
        this.setup();
    }
    check() {
        let allFound = this.events.every((event) => this.#def.events.includes(event));
        if (allFound == false) {
            throw new Error(`Not allowed event(s). Allow (${this.#allowed_events})`);
        }
    }
    setup() {
        if (this.submenuElems.length > 0) {
            this.setEvents();
        }
    }
    setEvents() {
        if (this.events.includes("hover")) {
            for(let elem of this.submenuElems) {
                if (elem.dataset.exceptEvent === "hover") continue;
                elem.addEventListener("mouseenter", (e) => {
                    if (elem !== e.target) return;
                    this.setElemAttributes(e.target, true);
                    if (this.hideInactive) {
                        this.hiddenVisibleContents(e.target);
                    }
                });
                elem.addEventListener("mouseleave", (e) => {
                    if (elem !== e.target) return;
                    this.setElemAttributes(e.target, false);
                });
            }
        }
        if (this.events.includes("click")) {
            for(let elem of this.submenuElems) {
                if (elem.dataset.exceptEvent === "click") continue;
                const toggle = elem.querySelector(this.toggleSelector);
                toggle.addEventListener("click", (e) => {
                    if (toggle !== e.target) return;
                    const show = this.getToggleVisible(e.target);
                    this.setElemAttributes(e.target, show);
                    if (this.hideInactive) {
                        this.hiddenVisibleContents(e.target);
                    }
                });
            }
        }
    }
    setElemAttributes(node, show) {
        const contentHidden = (show == true) ? "false" : "true";
        const toggleExpanded = (show == true) ? "true" : "false";
        const tabIndex = (show == true) ? "0" : "-1";

        let btn = null;
        let content = null;

        if (node.hasAttribute("aria-expanded")) {
            btn = node;
            content = node.parentElement.querySelector(this.contentSelector);
        } else {
            btn = node.querySelector(this.toggleSelector);
            content = node.querySelector(this.contentSelector);
        }
        btn.setAttribute("aria-expanded", toggleExpanded);
        content.setAttribute("aria-hidden", contentHidden);

        const links = content.querySelectorAll(this.linkSelector);
        if (links) {
            links.forEach((item) => {
                item.setAttribute("tabindex", tabIndex);
            });
        }

        if (this.showClass !== null || this.animateJsObj !== null) {
            this.toggleContentAnimation(content, show);
        }
    }
    toggle(elem) {
        // to button add oclick = submenu.toggle(this)
        const show = this.getToggleVisible(elem);
        this.setElemAttributes(elem, show);
    }
    getToggleVisible(node) {
        if (node.hasAttribute("aria-expanded")) {
            const currentVisible = node.getAttribute("aria-expanded");
            return (currentVisible == "true") ? false : true;
        } else {
            const btn = node.querySelector(this.toggleSelector);
            const currentVisible = btn.getAttribute("aria-expanded");
            return (currentVisible == "true") ? false : true;
        }
    }
    toggleContentAnimation(content, show) {
        this.setContentPosition(content);
        if (show == true) {
            if (this.showClass !== null) {
                content.classList.add(this.showClass);
            } else if (this.animateJsObj !== null) {
                this.setJsAnimation(content);
            }
        } else {
            if (this.showClass !== null) {
                content.classList.remove(this.showClass);
            } else if (this.animateJsObj !== null) {
                this.cancelJsAnimation(content);
            }
        }
    }
    setContentPosition(content) {
        const positionParent = content.parentElement.getBoundingClientRect();
        const positionContent = content.getBoundingClientRect();
        if (content.dataset.level > 1) {
            // content.style.setProperty("top", "auto");
            if (positionParent.x > (window.innerHeight - positionContent.width)) {
                content.style.setProperty("left", "-100%");
                content.style.setProperty("right", "auto");
            } else {
                content.style.setProperty("left", "100%");
                content.style.setProperty("right", "auto");
            }
        }
        // if (positionParent.top > (window.innerHeight - positionContent.height)) {
        //     content.style.setProperty("top", `-${positionContent.height}px`);
        // }
    }
    hiddenVisibleContents(node) {
        let contentId = null;
        if (node.hasAttribute("aria-expanded")) {
            contentId = node.parentElement.querySelector(this.contentSelector).id;
        } else {
            contentId = node.querySelector(this.contentSelector).id;
        }
        this.submenuElems.forEach((el) => {
            const elContent = el.querySelector(this.contentSelector);
            if (elContent.getAttribute("aria-hidden") == "false" && contentId != elContent.id) {
                this.setElemAttributes(el, false);
            }
        });
    }
    setJsAnimation(content) {
        content.style.setProperty("visibility", "visible");
        content.animate(this.animateJsObj.keyframes, this.animateJsObj.options);
    }
    cancelJsAnimation(content) {
        content.style.setProperty("visibility", "hidden");
        content.getAnimations().forEach((animation) => {
            animation.cancel();
        });
    }
}