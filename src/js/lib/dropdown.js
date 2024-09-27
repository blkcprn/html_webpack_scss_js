import { animateTransitionY } from './animations.js';


export class DropdownManager {
    /*
     *  Dropdown manager.
     */
    constructor(options) {
        this.dropdownElems = document.querySelectorAll(options.dropdown ?? '.dropdown');
        this.dropdownBtns = document.querySelectorAll(options.btn ?? '.dropdown__btn');
        this.btnSelector = options.btn ?? '.dropdown__btn';
        this.contentSelector = options.content ?? '.dropdown__content';
        this.itemSelector = options.item ?? '.dropdown__item';
        this.animateClass = options.animateClass;
        this.events = options.events ?? ['hover', 'click'];
        this.hiddenNotActive = options.hiddenNotActive ?? true; // hidden not active dropdowns
        this.animateJs = animateTransitionY;  // js animation object with keyframes and options
        this.extHandler = null;  // any additional handler, parameter - show
        this.setup();
    }
    setup() {
        this.setClick();
    }
    setClick() {
        if (this.events.includes('hover')) {
            this.dropdownElems.forEach((elem) => {
                elem.addEventListener('mouseenter', (e) => {
                    if (elem !== e.target) return;
                    this.setAttributesHover(e.target, true);
                    if (this.hiddenNotActive) {
                        const contentId = elem.querySelector(this.contentSelector).id;
                        this.closeNotActive(contentId);
                    }
                });
                elem.addEventListener('mouseleave', (e) => {
                    if (elem !== e.target) return;
                    this.setAttributesHover(e.target, false);
                });
            });
        }
        if (this.events.includes('click')) {
            this.dropdownBtns.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    if (btn !== e.target) return;
                    const currentExpanded = e.target.getAttribute('aria-expanded');
                    const show = currentExpanded == 'true' ? false : true;
                    this.setAttributesBtn(e.target, show);
                    if (show && this.hiddenNotActive) {
                        const contentId = btn.parentElement.querySelector(this.contentSelector).id;
                        this.closeNotActive(contentId);
                    }
                });
            });
        }
    }
    closeNotActive(contentId) {
        this.dropdownElems.forEach((el) => {
            const elContent = el.querySelector(this.contentSelector);
            const btn = el.querySelector(this.btnSelector);
            if (elContent.getAttribute('aria-hidden') == 'false' && contentId != elContent.id) {
                this.setAttributesBtn(btn, false);
            }
        });
    }
    setAttributesBtn(node, show) {
        const isHidden = show == true ? 'false' : 'true';
        const isExpanded = show == true ? 'true' : 'false';
        const tabIndex = show == true ? '0' : '-1';
        
        if (node.nodeName === 'BUTTON') {
            node.setAttribute('aria-expanded', isExpanded);

            const content = node.parentElement.querySelector(this.contentSelector);
            
            content.setAttribute('aria-hidden', isHidden);

            const items = content.querySelectorAll(this.itemSelector);

            items.forEach((item) => {
                item.setAttribute('tabindex', tabIndex);
            });
            this.onOffAnimation(content, show);
        }
    }
    setAttributesHover(node, show) {
        const isHidden = show == true ? 'false' : 'true';
        const isExpanded = show == true ? 'true' : 'false';
        const tabIndex = show == true ? '0' : '-1';

        const btn = node.querySelector(this.btnSelector);

        btn.setAttribute('aria-expanded', isExpanded);

        const content = node.querySelector(this.contentSelector);
        
        content.setAttribute('aria-hidden', isHidden);

        const items = node.querySelectorAll(this.itemSelector);
        items.forEach((item) => {
            item.setAttribute('tabindex', tabIndex);
        });
        this.onOffAnimation(content, show);
    }
    onOffAnimation(content, show) {
        if (show == true) {
            if (this.animateClass !== null || this.animateClass !== undefined) {
                content.classList.add(this.animateClass);
            } else {
                this.setAnimation(content, this.animateJs);
            }
        } else {
            if (this.animateClass !== null || this.animateClass !== undefined) {
                content.classList.remove(this.animateClass);
            } else {
                this.cancelAnimation(content);
            }
        }
        if (this.extHandler) {
            this.extHandler(show);
        }
    }
    setAnimation(content, anim) {
        const animete = (this.animateJs !== null) ? this.animateJs : anim;

        content.style.setProperty("visibility", "visible");
        content.animate(animete.keyframes, animete.options);
    }
    cancelAnimation(content) {
        content.style.setProperty("visibility", "hidden");
        content.getAnimations().forEach((animation) => {
            animation.cancel();
        });
    }
}
