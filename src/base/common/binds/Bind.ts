export default class Bind {
    ctrlKey = false;
    shiftKey = false;
    altKey = false;

    weak = false;

    constructor(ctrlKey=false, shiftKey=false, altKey=false) {
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.altKey = altKey;
    }

    get(event: Event): boolean {
        const ev = event as any;

        if (this.weak) {
            return (
                this.ctrlKey ? ev.ctrlKey : true &&
                this.shiftKey ? ev.shiftKey : true &&
                this.altKey ? ev.altKey : true
            )
        } else {
            return (
                ev.ctrlKey == this.ctrlKey &&
                ev.shiftKey == this.shiftKey &&
                ev.altKey == this.altKey
            )
        }
    }

    setCtrlKey(value=true): this {
        this.ctrlKey = value;
        return this;
    }
    setShiftKey(value=true): this {
        this.shiftKey = value;
        return this;
    }
    setAltKey(value=true): this {
        this.altKey = value;
        return this;
    }
    setWeak(value=true): this {
        this.weak = value;
        return this;
    }
}
