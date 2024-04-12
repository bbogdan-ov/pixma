import { Orientation } from "@base/types/enums";
import { BaseElement } from "../BaseElement";
import { BaseWindow } from "./BaseWindow";
import type { BaseApp } from "@base/BaseApp";
import { WindowsManager } from "@base/managers/WindowsManager";
import { Enablable } from "@base/types/types";

@BaseWindow.define("base-panel")
export class Panel<A extends BaseApp=BaseApp>
	extends BaseWindow<A>
	implements Enablable
{
	protected _isEnabled = true;

    constructor(name: string, manager: WindowsManager<A>, orientation: Orientation) {
        super(name, manager);

        this.classList.add("panel", "orientation-" + orientation);
    }

	enable(): this {
	    this._isEnabled = true;
		this.classList.remove("disabled");
		return this;
	}
	disable(): this {
	    this._isEnabled = false;
		this.classList.add("disabled");
	    return this;
	}

	// Set
	setIsEnabled(value=true): this {
		if (value)
			return this.enable();
		return this.disable();
	}

	// Get
	get isEnabled(): boolean {
		return this._isEnabled;
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
