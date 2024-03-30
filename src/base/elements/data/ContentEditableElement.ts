import { EventName } from "@base/types/enums";
import { BaseElement } from "..";
import { KeyBind } from "@base/common/binds";

@BaseElement.define("content-editable")
export class ContentEditableElement extends BaseElement {
    allowNewLine = true;
    allowFormatting = true;
    allowPasteFormattedText = true;

    constructor() {
        super();

        this.contentEditable = "true";
		this.spellcheck = false;

        this.classList.add("content-editable");
    }

    onMount(): void {
        super.onMount();

        this.listen(this, EventName.KEY_DOWN, this._onKeyDown.bind(this));
        this.listen(this, EventName.PASTE, this._onPaste.bind(this));
    }
    protected _onKeyDown(event: KeyboardEvent) {
        if (!this.allowNewLine && KeyBind.ENTER.setGentle().test(event))
            event.preventDefault();

        if (
			!this.allowFormatting && (
			// TODO: make it simple
			KeyBind.B.setCtrl().test(event) ||
			KeyBind.I.setCtrl().test(event) ||
			KeyBind.U.setCtrl().test(event)
		)) event.preventDefault();
    }
    protected _onPaste(event: ClipboardEvent) {
        if (!this.allowPasteFormattedText) {
            event.preventDefault();

            // TODO: find another solution if exists (plain text paste)
            document.execCommand("insertHTML", false, event.clipboardData?.getData("text/plain") || "")
        }
    }
}
