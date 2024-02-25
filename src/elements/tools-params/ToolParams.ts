import { BaseElement } from "@base/elements";
import { ProgressRange } from "@base/elements/ranges";
import { BrushColorsBubble } from "../brush";
import type { Tool } from "@source/common/tools";

@BaseElement.define("tool-params")
export default class ToolParams extends BaseElement {
    readonly tool: Tool;

    readonly toolSizeRange: ProgressRange;
    readonly colorsBubble: BrushColorsBubble;

    constructor(tool: Tool) {
        super();

        this.tool = tool;

        this.toolSizeRange = new ProgressRange(tool.sizeState).setIsInt();
        this.toolSizeRange.classList.add("tool-size-range");
        this.toolSizeRange.setClamp(1, 32);
        this.toolSizeRange.input?.setMax(tool.brush?.maxSize ?? 32);

        this.colorsBubble = new BrushColorsBubble(tool.frontColorState, tool.backColorState);

        this.classList.add("tool-params");

        this.append(this.colorsBubble);
        this.append(this.toolSizeRange);
    }
}
