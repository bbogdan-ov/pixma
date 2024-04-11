import { TabsList } from "@base/elements/layout";
import { LagMeter } from "@base/elements/misc";
import { Panel } from "@base/elements/windows";
import { TabsManager } from "@base/managers";
import { Orientation } from "@base/types/enums";
import type { App } from "@source/App";

@Panel.define("project-tabs-panel")
export class ProjectsTabsPanel extends Panel {
	static readonly NAME = "projects-tabs";

    readonly tabsManager: TabsManager<App>;

    readonly tabsList: TabsList;

    constructor(app: App) {
        super(ProjectsTabsPanel.NAME, app.windows, Orientation.HORIZONTAL);

        this.tabsManager = app.tabs;
        this.tabsList = new TabsList(this.tabsManager);

        this.classList.add("projects-tabs-panel", "row", "justify-between");
        this.append(
            this.tabsList,
            // TEMP
            new LagMeter(220, 30)
        );
    }
}
