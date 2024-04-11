import { Dev } from "@base/utils";
import { Manager } from ".";
import { BaseApp } from "@base/BaseApp";
import { Trigger } from "@base/common/listenable";

export type CommandFunc = VoidFunction;
export type CommandCondition = ()=> boolean;
export interface CommandAttachable {
	getAllowExecCommands(): boolean
}

export class CommandAttached {
	constructor(
		public attachable: CommandAttachable | null,
		public context: string | null,
		public func: CommandFunc,
		public condition: CommandCondition | null
	) {}

	test(contexts: string[] | null): boolean {
		if (this.attachable instanceof HTMLElement)
			if (!this.attachable.isConnected)
				return false;

		const isCond = (this.condition ? this.condition() : true);

		if (this.attachable)
			return this.attachable.getAllowExecCommands() && isCond;
		else if (this.context && contexts)
			return contexts.includes(this.context) && isCond;

		return false;
	}
	execute(contexts: string[] | null): boolean {
		if (!this.test(contexts)) return false;

		this.func();
		return true;
	}
}
export class Command {
	attached: CommandAttached[] = [];
	
	constructor() {}

	execute(contexts: string[] | null) {
		for (const cmd of this.attached) {
			cmd.execute(contexts);
		}
	}

	attach(attachableOrContext: CommandAttachable | string, func: CommandFunc, cond?: CommandCondition | null) {
		let context    = typeof attachableOrContext == "string" ? attachableOrContext : null;
		let attachable = typeof attachableOrContext == "object" ? attachableOrContext : null;

		this.attached.push(new CommandAttached(attachable, context, func, cond ?? null));
	}
	unattach(attachableOrContext: CommandAttachable | string): boolean {
		const index = this.attached.findIndex(a=>
			a.attachable === attachableOrContext ||
			a.context === attachableOrContext
		);
		if (index < 0) return false;

		this.attached.splice(index, 1);
		return true;
	}
}

export class CommandsManager extends Manager {
	readonly app: BaseApp;
	readonly registered: Record<string, Command> = {};

	readonly onDidRegistered = new Trigger<string>();
	readonly onDidUnregistered = new Trigger<string>();

	constructor(app: BaseApp) {
		super();

		this.app = app;
	}
	
	/**
	* Register a command
	* If `override` is `true` overrides the existing command
	* Returns successfully or not
	*/
	register(name: string, attachToContext?: string, func?: CommandFunc, override=false): boolean {
		if (!override && this.get(name)) {
			Dev.warn(`Command with name "${ name }" already exists`);
			return false;
		}

		const cmd = new Command();
		this.registered[name] = cmd;

		if (attachToContext && func)
			cmd.attach(attachToContext, func)

		this.onDidRegistered.trigger(name);
		return true;
	}
	/**
	* Remove/unregister the command
	* Returns successfully or not
	*/
	unregister(name: string): boolean {
		if (!this.get(name)) return false;
		this.onDidUnregistered.trigger(name);
		delete this.registered[name];
		return true;
	}

	attach(attachableOrContext: CommandAttachable | string, name: string, func: CommandFunc, cond?: CommandCondition | null): VoidFunction | null {
		const command = this.get(name);
		if (!command) {
			Dev.warn(`No command with name "${ name }" found. Register it first`);
			return null;
		}

		command.attach(attachableOrContext, func, cond);

		return ()=> this.unattach(name, attachableOrContext);
	}
	unattach(name: string, attachableOrContext: CommandAttachable | string): boolean {
		return this.get(name)?.unattach(attachableOrContext) ?? false;
	}

	execute(name: string): boolean {
		return this.get(name)?.execute(this.app.activeContexts) ?? false;
	}

	get(name: string): Command | null {
		return this.registered[name] ?? null;
	}
}
