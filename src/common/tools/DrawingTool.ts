import { Tool } from "./Tool";
import type { MouseData } from "@base/types/types";
import type { Layer } from "../layers";
import type { App } from "@source/App";

export class DrawingTool extends Tool {
    constructor(name: string, app: App) {
        super(name, app);
    }

    use(layer: Layer, mouse: MouseData) {
		this.draw(layer.context, mouse);
    }

    // On
    onDown(layer: Layer, mouse: MouseData): void {
        super.onDown(layer, mouse);

        this.use(layer, mouse);
    }
    onUse(layer: Layer, mouse: MouseData): void {
        super.onUse(layer, mouse);

        this.use(layer, mouse);
    }
}
