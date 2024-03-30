import { Panel, PanelContent } from "@base/elements/panels";
import { Orientation } from "@base/types/enums";
import { DOM } from "@base/utils";
import type { App } from "@source/App";

@Panel.define("tools-panel")
export class ToolsPanel extends Panel {
    readonly app: App;
    readonly buttonsList = DOM.div("buttons-list");
    
    constructor(app: App) {
        super(Orientation.VERTICAL);

        this.app = app;
        this.classList.add("tools-panel");

        this.append(new PanelContent(this.buttonsList));

        for (const tool of Object.values(this.app.tools.tools)) {
            this.addToolButton(tool.createButton());
        }
		this.listen(this.app.tools.onDidRegistered, tool => {
			this.addToolButton(tool.createButton());
		})
    }

    addToolButton(element: HTMLElement) {
        this.buttonsList.append(element);
    }
}

