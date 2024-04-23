import { BaseElement } from "@base/elements";
import { LagMeter } from "@base/elements/misc";
import { Panel } from "@base/elements/windows";
import { Orientation } from "@base/types/enums";
import type { App } from "@source/App";
import type { Project } from "@source/common/project";
import type { ProjectsManager } from "@source/managers";

// Projects tabs panel
@Panel.define("project-tabs-panel")
export class ProjectsTabsPanel extends Panel<App> {
	static readonly NAME = "projects-tabs";

    readonly tabsList: ProjectsTabsList;

    constructor(app: App) {
        super(ProjectsTabsPanel.NAME, app.windows, Orientation.HORIZONTAL);

		this.tabsList = new ProjectsTabsList(app.projects);

        this.classList.add("row", "justify-between");
        this.append(
			this.tabsList,
        );

		if (import.meta.env.DEV)
            this.append(new LagMeter(220, 30));
    }
}

// Projects tabs list
@BaseElement.define("projects-tabs-list")
export class ProjectsTabsList extends BaseElement {
	readonly manager: ProjectsManager;

	constructor(manager: ProjectsManager) {
		super();

		this.manager = manager;

		this.classList.add("tabs-list");
	}

	appendProject(project: Project) {
		this.append(project.createTabElement());
	}

	// On
	onMount(): void {
	    super.onMount();

		if (!this.isMountedOnce)
			for (const project of this.manager.list) {
				this.appendProject(project);
			}

		this.listen(this.manager.onDidOpened, this._onProjectOpen.bind(this));
	}
	protected _onProjectOpen(project: Project) {
		this.appendProject(project);
	}
}
