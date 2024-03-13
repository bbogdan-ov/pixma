import { IconName } from "@base/types/enums";
import DrawingTool from "./DrawingTool";
import type App from "@source/App";
import { Color } from "@base/common/misc";

export default class EraseTool extends DrawingTool {
    static readonly NAME = "erase";

    constructor(app: App) {
        super(EraseTool.NAME, app);

        this._icon = IconName.ERASE_TOOL;
    }
    
    get color(): Color {
        return Color.TRANSPARENT;
    }
}
