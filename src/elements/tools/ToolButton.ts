import { Button } from "@base/elements/buttons";
import { AccentName } from "@base/types/enums";
import type { Tool } from "@source/common/tools";

@Button.define("tool-button")
export default class ToolButton extends Button {
    readonly tool: Tool;

    constructor(tool: Tool) {
        super();

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

        this.tool.choose();
    }
    protected _onToolChoose() {
        this._updateState();
    }
    protected _onToolUnchoose() {
        this._updateState();
    }
    protected _onDown(event: MouseEvent): void {
        super._onDown(event);

        this.tool.choose();
    }

    // Set
    setIsActive(value: boolean=true): this {
        if (value) {
            this.setColor(AccentName.PRIMARY);
            this.setIsGhost(false);
        } else {
            this.setColor(AccentName.SECONDARY);
            this.setIsGhost(true);
        }
        return this;
    }
}
