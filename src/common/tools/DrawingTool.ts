import { Tool } from ".";
import DrawingToolParams from "@source/elements/tools-params/DrawingToolParams";
import type { IMouseData } from "@base/types/types";
import type { Layer } from "../layers";
import type App from "@source/App";

export default class DrawingTool extends Tool {
    constructor(name: string) {
        super(name);
    }

    draw(layer: Layer, mouse: IMouseData) {}

    createParams(app: App): HTMLElement {
        if (this.paramsElement) return this.paramsElement;
        return this.cacheParamsElement(new DrawingToolParams(app));
    }

    // On
    onDown(layer: Layer, mouse: IMouseData): void {
        super.onDown(layer, mouse);

        this.draw(layer, mouse);
    }
    onUse(layer: Layer, mouse: IMouseData): void {
        super.onUse(layer, mouse);

        this.draw(layer, mouse);
    }
}
