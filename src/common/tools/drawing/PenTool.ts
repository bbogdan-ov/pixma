import DrawingTool from "../DrawingTool";
import type { IMouseData } from "@base/types/types";
import type { Layer } from "@source/common/layers";

export default class PenTool extends DrawingTool {
    static readonly NAME = "pen";

    constructor() {
        super(PenTool.NAME);
    }

    draw(layer: Layer, mouse: IMouseData): void {
        super.draw(layer, mouse);

        layer.project.app.brushes.current?.drawLine(
            layer.context,
            mouse.last.x,
            mouse.last.y,
            mouse.pos.x,
            mouse.pos.y
        );
    }
}
