import { PenLikeTool } from "./PenLikeTool";
import type { App } from "@source/App";

export class PenTool extends PenLikeTool {
    static readonly NAME = "pen";

    constructor(app: App) {
        super(PenTool.NAME, app);

		this.keymap(["1", "p"]);
    }
}
