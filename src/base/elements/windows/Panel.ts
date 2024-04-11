import { Orientation } from "@base/types/enums";
import { BaseElement } from "../BaseElement";
import { BaseWindow } from "./BaseWindow";
import type { BaseApp } from "@base/BaseApp";
import { WindowsManager } from "@base/managers/WindowsManager";

@BaseWindow.define("base-panel")
export class Panel<A extends BaseApp=BaseApp> extends BaseWindow<A> {
    constructor(name: string, manager: WindowsManager<A>, orientation: Orientation) {
        super(name, manager);

        this.classList.add("panel", "orientation-" + orientation);
    }
}

@BaseElement.define("panel-header")
export class PanelHeader extends BaseElement {
    constructor(...content: Node[]) {
        super();

        this.classList.add("panel-header");
        this.append(...content);
    }
}

@BaseElement.define("panel-content")
export class PanelContent extends BaseElement {
    constructor(...content: Node[]) {
        super();

        this.classList.add("panel-content");
        this.append(...content);
    }
}

@BaseElement.define("panel-footer")
export class PanelFooter extends BaseElement {
    constructor(...content: Node[]) {
        super();

        this.classList.add("panel-footer");
        this.append(...content);
    }
}
