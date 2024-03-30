import DrawingLayerElement from "@source/elements/layers/DrawingLayerElement";
import { Layer } from "./Layer";
import type { LayersManager } from "@source/managers";

export class DrawingLayer extends Layer {
    static readonly NAME = "drawing";

    constructor(manager: LayersManager) {
        super(DrawingLayer.NAME, manager);
    }

    createElement(): HTMLElement {
        return new DrawingLayerElement(this);
    }
}
