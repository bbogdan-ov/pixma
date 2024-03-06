import { Trigger } from "@base/common/listenable";
import { Manager } from "@base/managers";
import { Utils } from "@base/utils";
import type App from "@source/App";
import type { Tool } from "@source/common/tools";

export default class ToolsManager extends Manager {
    readonly app: App;
    readonly tools: Record<string, Tool>;

    protected _current: Tool | null = null;

    readonly onDidAdded = new Trigger<Tool>();
    readonly onDidChosen = new Trigger<Tool>();
    readonly onDidUnchosen = new Trigger<Tool>();

    constructor(app: App) {
        super();

        this.app = app;
        this.tools = {};

        for (const name of app.toolsRegistry.getNames()) {
            const toolCallback = app.toolsRegistry.get(name);
            if (!toolCallback) continue;
            this.tools[name] = toolCallback(app);
        }

        const firstTool = Utils.getValueAt(this.tools, 0);
        if (firstTool)
            this.choose(firstTool);

        // If a new tool is registered, add this tool to the list
        app.toolsRegistry.onDidRegistered.listen(name=> {
            const tool = app.toolsRegistry.registered[name](app);
            this.tools[name] = tool;
            this.onDidAdded.trigger(tool);
        });
    }

    choose(tool: Tool): boolean {
        if (this._current === tool) return false;

        this.unchoose();

        this._current = tool;
        this._current.onChoose();

        this.onDidChosen.trigger(tool);
        return true;
    }
    unchoose(): boolean {
        if (!this._current) return false;

        this._current.onUnchoose();
        this.onDidUnchosen.trigger(this._current);
        this._current = null;

        return true;
    }

    // Get
    get current(): Tool | null {
        return this._current;
    }
}
