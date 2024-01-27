import { DOM } from "@base/utils";
import { LayerElement } from ".";
import type { Layer } from "@source/common/layers";

@LayerElement.define("layer-with-preview")
export default class LayerElementWithPreview extends LayerElement {
    readonly previewImage = new Image();

    constructor(layer: Layer) {
        super(layer);

        this.previewImage.classList.add("image");

        this._content.prepend(
            DOM.div("layer-preview",
                this.previewImage
            )
        )
    }

    protected _updatePreviewImage() {
        // PERFOMANCE: this thing is too sloooow
        this.previewImage.src = this.layer.canvas.getDataUrl();
    }
    
    // On
    onMount(): void {
        super.onMount();

        this._updatePreviewImage();
    }
    protected _onEdit(): void {
        super._onEdit();

        this._updatePreviewImage();
    }
}
