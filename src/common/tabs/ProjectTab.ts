import { Tab } from "@base/common/tabs";
import { ProjectTabElement, ProjectTabView } from "@source/elements/tabs";
import type { TabsManager } from "@base/managers";
import type { Project } from "../project";
import type { App } from "@source/App";
import { AppContext } from "@source/types/enums";

export class ProjectTab extends Tab<App, ProjectTabView> {
    static readonly NAME = "project";
    
    readonly project: Project;

    constructor(manager: TabsManager<App>, project: Project) {
        super(ProjectTab.NAME, manager, project.titleState);

		this._contextName = AppContext.PROJECT;
    
        this.project = project;
        this.project.attachTab(this);

        this.attachView(new ProjectTabView(this));
    }

    createElement(): ProjectTabElement {
        return new ProjectTabElement(this);
    }

    // On
    onOpen(): void {
        super.onOpen();
        this.project.onOpen();
    }
	onEnter(): void {
	    super.onEnter();
        this.project.onEnter();
	}
	onLeave(): void {
	    super.onLeave();
		this.project.onLeave();
	}
    onClose(): void {
        super.onClose();
        this.project.onClose();
    }
}
