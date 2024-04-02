import { BaseElement } from "@base/elements";
import { ProgressRange } from "@base/elements/ranges";
import { BrushColorsBubble } from "../brush";
import { CheckboxToggle } from "@base/elements/toggles";
import type { Tool } from "@source/common/tools";
import type { State } from "@base/common/listenable";

@BaseElement.define("tool-params")
export class ToolParams<T extends Tool=Tool> extends BaseElement {
	static readonly SIZE_RANGE_MAX_VALUE = 32;

    readonly tool: T;

    readonly colorsBubble: BrushColorsBubble;

    constructor(tool: T) {
        super();

        this.tool = tool;
        this.colorsBubble = new BrushColorsBubble(
			tool.app.brushes.frontColorState,
			tool.app.brushes.backColorState
		);

        this.classList.add("tool-params");

        this.append(this.colorsBubble);

		if (tool.sizeState)
			this.addProgressRange(tool.sizeState)
				.setWidth(200)
				.setIsInt()
				.setClamp(1, ToolParams.SIZE_RANGE_MAX_VALUE)
				// TODO: change max input value based on tool's brush max size
				.input?.setMax(64);
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
