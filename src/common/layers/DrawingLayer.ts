import DrawingLayerElement from "@source/elements/layers/DrawingLayerElement";
import { Layer } from ".";
import type { LayersManager } from "@source/managers";

export default class DrawingLayer extends Layer {
    static readonly NAME = "drawing";

    constructor(manager: LayersManager) {
        super(DrawingLayer.NAME, manager);
    }

    createElement(): HTMLElement {
        return new DrawingLayerElement(this);
    }
}
