import { BaseElement } from "@base/elements";
import { ProjectsTabsPanel } from "./panels";
import { Project } from "@source/common/project";
import { DrawingLayer } from "@source/common/layers";
import { EventName } from "@base/types/enums";
import { TabViewSlot } from "@base/elements/tabs";
import type { App } from "@source/App";

@BaseElement.define("app-element")
export default class AppElement extends BaseElement {
    readonly app: App;

    constructor(app: App) {
        super();

        this.app = app;

        this.classList.add("app");
        
        this.append(
            new ProjectsTabsPanel(this.app),
            new TabViewSlot(app.tabs, this)
        );
    }

    onMount(): void {
        super.onMount();

        // TEMP {
        const a = new Project(this.app, "Project A");
        const b = new Project(this.app, "Project B");
        const l = new DrawingLayer(a.layers).setDisplayName("Hey yo");
        a.layers.add(l);

        this.app.projects.open(a);
        this.app.projects.open(b);
        // }

		this.listen(window, EventName.CONTEXT_MENU, this._onContextMenu.bind(this));
        this.listen(window, EventName.SCROLL, this._onScroll.bind(this));
		this.listen(window, EventName.KEY_DOWN, this._onKeyDown.bind(this));
    }
	protected _onContextMenu(event: MouseEvent) {
		event.preventDefault();
	}
	protected _onKeyDown(event: KeyboardEvent) {
		this.app.keymaps.onKeyDown(event);
	}
    protected _onScroll() {
        this.scrollTo(0, 0); // its a crutch
    }
}
