import { EventName } from "@base/types/enums";
import { BaseElement } from "./BaseElement";
import { KeyBind } from "@base/common/binds";

export interface FocusableOptions {
	keyboardInteract: boolean
}

export abstract class FocusableElement
	extends BaseElement
	implements FocusableOptions
{
	keyboardInteract = true;

    constructor() {
        super();

        this.tabIndex = 0;
		this.classList.add("focusable");
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.KEY_DOWN, this._onKeyDown.bind(this));
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
}
