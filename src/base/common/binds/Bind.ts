export class Bind {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;

	/**
	 * TODO: come up with a good description for this thing
	 * See implementation of `get()` method 
	 */
    strict = true;

    constructor(ctrl=false, shift=false, alt=false) {
        this.ctrl = ctrl;
        this.shift = shift;
        this.alt = alt;
    }

	/** Test event for matching */
    get(event: Event): boolean {
        const ev = event as any;

        if (!this.strict) {
			// Match at least one
            return (
                this.ctrl ? ev.ctrlKey : true &&
                this.shift ? ev.shiftKey : true &&
                this.alt ? ev.altKey : true
            )
        } else {
			// Match all
            return (
                ev.ctrlKey == this.ctrl &&
                ev.shiftKey == this.shift &&
                ev.altKey == this.alt
            )
        }
    }

    setCtrl(value=true): this {
        this.ctrl = value;
        return this;
    }
    setShift(value=true): this {
        this.shift = value;
        return this;
    }
    setAlt(value=true): this {
        this.alt = value;
        return this;
    }
	/** TODO: this is also need a good description */
    setStrict(value=true): this {
        this.strict = value;
        return this;
    }
	/** Inverse of `setStrict()` */
    setGentle(value=true): this {
        return this.setStrict(!value);
    }
}
