import { DOM } from "@base/utils";
import { LayerElement } from "./LayerElement";
import type { Layer } from "@source/common/layers";

@LayerElement.define("layer-with-preview")
export class LayerElementWithPreview extends LayerElement {
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

		this.listen(this.layer.onDidEdited, this._onEdit.bind(this));

        this._updatePreviewImage();
    }
    protected _onEdit(): void {
        this._updatePreviewImage();
    }
}
