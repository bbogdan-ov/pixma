import { Button } from "@base/elements/buttons";
import { Panel, PanelContent, PanelFooter } from "@base/elements/panels";
import { EventName, IconName, Orientation } from "@base/types/enums";
import { BaseElement } from "@base/elements";
import { DrawingLayer, Layer } from "@source/common/layers";
import type { Project } from "@source/common/project";
import type { LayersManager } from "@source/managers";
import { App } from "@source/App";
import { AppCommand } from "@source/types/enums";

// Layers panel
@Panel.define("layers-panel")
export class LayersPanel extends Panel<App> {
	static readonly NAME = "layers";

    readonly project: Project;

    readonly layersList: LayersList;

    constructor(project: Project) {
        super(LayersPanel.NAME, project.app, Orientation.VERTICAL);

        this.project = project;
		this.layersList = new LayersList(project.layers);

        this.classList.add("layers-panel");

        this.append(
            new PanelContent(
                this.layersList
            ).addClassName("scrollable"),
            new LayersPanelFooter(this.project)
        );
    }

    // On
	onRegister(): void {
	    super.onRegister();

		this.registerCommand(App.NAMESPACE, AppCommand.RENAME_CURRENT_LAYER, ()=> this.layersList.startCurrentRenaming());
	}
    protected _onPointerDownOutside(event: PointerEvent): void {
        super._onPointerDownOutside(event);
        
        this.project.app.selection.deselectAll(Layer.KEY);
    }
}

// Layers list
@BaseElement.define("layers-list")
export class LayersList extends BaseElement {
	readonly manager: LayersManager;

	protected _current: HTMLElement | null = null;

	constructor(manager: LayersManager) {
		super();

		this.manager = manager;

		this.classList.add("layers-list");

        for (const layer of this.manager.list) {
			this.appendLayer(layer);
        }
	}

	appendLayer(layer: Layer) {
		this.append(layer.createElement());
	}
	findCurrentLayerElement(layer: Layer | null) {
		if (layer === null) {
			this._current = null;
			return;
		}

		for (const element of this.children as any) {
			if (element.isCurrent) {
				this._current = element;
				break;
			}
		}
	}

	startCurrentRenaming() {
		const current: any = this.current;
		if (current.startRenaming)
			current.startRenaming();
	}

	// On
    onMount(): void {
        super.onMount();

        this.listen(this.manager.onDidChosen, this._onLayerChoose.bind(this));
        this.listen(this.manager.onDidAdded, this._onLayerAdd.bind(this));

		this.findCurrentLayerElement(this.manager.current);
    }
	protected _onLayerChoose(layer: Layer) {
		this.findCurrentLayerElement(layer);
	}
    protected _onLayerAdd(layer: Layer) {
        this.appendLayer(layer);
    }

	// Get
	get current(): HTMLElement | null {
		return this._current;
	}
}

// Layers panel footer
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
		const parent = this.parentElement;
		if (!(parent instanceof LayersPanel)) return;

		parent.layersList.startCurrentRenaming();
    }
}
