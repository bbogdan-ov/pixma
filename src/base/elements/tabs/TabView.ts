import type { BaseApp } from "@base/BaseApp";
import type { Tab } from "@base/common/tabs";
import { BaseElement } from "..";

@BaseElement.define("base-tab-view")
export class TabView<A extends BaseApp=BaseApp, T extends Tab=Tab<A>> extends BaseElement {
    readonly tab: T;

    constructor(tab: T) {
        super();

        this.tab = tab;

        this.classList.add("tab-view");
    }

    onMount(): void {
        super.onMount();

		// Just call it here cos when the tab is entered, the view is mounted
		this._onTabEnter();
        this.listen(this.tab.onDidLeaved, this._onTabLeave.bind(this));
        this.listen(this.tab.onDidClosed, this._onTabClose.bind(this));
    }
	protected _onTabEnter() {}
	protected _onTabClose() {}
    protected _onTabLeave() {
        this.remove();
    }
}
