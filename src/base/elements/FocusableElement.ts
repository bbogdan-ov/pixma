import { EventName } from "@base/types/enums";
import { BaseElement } from "./BaseElement";
import { KeyBind } from "@base/common/binds";
import { Focusable } from "@base/types/types";

export interface FocusableOptions {
	keyboardInteract: boolean
}

export abstract class FocusableElement
	extends BaseElement
	implements Focusable, FocusableOptions, FocusableOptions
{
    protected _isFocused = false;

	keyboardInteract = true;

    constructor() {
        super();

        this.tabIndex = 0;
		this.classList.add("focusable");
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.FOCUS, this._onFocus.bind(this));
        this.listen(this, EventName.BLUR, this._onBlur.bind(this));
        this.listen(this, EventName.KEY_DOWN, this._onKeyDown.bind(this));
    }
    protected _onFocus(event: FocusEvent) {
        this._isFocused = true;
    }
    protected _onBlur(event: FocusEvent) {
        this._isFocused = false;
    }
    protected _onKeyDown(event: KeyboardEvent) {
        if (this.keyboardInteract) {
			if (
				KeyBind.ENTER.test(event) ||
				KeyBind.SPACE.test(event)
			) {
				event.preventDefault();
				event.stopPropagation();
				this._onInteract(event);
			}
        }

		if (KeyBind.ESCAPE.test(event)) {
			event.preventDefault();
			event.stopPropagation();
            this.blur();
        }
    }
    protected _onInteract(event: KeyboardEvent) {}

    // Get
    get isFocused(): boolean {
        return this._isFocused;
    }
}
