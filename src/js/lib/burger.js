export class BurgerManager {
    /* Burger manager */
    constructor(options) {
        this.burgerElem = document.querySelector(options.selector ?? ".burger");
        this.activeClass = options.activeClass ?? "burger--active";
        this.event = options.event ?? "click";
        this.setup();
    }
    setup() {
        if (this.burgerElem) {
            this.setEvent();
        }
    }
    setEvent() {
        this.burgerElem.addEventListener(this.event, (e) => {
            e.target.classList.toggle(this.activeClass);
        });
    }
}