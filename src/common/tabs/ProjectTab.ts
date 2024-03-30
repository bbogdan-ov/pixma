import { Tab } from "@base/common/tabs";
import { ProjectTabElement, ProjectTabView } from "@source/elements/tabs";
import { AppContext } from "@source/types/enums";
import type { TabsManager } from "@base/managers";
import type { Project } from "../project";

export class ProjectTab extends Tab<ProjectTabView> {
    static readonly NAME = "project";
    
    readonly project: Project;

    constructor(manager: TabsManager, project: Project) {
        super(ProjectTab.NAME, manager, project.titleState);
    
        this.project = project;
        this.project.attachTab(this);

		this._context = AppContext.PROJECT;

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
