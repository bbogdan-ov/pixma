import { Panel } from "@base/elements/windows";
import type { WindowsManager } from "@base/managers";
import { Orientation } from "@base/types/enums";
import type { App } from "@source/App";
import { Project } from "@source/common/project";

export abstract class ProjectPanel extends Panel<App> {
	protected _project: Project | null = null;
	
	constructor(name: string, manager: WindowsManager<App>, orientation: Orientation) {
		super(name, manager, orientation);
	}

	protected _updateStyles() {
		this.classList.toggle("disabled", !this.project);
	}
	protected _updateProjectState() {
		this._updateStyles();
	}

	// On
	onMount(): void {
	    super.onMount();

		this.listen(this.app.projects.onDidEntered, this._onProjectEnter.bind(this));
		this.listen(this.app.projects.onDidLeaved, this._onProjectLeave.bind(this));

		this._updateProjectState();
	}
	protected _onProjectEnter(project: Project) {
		this._project = project;
		this._updateProjectState();
	}
	protected _onProjectLeave(project: Project) {
		this._project = null;
		this._updateProjectState();
	}

	// Get
	get project(): Project | null {
		return this._project;
	}
}
