import { TabsList } from "@base/elements/layout";
import { LagMeter } from "@base/elements/misc";
import { Panel } from "@base/elements/panels";
import { TabsManager } from "@base/managers";
import { Orientation } from "@base/types/enums";
import type { App } from "@source/App";

@Panel.define("project-tabs-panel")
export class ProjectsTabsPanel extends Panel {
	static readonly NAME = "projects-tabs";

    readonly manager: TabsManager<App>;

    readonly tabsList: TabsList;

    constructor(manager: TabsManager<App>) {
        super(ProjectsTabsPanel.NAME, manager.app, Orientation.HORIZONTAL);

        this.manager = manager;

        this.tabsList = new TabsList(this.manager);

        this.classList.add("projects-tabs-panel", "row", "justify-between");
        this.append(
            this.tabsList,
            // TEMP
            new LagMeter(220, 30)
        );
    }
}
