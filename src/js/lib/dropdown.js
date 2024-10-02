export class DropdownManager {
    /*
    Dropdown elem manager.
    Change dropdown btn attributes, and dropdown content attributes.
    for add animation from css: add option.visibleClass,
    for add ainmation from js: add options.animateJsObj {keyframes: [], options: {}},
    events: hover and click,
    */
    #default = {
        baseSelector: ".dropdown",
        contentSelector: ".dropdown__content",
        contentVisibleClass: null, // "dropdown__content--visible",
        btnSelector: ".dropdown__btn",
        itemSelector: ".dropdown__item",
        events: ["hover", "click"],
        hiddenNotActive: true,
    }
    constructor(options) {
        this.dropdownElems = document.querySelectorAll(options.dropdown ?? this.#default.baseSelector);
        this.events = options.events ?? this.#default.events;
        this.btnSelector = options.btn ?? this.#default.btnSelector;
        this.contentSelector = options.content ?? this.#default.contentSelector;
        this.visibleClass = options.visibleClass ?? this.#default.contentVisibleClass;
        this.itemSelector = options.item ?? this.#default.itemSelector;
        this.events = options.events ?? this.#default.events;
        this.hiddenNotActive = options.hiddenNotActive ?? this.#default.hiddenNotActive;
        this.animateClass = options.animateClass;
        this.animateJsObj = options.animateJsObj ?? null;
        this.setup();
    }
    setup() {
        this.setEvents();
    }
    setEvents() {
        if (this.events.includes("hover")) {
            this.dropdownElems.forEach((elem) => {
                elem.addEventListener("mouseenter", (e) => {
                    if (elem !== e.target) return;
                    this.setAttributes(e.target, true);
                    if (this.hiddenNotActive) {
                        this.hiddenVisibleContents(e.target);
                    }
                });
                elem.addEventListener("mouseleave", (e) => {
                    if (elem !== e.target) return;
                    this.setAttributes(e.target, false);
                });
            });
        }
        if (this.visibleClass !== null || this.animateJsObj !== null) {
            if (this.events.includes("click")) {
                this.dropdownElems.forEach((elem) => {
                    const btn = elem.querySelector(this.btnSelector);
                    btn.addEventListener("click", (e) => {
                        if (elem !== e.target) return;
                        const show = this.getToggleVisible(e.target);
                        console.log(show);
                        this.setAttributes(e.target, show);
                        if (this.hiddenNotActive) {
                            this.hiddenVisibleContents(e.target);
                        }
                    });
                });
            }
        }
    }
    setAttributes(node, show) {
        const isHidden = (show == true) ? "false" : "true";
        const isExpanded = (show == true) ? "true" : "false";
        const tabIndex = (show == true) ? "0" : "-1";
        let btn = null;
        let content = null;

        if (node.nodeName === "BUTTON") {
            btn = node;
            content = node.parentElement.querySelector(this.contentSelector);
        } else {
            btn = node.querySelector(this.btnSelector);
            content = node.querySelector(this.contentSelector);
        }
        btn.setAttribute("aria-expanded", isExpanded);
        content.setAttribute("aria-hidden", isHidden);

        const items = node.querySelectorAll(this.itemSelector);
        if (items) {
            items.forEach((item) => {
                item.setAttribute("tabindex", tabIndex);
            });
        }

        if (this.visibleClass !== null || this.animateJsObj !== null) {
            this.toggleContentAnimation(content, show);
        }
    }
    getToggleVisible(node) {
        if (node.nodeName === "BUTTON") {
            const currentVisible = node.getAttribute("aria-expanded");
            return (currentVisible == "true") ? false : true;
        } else {
            const currentVisible = node.getAttribute("aria-hidden");
            return (currentVisible == "true") ? false : true;
        }
    }
    toggleContentAnimation(content, show) {
        if (show == true) {
            if (this.visibleClass !== null) {
                content.classList.add(this.visibleClass);
            } else if (this.animateJsObj !== null) {
                this.setJsAnimation(content);
            }
        } else {
            if (this.visibleClass !== null) {
                content.classList.remove(this.visibleClass);
            } else if (this.animateJsObj !== null) {
                this.cancelJsAnimation(content);
            }
        }
    }
    hiddenVisibleContents(node) {
        let contentId = null;
        if (node.nodeName === "BUTTON") {
            contentId = node.parentElement.querySelector(this.contentSelector).id;
        } else {
            contentId = node.querySelector(this.contentSelector).id;
        }
        this.dropdownElems.forEach((el) => {
            const elContent = el.querySelector(this.contentSelector);
            const btn = el.querySelector(this.btnSelector);
            if (elContent.getAttribute("aria-hidden") == "false" && contentId != elContent.id) {
                this.setAttributes(btn, false);
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