import { KeyCode } from "@base/types/enums";
import { Manager } from ".";
import { EventUtils } from "@base/utils";
import { KeyBind } from "@base/common/binds";

export class KeyboardManager extends Manager {
    protected _isPressed = false;
    protected _pressedCode: KeyCode | null = null;
    protected _isCtrlPressed = false;
    protected _isShiftPressed = false;
    protected _isAltPressed = false;

    protected _downEvent: KeyboardEvent | null = null;
    protected _upEvent: KeyboardEvent | null = null;

    constructor() {
        super();
    }

    reset() {
        this._isPressed = false;
        this._pressedCode = null;
        this._isCtrlPressed = false;
        this._isShiftPressed = false;
        this._isAltPressed = false;
    }

    // On
    onDown(event: KeyboardEvent) {
        const code = EventUtils.getKeyCode(event);

        this._downEvent = event;
    
        this._isPressed = true;
        this._pressedCode = code;
        this._isCtrlPressed = event.ctrlKey || code == KeyCode.CONTROL;
        this._isShiftPressed = event.shiftKey || code == KeyCode.SHIFT;
        this._isAltPressed = event.altKey || code == KeyCode.ALT;
    }
    onUp(event: KeyboardEvent) {
        this._upEvent = event;

        this._isPressed = false;
        this._isCtrlPressed = false;
        this._isShiftPressed = false;
        this._isAltPressed = false;
    }

    // Get
    getIsPressed(...binds: KeyBind[]): boolean {
        if (!this.isPressed || !this.downEvent) return false;

        for (const bind of binds) {
            if (bind.test(this.downEvent))
                return true;
        }

        return false;
    }
    get downEvent(): KeyboardEvent | null {
        return this._downEvent;
    }
    get upEvent(): KeyboardEvent | null {
        return this._upEvent;    
    }
    get isPressed(): boolean {
        return this._isPressed;
    }
    get pressedCode(): KeyCode | null {
        return this._pressedCode;
    }
    get isCtrlPressed(): boolean {
        return this._isCtrlPressed;
    }
    get isShiftPressed(): boolean {
        return this._isShiftPressed;
    }
    get isAltPressed(): boolean {
        return this._isAltPressed;
    }
}
