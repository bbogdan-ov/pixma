import { BaseElement } from "@base/elements";
import { ProgressRange } from "@base/elements/ranges";
import { BrushColorsBubble } from "../brush";
import type App from "@source/App";

@BaseElement.define("tool-params")
export default class ToolParams extends BaseElement {
    readonly app: App;

    readonly toolSizeRange: ProgressRange;
    readonly colorsBubble: BrushColorsBubble;

    constructor(app: App) {
        super();

        this.app = app;

        this.toolSizeRange = new ProgressRange(app.brushes.sizeState).setIsInt();
        this.toolSizeRange.classList.add("tool-size-range");
        this.toolSizeRange.setClamp(1, 32);
        // TODO:
        // this.toolSizeRange.input.limit.setMax(Brush.MAX_SIZE);

        this.colorsBubble = new BrushColorsBubble(app);

        this.classList.add("tool-params");

        this.append(this.colorsBubble);
        this.append(this.toolSizeRange);
    }
}
