import { DOM } from "@base/utils";
import { LayerElement } from "./LayerElement";
import type { Layer } from "@source/common/layers";

@LayerElement.define("layer-with-preview")
export class LayerElementWithPreview extends LayerElement {
    readonly previewImage = new Image();

    constructor(layer: Layer) {
        super(layer);

        this.previewImage.classList.add("empty");

        this.content.prepend(
            DOM.div("layer-preview",
                this.previewImage
            )
        )
    }

    protected _updatePreviewImage() {
		const url = this.layer.previewDataUrl;
		if (url) {
			this.previewImage.src = url;
			this.previewImage.classList.remove("empty");
		}
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
