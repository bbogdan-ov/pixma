import { BaseElement } from "@base/elements";
import { ProjectsTabsPanel } from "./panels";
import { Project } from "@source/common/project";
import { DrawingLayer } from "@source/common/layers";
import { EventName } from "@base/types/enums";
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
			app.editor.element
        );
    }

    onMount(): void {
        super.onMount();

        // TEMP {
        const a = new Project(this.app.projects);
        const b = new Project(this.app.projects);
        const l = new DrawingLayer(a.layers).setDisplayName("Hey yo");
        a.layers.add(l);

		a.open();
		b.open();
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
