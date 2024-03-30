import { ToolParams } from "./ToolParams";
import type { DrawingTool } from "@source/common/tools";

@ToolParams.define("drawing-tool-params")
export class DrawingToolParams<T extends DrawingTool=DrawingTool> extends ToolParams<T> {
	static readonly SIZE_RANGE_MAX_VALUE = 32;

    constructor(tool: T) {
        super(tool);

		this.addProgressRange(tool.sizeState)
			.setWidth(200)
			.setIsInt()
			.setClamp(1, DrawingToolParams.SIZE_RANGE_MAX_VALUE)
			.input?.setMax(tool.brush?.maxSize ?? DrawingToolParams.SIZE_RANGE_MAX_VALUE);
		this.addCheckboxToggle(tool.isPixelPerfectState, "pixel perfect");

		this.classList.add("drawing-tool-params");
    }
}
