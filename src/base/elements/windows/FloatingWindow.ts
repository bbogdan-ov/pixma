import { WindowsManager } from "@base/managers";
import { BaseWindow, WindowHeader } from "./BaseWindow";
import { Button } from "../buttons";
import { EventName, IconName } from "@base/types/enums";
import { DOM, Utils } from "@base/utils";
import type { BaseApp } from "@base/BaseApp";
import { Point } from "@base/common/math";

// Floating window
@BaseWindow.define("floating-window")
export class FloatingWindow<A extends BaseApp=BaseApp> extends BaseWindow<A> {
	static readonly BOUNDS_PADDING = 12;

	readonly header: WindowHeader;
	readonly closeButton = Button
		.action(IconName.SMALL_CROSS)
		.addClassName("close-button");

	protected _placeInCenter = false;
	protected _x = 0;
	protected _y = 0;
	protected _isDragging = false;
	protected _dragOffset = new Point();

	constructor(name: string, manager: WindowsManager<A>, title: string="", x?: number, y?: number) {
		super(name, manager);

		if (x !== undefined && y !== undefined) {
			this._x = x;
			this._y = y;
		} else {
			this._placeInCenter = true;
		}

		this.header = new WindowHeader(
			DOM.span(title, "header-title"),
			this.closeButton
		);

		this.classList.add("floating-window", this.name + "-window");

		this.append(this.header);
	}

	open(): boolean {
		return this.manager.openFloating(this);
	}
	close(): boolean {
		return this.manager.close(this);
	}

	startDrag(event: MouseEvent): boolean {
		if (this.isDragging) return false;

		const bounds = this.getBoundingClientRect();

		this._dragOffset.set(
			bounds.left - event.clientX,
			bounds.top - event.clientY
		)

		this._isDragging = true;
		return true;
	}
	updateDrag(event: MouseEvent): boolean {
		if (!this.isDragging) return false;
		
		this.place(
			event.clientX + this._dragOffset.x,
			event.clientY + this._dragOffset.y
		);

		return true;
	}
	endDrag(event: MouseEvent): boolean {
		if (!this.isDragging) return false;

		this._isDragging = false;
		return true;
	}

	place(x: number, y: number) {
		this._x = x;
		this._y = y;

		this.updateBounds();
		this.updateTransform();
	}
	updateBounds() {
		const box = this.parentElement?.getBoundingClientRect();
		if (!box) return;

		const pad = FloatingWindow.BOUNDS_PADDING;
		const bounds = this.getBoundingClientRect();

		this._x = Utils.clamp(this._x, pad, box.width - bounds.width - pad);
		this._y = Utils.clamp(this._y, pad, box.height - bounds.height - pad);
	}
	updateTransform() {
		this.style.left = this.x + "px";
		this.style.top = this.y + "px";
	}

	// On
	onMount(): void {
	    super.onMount();

		// Events
		this.listen(this.header, EventName.DOWN, this._onHeaderDown.bind(this));
		this.listen(window, EventName.MOVE, this._onWindowMove.bind(this));
		this.listen(window, EventName.UP, this._onWindowUp.bind(this));
		this.listen(this.closeButton, EventName.CLICK, this._onCloseButtonClick.bind(this));

		if (this._placeInCenter) {
			const box = this.parentElement?.getBoundingClientRect();
			if (box) {
				const bounds = this.getBoundingClientRect();

				this.place(
					box.width/2 - bounds.width/2,
					box.height/2 - bounds.height/2
				);
			}
		} else {
			this.updateBounds();
			this.updateTransform();
		}
	}

	protected _onHeaderDown(event: PointerEvent) {
		this.startDrag(event);
	}
	protected _onWindowMove(event: PointerEvent) {
		this.updateDrag(event);
	}
	protected _onWindowUp(event: PointerEvent) {
		this.endDrag(event);
	}
	protected _onCloseButtonClick() {
		this.close();
	}

	// Get
	getAllowExecCommands(): boolean {
	    return this.isActive || this.isFocusedWithin;
	}
	get x(): number {
		return this._x;
	}
	get y(): number {
		return this._y;
	}
	get isDragging(): boolean {
		return this._isDragging;
	}
}
