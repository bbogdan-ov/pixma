import { Manager } from ".";
import { KeyBind } from "@base/common/binds";
import { CommandsManager } from "./CommandsManager";
import { DOM, Dev } from "@base/utils";

export type KeymapBind = KeyBind | string | (KeyBind | string)[];

export class Keymap {
	readonly bind: KeyBind;
	readonly command: string;

	constructor(bind: KeyBind, command: string) {
		this.bind = bind;
		this.command = command;
	}

	test(event: Event): boolean {
		return this.bind.test(event);
	}
}

export class KeymapsManager extends Manager {
	readonly commands: CommandsManager;
	readonly keymaps: Keymap[] = [];

	protected _isPreventing = false;

	constructor(commands: CommandsManager) {
		super();

		this.commands = commands;
	}

	/**
	 * Register a keymap
	 * `binds` can be a string, `KeyBind` or array of strings and `KeyBind`
	 * See `KeyBind.fromString()` for more info about "string key bind"
	 *
	 * Examples:
	 * - `register("a", "my-command")` -> Bind `"my-command"` to `A`
	 * - `register("shift-b", "my-command")` -> Bind `"my-command"` to `Shift + B`
	 * - `register("a-b-c", "my-command")` -> Throws an error!
	 * - `register(KeyBind.A, "my-command")` -> Bind `"my-command"` to `A`
	 * - `register(KeyBind.B.setShift(), "my-command")` -> Bind `"my-command"` to `Shift + B`
	 * - `register(["c", "d"], "my-command")` -> Bind `"my-command"` to `C` and `D`
	 */
	register(binds: KeymapBind, command: string): boolean {
		if (typeof binds != "object")
			binds = [binds];

		for (const bind of binds as (string[] | KeyBind[])) {
			let b: KeyBind | null = null;

			if (typeof bind == "string")
				b = KeyBind.fromString(bind);
			else
				b = bind;

			if (!b) {
				// Only binds that was parsed from a string may be null
				Dev.throwError(`Cannot register a keymap bind "${ bind }"`);
				return false;
			}
			this.keymaps.push(new Keymap(b, command));
		}
		return true;
	}

	// On
	onKeyDown(event: KeyboardEvent) {
		if (this.getIsPreventKeyDownListen()) return;

		for (const map of this.keymaps) {
			if (map.test(event)) {
				event.preventDefault();
				this.commands.call(map.command);
			}
		}
	}

	// Set
	setIsPreventing(value: boolean) {
		this._isPreventing = value;
	}

	// Get
	getIsPreventKeyDownListen(): boolean {
		return this.isPreventing || !!DOM.focusedInput;
	}
	get isPreventing(): boolean {
		return this._isPreventing;
	}
}
