import { BurgerManager } from "./lib/burger.js";
// import { animateTranslateYOpacity } from "./lib/animations.js";
import { DropdownManager } from "./lib/dropdown.js";
import { SubmenuManager } from "./lib/submenu.js";


window.addEventListener("DOMContentLoaded", () => {
    const burger = new BurgerManager({});
    const dropdown = new DropdownManager({
        // animateJsObj: animateTranslateYOpacity,
        events: ["hover", "click"],
        showClass: "dropdown__content--show"
    });
    const submenu = new SubmenuManager({
        // animateJsObj: animateTranslateYOpacity,
        events: ["hover", "click"],
        showClass: "submenu__content--show"
    });
});