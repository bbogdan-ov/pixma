import { Button } from "@base/elements/buttons";
import { PanelContent, PanelFooter } from "@base/elements/windows";
import { EventName, IconName, Orientation } from "@base/types/enums";
import { BaseElement } from "@base/elements";
import { DrawingLayer, Layer } from "@source/common/layers";
import { AppCommand } from "@source/types/enums";
import { ProjectPanel } from "./ProjectPanel";
import type { Project } from "@source/common/project";
import type { LayersManager } from "@source/managers";
import type { App } from "@source/App";

// Layers panel
@ProjectPanel.define("layers-panel")
export class LayersPanel extends ProjectPanel {
	static readonly NAME = "layers";

    readonly layersList = new LayersList(null);

    constructor(app: App) {
        super(LayersPanel.NAME, app.windows, Orientation.VERTICAL);

        this.classList.add("layers-panel");

        this.append(
			new PanelContent(
				this.layersList
			).addClassName("scrollable"),
            new LayersPanelFooter(this)
        );
    }

    // On
	onMount(): void {
	    super.onMount();

		this.attachCommand(AppCommand.RENAME_CURRENT_LAYER, ()=> this.layersList.startCurrentRenaming());
	}
	protected _onProjectEnter(project: Project): void {
	    super._onProjectEnter(project);

		this.layersList.setManager(project.layers);
	}
	protected _onProjectLeave(project: Project): void {
	    super._onProjectLeave(project);

		this.layersList.setManager(null);
	}
    protected _onPointerDownOutside(event: PointerEvent): void {
        super._onPointerDownOutside(event);
		if (!this.project) return;
        
        this.project.app.selection.deselectAll(Layer.KEY);
    }
}

// Layers list
@BaseElement.define("layers-list")
export class LayersList extends BaseElement {
	protected _manager: LayersManager | null;

	protected _current: HTMLElement | null = null;

	constructor(manager: LayersManager | null) {
		super();

		this._manager = manager;

		this.classList.add("layers-list");
	}

	setManager(manager: LayersManager | null) {
		this._manager = manager;
		this.replaceChildren();
		this.unlistenAll();

		if (!this.manager)
			return;

		for (const layer of this.manager.list) {
			this.appendLayer(layer);
		}

        this.listen(this.manager.onDidChosen, this._onLayerChoose.bind(this));
        this.listen(this.manager.onDidAdded, this._onLayerAdd.bind(this));

		this.findCurrentLayerElement(this.manager.current);
	}

	appendLayer(layer: Layer) {
		// this.append(...DOM.html("<h1>layer</h1>"));
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

		this.setManager(this.manager);
    }
	protected _onLayerChoose(layer: Layer) {
		this.findCurrentLayerElement(layer);
	}
    protected _onLayerAdd(layer: Layer) {
        this.appendLayer(layer);
    }

	// Get
	get manager(): LayersManager | null {
		return this._manager;
	}
	get current(): HTMLElement | null {
		return this._current;
	}
}

// Layers panel footer
@PanelFooter.define("layers-panel-footer")
class LayersPanelFooter extends PanelFooter {
	readonly panel: LayersPanel;

    readonly addButton = Button.compact(IconName.ADD_LAYER).setIsGhost();
    readonly removeButton = Button.compact(IconName.REMOVE_LAYER).setIsGhost();
    readonly renameButton = Button.compact(IconName.EDIT_LAYER).setIsGhost();
    
    constructor(panel: LayersPanel) {
        super();

		this.panel = panel;

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
		if (!this.panel.project) return;

        const layers = this.panel.project.layers;
        layers.addNearCurrent(new DrawingLayer(layers), true);
    }
    protected _onRemoveClick() {
		if (!this.panel.project) return;

        const layers = this.panel.project.layers;
        if (layers.current)
            layers.remove(layers.current);
    }
    protected _onRenameClick() {
		const parent = this.parentElement;
		if (!(parent instanceof LayersPanel)) return;

		parent.layersList.startCurrentRenaming();
    }
}
