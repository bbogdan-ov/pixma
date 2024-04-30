import { Point } from "@base/common/math";
import { BaseElement } from "../BaseElement";
import { EventName } from "@base/types/enums";
import { Trigger } from "@base/common/listenable";
import { MouseManager } from "@base/managers";
import { MouseBind } from "@base/common/binds";
import { DOM, Utils } from "@base/utils";

@BaseElement.define("zoomable-element")
export class Zoomable extends BaseElement {
    protected _target: HTMLElement | null = null;

    protected _isPanning: boolean = false;

    readonly pan = new Point();
    protected _zoom: number = 1;

    protected _isMouseOver = false;
    protected _isMouseDown = false;
    protected _isSpacePressed = false;

    panEnabled = true;
    zoomEnabled = true;
    useMiddleMouseToPan = false;
    useCtrlToZoom = false;
    allowWheelPan = true;
    allowSpacePan = true;
    allowMouseZoom = true;
    /** Blur other elements on mouse enter */
    autoBlurOnEnter = true;
	/** Change `target` size (width and height) on zoom instead of scale */
	resizeOnZoom = false;
	
    minZoom = 0.02;
    maxZoom = 10;
    minPanX = -Infinity;
    minPanY = -Infinity;
    maxPanX = Infinity;
    maxPanY = Infinity;

    readonly mouse = new MouseManager();

    readonly onDidZoom = new Trigger<number>();
    readonly onDidPan = new Trigger<Point>();

    constructor() {
        super();

        this.classList.add("zoomable");
    }

    appendTarget(element: HTMLElement): this {
        this._target = element;
        this._target.classList.add("zoomable-target");

        this.append(this._target);
        return this;
    }

    centerTarget() {
        this.setPan(this.clientWidth / 2, this.clientHeight / 2);
    }
    updateTargetTransform() {
        if (!this._target) return;

        const panX = Math.floor(this.pan.x);
        const panY = Math.floor(this.pan.y);

		if (this.resizeOnZoom) {
			const width = this.getTargetWidth() * this.zoom;
			const height = this.getTargetHeight() * this.zoom;
			this._target.style.width = Math.round(width) + "px";
			this._target.style.height = Math.round(height) + "px";
			this._target.style.transform  = `translate(calc(${panX}px - 50%), calc(${panY}px - 50%))`;
		} else {
			this._target.style.transform  = `translate(calc(${panX}px - 50%), calc(${panY}px - 50%)) scale(${this.zoom})`;
		}
    }

    protected _updateMovePan(event: PointerEvent) {
        if (!this.panEnabled || !this._isPanning) return;

        this.setPan(this.pan.x + event.movementX, this.pan.y + event.movementY);
    }
    protected _updateWheelPan(event: WheelEvent) {
        if (!this.panEnabled || this.isPanning) return;
        if (!(this.useCtrlToZoom ? !event.ctrlKey : false)) return;
        event.preventDefault();

        if (event.shiftKey) {
            this.setPan(this.pan.x - event.deltaY, this.pan.y);
        } else {
            this.setPan(this.pan.x - event.deltaX, this.pan.y - event.deltaY);
        }
    }
    protected _updateSpacePan(event: PointerEvent) {
        if (!this.panEnabled || !this.allowSpacePan || this.isPanning) return;
        if (!this._isSpacePressed) return;

        this.setPan(this.pan.x + event.movementX, this.pan.y + event.movementY);
    }

    protected _updateWheelZoom(event: WheelEvent) {
        if (!this.zoomEnabled || this.isPanning) return;
        if (!(this.useCtrlToZoom ? event.ctrlKey : true)) return;
        event.preventDefault();

        this.setZoom(this._zoom - (event.deltaY / 400) * this._zoom, event.clientX, event.clientY);
    }
    protected _updateMoveZoom(event: PointerEvent) {
        if (!this.zoomEnabled || this.isPanning) return;
        if (!this.mouse.getIsPressed(MouseBind.MIDDLE.setCtrl())) return;
        event.preventDefault();

        this.setZoom(
            this._zoom - (event.movementY / 100) * this._zoom,
            this.mouse.start.x,
            this.mouse.start.y
        );
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(window, EventName.MOVE, this._onWindowMove.bind(this));
        this.listen(window, EventName.UP, this._onWindowUp.bind(this));
        this.listen(window, EventName.KEY_DOWN, this._onWindowKeyDown.bind(this));
        this.listen(window, EventName.KEY_UP, this._onWindowKeyUp.bind(this));
        this.listen(this, EventName.DOWN, this._onDown.bind(this));
        this.listen(this, EventName.WHEEL, this._onWheel.bind(this));
        this.listen(this, EventName.POINTER_ENTER, this._onPointerEnter.bind(this));
        this.listen(this, EventName.POINTER_LEAVE, this._onPointerLeave.bind(this));

        this.updateTargetTransform();
    }
    protected _onWindowMove(event: PointerEvent) {
        this.mouse.onMove(event);

        this._updateMovePan(event);
        this._updateMoveZoom(event);
        this._updateSpacePan(event);
    }
    protected _onWindowUp(event: PointerEvent) {
        this.mouse.onUp(event);
        this._isMouseDown = false;

        if (!this._isPanning) return;

        this._isPanning = false;
    }
    protected _onWindowKeyDown(event: KeyboardEvent) {
        if (this.isMouseOver)
            this._isSpacePressed = event.code == "Space";
    }
    protected _onWindowKeyUp(event: KeyboardEvent) {
        this._isSpacePressed = false;
    }
    protected _onDown(event: PointerEvent) {
        this.mouse.onDown(event);
        this._isMouseDown = true;

        if (event.ctrlKey || !(this.useMiddleMouseToPan ? this.mouse.isMiddle : true))
            return;

        event.preventDefault();
        this._isPanning = true;
    }
    protected _onWheel(event: WheelEvent) {
        this._updateWheelZoom(event);
        this._updateWheelPan(event);
    }
    protected _onPointerEnter(event: PointerEvent) {
        if (this.autoBlurOnEnter)
            DOM.blurFocused();
        
        this._isMouseOver = true;
    }
    protected _onPointerLeave(event: PointerEvent) {
        this._isMouseOver = false;
    }

    // Set
    setPan(x: number, y: number, updateTransform: boolean = true): this {
        this.pan.x = Utils.clamp(x, this.minPanX, this.maxPanX);
        this.pan.y = Utils.clamp(y, this.minPanY, this.maxPanY);

        this.onDidPan.trigger(this.pan);

        if (updateTransform)
            this.updateTargetTransform();

        return this;
    }
    setZoom(zoom: number, x: number, y: number, updateTransform: boolean = true): this {
        const wrapperBounds = this.getBoundingClientRect();
        x -= wrapperBounds.left;
        y -= wrapperBounds.top;

        zoom = Utils.clamp(zoom, this.minZoom, this.maxZoom);

        const targetX = (x - this.pan.x) / this._zoom;
        const targetY = (y - this.pan.y) / this._zoom;

        this._zoom = zoom;

        this.onDidZoom.trigger(zoom);
        this.setPan(-targetX * this._zoom + x, -targetY * this._zoom + y, false);

        if (updateTransform)
            this.updateTargetTransform();

        return this;
    }

    // Get
    getLocalPos(screenX: number, screenY: number): Point {
        if (!this._target) return new Point();

        const targetRect = this._target.getBoundingClientRect();
        const localX = screenX - targetRect.left;
        const localY = screenY - targetRect.top;

        const point = new Point(
            localX / targetRect.width * this._target.clientWidth,
            localY / targetRect.height * this._target.clientHeight,
        );

		if (this.resizeOnZoom) {
			point.x /= this.zoom;
			point.y /= this.zoom;
		}

		return point;
    }
	/** Default target width. Needed when `resizeOnZoom` is `true` */
	getTargetWidth(): number {
		return 100;
	}
	/** Default target height. Needed when `resizeOnZoom` is `true` */
	getTargetHeight(): number {
		return 100;
	}
    get target() {
        return this._target;
    }
    get zoom() {
        return this._zoom;
    }
    get isPanning() {
        return this._isPanning;
    }
    get isSpacePressed() {
        return this._isSpacePressed;
    }
    get isMouseOver() {
        return this._isMouseOver;
    }
    get isMouseDown() {
        return this._isMouseDown;
    }
}
