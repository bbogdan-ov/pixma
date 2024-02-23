import { Trigger } from "@base/common/listenable";
import { Manager } from "@base/managers";
import { Utils } from "@base/utils";
import type App from "@source/App";
import type { Project } from "@source/common/project";
import { ProjectTab } from "@source/common/tabs";

export default class ProjectsManager extends Manager {
	readonly app: App;

	protected readonly _list: Project[] = []

	readonly onDidOpened = new Trigger<Project>();
	readonly onDidClosed = new Trigger<Project>();
		
	constructor(app: App) {
		super();

		this.app = app;
	}

	open(project: Project): boolean {
		if (this.getIsExists(project)) return false;
		
		this._list.push(project);
		this.app.tabs.open(new ProjectTab(this.app.tabs, project));
		this.onDidOpened.trigger(project);
		return true;
	}
	close(project: Project): boolean {
		const removedIndex = Utils.removeItem(this._list, project);
		if (!Utils.exists(removedIndex) || removedIndex < 0) return false;

		if (project.tab)
			this.app.tabs.close(project.tab);
		this.onDidClosed.trigger(project);
		return true;
	}
	
	// Get
	getIsExists(project: Project): boolean {
		return this.list.includes(project)
	}
	get list(): Project[] {
		return this._list;
	}
}
