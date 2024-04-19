import { Orientation } from "@base/types/enums";
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

        this.classList.add("panel", this.name + "-panel", "orientation-" + orientation);
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
	getAllowExecCommands(): boolean {
	    return this.isMouseOver;
	}
	get isEnabled(): boolean {
		return this._isEnabled;
	}
}
