import { Trigger } from "./common/listenable";
import { CommandsManager, Keymap, KeymapBind, KeymapCondition, KeymapsManager } from "./managers";
import { OptionsManager } from "./managers/OptionsManager";
import { Utils } from "./utils";

export class BaseApp<E extends HTMLElement=HTMLElement> {
	static readonly NAMESPACE = "app";
	static readonly CONTEXT = "app";

	protected _element!: E;

	readonly options: OptionsManager;
	readonly commands: CommandsManager;
	readonly keymaps: KeymapsManager;

	readonly activeContexts: string[] = [BaseApp.CONTEXT];

	readonly onDidContextAdded = new Trigger<string>();
	readonly onDidContextRemoved = new Trigger<string>();

	constructor() {
		this.options = new OptionsManager();
		this.commands = new CommandsManager(this);
		this.keymaps = new KeymapsManager(this.commands);
	}

	addContext(name: string): boolean {
		if (this.activeContexts.includes(name)) return false;

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

	/**
	 * Register a keymap
	 * See `new Keymap()` for more info
	 */
	registerKeymap(binds: KeymapBind | KeymapBind[], command: string, condition?: KeymapCondition) {
		if (typeof binds != "object")
			binds = [binds];

		for (const bind of binds as KeymapBind[]) {
			this.keymaps.register(new Keymap(bind, command, condition));
		}
	}

	// Get
	/** Get boolean option */
	getBool(name: string, defaultValue?: boolean): boolean {
		return this.options.getBoolean(name) ?? defaultValue ?? false;
	}
	/** Get float option */
	getFloat(name: string, defaultValue?: number): number {
		return this.options.getFloat(name) ?? defaultValue ?? 0;
	}
	/** Get int option */
	getInt(name: string, defaultValue?: number): number {
		return this.options.getInt(name) ?? defaultValue ?? 0;
	}
	/** Get string option */
	getString(name: string, defaultValue?: string): string {
		return this.options.getString(name) ?? defaultValue ?? "";
	}
	get element(): E {
		return this._element;
	}
}
