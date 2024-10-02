// import { animateTranslateYOpacity } from "./lib/animations.js";
import { DropdownManager } from "./lib/dropdown.js";


window.addEventListener("DOMContentLoaded", () => {
    const dropdown = new DropdownManager({
        // animateJsObj: animateTranslateYOpacity,
        // events: ["hover", "click"],
        // visibleClass: "dropdown__content--visible"
    });
});
