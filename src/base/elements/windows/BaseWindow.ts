import { ActionAttachableElement, BaseElement } from "..";
import { EventName } from "@base/types/enums";
import type { WindowsManager } from "@base/managers/WindowsManager";
import type { BaseApp } from "@base/BaseApp";

// Window
@BaseElement.define("base-window")
export class BaseWindow<A extends BaseApp=BaseApp> extends ActionAttachableElement<A> {
	static _id = 0;

	readonly name: string;
	readonly windowId: number;
	readonly manager: WindowsManager<A>;

	protected _isActive = false;
    protected _isMouseOver = false;

	constructor(name: string, manager: WindowsManager<A>) {
		super(manager.app);

		this.name = name;
		this.windowId = ++ BaseWindow._id;
		this.manager = manager;

        this.id = "window-" + this.windowId;
		this.classList.add("window");
	}

	protected _updateStyles() {
		this.classList.toggle("active", this.isActive);
	}

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.DOWN, this._onDown.bind(this));
        this.listen(this, EventName.POINTER_ENTER, this._onPointerEnter.bind(this));
        this.listen(this, EventName.POINTER_LEAVE, this._onPointerLeave.bind(this));
        this.listen(window, EventName.CLICK, this._onWindowClick.bind(this));
        this.listen(window, EventName.DOWN, this._onWindowDown.bind(this));
    }

	protected _onActivate() {
		this._updateStyles();
	}
	protected _onDisactivate() {
		this._updateStyles();
	}

	protected _onDown(event: PointerEvent) {
		this._isActive = true;
		this._onActivate();
	}
    protected _onPointerEnter(event: PointerEvent) {
        this._isMouseOver = true;
    }
    protected _onPointerLeave(event: PointerEvent) {
        this._isMouseOver = false;
    }
    protected _onWindowClick(event: MouseEvent) {
        if (!this.isMouseOver)
            this._onClickOutside(event);
    }
    protected _onWindowDown(event: PointerEvent) {
        if (!this.isMouseOver)
            this._onPointerDownOutside(event);
    }
    protected _onClickOutside(event: MouseEvent) {}
    protected _onPointerDownOutside(event: PointerEvent) {
		this._isActive = false;
		this._onDisactivate();
	}

    // Get
	getAllowExecCommands(): boolean {
	    return this.isMouseOver || this.isActive;
	}
    get isMouseOver(): boolean {
        return this._isMouseOver;
    }
	get isActive(): boolean {
		return this._isActive;
	}
}

// Header
@BaseElement.define("window-header")
export class WindowHeader extends BaseElement {
    constructor(...content: Node[]) {
        super();

        this.classList.add("window-header");
        this.append(...content);
    }
}

// Content
@BaseElement.define("window-content")
export class WindowContent extends BaseElement {
    constructor(...content: Node[]) {
        super();

        this.classList.add("window-content");
        this.append(...content);
    }
}

// Footer
@BaseElement.define("window-footer")
export class WindowFooter extends BaseElement {
    constructor(...content: Node[]) {
        super();

        this.classList.add("window-footer");
        this.append(...content);
    }
}
