import { DrawingTool } from ".";
import type { App } from "@source/App";
import { Layer } from "../layers";
import { MouseData } from "@base/managers";

export class ShapeTool extends DrawingTool {
	protected _left = 0;
	protected _top = 0;
	protected _width = 0;
	protected _height = 0;
	protected _quarter = 0;

	constructor(namespace: string, name: string, app: App) {
		super(namespace, name, app);
	}

	protected _calculatePosition(mouse: MouseData) {
		let left = mouse.start.x;
		let top = mouse.start.y;
		let width = mouse.pos.x - left;
		let height = mouse.pos.y - top;

		// Calc aspect ratio
		if (this.isSaveAspectRatio) {
			const max = Math.max(width, height);

			width = max;
			height = max;
		}

		if (width < 0) {
			this._left = left + width;
			this._width = -width;
		} else {
			this._left = left;
			this._width = width;
		}

		if (height < 0) {
			this._top = top + height;
			this._height = -height;
		} else {
			this._top = top;
			this._height = height;
		}

		// Calc quarter
		if (width > 0 && height < 0)
			this._quarter = 0;
		else if (width < 0 && height < 0)
			this._quarter = 1;
		else if (width < 0 && height > 0)
			this._quarter = 2;
		else if (width > 0 && height > 0)
			this._quarter = 3;
		else
			this._quarter = 0;
	}

	// On
	onDown(layer: Layer, mouse: MouseData): void {
		this._calculatePosition(mouse);
	    super.onDown(layer, mouse);
	}
	onUse(layer: Layer, mouse: MouseData): void {
		this._calculatePosition(mouse);
	    super.onUse(layer, mouse);
	}

	// Get
	get isSaveAspectRatio(): boolean {
		return this.app.keyboard.isShiftPressed;
	}
	get isDrawFromCenter(): boolean {
		return this.app.keyboard.isCtrlPressed;
	}
	get drawOnPreview(): boolean {
	    return true;
	}
	get left(): number {
		return this._left;
	}
	get top(): number {
		return this._top;
	}
	get right(): number {
		return this.left + this.width;
	}
	get bottom(): number {
		return this.top + this.height;
	}
	get width(): number {
		return this._width;
	}
	get height(): number {
		return this._height;
	}
	/** Useful for drawing lines */
	get startX(): number {
		if (this.quarter == 2)
			return this.right;
		return this.left;
	}
	get startY(): number {
		if (this.quarter == 0)
			return this.bottom;
		return this.top;
	}
	get endX(): number {
		if (this.quarter == 2)
			return this.left;
		return this.right;
	}
	get endY(): number {
		if (this.quarter == 0)
			return this.top;
		return this.bottom;
	}
	get quarter(): number {
		return this._quarter;
	}
}
