import { Tool } from "./Tool";
import { Canvas, Color } from "@base/common/misc";
import { State, Trigger } from "@base/common/listenable";
import { CompositeOperation } from "@source/types/enums";
import { Algorithms } from "@source/utils";
import { Utils } from "@base/utils";
import { MouseButton } from "@base/types/enums";
import { ToolParams } from "@source/elements/tools";
import { ColorfulTool } from "./ColorfulTool";
import { MouseData } from "@base/managers";
import type { Layer } from "../layers";
import type { App } from "@source/App";
import type { Brush } from "../brushes";

// Tool brush
export class ToolBrush {
	readonly canvas = Canvas.sized(1, 1);

	protected _color: Color = Color.BLACK;
	protected _size: number = 1;

	readonly onDidRendered = new Trigger<ToolBrush>();

	constructor() {}

    draw(context: CanvasRenderingContext2D, x: number, y: number) {
        const half = Math.floor(this._size/2);
        const rem = (this._size%2)/2;
        
		context.globalCompositeOperation = this.getCompositeOperation();

        context.drawImage(
            this.image,
            Math.round(x - half - rem),
            Math.round(y - half - rem)
        );

        context.globalCompositeOperation = CompositeOperation.DEFAULT;
    }
    drawLine(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
        Algorithms.line(
            fromX, fromY,
            toX, toY,
            (x, y)=> this.draw(context, x, y)
        )
    }
    
	render(brush: Brush, color: Color, size: number): boolean {
		size = Utils.clamp(Math.floor(size), 1, brush.maxSize);

		if (this._color.compareHsl(color) && this._size == size)
			return false;

		this._color.copy(color);
		this._size = size;
		brush.render(this.canvas.context, color, size);

		this.onDidRendered.trigger(this);
		return true;
	}

	// Get
	getCompositeOperation(): CompositeOperation {
        if (this._color.isTransparent)
            return CompositeOperation.ERASE;
		return CompositeOperation.DEFAULT;
	}
	get image(): CanvasImageSource {
		return this.canvas.element;
	}
}

// Drawing tool
export class DrawingTool extends ColorfulTool {
	readonly brush = new ToolBrush();

    constructor(namespace: string, name: string, app: App) {
        super(namespace, name, app);
    }

    use(layer: Layer, mouse: MouseData) {
		if (this.drawOnPreview)
			this.draw(layer.project.previewLayer.context, mouse);
		else
			this.draw(layer.context, mouse);
    }
    draw(context: CanvasRenderingContext2D, mouse: MouseData) {
		this.brush.drawLine(
			context,
			mouse.last.x, mouse.last.y,
			mouse.pos.x, mouse.pos.y
		);
    }
    drawPreview(context: CanvasRenderingContext2D, mouse: MouseData) {
		this.brush.draw(context, mouse.pos.x, mouse.pos.y);
    }

	renderBrush(button: MouseButton | null) {
		const curBrush = this.app.brushes.current;

		// TODO: somehow store current app brush
		if (curBrush)
			this.brush.render(curBrush, this.getColor(button), this.size);
	}

	createParams(): ToolParams<Tool> {
	    const params = super.createParams();
		if (this.sizeState)
			params.addProgressRange(this.sizeState)
				.setWidth(200)
				.setIsInt()
				.setClamp(1, ToolParams.SIZE_RANGE_MAX_VALUE)
				// TODO: change max input value based on tool's brush max size
				.input?.setMax(64);

		return params
	}

    // On
    onDown(layer: Layer, mouse: MouseData): void {
        super.onDown(layer, mouse);

		this.renderBrush(mouse.pressedButton);
        this.use(layer, mouse);
    }
    onUse(layer: Layer, mouse: MouseData): void {
        super.onUse(layer, mouse);

        this.use(layer, mouse);
    }
	onMove(layer: Layer, mouse: MouseData): void {
	    super.onMove(layer, mouse);

		if (this.isUsing || layer.project.canvasZoomable?.isMouseOver)
			this.renderBrush(mouse.pressedButton);
	}
	onUp(layer: Layer, mouse: MouseData): void {
		if (this.drawOnPreview)
			this.draw(layer.context, mouse);

	    super.onUp(layer, mouse)

		this.renderBrush(mouse.pressedButton);
	}

	// Get
    /** Value from `sizeState` */
    get size(): number {
        return this.sizeState?.value ?? 1;
    }
    get sizeState(): State<number> | null {
        return this.app.brushes.sizeState;
    }
	get drawOnPreview(): boolean {
		return false;
	}
}
