export const modes = {
    light: {
        "color": "#ffffff",
    },
    dark: {
        "color": "#212121",
    }
}

export class ModeManager {
    /*
     *    html add data-mode,
     */
    constructor(options) {
        this.docStyle = document.documentElement.style;
        this.modeElem = document.querySelector("html");
        this.modes = options.modes ?? modes;
        this.mode = options.default ?? this.modeElem.dataset.mode ?? "light";
        this.btnSelector = options.btnSelector ?? "#mode-btn";
        this.iconHandler = null; // handler for chenge mode icon
        this.extHandler = null;  // any additional handler, parameter - mode name
        this._setup();
    }
    _setup() {
        let modeKey = localStorage.getItem("mode");
        if (modeKey != null && modeKey != this.mode) {
            this.mode = modeKey;
            this.set(this.mode);
        }
        this.changeIcon(modeKey);
        this.setClick();
    }
    setClick() {
        let switchetMode = document.querySelector(this.btnSelector);
        switchetMode.addEventListener("change", (e) => {
            const modeKey = this._getMode(e.target.checked);
            this._setMode(modeKey);
        });
        switchetMode.addEventListener("keydown", (e) => {
            if (e.keyCode == 13 || e.which === 13) {
                e.target.checked = !e.target.checked;
                const modeKey = this._getMode(e.target.checked);
                this._setMode(modeKey);
            }
        });
    }
    _getMode(isChecked) {
        return isChecked ? "dark" : "light";
    }
    _setMode(modeKey) {
        console.log(modeKey);
        if (modeKey) {
            this.to(modeKey);
        } else {
            this.to();
        }
    }
    setElemAttributes(elem) {
        elem.setAttribute("aria-pressed", elem.checked === true ? "true" : "false");
    }
    getValidmodeKey(key) {
        let modeKey = key
        const modesKeys = Object.keys(this.modes)
        if (!modesKeys.includes(key)) {
            modeKey = this.mode
        }
        return modeKey
    }
    set(key) {
        let modeKey = this.getValidmodeKey(key)
        this.modeElem.setAttribute("data-mode", modeKey);
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
        /* if key if null. set next mode from modes */
        if (this.mode == key) {return;}
        const modeKey = (key == null)? this.next() : key;
        this.set(modeKey);
        this.modeElem.setAttribute("data-mode", modeKey);
        localStorage.setItem("mode", modeKey);
        this.mode = modeKey;
        this.changeIcon(modeKey);
        if (this.extHandler) {
            this.extHandler(this.mode);
        }
    }
    changeIcon(key) {
        if (this.iconHandler) {
            this.iconHandler(this.mode);
        } else {
            let switchetMode = document.querySelector(this.btnSelector);
            switchetMode.checked = (key == "dark") ? true : false;
            this.setElemAttributes(switchetMode);
        }
    }
}

