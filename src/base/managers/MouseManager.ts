import { Point } from "@base/common/math";
import { Manager } from ".";
import { MouseButton } from "@base/types/enums";
import { MouseBind } from "@base/common/binds";
import { IPoint } from "@base/types/types";

export interface MouseData {
    pos: IPoint
    last: IPoint
    start: IPoint
    end: IPoint
    movement: IPoint

    pressedButton: MouseButton | null
    isCtrl: boolean
    isShift: boolean
    isAlt: boolean
}

export class MouseManager extends Manager implements MouseData {
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

    protected _pressedButton: MouseButton | null = null;
    protected _isPressed = false;
    protected _isCtrl = false;
    protected _isShift = false;
    protected _isAlt = false;

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

        this._pressedButton = null;
        this._isPressed = false;
        this._isCtrl = false;
        this._isShift = false;
        this._isAlt = false;

        this._downEvent = null;
        this._upEvent = null;
    }

    protected _updateKeys(event: MouseEvent) {
        this._isCtrl = event.ctrlKey;
        this._isShift = event.shiftKey;
        this._isAlt = event.altKey;
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

		this._pressedButton = null;
        this._isPressed = false;
        this._isCtrl = false;
        this._isShift = false;
        this._isAlt = false;
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
	get isLeft(): boolean {
		return this.isPressed && this.pressedButton === MouseButton.LEFT;
	}
	get isMiddle(): boolean {
		return this.isPressed && this.pressedButton === MouseButton.MIDDLE;
	}
	get isRigth(): boolean {
		return this.isPressed && this.pressedButton === MouseButton.RIGHT;
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
    get pressedButton(): MouseButton | null {
        return this._pressedButton;
    }
    get isCtrl(): boolean {
        return this._isCtrl;
    }
    get isShift(): boolean {
        return this._isShift;
    }
    get isAlt(): boolean {
        return this._isAlt;
    }
}
