import { FocusableElement } from "../FocusableElement";
import { ISelectableItem } from "@base/types/types";
import type { SelectionManager } from "@base/managers";

@FocusableElement.define("selectable-item")
export class SelectableItemElement extends FocusableElement {
    manager: SelectionManager;
    selectionKey: string;
    selectableItem: ISelectableItem;
    
    constructor(manager: SelectionManager, key: string, item: ISelectableItem) {
        super();

        this.manager = manager;
        this.selectionKey = key;
        this.selectableItem = item;

        this.classList.add("selectable-item");
    }

    select(): boolean {
        return this.manager.select(this.selectionKey, this.selectableItem);
    }
    deselect(): boolean {
        return this.manager.deselect(this.selectionKey, this.selectableItem);
    }
    /** Returns `true` if item was selected and `false` otherwise  */
    selectOnDown(event: MouseEvent): boolean {
        const isSelected = this.getIsSelected();

        if (!event.shiftKey && !isSelected) {
            this.manager.deselectAll(this.selectionKey);
        }
        
        if (event.shiftKey && isSelected) {
            this.deselect();
            return false;
        }

        return this.select();
    }
    /** Returns `true` if item was selected and `false` otherwise  */
    selectOnClick(event: MouseEvent): boolean {
        if (!event.shiftKey && this.getIsSelected()) {
            this.manager.deselectAll(this.selectionKey);
            return this.select();
        }
        return false;
    }

    // Get
    getIsSelected(): boolean {
        return this.manager.getIsSelected(this.selectionKey, this.selectableItem);
    }
}
