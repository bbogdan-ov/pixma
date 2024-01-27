import { BaseElement } from "..";
import type { Tab } from "@base/common/tabs";

@BaseElement.define("base-tab-view")
export default class TabView extends BaseElement {
    readonly tab: Tab;

    constructor(tab: Tab) {
        super();

        this.tab = tab;

        this.classList.add("tab-view");
    }

    onMount(): void {
        super.onMount();

        this.listen(this.tab.onDidLeaved, this._onTabLeave.bind(this));
    }
    protected _onTabLeave() {
        this.remove();
    }
}
