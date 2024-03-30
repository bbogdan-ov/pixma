import { Point } from "@base/common/math";
import { Manager } from ".";
import { MouseButton } from "@base/types/enums";
import { MouseBind } from "@base/common/binds";
import { IMouseData } from "@base/types/types";

export class MouseManager extends Manager implements IMouseData {
    /** Pressed and move pos */
    readonly pos = new Point();
    /** Last moved pos */
    readonly last = new Point();
    /** Pressed pos */
    readonly start = new Point();
    /** Released pos */
    readonly end = new Point();
    /** Difference between `pos` and `last` */
    readonly movement = new Point();

    protected _isPressed = false;
    protected _pressedButton = MouseButton.LEFT;
    protected _isCtrlPressed = false;
    protected _isShiftPressed = false;
    protected _isAltPressed = false;

    protected _downEvent: MouseEvent | null = null;
    protected _upEvent: MouseEvent | null = null;

    constructor() {
        super();
    }

    reset() {
        this.pos.zero();
        this.last.zero();
        this.start.zero();
        this.end.zero();
        this.movement.zero();

        this._isPressed = false;
        this._pressedButton = MouseButton.LEFT;
        this._isCtrlPressed = false;
        this._isShiftPressed = false;
        this._isAltPressed = false;

        this._downEvent = null;
        this._upEvent = null;
    }

    protected _updateKeys(event: MouseEvent) {
        this._isCtrlPressed = event.ctrlKey;
        this._isShiftPressed = event.shiftKey;
        this._isAltPressed = event.altKey;
    }

    // On
    onDown(event: MouseEvent, x?: number, y?: number) {
        this._downEvent = event;

        x = x ?? event.clientX;
        y = y ?? event.clientY;

        this.start.set(x, y);
        this.last.set(x, y);
        this.pos.set(x, y);

        this._isPressed = true;
        this._pressedButton = event.button;
        this._updateKeys(event);
    }
    onMove(event: MouseEvent, x?: number, y?: number) {
        x = x ?? event.clientX;
        y = y ?? event.clientY;

        this._updateKeys(event);

        this.last.copy(this.pos);
        this.pos.set(x, y);

        this.movement.set(this.pos.x - this.last.x, this.pos.y - this.last.y);
    }
    onUp(event: MouseEvent, x?: number, y?: number) {
        this._upEvent = event;

        x = x ?? event.clientX;
        y = y ?? event.clientY;

        this.end.set(x, y);

        this._isPressed = false;
        this._isCtrlPressed = false;
        this._isShiftPressed = false;
        this._isAltPressed = false;
    }
    
    // Get
    getIsPressed(...binds: MouseBind[]): boolean {
        if (!this.isPressed || !this.downEvent) return false;

        for (const bind of binds) {
            if (bind.test(this.downEvent))
                return true;
        }

        return false;
    }
    get downEvent(): MouseEvent | null {
        return this._downEvent;
    }
    get upEvent(): MouseEvent | null {
        return this._upEvent;
    }
    get isPressed(): boolean {
        return this._isPressed;
    }
    get pressedButton(): MouseButton {
        return this._pressedButton;
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
