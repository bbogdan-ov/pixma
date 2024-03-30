import { BaseElement } from "../BaseElement";
import type { Tab } from "@base/common/tabs";

@BaseElement.define("base-tab-view")
export class TabView extends BaseElement {
    readonly tab: Tab;

    constructor(tab: Tab) {
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
