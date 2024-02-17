import { Button } from "@base/elements/buttons";
import type App from "@source/App";
import type { Tool } from "@source/common/tools";

@Button.define("tool-button")
export default class ToolButton extends Button {
    readonly app: App;
    readonly tool: Tool;

    constructor(app: App, tool: Tool) {
        super();

        this.app = app;
        this.tool = tool;

        this.classList.add("tool-button", "no-anim", tool.name + "-tool-button");
        this.setIsActive(false);
    }

    protected _updateState() {
        this.setIsActive(this.tool.isChosen);
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.tool.onDidChosen, this._onToolChoose.bind(this));
        this.listen(this.tool.onDidUnchosen, this._onToolUnchoose.bind(this));

        this._updateState();
    }
    protected _onInteract(event: KeyboardEvent): void {
        super._onInteract(event);

        this.app.tools.choose(this.tool);
    }
    protected _onToolChoose() {
        this._updateState();
    }
    protected _onToolUnchoose() {
        this._updateState();
    }
    protected _onDown(event: MouseEvent): void {
        super._onDown(event);

        this.app.tools.choose(this.tool);
    }

    // Set
    setIsActive(value: boolean=true): this {
        // TODO: set color
        if (value) {
            this.setIsGhost(false);
        } else {
            this.setIsGhost(true);
        }
        return this;
    }
}
