import { Dev } from "@base/utils";
import { Manager } from ".";
import { BaseApp } from "@base/BaseApp";

export type CommandFunc = VoidFunction;

export class Command {
	readonly name: string;
	readonly namespace: string;
	readonly context: string;
	readonly func: CommandFunc;

	constructor(namespace: string, context: string, name: string, func: CommandFunc) {
		this.namespace = namespace;
		this.context = context;
		this.name = name;
		this.func = func;
	}
}

export class CommandsManager extends Manager {
	readonly app: BaseApp;
	readonly commands: Record<string, Command> = {};

	constructor(app: BaseApp) {
		super();

		this.app = app;
	}
	
	/**
	* Register a command
	* If `override` is `true` overrides the existing command
	* Returns successfully or not
	*/
	register(namespace: string, context: string, name: string, func: CommandFunc, override=false): boolean {
		if (!override && this.get(name)) {
			Dev.warn(`Command with name "${ name }" already exists`);
			return false;
		}

		this.commands[name] = new Command(namespace, context, name, func);
		return true;
	}
	/**
	* Remove/unregister the command
	* Returns successfully or not
	*/
	unregister(name: string): boolean {
		if (!this.get(name)) return false;
		delete this.commands[name];
		return true;
	}
	get(name: string): Command | null {
		return this.commands[name] ?? null;
	}
	/**
	* Call a command
	* Returns successfully or not
	*/
	call(name: string): boolean {
		const cmd = this.get(name);
		if (!cmd) return false;
		if (!this.app.activeContexts.includes(cmd.context)) return false;

		cmd.func();
		return true;
	}
}
