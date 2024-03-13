import { Layer } from ".";
import { IMouseData } from "@base/types/types";
import type { LayersManager } from "@source/managers";
import type { Tool } from "../tools";

export default class PreviewLayer extends Layer {
    static readonly NAME = "preview";
    
    constructor(manager: LayersManager) {
        super(PreviewLayer.NAME, manager);

        this.listen(manager.onDidChosen, ()=> {
            this.drawCurrentLayer();
        })
    }

    draw(tool: Tool | null, mouse: IMouseData | null) {
        this.clear();
        this.drawCurrentLayer();

        if (tool && mouse && this.getIsDrawPreview()) {
            tool.drawPreview(this, mouse);
        }
    }
    
    drawCurrentLayer() {
        const layer = this.manager.current;
        if (!layer) return;

        // Don't draw and show current layer's canvas
        if (this.isToolDown) {
            layer.setCanvasElementVisibility(layer.isVisible);
            return;
        }

        // Hide current layer's canvas
        layer.setCanvasElementVisibility(false);

        // Draw current layer
        this.clear();
        this.context.drawImage(layer.canvas.element, 0, 0);
    }

    // On
    onToolDown(tool: Tool, mouse: IMouseData): void {
        super.onToolDown(tool, mouse);

        this.draw(tool, mouse);
    }
    onToolMove(tool: Tool, mouse: IMouseData): void {
        super.onToolMove(tool, mouse);

        this.draw(tool, mouse);
    }
    onToolUp(tool: Tool, mouse: IMouseData): void {
        super.onToolUp(tool, mouse);

        this.draw(tool, mouse);
    }

    // Get
    getIsDrawPreview(): boolean {
        const zoomable = this.manager.project.canvasZoomable;
        return zoomable?.isMouseDown || zoomable?.isMouseOver || false;
    }
}
