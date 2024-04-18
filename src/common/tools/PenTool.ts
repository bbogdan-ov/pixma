import { PenLikeTool } from "./PenLikeTool";
import { App } from "@source/App";

export class PenTool extends PenLikeTool {
    static readonly NAME = "pen";

    constructor(app: App) {
        super(App.NAMESPACE, PenTool.NAME, app);

		this.keymap(["1", "p"]);
    }
}
