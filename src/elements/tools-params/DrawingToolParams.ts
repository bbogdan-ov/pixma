import { CheckboxToggle } from "@base/elements/toggles";
import { ToolParams } from ".";
import type { DrawingTool } from "@source/common/tools";

@ToolParams.define("drawing-tool-params")
export default class DrawingToolParams<T extends DrawingTool=DrawingTool> extends ToolParams<T> {
	readonly pixelPerfectToggle: CheckboxToggle; 

    constructor(tool: T) {
        super(tool);

		this.pixelPerfectToggle = new CheckboxToggle(tool.isPixelPerfectState);

		this.classList.add("drawing-tool-params");
		this.append(this.pixelPerfectToggle);
    }
}
