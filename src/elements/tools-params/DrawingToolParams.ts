import type App from "@source/App";
import { ToolParams } from ".";

@ToolParams.define("drawing-tool-params")
export default class DrawingToolParams extends ToolParams {
    constructor(app: App) {
        super(app);
    }
}
