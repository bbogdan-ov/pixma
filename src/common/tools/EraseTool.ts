import { IconName } from "@base/types/enums";
import { PenLikeTool } from "./PenLikeTool";
import type { ColorState } from "@base/common/listenable";
import { App } from "@source/App";

export class EraseTool extends PenLikeTool {
    static readonly NAME = "erase";

    constructor(app: App) {
        super(App.NAMESPACE, EraseTool.NAME, app);

        this._iconName = IconName.ERASE_TOOL;

		this.keymap(["2", "e"]);
    }
    
    get frontColorState(): ColorState | null {
        return null;
    }
    get backColorState(): ColorState | null {
        return null;
    }
}
