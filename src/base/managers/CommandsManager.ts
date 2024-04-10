import { Dev } from "@base/utils";
import { Manager } from ".";
import { BaseApp } from "@base/BaseApp";

export type CommandFunc = VoidFunction;
export type CommandCondition = ()=> boolean;

export class Command {
	namespace: string;
	context: string;
	func: CommandFunc;
	condition: CommandCondition | null;

	constructor(namespace: string, context: string, func: CommandFunc, condition?: CommandCondition | null) {
		this.namespace = namespace;
		this.context = context;
		this.func = func;
		this.condition = condition ?? null;
	}

	test(contexts: string[]): boolean {
		return contexts.includes(this.context);
	}
	execute(contexts: string[]): boolean {
		if (!this.test(contexts)) return false;
		this.func();
		return true;
	}
}

export class CommandsManager extends Manager {
	readonly app: BaseApp;
	readonly registered: Record<string, Command> = {};

	constructor(app: BaseApp) {
		super();

		this.app = app;
	}
	
	/**
	* Register a command
	* If `override` is `true` overrides the existing command
	* Returns successfully or not
	*/
	register(name: string, command: Command, override=false): boolean {
		if (!override && this.get(name)) {
			Dev.warn(`Command with name "${ name }" already exists`);
			return false;
		}

		this.registered[name] = command;
		return true;
	}
	/**
	* Remove/unregister the command
	* Returns successfully or not
	*/
	unregister(name: string): boolean {
		if (!this.get(name)) return false;
		delete this.registered[name];
		return true;
	}

	call(name: string): boolean {
		const cmd = this.get(name);
		return cmd?.execute(this.app.activeContexts) ?? false;
	}

	get(name: string): Command | null {
		return this.registered[name] ?? null;
	}
}
