import { Trigger } from "@base/common/listenable";
import { Utils } from "@base/utils";
import { Layer } from "@source/common/layers";
import type { Project } from "@source/common/project";
import { ProjectManager } from "..";

export default class LayersManager extends ProjectManager {
    protected _list: Layer[] = [];

    protected _current: Layer | null = null;

    readonly onDidAdded = new Trigger<Layer>();
    readonly onDidRemoved = new Trigger<Layer>();
    readonly onDidChosen = new Trigger<Layer>();
    readonly onDidUnchosen = new Trigger<Layer>();
    readonly onDidListChanged = new Trigger<Layer[]>();
    readonly onDidReordered = new Trigger<Layer[]>();

    constructor(project: Project) {
        super(project);

        this.choose(this.list[0]);
    }

    add(layer: Layer, index: number | null=null): boolean {
        if (this.getIsExists(layer)) return false;

        if (!Utils.exists(index) || index < 0)
            this._list.push(layer);
        else
            Utils.insertItem(this._list, layer, index);

        this.choose(layer);

        layer.onAdd();
        this.onDidAdded.trigger(layer);
        this.onDidListChanged.trigger(this.list);

        return true;
    }
    remove(layer: Layer): boolean {
        if (!this.getIsExists(layer)) return false;

        const removedIndex = Utils.removeItem(this._list, layer);

        layer.onRemove();
        this.onDidRemoved.trigger(layer);
        this.onDidListChanged.trigger(this.list);
        
        const nextLayer = this.list[Utils.clamp(removedIndex, 0, this.count-1)];
        if (nextLayer)
            this.choose(nextLayer);
        
        return true;
    }
    choose(layer: Layer): boolean {
        if (!this.getIsExists(layer) || this.current === layer) return false;

        if (this.current)
            this.unchoose(this.current);

        this._current = layer;
        this._current.onChoose();

        this.onDidChosen.trigger(layer);
        return true
    }
    unchoose(layer: Layer): boolean {
        if (!this._current) return false;

        this._current = null;
        layer.onUnchoose();

        this.onDidUnchosen.trigger(layer);
        return true;
    }

    // Get
    get(index: number): Layer | null {
        return this.list[index] || null;
    }
    getIsExists(layer: Layer): boolean {
        return this.list.findIndex(l=> l === layer) >= 0;
    }
    getSelected(): Layer[] {
        return this.project.app.selection.getSelectedItems(Layer.KEY);
    }
    getDragging(): Layer[] {
        return this.project.app.drag.getDraggingItems(Layer.KEY);
    }
    /** Returns index of `layer` in the list if exists, otherwise returns `null` */
    getIndexOf(layer: Layer): number | null {
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
    get count(): number {
        return this.list.length;
    }
}
