import { TabsList } from "@base/elements/layout";
import { LagMeter } from "@base/elements/misc";
import { Panel } from "@base/elements/panels";
import { TabsManager } from "@base/managers";
import { Orientation } from "@base/types/enums";

@Panel.define("project-tabs-panel")
export class ProjectsTabsPanel extends Panel {
    readonly manager: TabsManager;

    readonly tabsList: TabsList;

    constructor(manager: TabsManager) {
        super(Orientation.HORIZONTAL);

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
