import AppElement from "@source/elements/AppElement";
import DragManager from "@base/managers/DragManager";
import { SelectionManager, TabsManager } from "@base/managers";
import { LayersRegistry, ToolsRegistry } from "@source/registries";
import { BrushesManager, PluginsManager, ProjectsManager, ToolsManager } from "./managers";
import type { Tool } from "./common/tools";
import type { RegisteredLayerCallback } from "./registries/LayersRegistry";

export default class App {
    readonly tabs: TabsManager;
    readonly selection: SelectionManager;
    readonly drag: DragManager;
    readonly tools: ToolsManager;
    readonly brushes: BrushesManager;
    readonly projects: ProjectsManager;
    readonly plugins: PluginsManager;

    readonly registries = {
        tools: new ToolsRegistry(this),
        layers: new LayersRegistry()
    }

    readonly element: AppElement;

    constructor() {
        this.tabs = new TabsManager();
        this.selection = new SelectionManager();
        this.drag = new DragManager();
        this.tools = new ToolsManager(this);
        this.brushes = new BrushesManager(this);
        this.projects = new ProjectsManager(this);
        this.plugins = new PluginsManager(this);

        this.element = new AppElement(this);
    }

    /** Alias to `app.registries.tools.register()` */
    registerTool(name: string, tool: Tool, override?: boolean): boolean {
        return this.registries.tools.register(name, tool, override);
    }
    /** Alias to `app.registries.layers.register()` */
    registerLayer(name: string, layerCallback: RegisteredLayerCallback, override?: boolean): boolean {
        return this.registries.layers.register(name, layerCallback, override);
    }
}
