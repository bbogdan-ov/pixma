import DrawingLayerElement from "@source/elements/layers/DrawingLayerElement";
import { Layer } from ".";
import type { Project } from "../project";

export default class DrawingLayer extends Layer {
    static readonly NAME = "drawing";

    constructor(project: Project) {
        super(DrawingLayer.NAME, project);
    }

    createElement(): HTMLElement {
        return new DrawingLayerElement(this);
    }
}
