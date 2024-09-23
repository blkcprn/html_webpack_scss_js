export class DropdownManager {
    /*
     *  Dropdown block manager
     */
    constructor(options) {
        this.dropdownBtns = document.querySelectorAll(options.btn);
        this.setup();
    }
    setup() {
        this.setClick();
    }
    setClick() {
        this.dropdownBtns.forEach(elem => {
            elem.addEventListener('click', (e) => {
                const dropdownWrap = document.getElementById(e.target.dataset.target);
                const newDisplayVal = dropdownWrap.style.display === 'block' ? 'none' : 'block';
                dropdownWrap.style.display = newDisplayVal;
            });
        })
    }
}


// const btn = document.querySelector('.button');
// const menu = document.querySelector('.menu');
// const menuLinks = menu.querySelectorAll('.menu__link');
// btn.addEventListener('click', () => {
//     btn.classList.toggle('active');
//     if (btn.classList.contains('active')) {
//         btn.setAttribute('aria-expanded', 'true');
//         menu.setAttribute('aria-hidden', 'false');
//         menuLinks.forEach((el) => {
//             el.setAttribute('tabindex', '0');
//         });
//     } else {
//         btn.setAttribute('aria-expanded', 'false');
//         menu.setAttribute('aria-hidden', 'true');
//         menuLinks.forEach((el) => {
//             el.setAttribute('tabindex', '-1');
//         });
//     }
// });
