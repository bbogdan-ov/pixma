import { Layer } from ".";
import { IMouseData } from "@base/types/types";
import type { LayersManager } from "@source/managers";
import type { Tool } from "../tools";

export default class PreviewLayer extends Layer {
    static readonly NAME = "preview";
    
    constructor(manager: LayersManager) {
        super(PreviewLayer.NAME, manager);

        manager.onDidChosen.listen(layer=> {
            this.canvas.style.zIndex = ((layer.getIndex() || 0) + 1).toString();
        })
    }

    // On
    onToolMove(tool: Tool, mouse: IMouseData): void {
        super.onToolMove(tool, mouse);

        this.clear();
        if (this.manager.project.canvasZoomable?.isMouseOver)
            tool.drawPreview(this, mouse);
    }
}
