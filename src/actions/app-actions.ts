import { ActionAppContainedAttachable, AppContainedAction } from ".";
import type { Command } from "@base/managers";

// Hello
export class HelloAction extends AppContainedAction {
	execute(command: Command): boolean {
	    super.execute(command);
		return this.app.hello();
	}
}

// Enter project
export class EnterProjectAction extends AppContainedAction {
	constructor(public index: number, attachable: ActionAppContainedAttachable) { super(attachable) }

	execute(command: Command): boolean {
	    super.execute(command);
		return this.app.projects.enterIndex(this.index);
	}
}
