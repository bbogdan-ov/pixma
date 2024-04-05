import { BaseApp } from "@base/BaseApp";
import { Manager } from ".";
import { Trigger } from "@base/common/listenable";

export class HistoryItem<T=any, A extends BaseApp=BaseApp> {
	readonly app: A;
	readonly title: string;
	readonly data: T;

	constructor(app: A, title: string, data: T) {
		this.app = app;
		this.title = title;
		this.data = data;
	}

	async apply(): Promise<boolean> {
		return false;
	}
	condition(): boolean {
		return false;
	}
}

export class HistoryManager extends Manager {
	static readonly MAX_HISTORY_LENGTH = 2048;

	readonly undoHistory: HistoryItem[] = [];
	readonly redoHistory: HistoryItem[] = [];

	protected _stashedItem: HistoryItem | null = null;

	readonly onDidChanged = new Trigger<HistoryItem>();
	readonly onUndid = new Trigger<HistoryItem>();
	readonly onRedid = new Trigger<HistoryItem>();

	constructor(app: BaseApp) {
		super();

		app.registerKeymappedCommand(BaseApp.CONTEXT, "ctrl-z", 		"undo", ()=> this.undo());
		app.registerKeymappedCommand(BaseApp.CONTEXT, "ctrl-shift-z", 	"redo", ()=> this.redo());
	}

	save(item: HistoryItem): boolean {
		this._stashedItem = item;
		return true;
	}
	push(): boolean {
		if (!this._stashedItem) return false;

		this.undoHistory.push(this._stashedItem);
		if (this.undoHistory.length > HistoryManager.MAX_HISTORY_LENGTH)
			this.undoHistory.pop();

		this.onDidChanged.trigger(this._stashedItem);
		this._stashedItem = null;
		return true;
	}

	async undo(): Promise<boolean> {
		const index = this.getLastUndoIndex();
		if (index === null) return false;
		const item = this.undoHistory[index];

		const success = item.apply();
		this.undoHistory.splice(index, 1);

		this.onUndid.trigger(item);
		return success;
	}
	async redo(): Promise<boolean> {
		// TODO:
		return true;
	}

	// Get
	getLastUndoIndex(): number | null {
		for (let i = this.undoCount-1; i >= 0; i --) {
			const item = this.undoHistory[i];
			if (item.condition()) continue;

			return i;
		}
		return null
	}
	getLastRedoIndex(): number | null {
		for (let i = this.redoCount-1; i >= 0; i --) {
			const item = this.redoHistory[i];
			if (item.condition()) continue;

			return i;
		}
		return null
	}
	get undoCount(): number {
		return this.undoHistory.length;
	}
	get redoCount(): number {
		return this.redoHistory.length;
	}
}
