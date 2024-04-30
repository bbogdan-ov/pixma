import { Trigger } from "@base/common/listenable";
import { Zoomable } from "@base/elements/layout";
import { MouseData, MouseManager } from "@base/managers";
import { CanvasWrapper } from "./CanvasWrapper";
import type { Project } from "@source/common/project";
import type { Point } from "@base/common/math";

@Zoomable.define("canvas-zoomable")
export class CanvasZoomable extends Zoomable {
    readonly project: Project;

    readonly toolMouse = new MouseManager();

    protected _isToolUsing = false;

    readonly canvasWrapper: CanvasWrapper;

    readonly onDidToolDown = new Trigger<MouseData>();
    readonly onDidToolMove = new Trigger<MouseData>();
    readonly onDidToolUse = new Trigger<MouseData>();
    readonly onDidToolUp = new Trigger<MouseData>();

    constructor(project: Project) {
        super();

        this.project = project;

		this.canvasWrapper = new CanvasWrapper(project);

        this.useMiddleMouseToPan = true;
        this.useCtrlToZoom = true;
        this.minZoom = .1;
        this.maxZoom = 1000;
		this.resizeOnZoom = true;

        this.classList.add("canvas-zoomable", "size-fill");

        this.appendTarget(this.canvasWrapper);
    }

	updateTargetTransform(): void {
	    super.updateTargetTransform();

		const size = 8 * this.zoom;
		this.canvasWrapper.style.backgroundSize = `${ size }px ${ size }px`;
	}
    
    // On
    onMount(): void {
        super.onMount();

        if (!this.isMountedOnce)
            this.centerTarget();

        this.listen(this.project.canvasWidthState, this._onCanvasWidthChanged.bind(this), true);
        this.listen(this.project.canvasHeightState, this._onCanvasHeightChanged.bind(this), true);
		this.updateTargetTransform();
    }

    protected _onDown(event: PointerEvent): void {
        super._onDown(event);
        if (this.isPanning || this.mouse.isMiddle) return;

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
    
    protected _onCanvasWidthChanged(width: number) {
        this.canvasWrapper.style.width = width + "px";
    }
    protected _onCanvasHeightChanged(height: number) {
        this.canvasWrapper.style.height = height + "px";
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
    get isToolUsing() {
        return this._isToolUsing;
    }
}
