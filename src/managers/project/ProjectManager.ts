import { Manager } from "@base/managers";
import type { Project } from "@source/common/project";

export default class ProjectManager extends Manager {
    readonly project: Project;

    constructor(project: Project) {
        super();

        this.project = project;
    }
}
