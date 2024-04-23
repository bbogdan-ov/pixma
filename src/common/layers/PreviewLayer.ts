import { Layer } from ".";
import type { LayersManager } from "@source/managers";
import { DrawingTool, type Tool } from "../tools";
import { MouseData } from "@base/managers";

export class PreviewLayer extends Layer {
    static readonly NAME = "preview";
    
    constructor(manager: LayersManager) {
        super(PreviewLayer.NAME, manager);

		let layerEditedUnlisten: VoidFunction | null = null;

        manager.onDidChosen.listen(layer=> {
			if (layerEditedUnlisten)
				layerEditedUnlisten();

            this.drawCurrentLayer(null);
			layerEditedUnlisten = layer.onDidEdited.listen(()=> {
				this.draw(null, null);
			})
        })
    }

    draw(tool: Tool | null, mouse: MouseData | null) {
		tool = tool ?? this.manager.project.app.currentTool ?? null;
		mouse = mouse ?? this.manager.project.toolMouse;

        this.clear();
        this.drawCurrentLayer(tool);

		// Draw preview
        if (!this.isToolDown && tool && mouse && this.getIsDrawPreview()) {
            tool.drawPreview(this.context, mouse);
        }
    }
    
    drawCurrentLayer(tool: Tool | null) {
        const layer = this.manager.current;
        if (!layer) return;

        // Don't draw and show current layer's canvas
        if (this.isToolDown) {
			if (!(tool instanceof DrawingTool && tool.drawOnPreview)) {
				layer.setCanvasElementVisibility(layer.isVisible);
				return;
			}
        }

        // Hide current layer's canvas
        layer.setCanvasElementVisibility(false);

        // Draw current layer
		if (layer.isVisible)
			this.context.drawImage(layer.canvas.element, 0, 0);
    }

    // On
    onToolDown(tool: Tool, mouse: MouseData): void {
        super.onToolDown(tool, mouse);

        this.draw(tool, mouse);
    }
    onToolMove(tool: Tool, mouse: MouseData): void {
        super.onToolMove(tool, mouse);

        this.draw(tool, mouse);
    }
	onToolUp(tool: Tool, mouse: MouseData): void {
	    super.onToolUp(tool, mouse);

		this.draw(tool, mouse);
	}

    // Get
    getIsDrawPreview(): boolean {
        const zoomable = this.manager.project.canvasZoomable;
        return zoomable?.isMouseDown || zoomable?.isMouseOver || false;
    }
}
