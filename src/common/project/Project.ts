import { State, Trigger } from "@base/common/listenable";
import App from "@source/App";
import LayersManager from "@source/managers/project/LayersManager";
import PaletteManager from "@source/managers/project/PaletteManager";
import type { ProjectTab } from "../tabs";
import type { ProjectTabView } from "@source/elements/tabs";
import type { CanvasZoomable } from "@source/elements/canvas";
import type PreviewLayer from "../layers/PreviewLayer";
import type { Layer } from "../layers";

export default class Project {
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
        this.onDidOpened.trigger(this);
    }
    onClose() {
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
	/** Alias to `project.layers.current` */
	get currentLayer(): Layer | null {
		return this.layers.current;
	}
    /** Alias to `project.layers.previewLayer` */
    get previewLayer(): PreviewLayer {
        return this.layers.previewLayer;
    }
}
