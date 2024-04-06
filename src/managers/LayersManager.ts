import { Trigger } from "@base/common/listenable";
import { Manager } from "@base/managers";
import { Utils } from "@base/utils";
import { DrawingLayer, Layer, PreviewLayer } from "@source/common/layers";
import type { Project } from "@source/common/project";

export class LayersManager extends Manager {
	readonly project: Project;

    protected _list: Layer[] = [];

    protected _current: Layer | null = null;
    protected _currentIndex: number | null = null;
    readonly previewLayer: PreviewLayer;

    readonly onDidAdded = new Trigger<Layer>();
    readonly onDidRemoved = new Trigger<Layer>();
    readonly onDidChosen = new Trigger<Layer>();
    readonly onDidUnchosen = new Trigger<Layer>();
    readonly onDidListChanged = new Trigger<Layer[]>();
    readonly onDidReordered = new Trigger<Layer[]>();

    constructor(project: Project) {
        super();

		this.project = project;

        this.previewLayer = new PreviewLayer(this);

        this.add(new DrawingLayer(this));
    }

    add(layer: Layer, index: number | null=null): boolean {
        if (this.getIsExists(layer)) return false;

        if (!Utils.exists(index) || index < 0)
            this._list.push(layer);
        else
            Utils.insertItem(this._list, layer, index);

		const newIndex = index ?? (this.count-1);

		this._updateIndexFrom(newIndex+1);

        this.chooseIndex(newIndex);

        layer.onAdd();
        this.onDidAdded.trigger(layer);
        this.onDidListChanged.trigger(this.list);

        return true;
    }
	addNearCurrent(layer: Layer, above=false): boolean {
		return this.add(layer, (this.currentIndex ?? 0) + +above)
	}
	removeIndex(index: number): boolean {
		const layer = this.list[index];
		if (!layer) return false;

		this._list.splice(index, 1);
		this._updateIndexFrom(index);

		layer.onRemove();
		this.onDidRemoved.trigger(layer);
		this.onDidListChanged.trigger(this.list);

        this.chooseIndex(index);

		return true;
	}
	/**
	 * Slower than `removeIndex()` because it have to search for the index of the layer
	 * So if you are already know the index of the layer, use `removeIndex()` method instead
	 */
    remove(layer: Layer): boolean {
		const index = this.getIndex(layer);
		if (index === null) return false;
        return this.removeIndex(index);
    }
	removeCurrent(): boolean {
		if (this.currentIndex === null) return false;
		return this.removeIndex(this.currentIndex);
	}
	chooseIndex(index: number): boolean {
		const layer = this.list[index];
		if (!layer || this.current == layer) return false;

		this.unchoose();

		this._current = layer;
		this._currentIndex = index;
		this._current.onChoose();

		this.onDidChosen.trigger(this._current);
		return true;
	}
	/** A little bit slower than `chooseIndex()` due to checking that `layer` exists */
    choose(layer: Layer): boolean {
		// Code here is kind of simular to code in `chooseIndex()`
		// it was done intentionally for the sake of speed!
        if (!this.getIsExists(layer) || this.current === layer) return false;

		this.unchoose();

        this._current = layer;
        this._currentIndex = this.getIndex(layer) ?? 0;
        this._current.onChoose();

        this.onDidChosen.trigger(layer);
        return true
    }
	/**
	 * Unchoose current layer
	 * If `layer` is `null`, just unchoose current layer
	 * If `layer` is specified, unchoose only if `layer` is current
	 */
    unchoose(layer?: Layer | null): boolean {
        if (!this._current)
			return false;
		if (!!layer && this._current !== layer)
			return false;

		this._current.onUnchoose();
		this.onDidUnchosen.trigger(this._current);

		this._current = null;
		return true;
    }

	protected _updateIndexFrom(index: number) {
		for (let i = index; i < this.count; i ++) {
			this.list[i].onIndexChange(i);
		}
	}

    // Get
    get(index: number): Layer | null {
        return this.list[index] || null;
    }
	getById(id: number): Layer | null {
		return this.list.find(l=> l.id == id) ?? null;
	}
    getIsExists(layer: Layer): boolean {
        return this.list.includes(layer);
    }
    getSelected(): Layer[] {
        return this.project.app.selection.getSelectedItems(Layer.KEY);
    }
    getDragging(): Layer[] {
        return this.project.app.drag.getDraggingItems(Layer.KEY);
    }
    /** Returns index of `layer` in the list if exists, otherwise returns `null` */
    getIndex(layer: Layer): number | null {
        return Utils.indexOf(this.list, layer);
    }
    getIsSelected(layer: Layer): boolean {
        return this.project.app.selection.getIsSelected(Layer.KEY, layer);
    }
    getIsDragging(layer: Layer): boolean {
        return this.project.app.drag.getIsDragging(Layer.KEY, layer);
    }
    get list(): Layer[] {
        return this._list;
    }
    get current(): Layer | null {
        return this._current;
    }
    get currentIndex(): number | null {
        return this._currentIndex;
    }
    get count(): number {
        return this.list.length;
    }
}
