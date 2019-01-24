function bindDOM(base, el, varname) {
    //TODO: compensate for existing getters and setters; compensate for existing value.

    if (el.tagName.toLowerCase() == "input" || el.tagName.toLowerCase() == "textarea") {
        Object.defineProperty(base, varname, {
            get: () => {
                return el.value;
            },
            set: (value) => {
                el.value = value;
            }
        })
    } else {
        Object.defineProperty(base, varname, {
            get: () => {
                return el.innerText;
            },
            set: (value) => {
                el.innerText = value;
            }
        })
    }
}