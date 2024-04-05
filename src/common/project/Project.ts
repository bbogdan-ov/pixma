import { State, Trigger } from "@base/common/listenable";
import { LayersManager, PaletteManager } from "@source/managers";
import type { App } from "@source/App";
import type { ProjectTab } from "../tabs";
import type { ProjectTabView } from "@source/elements/tabs";
import type { CanvasZoomable } from "@source/elements/canvas";
import type { PreviewLayer, Layer } from "../layers";
import { MouseManager } from "@base/managers";

export class Project {
	static _id = 0;
    static readonly DEFAULT_CANVAS_WIDTH = 416;
    static readonly DEFAULT_CANVAS_HEIGHT = 240;
    
	readonly id: number;
    readonly app: App;
    readonly titleState: State<string>;
    protected _tab: ProjectTab | null = null;

    readonly layers: LayersManager;
    readonly palette: PaletteManager;

    readonly canvasWidthState = new State<number>(Project.DEFAULT_CANVAS_WIDTH);
    readonly canvasHeightState = new State<number>(Project.DEFAULT_CANVAS_HEIGHT);

    readonly onDidOpened = new Trigger<Project>();
    readonly onDidEntered = new Trigger<Project>();
    readonly onDidLeaved = new Trigger<Project>();
    readonly onDidClosed = new Trigger<Project>();

    constructor(app: App, title: string) {
		this.id = ++ Project._id;
        this.app = app;
        this.titleState = new State(title);

        this.layers = new LayersManager(this);
        this.palette = new PaletteManager(this);
    }

    attachTab(tab: ProjectTab): this {
        if (this._tab) return this;
        this._tab = tab;
        return this;
    }

    // On
    onOpen() {
		this.app.projects.onOpen(this);
        this.onDidOpened.trigger(this);
    }
	onEnter() {
		this.app.projects.onEnter(this);
		this.onDidEntered.trigger(this);
	}
	onLeave() {
		this.app.projects.onLeave(this);
		this.onDidLeaved.trigger(this);
	}
    onClose() {
		this.app.projects.onClose(this);
        this.onDidClosed.trigger(this);
    }
    
    // Set
    setCanvasSize(width: number, height: number): this {
        this.canvasWidthState.set(width);
        this.canvasHeightState.set(height);
        return this;
    }

    // Get
    get title(): string {
        return this.titleState.value;
    }
    get canvasWidth() {
        return this.canvasWidthState.value;
    }
    get canvasHeight() {
        return this.canvasHeightState.value;
    }
    get tab(): ProjectTab | null {
        return this._tab;
    }
    /** Alias to `project.tab.viewElement` */
    get tabView(): ProjectTabView | null {
        return this.tab?.viewElement ?? null;
    }
    /** Alias to `project.tab.viewElement.canvasZoomable` */
    get canvasZoomable(): CanvasZoomable | null {
        return this.tabView?.canvasZoomable ?? null;
    }
    /** Alias to `project.tab.viewElement.canvasZoomable.toolMouse` */
	get toolMouse(): MouseManager | null {
		return this.canvasZoomable?.toolMouse ?? null;
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
		return this.tab?.isActive ?? false;
	}
}
