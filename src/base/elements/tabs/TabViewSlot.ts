import { BaseApp } from "@base/BaseApp";
import { BaseElement } from "../BaseElement";
import type { Tab } from "@base/common/tabs";
import type { TabsManager } from "@base/managers";

@BaseElement.define("base-tab-view-slot")
export class TabViewSlot<A extends BaseApp=BaseApp> extends BaseElement {
    readonly manager: TabsManager<A>;
    readonly parent: HTMLElement;

    constructor(manager: TabsManager<A>, parent: HTMLElement) {
        super();

        this.manager = manager;
        this.parent = parent;

        this.classList.add("tab-view-slot");
    }

    onMount(): void {
        super.onMount();

        this.listen(this.manager.onDidEntered, this._onTabEnter.bind(this));
    }
    protected _onTabEnter(tab: Tab) {
        if (tab.viewElement)
            this.append(tab.viewElement);
    }
}
