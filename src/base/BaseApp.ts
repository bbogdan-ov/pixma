import { Trigger } from "./common/listenable";
import { Utils } from "./utils";

export class BaseApp<E extends Element=HTMLElement> {
	protected _element!: E;

	readonly activeContexts: string[] = ["app"];

	readonly onDidContextAdded = new Trigger<string>();
	readonly onDidContextRemoved = new Trigger<string>();

	constructor() {}

	addContext(name: string): boolean {
		if (this.getIsContextActive(name)) return false;

		this.activeContexts.push(name);
		this.onDidContextAdded.trigger(name);
		return true;
	}
	removeContext(name: string): boolean {
		const removedIndex = Utils.removeItem(this.activeContexts, name);
		if (removedIndex === null) return false;

		this.onDidContextRemoved.trigger(name);
		return true;
	}

	// Get
	getIsContextActive(name: string): boolean {
		return this.activeContexts.includes(name);
	}
	get element(): E {
		return this._element;
	}
}
