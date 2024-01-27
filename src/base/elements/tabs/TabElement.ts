import { DOM } from "@base/utils";
import { FocusableElement } from "..";
import type { Tab } from "@base/common/tabs";
import { Button } from "../buttons";
import { EventName, IconName } from "@base/types/enums";

@FocusableElement.define("base-tab")
export default class TabElement extends FocusableElement {
    readonly tab: Tab;

    protected readonly _content = DOM.div("tab-content");
    protected readonly _titleElement = DOM.span("", "tab-title");
    protected readonly _closeButton = Button.action(IconName.SMALL_CROSS);
        
    constructor(tab: Tab) {
        super();

        this.tab = tab;

        this.id = "tab-" + tab.id;
        this.classList.add("tab");

        this._content.append(this._titleElement);
        this.append(
            this._content,
            DOM.div("tab-close-button-wrapper",
                this._closeButton
            )
        )
    }

    setTitle(value: string): this {
        this._titleElement.textContent = value;
        return this;
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this._content, EventName.POINTER_DOWN, this._onContentDown.bind(this));
        this.listen(this._closeButton, EventName.CLICK, this._onCloseButtonClick.bind(this));

        this.listen(this.tab.titleState, this._onTabTitleChange.bind(this), true);

        this.listen(this.tab.onDidEntered, this._onTabEntered.bind(this));
        this.listen(this.tab.onDidLeaved, this._onTabLeaved.bind(this));
        this.listen(this.tab.onDidClosed, this._onTabClosed.bind(this));
    }
    protected _onInteract(event: KeyboardEvent): void {
        super._onInteract(event);

        this.tab.enter();
    }
    protected _onContentDown() {
        this.tab.enter();
    }
    protected _onCloseButtonClick() {
        this.tab.close();
    }

    protected _onTabTitleChange(value: string) {
        this.setTitle(value);
    }
    protected _onTabEntered() {
        this.classList.add("active");
    }
    protected _onTabLeaved() {
        this.classList.remove("active");
    }
    protected _onTabClosed() {
        this.remove();
    }
}
