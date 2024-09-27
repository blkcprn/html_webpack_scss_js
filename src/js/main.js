import { modes, ModeManager } from './lib/mode.js';
import { DropdownManager } from './lib/dropdown.js';


window.addEventListener("DOMContentLoaded", () => {
    const mode = new ModeManager({
        modes: modes,
        default: 'light',
    });
    const dropdown = new DropdownManager({
        events: ['hover', 'click'],
        animateClass: 'dropdown__content--active'
    });
});
