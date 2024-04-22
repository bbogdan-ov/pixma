import { Trigger } from "@base/common/listenable";
import { IconName } from "@base/types/enums";
import { ToolButton, ToolParams } from "@source/elements/tools";
import { KeymapBind } from "@base/managers/KeymapsManager";
import { AppActionAttachable, AppContainedAction, MouseData, type Command } from "@base/managers";
import { Draw } from "@source/utils";
import type { Layer } from "../layers";
import type { App } from "@source/App";

// Actions
export class ChooseToolAction extends AppContainedAction<App> {
	constructor(readonly tool: Tool, attachable: AppActionAttachable<App>) { super(attachable) }

	execute(command: Command): boolean {
	    super.execute(command);
		return this.app.tools.choose(this.tool);
	}
}

// Tool
export class Tool {
	readonly namespace: string;
    readonly name: string;
    readonly app: App;

    protected _isChosen = false;
    protected _isUsing = false;

    protected _iconName: IconName = IconName.PEN_TOOL;

    /** Cache params, so we dont need to create another one */
    protected _paramsElement: ToolParams | null = null;

    readonly onDidChosen = new Trigger<Tool>();
    readonly onDidUnchosen = new Trigger<Tool>();

    constructor(namespace: string, name: string, app: App) {
		this.namespace = namespace;
        this.name = name;
        this.app = app;
    }
    setup() {
		this._paramsElement = this.createParams();
    }

    choose(): boolean {
        return this.app.tools.choose(this);
    }
    unchoose(): boolean {
        return this.app.tools.unchoose();
    }
	/** Create a command and keymap for this tool */
	keymap(binds: KeymapBind | KeymapBind[]) {
		this.app.registerCommand(this.chooseCommandName)
		this.app.element.attachAction(this.chooseCommandName, new ChooseToolAction(this, this.app.element));
		this.app.registerKeymap(binds, this.chooseCommandName);
	}

    createButton(): HTMLElement {
        return new ToolButton(this).setIcon(this.iconName);
    }
    createParams(): ToolParams {
        return new ToolParams(this);
    }

    drawPreview(context: CanvasRenderingContext2D, mouse: MouseData) {
		Draw.pixel(context, Math.floor(mouse.pos.x), Math.floor(mouse.pos.y), 1, "#f00");
    }

    // On
    onDown(layer: Layer, mouse: MouseData) {
        this._isUsing = true;
		layer.startEdit(this.pushToHistory);
    }
    onUse(layer: Layer, mouse: MouseData) {}
    onMove(layer: Layer, mouse: MouseData) {
	}
    onUp(layer: Layer, mouse: MouseData) {
        this._isUsing = false;
		layer.endEdit();
    }
    onChoose() {
        this._isChosen = true;
        this.onDidChosen.trigger(this);
    }
    onUnchoose() {
        this._isChosen = false;
        this.onDidUnchosen.trigger(this);
    }

    // Get
    get isChosen(): boolean {
        return this._isChosen;
    }
    get isUsing(): boolean {
        return this._isUsing;
    }
	get chooseCommandName(): string {
		return `choose-${ this.name }-tool`;
	}
	get iconName(): IconName {
		return this._iconName;
	}
	get paramsElement(): ToolParams | null {
		return this._paramsElement;
	}
	get pushToHistory(): boolean {
		return true;
	}
}
