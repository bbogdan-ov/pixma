import { IconName } from "@base/types/enums";
import { DrawingTool } from "../DrawingTool";
import type { App } from "@source/App";
import { ColorState } from "@base/common/listenable";

export class EraseTool extends DrawingTool {
    static readonly NAME = "erase";

    constructor(app: App) {
        super(EraseTool.NAME, app);

        this._icon = IconName.ERASE_TOOL;

		this.keymap(["2", "e"]);
    }
    
    get colorState(): ColorState {
        return ColorState.TRANSPARENT;
    }
}
