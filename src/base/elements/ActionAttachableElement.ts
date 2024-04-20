import { BaseElement } from ".";
import { AppContained } from "@base/types/types";
import type { BaseApp } from "@base/BaseApp";
import type { ActionAttachable, Command, CommandAction } from "@base/managers";

export class ActionAttachableElement<A extends BaseApp=BaseApp>
	extends BaseElement
	implements ActionAttachable, AppContained<A>
{
	readonly app: A;

	constructor(app: A) {
		super();

		this.app = app;
	}

	attachAction(commandName: string, action: CommandAction): boolean {
		const remove = this.app.commands.add(commandName, action);
		if (!remove) return false;
		this.listen(remove);
		return true;
	}

	// On
	onCommandExecute(command: Command, action: CommandAction) { }

	// Get
	getAllowExecCommands(): boolean {
	    return true;
	}
}
