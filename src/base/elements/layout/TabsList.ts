import { BaseElement } from "..";
import type { TabsManager } from "@base/managers";
import type { Tab } from "@base/common/tabs";

@BaseElement.define("base-tabs-list")
export default class TabsList extends BaseElement {
    readonly manager: TabsManager;

    constructor(manager: TabsManager) {
        super();

        this.manager = manager;

        this.classList.add("tabs-list");
    }

    onMount(): void {
        super.onMount();

        this.listen(this.manager.onDidOpened, this._onTabOpened.bind(this));

        for (const tab of this.manager.list) {
            this.append(tab.createElement());
        }
    }
    protected _onTabOpened(tab: Tab) {
        this.append(tab.createElement());
    }
}
