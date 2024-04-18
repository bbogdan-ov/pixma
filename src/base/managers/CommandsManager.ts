import { Manager } from ".";
import { BaseApp } from "@base/BaseApp";
import { Trigger } from "@base/common/listenable";

export type CommandFunc = VoidFunction;
export type CommandCondition = ()=> boolean;
export interface ActionAttachable {
	getAllowExecCommands(): boolean
}

// Command action
export class CommandAction<A extends ActionAttachable=ActionAttachable> {
	constructor(readonly attachable: A) {}

	execute(): boolean {
		return false;
	}
	test(): boolean {
		if (this.attachable instanceof Element && !this.attachable.isConnected)
			return false;

		return this.attachable.getAllowExecCommands();
	}
}

// Command
export class Command {
	readonly namespace: string;
	readonly name: string;
	readonly condition: CommandCondition | null;

	readonly actions: CommandAction[] = []

	constructor(
		namespace: string,
		name: string,
		condition?: CommandCondition
	) {
		this.namespace = namespace;
		this.name = name;
		this.condition = condition || null;
	}

	/**
	 * Add a command action
	 * Returns remove action function
	 */
	add(action: CommandAction): VoidFunction {
		this.actions.push(action);
		return ()=> this.actions.splice(this.actions.length-1, 1);
	}

	test(): boolean {
		return this.condition ? this.condition() : true;
	}
	execute(): boolean {
		if (!this.test()) return false;

		for (const action of this.actions) {
			if (action.test())
				action.execute();
		}
		return true;
	}
}

// Commands manager
export class CommandsManager extends Manager {
	readonly app: BaseApp;
	readonly registered: Record<string, Command> = {};

	readonly onDidRegistered = new Trigger<string>();
	readonly onDidUnregistered = new Trigger<string>();

	constructor(app: BaseApp) {
		super();

		this.app = app;
	}
	
	execute(name: string): boolean {
		const cmd = this.get(name);
		if (!cmd) {
			console.warn(`A command named "${ name }" cannot be executed. No such command is registered`);
			return false;
		}
		return cmd.execute();
	}

	/**
	 * Register a command
	 * If `override` is `true` overrides the existing command
	 * Returns successfully or not
	 */
	register(command: Command, override=false): boolean {
		if (!override && this.get(command.name)) {
			console.warn(`A command named "${ name }" already exists`);
			return false;
		}

		this.registered[command.name] = command;
		this.onDidRegistered.trigger(command.name);
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

	/**
	 * Add an action to the command
	 * Returns remove action function if command exists, otherwise return `null`
	 */
	add(commandName: string, action: CommandAction): VoidFunction | null {
		const cmd = this.get(commandName);
		if (!cmd) {
			console.warn(`The action connot be added to a command named "${ commandName }". No such command is registered`);
			return null;
		}

		return cmd.add(action);
	}

	get(name: string): Command | null {
		return this.registered[name] ?? null;
	}
}
