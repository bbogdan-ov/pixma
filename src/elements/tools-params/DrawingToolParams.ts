import { ToolParams } from ".";
import type { Tool } from "@source/common/tools";

@ToolParams.define("drawing-tool-params")
export default class DrawingToolParams<T extends Tool=Tool> extends ToolParams<T> {
    constructor(tool: T) {
        super(tool);
    }
}
