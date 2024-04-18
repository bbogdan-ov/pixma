import { Panel, WindowContent } from "@base/elements/windows";
import { Orientation } from "@base/types/enums";
import type { App } from "@source/App";
import type { Tool } from "@source/common/tools";

@Panel.define("tool-params-panel")
export class ToolParamsPanel extends Panel<App> {
	static readonly NAME = "tool-params";

    readonly content = new WindowContent();

    constructor(app: App) {
        super(ToolParamsPanel.NAME, app.windows, Orientation.HORIZONTAL);

        this.append(this.content);
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.app.tools.onDidChosen, this._onToolChoose.bind(this));

        if (this.app.tools.current)
            this._onToolChoose(this.app.tools.current);
    }
    onDismount(): void {
        super.onDismount();

        this.content.replaceChildren();
    }
    protected _onToolChoose(tool: Tool) {
		if (tool.paramsElement)
			this.content.replaceChildren(tool.paramsElement);
    }
}
