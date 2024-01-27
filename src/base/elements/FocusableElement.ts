import { EventName } from "@base/types/enums";
import { BaseElement } from ".";
import { KeyboardData } from "@base/common/events";
import { KeyBind } from "@base/common/binds";

export default abstract class FocusableElement extends BaseElement {
    protected _isFocused = false;

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
        const key = new KeyboardData(event);

        if (key.get(KeyBind.SPACE, KeyBind.ENTER)) {
            event.preventDefault();
            this._onInteract(event);
        } else if (key.get(KeyBind.ESCAPE)) {
            this.blur();
        }
    }
    protected _onInteract(event: KeyboardEvent) {}

    // Get
    get isFocused(): boolean {
        return this._isFocused;
    }
}
