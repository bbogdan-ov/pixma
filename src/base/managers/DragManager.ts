import { Utils } from "@base/utils";
import { Manager } from ".";
import { Trigger } from "@base/common/listenable";

type DragItem = any;

export class DragManager extends Manager {
    protected _dragKey: string | null = null;
    protected _draggingItems: DragItem[] = [];

    readonly onDidDragStarted = new Trigger<DragItem>();
    readonly onDidDragEnded = new Trigger<string>();
    
    constructor() {
        super();
    }

    startMultiDrag(key: string, items: DragItem[]): boolean {
        for (const item of items) {
            this.startDrag(key, item);
        }
        console.log(items);

        return true;
    }
    startDrag(key: string, item: DragItem): boolean {
        if (this.getIsDragging(key, item)) return false;

        if (key !== this.dragKey) {
            this._dragKey = key;
            Utils.clearArray(this._draggingItems);
        }
        
        this._draggingItems.push(item);
        this.onDidDragStarted.trigger(item);

        return true;
    }
    endDrag(key: string): boolean {
        if (!this.dragKey || this.dragKey !== key) return false;

        Utils.clearArray(this._draggingItems)
        this.onDidDragEnded.trigger(this.dragKey);
        this._dragKey = null;

        return true;
    }
    
    // Get
    getIsDragging(key: string, item: DragItem): boolean {
        return this.dragKey == key && this.draggingItems.includes(item);
    }
    getDraggingItems<T extends DragItem>(key: string): T[] {
        if (this.dragKey !== key) return [];
        return this.draggingItems as T[];
    }
    get dragKey(): string | null {
        return this._dragKey;
    }
    get draggingItems(): DragItem[] {
        return this._draggingItems;
    }
}
