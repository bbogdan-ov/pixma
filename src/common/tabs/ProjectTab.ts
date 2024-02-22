import { Tab } from "@base/common/tabs";
import { ProjectTabView } from "@source/elements/tab-views";
import { ProjectTabElement } from "@source/elements/tabs";
import type { TabsManager } from "@base/managers";
import type { Project } from "../project";

export default class ProjectTab extends Tab {
    readonly project: Project;

    constructor(manager: TabsManager, project: Project) {
        super(manager);
    
        this.project = project;
        this.project.attachTab(this);
        this.attachView(new ProjectTabView(this));

        this.setTitle(project.title);
    }

    createElement(): HTMLElement {
        return new ProjectTabElement(this);
    }

    // On
    onOpen(): void {
        this.project.onOpen();
    }
    onClose(): void {
        this.project.onClose();
    }
}
