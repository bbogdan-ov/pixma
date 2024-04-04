import { Trigger } from "@base/common/listenable";
import { IconName, MouseButton } from "@base/types/enums";
import { ToolButton, ToolParams } from "@source/elements/tools";
import { IMouseData } from "@base/types/types";
import { Canvas, Color } from "@base/common/misc";
import { KeymapBind } from "@base/managers/KeymapsManager";
import { AppContext, CompositeOperation } from "@source/types/enums";
import { Algorithms } from "@source/utils";
import type { ColorState, State } from "@base/common/listenable";
import type { Layer } from "../layers";
import type { App } from "@source/App";
import type { Brush } from "../brushes";
import { Utils } from "@base/utils";

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

export class Tool {
    readonly name: string;
    readonly app: App;

    protected _isChosen = false;
    protected _isUsing = false;

    protected _iconName: IconName = IconName.PEN_TOOL;

    /** Cache params, so we dont need to create another one */
    protected _paramsElement: ToolParams | null = null;
	readonly brush = new ToolBrush();

    readonly onDidChosen = new Trigger<Tool>();
    readonly onDidUnchosen = new Trigger<Tool>();

    constructor(name: string, app: App) {
        this.name = name;
        this.app = app;
    }
    setup() {
		this._paramsElement = this.createParams();
    }

    choose(): boolean {
        return this.app.tools.choose(this);
    }
    unchoose(): boolean {
        return this.app.tools.unchoose();
    }
	/** Create a command and keymap for this tool */
	keymap(binds: KeymapBind) {
		this.app.registerCommand(AppContext.PROJECT, this.chooseCommandName, this.choose.bind(this));
		this.app.registerKeymap(binds, this.chooseCommandName);
	}

    createButton(): HTMLElement {
        return new ToolButton(this).setIcon(this.iconName);
    }
    createParams(): ToolParams {
        return new ToolParams(this);
    }

    draw(context: CanvasRenderingContext2D, mouse: IMouseData) {
		this.brush.drawLine(
			context,
			mouse.last.x, mouse.last.y,
			mouse.pos.x, mouse.pos.y
		);
    }
    drawPreview(context: CanvasRenderingContext2D, mouse: IMouseData) {
		this.brush.draw(context, mouse.pos.x, mouse.pos.y);
    }

	renderBrush(button: MouseButton | null) {
		const curBrush = this.app.brushes.current;

		// TODO: somehow store current app brush
		if (curBrush)
			this.brush.render(curBrush, this.getColor(button), this.size);
	}

    // On
    onDown(layer: Layer, mouse: IMouseData) {
        this._isUsing = true;
		this.renderBrush(mouse.pressedButton);
    }
    onUse(layer: Layer, mouse: IMouseData) {}
    onMove(layer: Layer, mouse: IMouseData) {
		this.renderBrush(mouse.pressedButton);
	}
    onUp(layer: Layer, mouse: IMouseData) {
        this._isUsing = false;
		this.renderBrush(mouse.pressedButton);
    }
    onChoose() {
        this._isChosen = true;
        this.onDidChosen.trigger(this);
    }
    onUnchoose() {
        this._isChosen = false;
        this.onDidUnchosen.trigger(this);
    }

    // Get
	getColor(button: MouseButton | null): Color {
		if (button == MouseButton.RIGHT)
			return this.backColor;
		return this.frontColor;
	}
    get frontColor(): Color {
        return this.frontColorState?.color ?? Color.TRANSPARENT;
    }
    get backColor(): Color {
        return this.backColorState?.color ?? Color.TRANSPARENT;
    }
    /** Value from `sizeState` */
    get size(): number {
        return this.sizeState?.value ?? 1;
    }
	get frontColorState(): ColorState | null {
		return this.app.brushes.frontColorState;
	}
	get backColorState(): ColorState | null {
		return this.app.brushes.backColorState;
	}
    get sizeState(): State<number> | null {
        return this.app.brushes.sizeState;
    }
    get isChosen(): boolean {
        return this._isChosen;
    }
    get isUsing(): boolean {
        return this._isUsing;
    }
	get chooseCommandName(): string {
		return `choose-${ this.name }-tool`;
	}
	get iconName(): IconName {
		return this._iconName;
	}
	get paramsElement(): ToolParams | null {
		return this._paramsElement;
	}
}
