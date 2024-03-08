import AppElement from "@source/elements/AppElement";
import DragManager from "@base/managers/DragManager";
import { SelectionManager, TabsManager } from "@base/managers";
import { LayersRegistry, ToolsRegistry } from "@source/registries";
import { BrushesManager, PluginsManager, ProjectsManager, ToolsManager } from "./managers";
import type { Tool } from "./common/tools";
import type { RegisteredLayerCallback } from "./registries/LayersRegistry";
import { RegisteredToolCallback } from "./registries/ToolsRegistry";

export default class App {
    readonly toolsRegistry: ToolsRegistry;
    readonly layersRegistry: LayersRegistry;

    readonly tabs: TabsManager;
    readonly selection: SelectionManager;
    readonly drag: DragManager;
    readonly tools: ToolsManager;
    readonly brushes: BrushesManager;
    readonly projects: ProjectsManager;
    readonly plugins: PluginsManager;

    readonly element: AppElement;

    constructor() {
        this.toolsRegistry = new ToolsRegistry();
        this.layersRegistry = new LayersRegistry();

        this.tabs = new TabsManager();
        this.selection = new SelectionManager();
        this.drag = new DragManager();
        this.brushes = new BrushesManager(this);
        this.tools = new ToolsManager(this);
        this.projects = new ProjectsManager(this);
        this.plugins = new PluginsManager(this);

        this.element = new AppElement(this);
    }

    /** Alias to `app.toolsRegistries.register()` */
    registerTool(name: string, toolCallback: RegisteredToolCallback, override?: boolean): boolean {
        return this.toolsRegistry.register(name, toolCallback, override);
    }
    /** Alias to `app.layersRegistries.register()` */
    registerLayer(name: string, layerCallback: RegisteredLayerCallback, override?: boolean): boolean {
        return this.layersRegistry.register(name, layerCallback, override);
    }
}
