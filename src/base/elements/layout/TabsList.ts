import { BaseElement } from "../BaseElement";
import type { TabsManager } from "@base/managers";
import type { Tab } from "@base/common/tabs";
import { BaseApp } from "@base/BaseApp";

@BaseElement.define("base-tabs-list")
export class TabsList<A extends BaseApp=BaseApp> extends BaseElement {
    readonly manager: TabsManager<A>;

    constructor(manager: TabsManager<A>) {
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
