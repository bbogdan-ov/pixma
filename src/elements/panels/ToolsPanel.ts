import { Panel, PanelContent } from "@base/elements/panels";
import { Orientation } from "@base/types/enums";
import { DOM } from "@base/utils";
import type App from "@source/App";

@Panel.define("tools-panel")
export default class ToolsPanel extends Panel {
    readonly app: App;
    readonly buttonsList = DOM.div("buttons-list");
    
    constructor(app: App) {
        super(Orientation.VERTICAL);

        this.app = app;
        this.classList.add("tools-panel");

        this.updateButtons();
        this.append(new PanelContent(this.buttonsList));

        this.app.toolsRegistry.onDidRegistered.listen(this._onToolAdded.bind(this));
    }

    updateButtons() {
        this.buttonsList.replaceChildren();
        const tools = this.app.tools.tools;
        for (const toolName of Object.keys(tools)) {
            const tool = tools[toolName];
            this.buttonsList.append(tool.createButton());
        }
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.app.tools.onDidAdded, this._onToolAdded.bind(this));
    }
    protected _onToolAdded() {
        this.updateButtons();
    }
}

