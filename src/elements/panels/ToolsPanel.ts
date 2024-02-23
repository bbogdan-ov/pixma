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

        this.app.registries.tools.onDidRegistered.listen(this._onToolRegister.bind(this));
    }

    updateButtons() {
        this.buttonsList.replaceChildren();
        for (const tool of this.app.registries.tools.getItems()) {
            this.buttonsList.append(tool.createButton());
        }
    }

    // On
    protected _onToolRegister() {
        this.updateButtons();
    }
}

