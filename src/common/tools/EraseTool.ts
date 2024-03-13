import { IconName } from "@base/types/enums";
import DrawingTool from "./DrawingTool";
import { IMouseData } from "@base/types/types";
import { Layer } from "../layers";
import { CompositeOperation } from "@source/types/enums";
import type App from "@source/App";

export default class EraseTool extends DrawingTool {
    static readonly NAME = "erase";

    constructor(app: App) {
        super(EraseTool.NAME, app);

        this._icon = IconName.ERASE_TOOL;
    }
    
    use(layer: Layer, mouse: IMouseData): void {
        super.use(layer, mouse);

        layer.context.globalCompositeOperation = CompositeOperation.ERASE;
        this.brush?.drawLine(
            layer.context,
            mouse.last.x,
            mouse.last.y,
            mouse.pos.x,
            mouse.pos.y
        )
        layer.context.globalCompositeOperation = CompositeOperation.DEFAULT;
    }
}
