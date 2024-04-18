import { ActionAttachable, CommandAction } from "@base/managers";
import { BaseElement } from ".";
import { BaseApp } from "@base/BaseApp";
import { AppContained } from "@base/types/types";

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

	// Get
	getAllowExecCommands(): boolean {
	    return true;
	}
}
