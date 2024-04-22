import { LayerElement } from "@source/elements/layers";
import { State, Trigger } from "@base/common/listenable";
import { Canvas } from "@base/common/misc";
import type { Project } from "../project";
import type { Tool } from "../tools";
import { MouseData } from "@base/managers";
import type { LayersManager } from "@source/managers";
import type { App } from "@source/App";

export class Layer {
    static _id = 0;

    readonly id: number;
    readonly name: string;
    readonly manager: LayersManager;

    readonly canvas: Canvas;
	protected _previewDataUrl: string | null = null;

	protected _index: number | null = null;
    protected _isEmpty = true;
    protected _isCurrent = false;
    protected _isSelected = false;
    protected _isToolDown = false;
	protected _isEditing = false;

	protected _renderPreviewOnEdit = true;
    
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
	startEdit(pushToHistory: boolean) {
		if (this.isEditing) return;

		// TODO: stash to history
		this._isEditing = true;
	}
	endEdit() {
		if (!this.isEditing) return;

		// TODO: push to history
		this._isEditing = false;
		this.edited();
	}
	edited() {
		if (this._renderPreviewOnEdit)
			this.renderPreview();

		this._isEmpty = false;
		this.onDidEdited.trigger(this);
	}

	renderPreview() {
		this._previewDataUrl = this.getDataUrl();
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
    onToolDown(tool: Tool, mouse: MouseData) {
        this._isToolDown = true;
        this.onDidToolDown.trigger(tool);
    }
    onToolUse(tool: Tool, mouse: MouseData) {
        this.onDidToolUse.trigger(tool);
    }
    onToolMove(tool: Tool, mouse: MouseData) {}
    onToolUp(tool: Tool, mouse: MouseData) {
        this._isToolDown = false;
        this.onDidToolUp.trigger(tool);
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
	get isEditing(): boolean {
		return this._isEditing;
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
		return this.manager.project.manager.app;
	}
	get previewDataUrl() {
		return this._previewDataUrl;
	}
}
