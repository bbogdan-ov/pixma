import { Trigger } from "./common/listenable";
import { ActionAttachableElement } from "./elements";
import { Command, CommandAction, CommandCondition, CommandsManager, Keymap, KeymapBind, KeymapCondition, KeymapsManager } from "./managers";
import { OptionsManager } from "./managers/OptionsManager";

export class BaseApp<E extends HTMLElement=HTMLElement> {
	static readonly NAMESPACE = "app";
	static readonly CONTEXT = "app";

	protected _element!: E;

	readonly options: OptionsManager;
	readonly commands: CommandsManager;
	readonly keymaps: KeymapsManager;

	readonly onDidContextAdded = new Trigger<string>();
	readonly onDidContextRemoved = new Trigger<string>();

	constructor() {
		this.options = new OptionsManager();
		this.commands = new CommandsManager(this);
		this.keymaps = new KeymapsManager(this.commands);
	}

	/** Register a command and attach an action to app element */
	attachCommand(name: string, action: CommandAction): boolean {
		if (!(this.element instanceof ActionAttachableElement)) return false;

		this.registerCommand(name);
		this.element.attachAction(name, action);
		return true;
	}
	/**
	 * Register a command
	 * See `new Command()` for more info
	 */
	registerCommand(name: string, condition?: CommandCondition): boolean {
		return this.commands.register(new Command(BaseApp.NAMESPACE, name, condition));
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
