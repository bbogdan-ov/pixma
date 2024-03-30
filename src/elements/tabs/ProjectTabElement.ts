import { TabElement } from "@base/elements/tabs";
import type { Tab } from "@base/common/tabs";

@TabElement.define("project-tab")
export class ProjectTabElement extends TabElement {
    constructor(tab: Tab) {
        super(tab);
    }
}
