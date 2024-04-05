import { Trigger } from "@base/common/listenable";
import { Manager } from "@base/managers";
import { Utils } from "@base/utils";
import type { App } from "@source/App";
import type { Project } from "@source/common/project";
import { ProjectTab } from "@source/common/tabs";

export class ProjectsManager extends Manager {
	readonly app: App;

	protected _current: Project | null = null;
	protected readonly _list: Project[] = [];

	readonly onDidOpened = new Trigger<Project>();
	readonly onDidEntered = new Trigger<Project>();
	readonly onDidLeaved = new Trigger<Project>();
	readonly onDidClosed = new Trigger<Project>();
		
	constructor(app: App) {
		super();

		this.app = app;
	}

	/** Open project tab */
	open(project: Project): boolean {
		return this.app.tabs.open(new ProjectTab(this.app.tabs, project));
	}
	/** Close project tab */
	close(project: Project): boolean {
		if (!project.tab) return false;
		return project.tab.close();
	}

	// On
	onOpen(project: Project) {
		if (this.getIsExists(project)) return;

		this.list.push(project);
		this.onDidOpened.trigger(project);
	}
	onEnter(project: Project) {
		if (this.current === project) return;

		this._current = project;
		this.onDidEntered.trigger(project);
	}
	onLeave(project: Project) {
		if (this.current === project)
			this._current = null;

		this.onDidLeaved.trigger(project);
	}
	onClose(project: Project) {
		const removeIndex = Utils.removeItem(this.list, project);
		if (removeIndex === null) return;

		this.onDidClosed.trigger(project);
	}

	// Get
	getIsExists(project: Project): boolean {
		return this.list.includes(project);
	}
	getById(id: number): Project | null {
		return this.list.find(p=> p.id == id) ?? null;
	}
	get current(): Project | null {
		return this._current;
	}
	get list(): Project[] {
		return this._list;
	}
}
