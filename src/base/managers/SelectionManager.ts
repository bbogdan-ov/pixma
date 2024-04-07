import { Utils } from "@base/utils";
import { Manager } from ".";
import { Trigger } from "@base/common/listenable";

// TODO:
type SelectionItem = any;

export class SelectionManager extends Manager {
	protected _selectedKey: string | null = null;
	protected _selectedItems: SelectionItem[] = [];
	
	readonly onDidSelected = new Trigger<SelectionItem>();
	readonly onDidDeselected = new Trigger<SelectionItem>();
	
	constructor() {
		super();
	}

	toggle(key: string, item: SelectionItem): boolean {
		const is_selected = this.select(key, item); 
		if (is_selected) return true;
		return this.deselect(key, item);
	}
	select(key: string, item: SelectionItem): boolean {
		if (this.getIsSelected(key, item)) return false;

		if (key !== this.selectedKey) {
			this._selectedKey = key;
			Utils.clearArray(this._selectedItems);
		}
		
		this._selectedItems.push(item);

		item.onSelect(key);
		this.onDidSelected.trigger(item);

		return true;
	}
	deselect(key: string, item: SelectionItem): boolean {
		if (!this.getIsSelected(key, item)) return false;
		
		Utils.removeItem(this._selectedItems, item);
		if (this.count == 0)
			this._selectedKey = null;

		item.onUnselect();
		this.onDidDeselected.trigger(item);

		return true;
	}
	deselectAll(key: string): boolean {
		if (this.selectedKey !== key) return false;
		
		// TODO: maybe there is another solution here?..
		for (let i = 0; i < this.count; i ++) {
			if (this.deselect(this.selectedKey!, this.selectedItems[i]))
				i --; // This is necessary because array.splice shifts its elements
		}
		
		return true;
	}

	// Get
	getIsSelected(key: string, item: SelectionItem): boolean {
		return this.selectedKey === key && this.selectedItems.includes(item);
	}
	getSelectedItems<T extends SelectionItem>(key: string): T[] {
		if (this.selectedKey !== key) return [];
		return this.selectedItems as T[];
	}
	get selectedKey(): string | null {
		return this._selectedKey;
	}
	get selectedItems(): SelectionItem[] {
		return this._selectedItems;
	}
	get count(): number {
		return this.selectedItems.length;
	}
}
