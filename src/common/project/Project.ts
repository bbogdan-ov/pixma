import { State, Trigger } from "@base/common/listenable";
import { LayersManager, PaletteManager, ProjectsManager } from "@source/managers";
import { HistoryItem, MouseManager } from "@base/managers";
import { AppOption } from "@source/types/enums";
import { CanvasZoomable } from "@source/elements/canvas";
import { ProjectTabElement } from "@source/elements/tabs/ProjectTabElement";
import type { App } from "@source/App";
import { type PreviewLayer, type Layer } from "../layers";
import { LayersList, PaletteList } from "@source/elements/panels";

export class ProjectHistoryItem<T=any> extends HistoryItem<T, App> {
	readonly projectId: number;

	constructor(project: Project, title: string, data: T) {
		super(project.manager.app, title, data);

		this.projectId = project.id;
	}

	condition(): boolean {
	    return this.app.currentProject?.id !== this.projectId;
	}
}

export class Project {
	static _id = 0;
	static readonly DEFAULT_CANVAS_WIDTH = 256;
	static readonly DEFAULT_CANVAS_HEIGHT = 256;
	static readonly MAX_CANVAS_SIZE = 2048;
    
	readonly id: number;
    readonly manager: ProjectsManager;

	protected _isActive = false;

    readonly layers: LayersManager;
    readonly palette: PaletteManager;

    readonly canvasWidthState: State<number>;
    readonly canvasHeightState: State<number>;

	readonly canvasZoomable: CanvasZoomable;
	readonly layersList: LayersList;
	readonly paletteList: PaletteList;

    readonly onDidOpened = new Trigger<Project>();
    readonly onDidEntered = new Trigger<Project>();
    readonly onDidLeaved = new Trigger<Project>();
    readonly onDidClosed = new Trigger<Project>();

    constructor(manager: ProjectsManager) {
		this.id = ++ Project._id;
        this.manager = manager;

		this.canvasWidthState = new State(
			manager.app.getInt(AppOption.DEFAULT_CANVAS_WIDTH, Project.DEFAULT_CANVAS_WIDTH) 
		);
		this.canvasHeightState = new State(
			manager.app.getInt(AppOption.DEFAULT_CANVAS_HEIGHT, Project.DEFAULT_CANVAS_HEIGHT)
		);

        this.layers = new LayersManager(this);
        this.palette = new PaletteManager(this);

		this.canvasZoomable = new CanvasZoomable(this);
		this.layersList = new LayersList(this.layers);
		this.paletteList = new PaletteList(this.palette);
    }

	open(): boolean {
		return this.manager.open(this);
	}
	enter(): boolean {
		return this.manager.enter(this);
	}
	leave(): boolean {
		return this.manager.leave(this);
	}
	close(): boolean {
		return this.manager.close(this);
	}

	createTabElement(): HTMLElement {
		return new ProjectTabElement(this);
	}

    // On
    onOpen() {
        this.onDidOpened.trigger(this);
    }
    onClose() {
        this.onDidClosed.trigger(this);
    }
	onEnter() {
		this._isActive = true;
		this.onDidEntered.trigger(this);
	}
	onLeave() {
		this.canvasZoomable.remove();
		this._isActive = false;
		this.onDidLeaved.trigger(this);
	}
    
    // Set
    setCanvasSize(width: number, height: number): this {
        this.canvasWidthState.set(width);
        this.canvasHeightState.set(height);
        return this;
    }

    // Get
	get app(): App {
		return this.manager.app;
	}
    get canvasWidth() {
        return this.canvasWidthState.value;
    }
    get canvasHeight() {
        return this.canvasHeightState.value;
    }
	/** Alias to `project.layers.current` */
	get currentLayer(): Layer | null {
		return this.layers.current;
	}
    /** Alias to `project.layers.previewLayer` */
    get previewLayer(): PreviewLayer {
        return this.layers.previewLayer;
    }
	/** Is tab active */
	get isActive(): boolean {
		return this._isActive;
	}
	get toolMouse(): MouseManager {
		return this.canvasZoomable.toolMouse;
	}
}
