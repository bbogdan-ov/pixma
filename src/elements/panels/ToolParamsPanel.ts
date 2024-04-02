import { Panel, PanelContent } from "@base/elements/panels";
import { Orientation } from "@base/types/enums";
import type { App } from "@source/App";
import type { Tool } from "@source/common/tools";

@Panel.define("tool-params-panel")
export class ToolParamsPanel extends Panel {
    readonly app: App;

    readonly content = new PanelContent();

    constructor(app: App) {
        super(Orientation.HORIZONTAL);

        this.app = app;

        this.classList.add("tool-params-panel");

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
