import { IconName } from "@base/types/enums";
import DrawingTool from "./DrawingTool";
import { IMouseData } from "@base/types/types";
import { Layer } from "../layers";
import { Draw } from "@source/utils";

export default class EraseTool extends DrawingTool {
    static readonly NAME = "erase";

    constructor() {
        super(EraseTool.NAME);

        this._icon = IconName.ERASE_TOOL;
    }
    
    draw(layer: Layer, mouse: IMouseData): void {
        const size = layer.project.app.brushes.size;
        Draw.clear(layer.context, mouse.pos.x, mouse.pos.y, size, size);
    }
}
