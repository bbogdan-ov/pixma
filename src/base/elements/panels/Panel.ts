import { EventName, Orientation } from "@base/types/enums";
import { BaseElement } from "../BaseElement";
import type { BaseApp } from "@base/BaseApp";
import { Command, CommandCondition, CommandFunc } from "@base/managers";

@BaseElement.define("base-panel")
export class Panel<A extends BaseApp=BaseApp> extends BaseElement {
    static _id = 0;

	readonly name: string;
    readonly panelId: number;
	readonly app: A;

    protected _isMouseOver = false;

    constructor(name: string, app: A, orientation: Orientation) {
        super();

		this.name = name;
        this.panelId = ++ Panel._id;
		this.app = app;

        this.id = "panel-" + this.panelId;
        this.classList.add("panel", "orientation-" + orientation);
    }

	registerCommand(namespace: string, name: string, func: CommandFunc, cond?: CommandCondition | null): boolean {
		return this.app.commands.register(name, new Command(namespace, this.contextName, func, cond));
	}

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.POINTER_ENTER, this._onPointerEnter.bind(this));
        this.listen(this, EventName.POINTER_LEAVE, this._onPointerLeave.bind(this));
        this.listen(window, EventName.CLICK, this._onWindowClick.bind(this));
        this.listen(window, EventName.DOWN, this._onWindowDown.bind(this));
    }
	onRegister() {}
    protected _onPointerEnter(event: PointerEvent) {
        this._isMouseOver = true;

		this.app.addContext(this.contextName);
    }
    protected _onPointerLeave(event: PointerEvent) {
        this._isMouseOver = false;

		this.app.removeContext(this.contextName);
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
    protected _onPointerDownOutside(event: PointerEvent) {}

    // Get
	get contextName(): string {
		return this.name + "-panel";
	}
    get isMouseOver(): boolean {
        return this._isMouseOver;
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
