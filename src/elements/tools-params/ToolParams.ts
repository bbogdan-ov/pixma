import { BaseElement } from "@base/elements";
import { ProgressRange } from "@base/elements/ranges";
import { BrushColorsBubble } from "../brush";
import type { Tool } from "@source/common/tools";
import type { State } from "@base/common/listenable";
import { CheckboxToggle } from "@base/elements/toggles";

@BaseElement.define("tool-params")
export default class ToolParams<T extends Tool=Tool> extends BaseElement {
    readonly tool: T;

    readonly colorsBubble: BrushColorsBubble;

    constructor(tool: T) {
        super();

        this.tool = tool;
        this.colorsBubble = new BrushColorsBubble(tool.frontColorState, tool.backColorState);

        this.classList.add("tool-params");
        this.append(this.colorsBubble);
    }

	addProgressRange(state: State<number>): ProgressRange {
		const range = new ProgressRange(state);
		this.append(range);
		return range;
	}
	addCheckboxToggle(state: State<boolean>, label?: string): CheckboxToggle {
		const toggle = new CheckboxToggle(state);
		this.append(toggle);
		return toggle;
	}
}
