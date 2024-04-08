import { AccentName, ColorName, EventName, SizeName } from "@base/types/enums";
import { ContentEditableElement } from "../data";
import { BaseElement } from "..";
import { KeyBind } from "@base/common/binds";
import { State } from "@base/common/listenable";
import { DOM } from "@base/utils";
import { ThemeColorful, ThemeResizeable, StateValueContained, Focusable } from "@base/types/types";

@BaseElement.define("base-input")
export class BaseInput<T extends string | number>
	extends BaseElement
	implements StateValueContained<T>, ThemeColorful, ThemeResizeable, Focusable
{
    readonly state: State<T>;

	protected _isFocused = false;
	protected _isChanged = false;

	selectOnFocus = false;

    protected _maxLength = Infinity;
    protected _color: ColorName | AccentName = AccentName.PRIMARY;
    protected _size: SizeName = SizeName.NORMAL;

	protected _label: HTMLDivElement | null = null;
    readonly editable = new ContentEditableElement();

    constructor(defaultValue: T, state?: State<T>) {
        super();
        this.state = state || new State(defaultValue);

        this.editable.allowNewLine = false;
        this.editable.allowFormatting = false;
        this.editable.allowPasteFormattedText = false;

        this.classList.remove("focusable");
        this.classList.add("input");
        this.removeAttribute("tabindex");

        this.append(this.editable);
    }

    focus(options?: FocusOptions): void {
        this.editable.focus(options);
    }
    blur(): void {
        this.editable.blur();
    }

    applyToValue(value: T): T {
        return value;
    }
    formatValue(value: string | number): T {
        return value as T;
    }
    formatDisplayValue(value: T): string {
        return value.toString();
    }

	protected _updateState() {
        const value = this.applyToValue(this.formatValue(this.editable.textContent || ""));
        this.state.set(value);
	}
    protected _updateValueDisplay() {
        this.setDisplay(this.value);
    }

    // On
    // override
    onMount(): void {
        this.listen(this.state, this._onValueChange.bind(this));

        this.listen(this.editable, EventName.INPUT, this._onInput.bind(this));
        this.listen(this.editable, EventName.FOCUS, this._onFocus.bind(this));
        this.listen(this.editable, EventName.BLUR, this._onBlur.bind(this));
        this.listen(this.editable, EventName.KEY_DOWN, this._onKeyDown.bind(this));

        this._updateValueDisplay();
    }
    
    protected _onValueChange(value: T) {
        this._updateValueDisplay();
    }

    protected _onInput(event: Event) {
        this.dispatchEvent(new InputEvent(EventName.INPUT));
    }
    protected _onChange(event: Event) {
		this._updateState();
        this._updateValueDisplay();
        this.dispatchEvent(new InputEvent(EventName.CHANGE));
    }
	protected _onCancel(event: Event) {
        this._updateValueDisplay();
        this.dispatchEvent(new InputEvent(EventName.CHANGE));
        this.dispatchEvent(new InputEvent(EventName.CHANGE_CANCEL));
	}
    // override
    protected _onKeyDown(event: KeyboardEvent): void {
		event.stopPropagation();

		if (KeyBind.ENTER.test(event))
			this._isChanged = true;
		else if (KeyBind.ESCAPE.test(event)) {
			// just blur
		} else
			return;

		event.preventDefault();
		this.blur();
    }

    protected _onFocus(event: FocusEvent): void {
		this._isFocused = true;

        if (this.selectOnFocus)
            DOM.selectContent(this.editable);
    }
    protected _onBlur(event: FocusEvent): void {
		this._isFocused = false;

		if (this._isChanged)
			this._onChange(event);
		else
			this._onCancel(event);

		this._isChanged = false;
    }

    // Set
    setValue(value: T): this {
        this.state.set(this.applyToValue(value));
        return this;
    }
    setMaxLength(value: number): this {
        this._maxLength = value;
        return this;
    }
    setWidth(value: string | number): this {
        return this.setStyle("width", value);
    }
    setDisplay(value: T): this {
        this.editable.textContent = this.formatDisplayValue(this.applyToValue(value));
        return this;
    }
    setColor(name: ColorName | AccentName): this {
        this.replaceClassName(`color-${ this.color }`, `color-${ name }`);
        this._color = name;
        return this;
    }
    setSize(name: SizeName): this {
        this.replaceClassName(`size-${ this.size }`, `size-${ name }`);
        this._size = name;
        return this;
    }
	/**
	 * Set label's text is `value` is string
	 * To remove label set `value` to `null`
	 */
	setLabel(value: string | null): this {
		if (value === null) {
			this.label?.remove();
			this._label = null;
			return this;
		}

		if (!this.label) {
			this._label = DOM.div("input-label");
			this.prepend(this._label);
		}

		this.label!.textContent = value;
		return this;
	}

    // Get
    get value(): T {
        return this.state.value;
    }
    get color(): ColorName | AccentName {
        return this._color;
    }
    get size(): SizeName {
        return this._size;
    }
	get label(): HTMLDivElement | null {
		return this._label;
	}
	get isFocused(): boolean {
		return this._isFocused;
	}
}
