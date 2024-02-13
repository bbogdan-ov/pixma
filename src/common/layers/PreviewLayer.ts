import { Layer } from ".";
import { IMouseData } from "@base/types/types";
import type { Project } from "../project";
import type { LayersManager } from "@source/managers";

export default class PreviewLayer extends Layer {
    static readonly NAME = "preview";
    
    constructor(project: Project, layers: LayersManager) {
        super(PreviewLayer.NAME, project);

        this._ghost = true;

        this.context.fillRect(10, 10, 10, 10);

        layers.onDidChosen.listen(layer=> {
            this.canvas.style.zIndex = ((layer.getIndex() || 0) + 1).toString();
        })
    }

    drawBrush(mouse: IMouseData) {
        const current = this.project.app.brushes.current;
        if (!current) return;

        current.draw(this.context, mouse.pos.x, mouse.pos.y);
    }
}
