import { Manager } from "@base/managers";
import { Utils } from "@base/utils";
import type App from "@source/App";
import type { Project } from "@source/common/project";
import { ProjectTab } from "@source/common/tabs";

export default class ProjectsManager extends Manager {
	readonly app: App;

	protected readonly _list: Project[] = []
		
	constructor(app: App) {
		super();

		this.app = app;
	}

	open(project: Project): boolean {
		if (this.getIsExists(project)) return false;
		
		this.app.tabs.open(new ProjectTab(this.app.tabs, project));
		project.onOpen();
		return true;
	}
	close(project: Project): boolean {
		if (this.getIsExists(project)) return false;

		Utils.removeItem(this._list, project);
		project.onClose();
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
