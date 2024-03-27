import { BaseElement } from "@base/elements";
import { ProgressRange } from "@base/elements/ranges";
import { BrushColorsBubble } from "../brush";
import type { Tool } from "@source/common/tools";

@BaseElement.define("tool-params")
export default class ToolParams<T extends Tool=Tool> extends BaseElement {
    readonly tool: T;

    readonly toolSizeRange: ProgressRange;
    readonly colorsBubble: BrushColorsBubble;

    constructor(tool: T) {
        super();

        this.tool = tool;

        this.toolSizeRange = new ProgressRange(tool.sizeState).setIsInt();
        this.toolSizeRange.classList.add("tool-size-range", "mr-1");
        this.toolSizeRange.setClamp(1, 32);
        this.toolSizeRange.input?.setMax(tool.brush?.maxSize ?? 32);

        this.colorsBubble = new BrushColorsBubble(tool.frontColorState, tool.backColorState);

        this.classList.add("tool-params");

        this.append(this.colorsBubble);
        this.append(this.toolSizeRange);
    }
}
