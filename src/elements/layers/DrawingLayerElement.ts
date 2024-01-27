import { LayerElementWithPreview } from ".";
import type { Layer } from "@source/common/layers";

@LayerElementWithPreview.define("drawing-layer")
export default class DrawingLayerElement extends LayerElementWithPreview {
    constructor(layer: Layer) {
        super(layer);
    }
}
