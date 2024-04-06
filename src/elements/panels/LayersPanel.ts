import { Button } from "@base/elements/buttons";
import { Panel, PanelContent, PanelFooter } from "@base/elements/panels";
import { EventName, IconName, Orientation } from "@base/types/enums";
import { DOM, Utils } from "@base/utils";
import { DrawingLayer, Layer } from "@source/common/layers";
import type { Project } from "@source/common/project";

@Panel.define("layers-panel")
export class LayersPanel extends Panel {
    readonly project: Project;

    readonly layersList = DOM.div("layers-list");

    constructor(project: Project) {
        super(Orientation.VERTICAL);

        this.project = project;

        this.classList.add("layers-panel");

        this.append(
            new PanelContent(
                this.layersList
            ).addClassName("scrollable"),
            new LayersPanelFooter(this.project)
        );

        for (const layer of this.project.layers.list) {
            this.layersList.append(layer.createElement());
        }
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.project.layers.onDidAdded, this._onLayerAdded.bind(this));
    }
    protected _onLayerAdded(layer: Layer) {
        this.layersList.append(layer.createElement());
    }
    protected _onPointerDownOutside(event: PointerEvent): void {
        super._onPointerDownOutside(event);
        
        this.project.app.selection.deselectAll(Layer.KEY);
    }
}

@PanelFooter.define("layers-panel-footer")
class LayersPanelFooter extends PanelFooter {
    readonly project: Project;
    
    readonly addButton = Button.compact(IconName.ADD_LAYER).setIsGhost();
    readonly removeButton = Button.compact(IconName.REMOVE_LAYER).setIsGhost();
    readonly renameButton = Button.compact(IconName.EDIT_LAYER).setIsGhost();
    
    constructor(project: Project) {
        super();

        this.project = project;

        this.append(
            this.addButton,
            this.removeButton,
            this.renameButton
        );
    }

    onMount(): void {
        super.onMount();

        this.listen(this.addButton, EventName.CLICK, this._onAddClick.bind(this));
        this.listen(this.removeButton, EventName.CLICK, this._onRemoveClick.bind(this));
        this.listen(this.renameButton, EventName.CLICK, this._onRenameClick.bind(this));
    }
    protected _onAddClick() {
        const layers = this.project.layers;

        layers.addNearCurrent(new DrawingLayer(layers), true);
    }
    protected _onRemoveClick() {
        const layers = this.project.layers;
        if (layers.current)
            layers.remove(layers.current);
    }
    protected _onRenameClick() {

    }
}
