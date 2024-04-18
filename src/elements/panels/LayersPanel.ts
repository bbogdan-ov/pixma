import { Button } from "@base/elements/buttons";
import { PanelContent, PanelFooter } from "@base/elements/windows";
import { EventName, IconName, Orientation } from "@base/types/enums";
import { BaseElement } from "@base/elements";
import { DrawingLayer, Layer } from "@source/common/layers";
import { ProjectPanel } from "./ProjectPanel";
import { App } from "@source/App";
import type { Project } from "@source/common/project";
import type { LayersManager } from "@source/managers";
import { CommandAction } from "@base/managers";
import { AppCommand } from "@source/types/enums";

// Actions
class RenameCurrentLayerAction extends CommandAction<LayersPanel> {
	execute(): boolean {
	    super.execute();

		return this.attachable.layersList?.startCurrentRenaming() ?? false;
	}
}

// Layers panel
@ProjectPanel.define("layers-panel")
export class LayersPanel extends ProjectPanel {
	static readonly NAME = "layers";

    protected _layersList: LayersList | null = null;
	readonly content = new PanelContent().addClassName("scrollable");

    constructor(app: App) {
        super(LayersPanel.NAME, app.windows, Orientation.VERTICAL);

        this.append(
			this.content,
            new LayersPanelFooter(this)
        );
    }

    // On
	onMount(): void {
	    super.onMount();

		this.attachAction(AppCommand.RENAME_CURRENT_LAYER, new RenameCurrentLayerAction(this));
	}
	// FIXME: perfomance when changing current project is so fucking terrible
	protected _onProjectEnter(project: Project): void {
	    super._onProjectEnter(project);

		this._layersList = project.layersList;
		this.content.appendChild(this._layersList);
	}
	protected _onProjectLeave(project: Project): void {
	    super._onProjectLeave(project);

		this._layersList?.remove();
		this._layersList = null;
	}
    protected _onPointerDownOutside(event: PointerEvent): void {
        super._onPointerDownOutside(event);
		if (!this.project) return;
        
        this.project.app.selection.deselectAll(Layer.KEY);
    }

	// Get
	get layersList(): LayersList | null {
		return this._layersList;
	}
}

// Layers list
@BaseElement.define("layers-list")
export class LayersList extends BaseElement {
	readonly manager: LayersManager

	protected _current: HTMLElement | null = null;

	constructor(manager: LayersManager) {
		super();

		this.manager = manager;

		this.classList.add("layers-list");
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

	startCurrentRenaming(): boolean {
		const current: any = this.current;
		if (!current.startRenaming) return false;

		current.startRenaming();
		return true;
	}

	// On
    onMount(): void {
        super.onMount();

		if (!this.isMountedOnce) {
			for (const layer of this.manager.list) {
				this.appendLayer(layer);
			}
		}

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

		parent.layersList?.startCurrentRenaming();
    }
}
