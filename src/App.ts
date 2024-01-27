import { SelectionManager, TabsManager } from "@base/managers";
import AppElement from "@source/elements/AppElement";
import { ToolsRegistry } from "@source/registries";
import { BrushesManager, ProjectsManager, ToolsManager } from "./managers";
import DragManager from "@base/managers/DragManager";

export default class App {
    readonly tabs: TabsManager;
    readonly selection: SelectionManager;
    readonly drag: DragManager;
    readonly tools: ToolsManager;
    readonly brushes: BrushesManager;
    readonly projects: ProjectsManager;

    readonly registries = {
        tools: new ToolsRegistry()
    }

    readonly element: AppElement;

    constructor() {
        this.tabs = new TabsManager();
        this.selection = new SelectionManager();
        this.drag = new DragManager();
        this.tools = new ToolsManager(this);
        this.brushes = new BrushesManager(this);
        this.projects = new ProjectsManager(this);

        this.element = new AppElement(this);
    }
}
