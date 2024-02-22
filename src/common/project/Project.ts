import { State, Trigger } from "@base/common/listenable";
import App from "@source/App";
import LayersManager from "@source/managers/project/LayersManager";
import PaletteManager from "@source/managers/project/PaletteManager";
import type { ProjectTab } from "../tabs";

export default class Project {
    static readonly DEFAULT_CANVAS_WIDTH = 416;
    static readonly DEFAULT_CANVAS_HEIGHT = 240;
    
    readonly app: App;
    readonly title: string;
    protected _tab: ProjectTab | null = null;

    readonly layers: LayersManager;
    readonly palette: PaletteManager;

    readonly canvasWidthState = new State<number>(Project.DEFAULT_CANVAS_WIDTH);
    readonly canvasHeightState = new State<number>(Project.DEFAULT_CANVAS_HEIGHT);

    readonly onDidOpened = new Trigger<Project>();
    readonly onDidClosed = new Trigger<Project>();

    constructor(app: App, title: string) {
        this.app = app;
        this.title = title;

        this.layers = new LayersManager(this);
        this.layers.setup();
        this.palette = new PaletteManager(this);
    }

    attachTab(tab: ProjectTab): this {
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
    get canvasWidth() {
        return this.canvasWidthState.value;
    }
    get canvasHeight() {
        return this.canvasHeightState.value;
    }
    get tab(): ProjectTab | null {
        return this._tab;
    }
}
