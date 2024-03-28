import { Trigger } from "@base/common/listenable";
import { Canvas } from "@base/common/misc";
import { Zoomable } from "@base/elements/layout";
import { MouseManager } from "@base/managers";
import { IMouseData } from "@base/types/types";
import { DOM } from "@base/utils";
import type { Layer } from "@source/common/layers";
import type { Project } from "@source/common/project";
import type { Point } from "@base/common/math";

@Zoomable.define("canvas-zoomable")
export default class CanvasZoomable extends Zoomable {
    readonly project: Project;

    readonly mouse = new MouseManager();

    protected _isToolUsing = false;

    protected _currentCanvas: Canvas | null = null;
    readonly backCanvas = new Canvas();
    readonly frontCanvas = new Canvas();
    readonly canvasesWrapper = DOM.div("canvases-wrapper");

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

        this.appendTarget(this.canvasesWrapper);

        this.canvasesWrapper.append(
            this.backCanvas.element,
            project.layers.previewLayer.canvas.element,
            this.frontCanvas.element,
        );
    }

    updateCanvases() {
        const currentLayer = this.project.layers.current;

        // Resize and clear canvases
        this.backCanvas.setSize(this.project.canvasWidth, this.project.canvasHeight);
        this.frontCanvas.setSize(this.project.canvasWidth, this.project.canvasHeight);

        // Remove previously current canvas
        if (this.currentCanvas)
            this.currentCanvas.element.remove();

        // Put new current canvas after back canvas
        if (currentLayer) {
            this.backCanvas.element.after(this.project.layers.current.canvas.element);
            this._currentCanvas = this.project.layers.current.canvas;
        }

        // Draw layers that below the current layer on back canvas
        for (let i = 0; i < this.project.layers.currentIndex; i ++) {
            const layer = this.project.layers.list[i];
            // Dont draw invisible layers
            if (!layer.isVisible) continue;

            this.backCanvas.context.drawImage(layer.canvas.element, 0, 0);
        }

        // Draw layers that above the current layer on front canvas
        for (let i = this.project.layers.currentIndex+1; i < this.project.layers.count; i ++) {
            const layer = this.project.layers.list[i];
            if (!layer.isVisible) continue;

            this.frontCanvas.context.drawImage(layer.canvas.element, 0, 0);
        }
    }
    
    // On
    onMount(): void {
        super.onMount();

        if (!this.isMountedOnce)
            this.centerTarget();

        this.listen(this.project.layers.onDidListChanged, this._onLayersListChange.bind(this));
        this.listen(this.project.layers.onDidChosen, this._onLayerChoose.bind(this));

        this.listen(this.project.canvasWidthState, this._onCanvasWidthChanged.bind(this), true);
        this.listen(this.project.canvasHeightState, this._onCanvasHeightChanged.bind(this), true);

        this.updateCanvases();
    }

    protected _onDown(event: PointerEvent): void {
        super._onDown(event);
        if (this.isPanning) return;

        // TODO: catch missed tool and layer
        const tool = this.project.app.tools.current;
        const layer = this.project.layers.current;
		const previewLayer = this.project.previewLayer;
        if (!tool || !layer) return;

        const pos = this.getToolPos(event);
        this.mouse.onDown(event, pos.x, pos.y);
        
        if (layer.isEditable) {
            tool.onDown(layer, this.mouse);
			this._isToolUsing = true;
		}

        layer.onToolDown(tool, this.mouse);
        previewLayer.onToolDown(tool, this.mouse);

        this.onDidToolDown.trigger(this.mouse);
    }
    protected _onWindowMove(event: PointerEvent): void {
        super._onWindowMove(event);

        const tool = this.project.app.tools.current;
        const layer = this.project.layers.current;
		const previewLayer = this.project.previewLayer;
        if (!tool || !layer) return;

        const pos = this.getToolPos(event);
        this.mouse.onMove(event, pos.x, pos.y);

		tool.onMove(layer, this.mouse);
		layer.onToolMove(tool, this.mouse);
        previewLayer.onToolMove(tool, this.mouse);

		this.onDidToolMove.trigger(this.mouse);

		// Tool using
        if (this.isToolUsing && layer.isEditable) {
			tool.onUse(layer, this.mouse);
            layer.onToolUse(tool, this.mouse);
            previewLayer.onToolUse(tool, this.mouse);

            this.onDidToolUse.trigger(this.mouse);
        }
    }
    protected _onWindowUp(event: PointerEvent): void {
        super._onWindowUp(event);
        if (!this.isToolUsing) return;

        const tool = this.project.app.tools.current;
        const layer = this.project.layers.current;
		const previewLayer = this.project.previewLayer;
        if (!tool || !layer) return;

        const pos = this.getToolPos(event);
        this.mouse.onUp(event, pos.x, pos.y);
		this._isToolUsing = false;

        if (layer.isEditable)
            tool.onUp(layer, this.mouse);
        layer.onToolUp(tool, this.mouse);
        previewLayer.onToolUp(tool, this.mouse);

        this.onDidToolUp.trigger(this.mouse);
    }
    
    protected _onLayersListChange(list: Layer[]) {
        this.updateCanvases();
    }
    protected _onLayerChoose(layer: Layer) {
        this.updateCanvases();
    }

    protected _onCanvasWidthChanged(width: number) {
        this.canvasesWrapper.style.width = width + "px";
    }
    protected _onCanvasHeightChanged(height: number) {
        this.canvasesWrapper.style.height = height + "px";
    }

    // Get
	getToolPos(event: MouseEvent): Point {
		return this.getLocalPos(event.clientX, event.clientY)
	}
    get currentCanvas(): Canvas | null {
        return this._currentCanvas;
    }
    get isToolUsing() {
        return this._isToolUsing;
    }
}
