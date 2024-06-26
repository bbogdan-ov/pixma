import { Trigger } from "@base/common/listenable";
import { Manager } from "@base/managers";
import { Utils } from "@base/utils";
import type { App } from "@source/App";
import type { Project } from "@source/common/project";

export class ProjectsManager extends Manager {
	readonly app: App;

	protected _current: Project | null = null;
	readonly list: Project[] = [];

	readonly onDidOpened = new Trigger<Project>();
	readonly onDidEntered = new Trigger<Project>();
	readonly onDidLeaved = new Trigger<Project>();
	readonly onDidClosed = new Trigger<Project>();
		
	constructor(app: App) {
		super();

		this.app = app;
	}

	open(project: Project): boolean {
		if (this.getIsExists(project)) return false;

		this.list.push(project);
		project.onOpen();
		this.onDidOpened.trigger(project);
		return true;
	}
	closeIndex(index: number): boolean {
		const project = this.list[index];
		if (!project) return false;

		this.list.splice(index, 1);
		
		this.leave(project);

		project.onClose();
		this.onDidClosed.trigger(project);
		return true;
	}
	close(project: Project): boolean {
		const index = this.getIndex(project);
		if (index === null) return false;
		return this.closeIndex(index);
	}
	enterIndex(index: number): boolean {
		const project = this.list[index];
		if (!project) return false;

		this.leave(null);

		this._current = project;
		project.onEnter();
		this.onDidEntered.trigger(project);
		return true;
	}
	enter(project: Project): boolean {
		const index = this.getIndex(project);
		if (index === null) return false;
		return this.enterIndex(index);
	}
	leave(project: Project | null): boolean {
		if (!this.current) return false;
		if (project && this.current !== project)
			return false;

		this.current.onLeave();
		this.onDidLeaved.trigger(this.current);
		this._current = null;
		return true;
	}

	// Get
	getIsExists(project: Project): boolean {
		return this.list.includes(project);
	}
	getById(id: number): Project | null {
		return this.list.find(p=> p.id == id) ?? null;
	}
	getIndex(project: Project): number | null {
		return Utils.indexOf(this.list, project);
	}
	get current(): Project | null {
		return this._current;
	}
}
