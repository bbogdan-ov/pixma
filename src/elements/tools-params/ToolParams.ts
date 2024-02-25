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

        this.toolSizeRange = new ProgressRange(tool.app.brushes.sizeState).setIsInt();
        this.toolSizeRange.classList.add("tool-size-range");
        this.toolSizeRange.setClamp(1, 32);
        // TODO:
        // this.toolSizeRange.input.limit.setMax(Brush.MAX_SIZE);

        this.colorsBubble = new BrushColorsBubble(tool.app);

        this.classList.add("tool-params");

        this.append(this.colorsBubble);
        this.append(this.toolSizeRange);
    }
}
