import { ActionAttachableElement, BaseElement } from "..";
import { EventName } from "@base/types/enums";
import type { WindowsManager } from "@base/managers/WindowsManager";
import type { BaseApp } from "@base/BaseApp";
import { Trigger } from "@base/common/listenable";

// Window
@BaseElement.define("base-window")
export class BaseWindow<A extends BaseApp=BaseApp> extends ActionAttachableElement<A> {
	static _id = 0;

	readonly name: string;
	readonly windowId: number;
	readonly manager: WindowsManager<A>;

    protected _isMouseOver = false;

	readonly onDidOpened = new Trigger<BaseWindow<A>>();
	readonly onDidClosed = new Trigger<BaseWindow<A>>();
	readonly onDidActivated = new Trigger<BaseWindow<A>>();
	readonly onDidDisactivated = new Trigger<BaseWindow<A>>();

	constructor(name: string, manager: WindowsManager<A>) {
		super(manager.app);

		this.name = name;
		this.windowId = ++ BaseWindow._id;
		this.manager = manager;

        this.id = "window-" + this.windowId;
		this.classList.add("window");
	}

	activate(): boolean {
		return this.manager.activate(this);
	}
	disactivate(): boolean {
		return this.manager.disactivate(this);
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

	onOpen() {
		this.onDidOpened.trigger(this);
	}
	onClose() {
		this.onDidClosed.trigger(this);
	}
	onActivate() {
		this.classList.add("active");
		this.onDidActivated.trigger(this);
	}
	onDisactivate() {
		this.classList.remove("active");
		this.onDidDisactivated.trigger(this);
	}

	protected _onDown(event: PointerEvent) {
		this.activate();
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
		this.disactivate();
	}

    // Get
	getAllowExecCommands(): boolean {
	    return this.isMouseOver || this.isActive;
	}
	get allowClose(): boolean {
		return true;
	}
    get isMouseOver(): boolean {
        return this._isMouseOver;
    }
	get isActive(): boolean {
		return this.manager.active === this;
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
