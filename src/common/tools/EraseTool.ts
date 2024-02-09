import { IconName } from "@base/types/enums";
import DrawingTool from "./DrawingTool";
import { IMouseData } from "@base/types/types";
import { Layer } from "../layers";
import { CompositeOperation } from "@source/types/enums";

export default class EraseTool extends DrawingTool {
    static readonly NAME = "erase";

    constructor() {
        super(EraseTool.NAME);

        this._icon = IconName.ERASE_TOOL;
    }
    
    draw(layer: Layer, mouse: IMouseData): void {
        layer.context.globalCompositeOperation = CompositeOperation.ERASE;
        layer.project.app.brushes.current?.drawLine(
            layer.context,
            mouse.last.x,
            mouse.last.y,
            mouse.pos.x,
            mouse.pos.y
        )
        layer.context.globalCompositeOperation = CompositeOperation.DEFAULT;
    }
}
