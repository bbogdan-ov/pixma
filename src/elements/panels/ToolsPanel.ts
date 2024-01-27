import { Panel, PanelContent } from "@base/elements/panels";
import { Orientation } from "@base/types/enums";
import { DOM } from "@base/utils";
import type App from "@source/App";

@Panel.define("tools-panel")
export default class ToolsPanel extends Panel {
    constructor(app: App) {
        super(Orientation.VERTICAL);

        this.classList.add("tools-panel");

        //
        const buttonsList = DOM.div("buttons-list")

        for (const tool of app.registries.tools.getItems()) {
            buttonsList.append(tool.createButton(app));
        }

        this.append(new PanelContent(
            buttonsList
        ));
    }
}

