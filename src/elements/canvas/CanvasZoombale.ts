import { Trigger } from "@base/common/listenable";
import { Zoomable } from "@base/elements/layout";
import { MouseManager } from "@base/managers";
import { MouseButton } from "@base/types/enums";
import { IMouseData } from "@base/types/types";
import { DOM } from "@base/utils";
import type { Layer } from "@source/common/layers";
import type { Project } from "@source/common/project";

@Zoomable.define("canvas-zoomable")
export default class CanvasZoomable extends Zoomable {
    readonly project: Project;

    readonly toolMouse = new MouseManager();

    protected _isToolUsing = false;

    readonly layersWrapper = DOM.div("layers-wrapper");

    readonly onDidToolDown = new Trigger<IMouseData>();
    readonly onDidToolMove = new Trigger<IMouseData>();
    readonly onDidToolUse = new Trigger<IMouseData>();
    readonly onDidToolUp = new Trigger<IMouseData>();

    constructor(project: Project) {
        super();

        this.project = project;

        this.useMiddleMouseToPan = true;
        this.useCtrlToZoom = true;
        this.minZoom = .1;
        this.maxZoom = 1000;

        this.classList.add("canvas-zoomable", "size-fill");

        this.appendTarget(this.layersWrapper);

        for (const layer of project.layers.ghostsList) {
            this.layersWrapper.append(layer.canvas.element);
        }
        for (const layer of project.layers.list) {
            this.layersWrapper.append(layer.canvas.element);
        }
    }

    onMount(): void {
        super.onMount();

        if (!this.isMountedOnce)
            this.centerTarget();

        this.listen(this.project.layers.onDidAdded, this._onLayerAdd.bind(this));

        this.listen(this.project.canvasWidthState, this._onCanvasWidthChanged.bind(this), true);
        this.listen(this.project.canvasHeightState, this._onCanvasHeightChanged.bind(this), true);
    }

    protected _onDown(event: PointerEvent): void {
        super._onDown(event);
        if (event.button == MouseButton.MIDDLE) return;

        // TODO: catch missed tool and layer
        const tool = this.project.app.tools.current;
        const layer = this.project.layers.current;
        if (!tool || !layer) return;

        const pos = this.getLocalPos(event.clientX, event.clientY);
        this.toolMouse.onDown(event, pos.x, pos.y);

        if (layer.isEditable)
            tool.onDown(layer, this.toolMouse);
        layer.onToolDown(tool, this.toolMouse);

        this._isToolUsing = true;
        this.onDidToolDown.trigger(this.toolMouse);
    }
    protected _onWindowMove(event: PointerEvent): void {
        super._onWindowMove(event);

        const tool = this.project.app.tools.current;
        const layer = this.project.layers.current;
        if (!tool || !layer || !layer.isEditable) return;

        const pos = this.getLocalPos(event.clientX, event.clientY);
        this.toolMouse.onMove(event, pos.x, pos.y);

        tool.onMove(layer, this.toolMouse);
        layer.onToolMove(tool, this.toolMouse);
        this.onDidToolMove.trigger(this.toolMouse);

        if (this.isToolUsing) {
            if (layer.isEditable)
                tool.onUse(layer, this.toolMouse);

            layer.onToolUse(tool, this.toolMouse);
            this.onDidToolUse.trigger(this.toolMouse);
        }
    }
    protected _onWindowUp(event: PointerEvent): void {
        super._onWindowUp(event);

        if (!this._isToolUsing) return;

        const tool = this.project.app.tools.current;
        const layer = this.project.layers.current;
        if (!tool || !layer) return;

        const pos = this.getLocalPos(event.clientX, event.clientY);
        this.toolMouse.onUp(event, pos.x, pos.y);

        if (layer.isEditable)
            tool.onUp(layer, this.toolMouse);
        layer.onToolUp(tool, this.toolMouse);

        this._isToolUsing = false;
        this.onDidToolUp.trigger(this.toolMouse);
    }
    
    protected _onLayerAdd(layer: Layer) {
        this.layersWrapper.append(layer.canvas.element);
    }

    protected _onCanvasWidthChanged(width: number) {
        this.layersWrapper.style.width = width + "px";
    }
    protected _onCanvasHeightChanged(height: number) {
        this.layersWrapper.style.height = height + "px";
    }

    // Get
    get isToolUsing() {
        return this._isToolUsing;
    }
}
