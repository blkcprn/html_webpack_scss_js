export class DropdownManager {
    /*
        Dropdown manager. Set dropdown attributes for dropdown buttons and element.
        Show and hide animation is done in CSS.
        Or or by CSS class, (showClass in options),
        or js animate object (animateJsObj in options {keyframes: [], options: {}}).
        Use button or tag with role="button".
        To exclude an event for a specific element add a dataset except-event
        with value (hover or click).
    */
    #allowed_events = ["hover", "click"];
    #def = {
        dropdownSelector: ".dropdown",
        contentSelector: ".dropdown__content",
        toggleSelector: ".dropdown__toggle",
        itemSelector: ".dropdown__item",
        showClass: null, // ".dropdown__content--show",
        events: this.#allowed_events,
        hideInactive: true,
    };
    constructor(options) {
        this.dropdownElems = document.querySelectorAll(
            options.dropdownSelector ?? this.#def.dropdownSelector,
        );
        this.contentSelector = options.contentSelector ?? this.#def.contentSelector;
        this.toggleSelector = options.toggleSelector ?? this.#def.toggleSelector;
        this.itemSelector = options.itemSelector ?? this.#def.itemSelector;
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
        if (this.dropdownElems.length > 0) {
            this.setEvents();
        }
    }
    setEvents() {
        if (this.events.includes("hover")) {
            for(let elem of this.dropdownElems) {
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
            for(let elem of this.dropdownElems) {
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

        const items = content.querySelectorAll(this.itemSelector);
        if (items) {
            items.forEach((item) => {
                item.setAttribute("tabindex", tabIndex);
            });
        }

        if (this.showClass !== null || this.animateJsObj !== null) {
            this.toggleContentAnimation(content, show);
        }
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
        if (positionParent.x < positionContent.width) {
            content.style.setProperty("left", "0");
            content.style.setProperty("right", "auto");
        }
        if (positionParent.top > (window.innerHeight - positionContent.height)) {
            content.style.setProperty("top", `-${positionContent.height}px`);
        } 
    }
    hiddenVisibleContents(node) {
        let contentId = null;
        if (node.hasAttribute("aria-expanded")) {
            contentId = node.parentElement.querySelector(this.contentSelector).id;
        } else {
            contentId = node.querySelector(this.contentSelector).id;
        }
        this.dropdownElems.forEach((el) => {
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