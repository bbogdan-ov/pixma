import { Manager } from ".";
import { KeyBind } from "@base/common/binds";
import { CommandsManager } from "./CommandsManager";
import { Dev, Utils } from "@base/utils";
import { Trigger } from "@base/common/listenable";

export type KeymapBind = KeyBind | string;
export type KeymapCondition = ()=> boolean;

export class Keymap {
	readonly bind: KeyBind | null;
	readonly command: string;
	readonly condition: KeymapCondition | null;

	/**
	 * Create a keymap
	 * `bind` can be a string, `KeyBind`
	 * See `KeyBind.fromString()` for more info about "string key bind"
	 *
	 * Examples:
	 * - `new Keymap("a", "my-command")` -> Bind `"my-command"` to `A`
	 * - `new Keymap("shift-b", "my-command")` -> Bind `"my-command"` to `Shift + B`
	 * - `new Keymap("a-b-c", "my-command")` -> Throws an error!
	 * - `new Keymap(KeyBind.A, "my-command")` -> Bind `"my-command"` to `A`
	 * - `new Keymap(KeyBind.B.setShift(), "my-command")` -> Bind `"my-command"` to `Shift + B`
	 */
	constructor(bind: KeymapBind, command: string, condition?: KeymapCondition) {
		if (typeof bind == "string") {
			this.bind = KeyBind.fromString(bind);

			if (!this.bind)
				Dev.throwError(`Cannot register a keymap bind "${ bind }"`);
		} else
			this.bind = bind;

		this.command = command;
		this.condition = condition ?? null;
	}

	test(event: Event): boolean {
		if (!this.bind) return false;
		// If condition returns false, return false
		// Is condition is null, continue
		if (this.condition ? !this.condition() : false)
			return false;

		return this.bind.test(event);
	}
}

export class KeymapsManager extends Manager {
	readonly commands: CommandsManager;
	readonly registered: Keymap[] = [];

	protected _isPreventing = false;

	readonly onDidRegistered = new Trigger<Keymap>();
	readonly onDidUnregistered = new Trigger<Keymap>();
	/**
	 * Triggers before keymap is called
	 * Can be used for preveting certain keymaps
	 */
	readonly onDidStartedCalling = new Trigger<Keymap>();

	constructor(commands: CommandsManager) {
		super();

		this.commands = commands;
	}

	register(keymap: Keymap): boolean {
		this.registered.push(keymap);
		this.onDidRegistered.trigger(keymap);
		return true;
	}
	/**
	 * Unregister/remove keymap
	 * Returns successfully or not
	 */
	unregister(keymap: Keymap): boolean {
		const index = Utils.removeItem(this.registered, keymap);
		if (index === null) return false;
		this.onDidUnregistered.trigger(keymap);
		return true;
	}

	// On
	onKeyDown(event: KeyboardEvent) {
		if (this.getIsPreventKeyDownListen()) return;

		for (const map of this.registered) {
			if (map.test(event)) {
				event.preventDefault();
				this.onDidStartedCalling.trigger(map);

				this.commands.execute(map.command);
			}
		}
	}

	// Set
	setIsPreventing(value: boolean) {
		this._isPreventing = value;
	}

	// Get
	getIsPreventKeyDownListen(): boolean {
		return this.isPreventing;
	}
	get isPreventing(): boolean {
		return this._isPreventing;
	}
}
