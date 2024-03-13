import { Tool } from ".";
import DrawingToolParams from "@source/elements/tools-params/DrawingToolParams";
import type { IMouseData } from "@base/types/types";
import type { Layer } from "../layers";
import type App from "@source/App";

export default class DrawingTool extends Tool {
    constructor(name: string, app: App) {
        super(name, app);
    }

    use(layer: Layer, mouse: IMouseData) {
        this.draw(layer.context, mouse);
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
}
