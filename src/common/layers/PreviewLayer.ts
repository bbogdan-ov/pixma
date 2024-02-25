import { Layer } from ".";
import { IMouseData } from "@base/types/types";
import type { LayersManager } from "@source/managers";
import type { Tool } from "../tools";

export default class PreviewLayer extends Layer {
    static readonly NAME = "preview";
    
    constructor(manager: LayersManager) {
        super(PreviewLayer.NAME, manager);
    }

    // On
    onToolMove(tool: Tool, mouse: IMouseData): void {
        super.onToolMove(tool, mouse);
        const canvasZoomable = this.manager.project.canvasZoomable;

        this.clear();

        if (canvasZoomable?.isMouseDown ? true : canvasZoomable?.isMouseOver)
            tool.drawPreview(this, mouse);
    }
}
