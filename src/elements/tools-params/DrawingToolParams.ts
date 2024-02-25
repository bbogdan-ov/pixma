import { ToolParams } from ".";
import type { Tool } from "@source/common/tools";

@ToolParams.define("drawing-tool-params")
export default class DrawingToolParams extends ToolParams {
    constructor(tool: Tool) {
        super(tool);
    }
}
