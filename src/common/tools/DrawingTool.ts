import { Tool } from "./Tool";
import { DrawingToolParams } from "@source/elements/tools-params";
import { State } from "@base/common/listenable";
import type { IMouseData } from "@base/types/types";
import type { Layer } from "../layers";
import type { App } from "@source/App";

export class DrawingTool extends Tool {
	readonly isPixelPerfectState = new State<boolean>(false);

    constructor(name: string, app: App) {
        super(name, app);
    }

    use(layer: Layer, mouse: IMouseData) {
		if (this.isPixelPerfect)
			this.drawPixelPerfect(layer, mouse);
		else
			this.draw(layer.context, mouse);
    }
	drawPixelPerfect(layer: Layer, mouse: IMouseData) {
		// TODO:
	}

    createParams(): HTMLElement {
        if (this.paramsElement) return this.paramsElement;
        return this.cacheParamsElement(new DrawingToolParams(this));
    }

    // On
    onDown(layer: Layer, mouse: IMouseData): void {
        super.onDown(layer, mouse);

        this.use(layer, mouse);
    }
    onUse(layer: Layer, mouse: IMouseData): void {
        super.onUse(layer, mouse);

        this.use(layer, mouse);
    }

	// Get
	get isPixelPerfect(): boolean {
		return this.isPixelPerfectState.value;
	}
}
