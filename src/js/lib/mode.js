export const modes = {
    light: {
        "--bg-html-color": "#f5f5f5",
        "--bg-body-color": "#f5f5f5",
        "--text-color": "#6c757d",
        "--accent-color": "#ffd333",
        "--contrast-color": "#3d464d",
    },
    dark: {
        "--bg-html-color": "#FFFFFF",
        "--bg-body-color": "#C0C0C0",
        "--text-color": "#F0F0F0",
        "--accent-color": "#ffd333",
        "--contrast-color": "#3d464d",
    }
}

export class ModeManager {
    /*
     *    html add data-mode,
     *    For modes icons add some tag with id="mode_<mode key from list_of_modes>"
     */
    constructor(options) {
        this.docStyle = document.documentElement.style;
        this.modeElem = document.querySelector("html");
        this.modes = options.modes;
        this.mode = this.modeElem.dataset.mode || options.default;
        this.setup();
    }
    setup() {
        let modeKey = localStorage.getItem("mode");
        if (modeKey != null && modeKey != this.mode) {
            this.mode = modeKey;
            this.set(this.mode);
        }
        this.changeIcon(modeKey);
        this.setClick();
    }
    setClick() {
        let icons = document.querySelectorAll(".mode");
        icons.forEach(el => {
            el.addEventListener('click', () => {
                let modeKey = el.dataset.mode;
                if (modeKey) {
                    this.to(modeKey);
                } else {
                    this.to();
                }
            });
        })
    }
    getValidmodeKey(key) {
        let modeKey = key
        const modesKeys = Object.keys(this.modes)
        if (!modesKeys.includes(key)) {
            modeKey = modesKeys[0]
        }
        return modeKey
    }
    set(key) {
        let modeKey = this.getValidmodeKey(key)
        Object.entries(this.modes[modeKey]).forEach(([k, val]) => {
            this.docStyle.setProperty(k, val);
        });
    }
    get() {
        return this.mode;
    }
    next() {
        /* If mode key is null - get next obj from modes obj */
        const modesKeys = Object.keys(this.modes);
        let modeInd = modesKeys.indexOf(this.mode);
        const nextInd = (modeInd + 1) % modesKeys.length;
        return modesKeys[nextInd];
    }
    to(key=null) {
        /* if key if null. set netx mode from modes */
        if (this.mode == key) {return;}
        const modeKey = (key == null)? this.next() : key;
        this.set(modeKey);
        this.modeElem.setAttribute("data-mode", modeKey);
        localStorage.setItem("mode", modeKey);
        this.mode = modeKey;
        this.changeIcon(modeKey);
    }
    changeIcon(key) {
        let icons = document.querySelectorAll(".mode");
        if (icons.length > 1) {
            icons.forEach(el => {
                if (el.id == "mode_" + key) {
                    el.style.setAttribute('display', 'node');
                } else {
                    el.style.setAttribute('display', 'inline-block');
                }
            })
        }
    }
}

// const modeBtn = document.querySelector('#mode-btn');
// const currentMode = localStorage.getItem('mode');
// if (currentMode) {
//     document.documentElement.setAttribute('data-mode', currentMode);
//     if (currentMode === 'dark') {
//         modeBtn.checked = true;
//     }
// }
// function modeSwitch(e) {
//     if (e.target.checked) {
//         document.documentElement.setAttribute('data-mode', 'dark');
//         localStorage.setItem('mode', 'dark');
//     } else {
//         document.documentElement.setAttribute('data-mode', 'light');
//         localStorage.setItem('mode', 'light');
//     }
// }
// modeBtn.addEventListener('chenge', modeSwitch, false);
