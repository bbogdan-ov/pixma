import { AccentName, ColorName, EventName, SizeName } from "@base/types/enums";
import { ContentEditableElement } from "../data";
import { FocusableElement } from "..";
import { KeyboardData } from "@base/common/events";
import { KeyBind } from "@base/common/binds";
import { State } from "@base/common/listenable";
import { DOM } from "@base/utils";
import { IThemeColorful, IThemeResizeable } from "@base/types/types";

@FocusableElement.define("base-input")
export default class BaseInput<T extends string | number> extends FocusableElement implements IThemeColorful, IThemeResizeable {
    protected _maxLength = Infinity;

    readonly state: State<T>;

    protected _selectOnFocus = false;
    protected _color: ColorName | AccentName = AccentName.PRIMARY;
    protected _size: SizeName = SizeName.NORMAL;

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

    focus(options?: FocusOptions | undefined): void {
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

    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
    addEventListener(type: any, listener: any, options?: any): void {
        this.editable.addEventListener(type, listener, options);
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
        this.dispatchEvent(new InputEvent("input"));
    }
    protected _onChange(event: FocusEvent) {
        const value = this.applyToValue(this.formatValue(this.editable.textContent || ""));

        this.state.set(value);
        this._updateValueDisplay();

        this.dispatchEvent(new InputEvent("change"));
    }
    // override
    protected _onKeyDown(event: KeyboardEvent): void {
        const key = new KeyboardData(event);

        if (key.get(KeyBind.ENTER, KeyBind.ESCAPE)) {
            event.preventDefault();
            this.blur();
        }
    }

    protected _onFocus(event: FocusEvent): void {
        super._onFocus(event);

        if (this.selectOnFocus)
            DOM.selectContent(this.editable);
    }
    protected _onBlur(event: FocusEvent): void {
        super._onBlur(event);

        this._onChange(event);
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
    setSelectOnFocus(value=true): this {
        this._selectOnFocus = value;
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

    // Get
    get value(): T {
        return this.state.value;
    }
    get selectOnFocus(): boolean {
        return this._selectOnFocus;
    }
    get color(): ColorName | AccentName {
        return this._color;
    }
    get size(): SizeName {
        return this._size;
    }
}
