import { Trigger } from "@base/common/listenable";
import { IconName } from "@base/types/enums";
import { ToolButton } from "@source/elements/tools";
import { IMouseData } from "@base/types/types";
import { ToolParams } from "@source/elements/tools-params";
import type { Layer } from "../layers";
import type App from "@source/App";
import type { Brush } from "../brushes";
import type PreviewLayer from "../layers/PreviewLayer";

export default class Tool {
    readonly name: string;
    readonly app: App;

    protected _resizable = true;
    protected _colorful = true;

    protected _isChosen = false;
    protected _isUsing = false;

    protected _icon: IconName = IconName.PEN_TOOL;

    /** Cache params, so we dont need to create another one */
    paramsElement: HTMLElement | null = null;

    readonly onDidChosen = new Trigger<Tool>();
    readonly onDidUnchosen = new Trigger<Tool>();

    constructor(name: string, app: App) {
        this.name = name;
        this.app = app;
    }

    choose(): boolean {
        return this.app.tools.choose(this);
    }
    unchoose(): boolean {
        return this.app.tools.unchoose();
    }

    createButton(): HTMLElement {
        return new ToolButton(this).setIcon(this._icon);
    }
    createParams(app: App): HTMLElement {
        if (this.paramsElement) return this.paramsElement;
        const el = new ToolParams(app);
        return this.cacheParamsElement(el);
    }

    cacheParamsElement(element: HTMLElement): HTMLElement {
        this.paramsElement = element;
        return this.paramsElement;
    }

    drawPreview(previewLayer: PreviewLayer, mouse: IMouseData) {
        this.brush?.draw(previewLayer.context, mouse.pos.x, mouse.pos.y);
    }

    // On
    onDown(layer: Layer, mouse: IMouseData) {
        this._isUsing = true;
    }
    onUse(layer: Layer, mouse: IMouseData) {}
    onMove(layer: Layer, mouse: IMouseData) {}
    onUp(layer: Layer, mouse: IMouseData) {
        this._isUsing = false;
    }
    onChoose() {
        this._isChosen = true;
        this.onDidChosen.trigger(this);
    }
    onUnchoose() {
        this._isChosen = false;
        this.onDidUnchosen.trigger(this);
    }

    // Get
    get brush(): Brush | null {
        return this.app.brushes.current;
    }
    get resizable(): boolean {
        return this._resizable
    }
    get colorful(): boolean {
        return this._colorful;
    }
    get isChosen(): boolean {
        return this._isChosen;
    }
    get isUsing(): boolean {
        return this._isUsing;
    }
}
