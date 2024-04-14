import { CommandAttachable, CommandCondition, CommandFunc } from "@base/managers";
import { BaseElement } from ".";
import type { BaseApp } from "@base/BaseApp";

export class CmdAttachableElement<A extends BaseApp=BaseApp>
	extends BaseElement
	implements CommandAttachable
{
	readonly app: A;

	constructor(app: A) {
		super();

		this.app = app;
	}

	attachCommand(name: string, func: CommandFunc, cond?: CommandCondition | null): boolean {
		const unlisten = this.app.commands.attach(this, name, func, cond);
		if (!unlisten) return false;

		this._unlistens.push(unlisten);
		return true;
	}

	// Get
	getAllowExecCommands(): boolean {
	    return true;
	}
}
