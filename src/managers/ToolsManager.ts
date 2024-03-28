import { Trigger } from "@base/common/listenable";
import { Manager } from "@base/managers";
import { Utils } from "@base/utils";
import type App from "@source/App";
import { EraseTool, PenTool, type Tool } from "@source/common/tools";

export default class ToolsManager extends Manager {
    readonly app: App;
    readonly tools: Record<string, Tool> = {};

    protected _current: Tool | null = null;

    readonly onDidRegistered = new Trigger<Tool>();
    readonly onDidChosen = new Trigger<Tool>();
    readonly onDidUnchosen = new Trigger<Tool>();

    constructor(app: App) {
        super();

        this.app = app;

		this.register(PenTool.NAME, 	new PenTool(app));
		this.register(EraseTool.NAME, 	new EraseTool(app));

        const firstTool = Utils.getValueAt(this.tools, 0);
        if (firstTool)
            this.choose(firstTool);
    }

	register(name: string, tool: Tool, override=false): boolean {
		// Register tool anyway if override is true
		if (!override && this.get(name)) return false;

		this.tools[name] = tool;
		tool.setup();
		this.onDidRegistered.trigger(tool);
		return true
	}
	get(name: string): Tool | null {
		return this.tools[name] || null;
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
