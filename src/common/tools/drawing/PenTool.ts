import DrawingTool from "../DrawingTool";
import type { IMouseData } from "@base/types/types";
import type App from "@source/App";
import type { Layer } from "@source/common/layers";

export default class PenTool extends DrawingTool {
    static readonly NAME = "pen";

    constructor(app: App) {
        super(PenTool.NAME, app);
    }

    use(layer: Layer, mouse: IMouseData): void {
        super.use(layer, mouse);

        this.brush?.drawLine(
            layer.context,
            mouse.last.x,
            mouse.last.y,
            mouse.pos.x,
            mouse.pos.y
        );
    }
}
