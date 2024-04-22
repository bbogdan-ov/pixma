import { Trigger } from "@base/common/listenable";
import { Canvas } from "@base/common/misc";
import { Zoomable } from "@base/elements/layout";
import { MouseData, MouseManager } from "@base/managers";
import { DOM } from "@base/utils";
import type { Layer } from "@source/common/layers";
import type { Project } from "@source/common/project";
import type { Point } from "@base/common/math";

@Zoomable.define("canvas-zoomable")
export class CanvasZoomable extends Zoomable {
    readonly project: Project;

    readonly toolMouse = new MouseManager();

    protected _isToolUsing = false;

    protected _currentCanvas: Canvas | null = null;
    readonly backCanvas = new Canvas();
    readonly frontCanvas = new Canvas();
    readonly canvasesWrapper = DOM.div("canvases-wrapper");

    readonly onDidToolDown = new Trigger<MouseData>();
    readonly onDidToolMove = new Trigger<MouseData>();
    readonly onDidToolUse = new Trigger<MouseData>();
    readonly onDidToolUp = new Trigger<MouseData>();

    constructor(project: Project) {
        super();

        this.project = project;

        this.useMiddleMouseToPan = true;
        this.useCtrlToZoom = true;
        this.minZoom = .1;
        this.maxZoom = 1000;
		this.resizeOnZoom = true;

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

		const curIndex = this.project.layers.currentIndex ?? 0;

        // Draw layers that below the current layer on back canvas
        for (let i = 0; i < curIndex; i ++) {
            const layer = this.project.layers.list[i];
            // Dont draw invisible layers
            if (!layer.hasMeaningToRender) continue;

            this.backCanvas.context.drawImage(layer.canvas.element, 0, 0);
        }

        // Draw layers that above the current layer on front canvas
        for (let i = curIndex + 1; i < this.project.layers.count; i ++) {
            const layer = this.project.layers.list[i];
            if (!layer.hasMeaningToRender) continue;

            this.frontCanvas.context.drawImage(layer.canvas.element, 0, 0);
        }
    }
	updateTargetTransform(): void {
	    super.updateTargetTransform();

		const size = 8 * this.zoom;
		this.canvasesWrapper.style.backgroundSize = `${ size }px ${ size }px`;
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
		this.updateTargetTransform();
    }

    protected _onDown(event: PointerEvent): void {
        super._onDown(event);
        if (this.isPanning) return;

        // TODO: catch missed tool and layer
        const tool = this.project.manager.app.currentTool;
        const layer = this.project.currentLayer;
		const previewLayer = this.project.previewLayer;
        if (!tool || !layer) return;

        const pos = this.getToolPos(event);
        this.toolMouse.onDown(event, pos.x, pos.y);
        
        if (layer.isEditable) {
            tool.onDown(layer, this.toolMouse);
			this._isToolUsing = true;
		}

        layer.onToolDown(tool, this.toolMouse);
        previewLayer.onToolDown(tool, this.toolMouse);

        this.onDidToolDown.trigger(this.toolMouse);
    }
    protected _onWindowMove(event: PointerEvent): void {
        super._onWindowMove(event);

        const tool = this.project.manager.app.currentTool;
        const layer = this.project.currentLayer;
		const previewLayer = this.project.previewLayer;
        if (!tool || !layer) return;

        const pos = this.getToolPos(event);
        this.toolMouse.onMove(event, pos.x, pos.y);

		tool.onMove(layer, this.toolMouse);
		layer.onToolMove(tool, this.toolMouse);
        previewLayer.onToolMove(tool, this.toolMouse);

		this.onDidToolMove.trigger(this.toolMouse);

		// Tool using
        if (this.isToolUsing && layer.isEditable) {
			tool.onUse(layer, this.toolMouse);
            layer.onToolUse(tool, this.toolMouse);
            previewLayer.onToolUse(tool, this.toolMouse);

            this.onDidToolUse.trigger(this.toolMouse);
        }
    }
    protected _onWindowUp(event: PointerEvent): void {
        super._onWindowUp(event);
        if (!this.isToolUsing) return;

        const tool = this.project.manager.app.currentTool;
        const layer = this.project.currentLayer;
		const previewLayer = this.project.previewLayer;
        if (!tool || !layer) return;

        const pos = this.getToolPos(event);
        this.toolMouse.onUp(event, pos.x, pos.y);
		this._isToolUsing = false;

        if (layer.isEditable)
            tool.onUp(layer, this.toolMouse);
        layer.onToolUp(tool, this.toolMouse);
        previewLayer.onToolUp(tool, this.toolMouse);

        this.onDidToolUp.trigger(this.toolMouse);
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
	getTargetWidth(): number {
	    return this.project.canvasWidth;
	}
	getTargetHeight(): number {
	    return this.project.canvasHeight;
	}
    get currentCanvas(): Canvas | null {
        return this._currentCanvas;
    }
    get isToolUsing() {
        return this._isToolUsing;
    }
}
