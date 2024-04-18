import { ActionAppContainedAttachable, AppContainedAction } from ".";

// Hello
export class HelloAction extends AppContainedAction {
	execute(): boolean {
	    super.execute();
		return this.app.hello();
	}
}

// Enter project
export class EnterProjectAction extends AppContainedAction {
	constructor(public index: number, attachable: ActionAppContainedAttachable) { super(attachable) }

	execute(): boolean {
	    super.execute();
		return this.app.projects.enterIndex(this.index);
	}
}
