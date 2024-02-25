import { LayerElement } from "@source/elements/layers";
import { Listenable, State, Trigger } from "@base/common/listenable";
import { Canvas } from "@base/common/misc";
import { DOM } from "@base/utils";
import type { Tool } from "../tools";
import type { IListener, IMouseData, ISelectableItem } from "@base/types/types";
import type { ListenableListener } from "@base/common/listenable/Listenable";
import type { LayersManager } from "@source/managers";

export default class Layer implements ISelectableItem, IListener {
    static readonly KEY = "layer";
    static _id = 0;

    readonly id: number;
    readonly name: string;
    readonly manager: LayersManager;

    readonly canvas: Canvas;
    readonly unlistens: VoidFunction[] = [];

    protected _isEmpty = true;
    protected _isCurrent = false;
    protected _isSelected = false;
    
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
    readonly onDidReordered = new Trigger<number>();

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
    unlistenAll(): void {
        for (const unlisten of this.unlistens) {
            unlisten();
        }
    }

    clear(): this {
        this.context.clearRect(0, 0, this.width, this.height);
        return this;
    }

    createElement(): HTMLElement {
        return new LayerElement(this);
    }

    listen<K extends keyof GlobalEventHandlersEventMap>(element: EventTarget, eventName: K, listener: (event: GlobalEventHandlersEventMap[K]) => void, options?: boolean | AddEventListenerOptions): VoidFunction;
    listen(element: EventTarget, eventName: string, listener: (event: Event) => void, options?: boolean | AddEventListenerOptions): VoidFunction;
    listen<T>(listenable: Listenable<T>, listener: ListenableListener<T>, invoke?: boolean): VoidFunction;
    listen(lisOrEl: any, eventOrListener: any, listenerOrInvoke?: any, options?: any): VoidFunction {
        return DOM.listen(this, lisOrEl, eventOrListener, listenerOrInvoke, options);
    }

    // On
    onAdd() {
        this.onDidAdded.trigger(this);
    }
    onRemove() {
        this.manager.project.app.selection.deselect(Layer.KEY, this);
        
        this.unlistenAll();
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
        this.onDidToolDown.trigger(tool);
    }
    onToolUse(tool: Tool, mouse: IMouseData) {
        this.onDidToolUse.trigger(tool);
    }
    onToolMove(tool: Tool, mouse: IMouseData) {}
    onToolUp(tool: Tool, mouse: IMouseData) {
        this.onChanged();
        
        this.onDidToolUp.trigger(tool);
        this.onDidEdited.trigger(this);
    }
    onSelect(key: string) {
        this._isSelected = true;
        this.onDidSelected.trigger(this);
    }
    onUnselect() {
        this._isSelected = false;
        this.onDidUnselected.trigger(this);
    }
    onChanged() {
        this._isEmpty = false;
        this.setCanvasElementVisibility(true);
    }
    onReorder(newIndex: number) {
        this.onDidReordered.trigger(newIndex);
    }
    
    // Set
    setSize(width: number, height: number): this {
        this.canvas.setSize(width, height);
        return this;
    }
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
     * @alias layersManager.getIndexOf
     */
    getIndex(): number | null {
        return this.manager.getIndexOf(this);
    }
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
    get isEmpty(): boolean {
        return this._isEmpty;
    }
    get width(): number {
        return this.canvas.width;
    }
    get height(): number {
        return this.canvas.height;
    }
}
