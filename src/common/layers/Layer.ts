import { LayerElement } from "@source/elements/layers";
import { State, Trigger } from "@base/common/listenable";
import { Canvas } from "@base/common/misc";
import { type Project, ProjectHistoryItem } from "../project";
import type { Tool } from "../tools";
import type { IMouseData, ISelectableItem } from "@base/types/types";
import type { LayersManager } from "@source/managers";
import type { App } from "@source/App";

export interface LayerHistoryItemOpts {
	canvasChanged?: boolean
}
export interface LayerHistoryItemData {
	id: number
	projectId: number,
	canvasDataUrl: string | null
}

export class LayerHistoryItem extends ProjectHistoryItem<LayerHistoryItemData> {
	constructor(layer: Layer, title: string, opts: LayerHistoryItemOpts) {
		super(layer.manager.project, title, {
			id: layer.id,
			projectId: layer.manager.project.id,
			canvasDataUrl: opts.canvasChanged ? layer.getDataUrl() : null
		});
	}

	apply(): Promise<boolean> {
		return new Promise((res)=> {
			const layer = this.app.projects.getById(this.data.projectId)?.layers.getById(this.data.id);
			if (!layer) {
				res(false);
				return;
			}

			if (this.data.canvasDataUrl) {
				const image = new Image();
				image.src = this.data.canvasDataUrl;

				image.onload = ()=> {
					if (!layer) {
						res(false);
						return;
					}

					layer.clear();
					layer.context.drawImage(image, 0, 0);
					layer.edited();
					res(true);
				}
				image.onerror = ()=> res(false);
			} else {
				res(true);
			}
		})
	}
}

export class Layer implements ISelectableItem {
    static readonly KEY = "layer";
    static _id = 0;

    readonly id: number;
    readonly name: string;
    readonly manager: LayersManager;

    readonly canvas: Canvas;

	protected _index: number | null = null;
    protected _isEmpty = true;
    protected _isCurrent = false;
    protected _isSelected = false;
    protected _isToolDown = false;
    
    readonly displayNameState = new State<string>("Layer");
    readonly isVisibleState = new State<boolean>(true);
    readonly isLockedState = new State<boolean>(false);

    readonly onDidAdded = new Trigger<Layer>();
    readonly onDidRemoved = new Trigger<Layer>();
    readonly onDidChosen = new Trigger<Layer>();
    readonly onDidUnchosen = new Trigger<Layer>();
    readonly onDidToolDown = new Trigger<Tool>();
    readonly onDidToolUse = new Trigger<Tool>();
    readonly onDidToolUp = new Trigger<Tool>();
    readonly onDidEdited = new Trigger<Layer>();
    readonly onDidSelected = new Trigger<Layer>();
    readonly onDidUnselected = new Trigger<Layer>();
    readonly onDidIndexChanged = new Trigger<number>();

    constructor(name: string, manager: LayersManager) {
        this.id = ++ Layer._id;
        this.name = name;
        this.manager = manager;

        this.canvas = Canvas.sized(manager.project.canvasWidth, manager.project.canvasHeight);
        this.canvas.element.id = "layer-" + this.id;
        this.canvas.element.classList.add("layer-canvas");

        this.setDisplayName("Layer " + this.id);

        //
        this.isVisibleState.listen(this.setCanvasElementVisibility.bind(this), true);
    }

    choose(): boolean {
        return this.manager.choose(this);
    }
    unchoose(): boolean {
        return this.manager.unchoose(this);
    }
    remove(): boolean {
        return this.manager.remove(this);
    }
	edited() {
		this._isEmpty = false;
		this.onDidEdited.trigger(this);
	}

    clear(): this {
        this.context.clearRect(0, 0, this.width, this.height);
        return this;
    }

    createElement(): HTMLElement {
        return new LayerElement(this);
    }

    // On
    onAdd() {
		this._index = this.manager.getIndex(this);
        this.onDidAdded.trigger(this);
    }
    onRemove() {
        this.manager.project.app.selection.deselect(Layer.KEY, this);
        
        this.canvas.element.remove();
        this.onDidRemoved.trigger(this);
    }
    onChoose() {
        this._isCurrent = true;
        this.onDidChosen.trigger(this);
    }
    onUnchoose() {
        this._isCurrent = false;
        this.onDidUnchosen.trigger(this);
    }
    onToolDown(tool: Tool, mouse: IMouseData) {
        this._isToolDown = true;
        this.onDidToolDown.trigger(tool);
    }
    onToolUse(tool: Tool, mouse: IMouseData) {
        this.onDidToolUse.trigger(tool);
    }
    onToolMove(tool: Tool, mouse: IMouseData) {}
    onToolUp(tool: Tool, mouse: IMouseData) {
        this._isToolDown = false;
        this.onDidToolUp.trigger(tool);
		this.edited();
    }
    onSelect(key: string) {
        this._isSelected = true;
        this.onDidSelected.trigger(this);
    }
    onUnselect() {
        this._isSelected = false;
        this.onDidUnselected.trigger(this);
    }
    onIndexChange(newIndex: number) {
		this._index = newIndex;
        this.onDidIndexChanged.trigger(newIndex);
    }
    
    // Set
    /** Resize and clear layer's canvas */
    setSize(width: number, height: number): this {
        this.canvas.setSize(width, height);
        return this;
    }
    /** Set name that displays in layer element */
    setDisplayName(value: string): this {
        this.displayNameState.set(value);
        return this;
    }
    setIsVisible(value: boolean): this {
        this.isVisibleState.set(value);
        return this;
    }
    setIsLocked(value: boolean): this {
        this.isLockedState.set(value);
        return this;
    }
    /** Set canvas element CSS `visibility` property (`"visible"` if `true` else `"hidden"`) */
    setCanvasElementVisibility(value: boolean): this {
        this.canvas.element.style.visibility = value ? "visible" : "hidden";
        return this;
    }

    // Get
    getDataUrl(): string {
        return this.canvas.getDataUrl();
    }
    /**
     * Returns index of `layer` in the list if exists, otherwise returns `null`
     * Alias to `LayersManager.getIndex`
     */
    get context(): CanvasRenderingContext2D {
        return this.canvas.context;
    }
    get displayName(): string {
        return this.displayNameState.value;
    }
    get isVisible(): boolean {
        return this.isVisibleState.value;
    }
    get isLocked(): boolean {
        return this.isLockedState.value;
    }
    get isCurrent(): boolean {
        return this._isCurrent;
    }
    get isSelected(): boolean {
        return this._isSelected;
    }
    get isEditable(): boolean {
        return this.isVisible && !this.isLocked;
    }
    get isToolDown(): boolean {
        return this._isToolDown;
    }
    get isEmpty(): boolean {
        return this._isEmpty;
    }
    get width(): number {
        return this.canvas.width;
    }
    get height(): number {
        return this.canvas.height;
    }
	get index(): number | null {
		return this._index;
	}
	/** If this layer isn't visible for human's eye, why should whe render it? */
	get hasMeaningToRender(): boolean {
		return !this.isEmpty && this.isVisible
	}
	/** Alias to `layer.manager.project` */
	get project(): Project {
		return this.manager.project;
	}
	/** Alias to `layer.manager.project.app` */
	get app(): App {
		return this.manager.project.app;
	}
}
