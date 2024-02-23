import { BaseElement } from "@base/elements";
import { ProjectsTabsPanel } from "./panels";
import { Project } from "@source/common/project";
import { DrawingLayer } from "@source/common/layers";
import { EventName } from "@base/types/enums";
import { TabViewSlot } from "@base/elements/tabs";
import type App from "@source/App";

@BaseElement.define("app-element")
export default class AppElement extends BaseElement {
    readonly app: App;

    constructor(app: App) {
        super();

        this.app = app;

        this.classList.add("app");
        
        this.append(
            new ProjectsTabsPanel(this.app.tabs),
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

        this.listen(this, EventName.SCROLL, this._onScroll.bind(this));
    }
    protected _onScroll() {
        this.scrollTo(0, 0); // its a crutch
    }
}
