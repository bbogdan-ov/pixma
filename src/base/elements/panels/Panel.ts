import { EventName, Orientation } from "@base/types/enums";
import { BaseElement } from "../BaseElement";

@BaseElement.define("base-panel")
export class Panel extends BaseElement {
    static _id = 0;

    readonly panelId: number;

    protected _isMouseOver = false;

    constructor(orientation: Orientation) {
        super();

        this.panelId = ++ Panel._id;

        this.id = "panel-" + this.panelId;
        this.classList.add("panel", "orientation-" + orientation);
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.POINTER_ENTER, this._onPointerEnter.bind(this));
        this.listen(this, EventName.POINTER_LEAVE, this._onPointerLeave.bind(this));
        this.listen(window, EventName.CLICK, this._onWindowClick.bind(this));
        this.listen(window, EventName.DOWN, this._onWindowDown.bind(this));
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
    protected _onPointerDownOutside(event: PointerEvent) {}

    // Get
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
