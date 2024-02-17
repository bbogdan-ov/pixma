import DrawingTool from "../DrawingTool";
import type { IMouseData } from "@base/types/types";
import type App from "@source/App";
import type { Layer } from "@source/common/layers";

export default class PenTool extends DrawingTool {
    static readonly NAME = "pen";

    constructor(app: App) {
        super(PenTool.NAME, app);
    }

    draw(layer: Layer, mouse: IMouseData): void {
        super.draw(layer, mouse);

        this.app.brushes.current?.drawLine(
            layer.context,
            mouse.last.x,
            mouse.last.y,
            mouse.pos.x,
            mouse.pos.y
        );
    }
}
