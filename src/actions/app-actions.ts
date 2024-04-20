import { AppActionAttachable, AppContainedAction, type Command } from "@base/managers";
import type { App } from "@source/App";

// Hello
export class HelloAction extends AppContainedAction<App> {
	execute(command: Command): boolean {
	    super.execute(command);
		return this.app.hello();
	}
}

// Enter project
export class EnterProjectAction extends AppContainedAction<App> {
	constructor(public index: number, attachable: AppActionAttachable<App>) { super(attachable) }

	execute(command: Command): boolean {
	    super.execute(command);
		return this.app.projects.enterIndex(this.index);
	}
}
