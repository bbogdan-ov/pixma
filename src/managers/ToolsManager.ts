import { Trigger } from "@base/common/listenable";
import { Manager } from "@base/managers";
import type App from "@source/App";
import type { Tool } from "@source/common/tools";

export default class ToolsManager extends Manager {
    readonly app: App;

    protected _current: Tool | null = null;

    readonly onDidChosen = new Trigger<Tool>();
    readonly onDidUnchosen = new Trigger<Tool>();

    constructor(app: App) {
        super();

        this.app = app;
        
        const tool = app.toolsRegistry.getFirstItem();
        if (tool)
            this.choose(tool);
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
