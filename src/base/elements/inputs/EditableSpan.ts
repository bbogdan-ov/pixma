import { State } from "@base/common/listenable";
import { BaseInput, TextInput } from ".";
import { BaseElement } from "..";
import { DOM } from "@base/utils";
import { EventName } from "@base/types/enums";
import { StateValueContained } from "@base/types/types";

@BaseElement.define("editable-span")
export class EditableSpan
	extends BaseElement
	implements StateValueContained<string>
{
	protected _isEditing = false;

	readonly input: BaseInput<string>;
	readonly span = DOM.span("", "editable-span");

	constructor(state?: State<string> | null, input?: BaseInput<string>) {
		super();

		this.input = input ?? new TextInput(state ?? undefined);
		this.input.classList.add("editable-input");

		this.classList.add("editable");

		this.append(this.input);
		this.append(this.span);
	}

	startEdit(): boolean {
		this._isEditing = true;

		this._updateEditingState();
		this._onEditStart();

		this.input.focus();

		return true;
	}
	endEdit(): boolean {
		if (!this.isEditing) return false;

		this._isEditing = false;
		this._updateEditingState();
		this._onEditEnd();
		return true;
	}

	protected _updateSpanText() {
		this.span.textContent = this.value.toString();
	}
	protected _updateEditingState() {
		this.classList.toggle("editing", this.isEditing);
	}

	// On
	onMount(): void {
	    super.onMount();

		this.listen(this.state, this._onValueChange.bind(this));
		
		this.listen(this.input, EventName.INPUT, this._onInput.bind(this));
		this.listen(this.input, EventName.CHANGE, this._onChange.bind(this));
		this.listen(this.input, EventName.BLUR, this._onBlur.bind(this));

		this._updateSpanText();
	}

	protected _onValueChange(value: string) {
		this._updateSpanText();
	}

	protected _onEditStart() {
		this.dispatchEvent(new Event(EventName.EDIT_START));
	}
	protected _onEditEnd() {
		this.dispatchEvent(new Event(EventName.EDIT_END));
	}
	protected _onInput(event: Event) {
		this.dispatchEvent(new InputEvent(EventName.INPUT));
	}
	protected _onChange(event: Event) {
		this.endEdit();
		this.dispatchEvent(new InputEvent(EventName.CHANGE));
	}
	protected _onBlur(event: FocusEvent) {
		this.endEdit();
	}

	// Set
	set selectOnFocus(value: boolean) {
		this.input.selectOnFocus = value;
	}

	// Get
	get isEditing(): boolean {
		return this._isEditing;
	}
	get state(): State<string> {
		return this.input.state;
	}
	get value(): string {
		return this.state.value;
	}
}
