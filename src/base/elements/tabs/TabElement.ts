import { DOM } from "@base/utils";
import { FocusableElement } from "../FocusableElement";
import { Button } from "../buttons";
import { EventName, IconName } from "@base/types/enums";

@FocusableElement.define("base-tab")
export class TabElement extends FocusableElement {
    readonly content = DOM.div("tab-content");
    readonly titleElement = DOM.span("Tab", "tab-title");
    readonly closeButton = Button.action(IconName.SMALL_CROSS);
        
    constructor() {
        super();

        this.classList.add("tab");

        this.content.append(this.titleElement);
        this.append(
            this.content,
            DOM.div("tab-close-button-wrapper",
                this.closeButton
            )
        )
    }

	enter() {}
	close() {}

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.content, EventName.POINTER_DOWN, this._onContentDown.bind(this));
        this.listen(this.closeButton, EventName.CLICK, this._onCloseButtonClick.bind(this));
    }
    protected _onInteract(event: KeyboardEvent): void {
        super._onInteract(event);

        this.enter();
    }
    protected _onContentDown() {
        this.enter();
    }
    protected _onCloseButtonClick() {
        this.close();
    }

    protected _onEnter() {
        this.classList.add("active");
    }
    protected _onLeave() {
        this.classList.remove("active");
    }
    protected _onClose() {
        this.remove();
    }

	// Set
    setTitle(value: string): this {
        this.titleElement.textContent = value;
        return this;
    }
}
