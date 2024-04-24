import { Canvas } from "@base/common/misc";
import { BaseElement } from "@base/elements";
import type { Layer } from "@source/common/layers";
import type { Project } from "@source/common/project";

@BaseElement.define("canvas-wrapper")
export class CanvasWrapper extends BaseElement {
	readonly project: Project;

    protected _currentCanvas: Canvas | null = null;
    readonly backCanvas = new Canvas();
    readonly frontCanvas = new Canvas();

	constructor(project: Project) {
		super();

		this.project = project;

		this.classList.add("canvas-wrapper");

        this.append(
            this.backCanvas.element,
            project.layers.previewLayer.canvas.element,
            this.frontCanvas.element,
        );
	}

    updateCanvases() {
        const currentLayer = this.project.layers.current;

        // Resize and clear canvases
        this.backCanvas.setSize(this.project.canvasWidth, this.project.canvasHeight);
        this.frontCanvas.setSize(this.project.canvasWidth, this.project.canvasHeight);

        // Remove previously current canvas
        if (this.currentCanvas)
            this.currentCanvas.element.remove();

        // Put new current canvas after back canvas
        if (currentLayer) {
            this.backCanvas.element.after(this.project.layers.current.canvas.element);
            this._currentCanvas = this.project.layers.current.canvas;
        }

		const curIndex = this.project.layers.currentIndex ?? 0;

        // Draw layers that below the current layer on back canvas
        for (let i = 0; i < curIndex; i ++) {
            const layer = this.project.layers.list[i];
            // Dont draw invisible layers
            if (!layer.hasMeaningToRender) continue;

            this.backCanvas.context.drawImage(layer.canvas.element, 0, 0);
        }

        // Draw layers that above the current layer on front canvas
        for (let i = curIndex + 1; i < this.project.layers.count; i ++) {
            const layer = this.project.layers.list[i];
            if (!layer.hasMeaningToRender) continue;

            this.frontCanvas.context.drawImage(layer.canvas.element, 0, 0);
        }
    }

	// On
	onMount() {
		super.onMount();

		this.listen(this.project.layers.onDidListChanged, this._onLayersListChange.bind(this));
		this.listen(this.project.layers.onDidChosen, this._onLayerChoose.bind(this));

		this.updateCanvases();
	}
    protected _onLayersListChange(list: Layer[]) {
        this.updateCanvases();
    }
    protected _onLayerChoose(layer: Layer) {
        this.updateCanvases();
    }

	// Get
    get currentCanvas(): Canvas | null {
        return this._currentCanvas;
    }
}
