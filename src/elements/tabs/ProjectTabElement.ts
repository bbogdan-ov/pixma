import { TabElement } from "@base/elements/tabs";
import { ProjectTab } from "@source/common/tabs";

@TabElement.define("project-tab")
export class ProjectTabElement extends TabElement<ProjectTab> {
    constructor(tab: ProjectTab) {
        super(tab);
    }
}
