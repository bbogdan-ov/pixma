import { TabElement } from "@base/elements/tabs/TabElement";
import type { Project } from "@source/common/project";

@TabElement.define("project-tab")
export class ProjectTabElement extends TabElement {
	readonly project: Project;

	constructor(project: Project) {
		super();

		this.project = project;
		this.setTitle("project.pixma");
	}

	enter(): void {
	    super.enter();

		this.project.enter();
	}
	close(): void {
	    super.close();

		this.project.close();
	}

	// On
	onMount(): void {
	    super.onMount();

		this.listen(this.project.onDidEntered, this._onEnter.bind(this));
		this.listen(this.project.onDidLeaved, this._onLeave.bind(this));
		this.listen(this.project.onDidClosed, this._onClose.bind(this));
	}
}
