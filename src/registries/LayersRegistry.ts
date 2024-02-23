import { Registry } from "@base/registries";
import { DrawingLayer, Layer } from "@source/common/layers";
import type { LayersManager } from "@source/managers";

export type RegisteredLayerCallback = (manager: LayersManager)=> Layer

export default class LayersRegistry extends Registry<RegisteredLayerCallback> {
    constructor() {
        super();

        this.register(DrawingLayer.NAME, m=> new DrawingLayer(m));
    }
}
