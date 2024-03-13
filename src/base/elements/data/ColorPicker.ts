import { Color } from "@base/common/misc";
import { BaseElement } from "..";
import { ColorState, State } from "@base/common/listenable";
import { BaseRange, ColorValueRange, HueRange, SaturationRange } from "../ranges";
import { EventName } from "@base/types/enums";
import { DOM, Utils } from "@base/utils";
import { HsvColor } from "@base/types/types";

@BaseElement.define("color-picker")
export default class ColorPicker extends BaseElement {
    protected _tempColor: Color;
    protected _isChanging = false;

    readonly state: ColorState;

    protected readonly _hueState: State<number>;
    protected readonly _saturationState: State<number>;
    protected readonly _valueState: State<number>;

    readonly field: HTMLDivElement;
    readonly cursor: HTMLDivElement;
    readonly hueRange: HueRange;
    readonly saturationRange: SaturationRange;
    readonly valueRange: ColorValueRange;
    
    constructor(state?: ColorState) {
        super();

        this.state = state || new ColorState(Color.WHITE);
        this._tempColor = this.state.color.clone();

        this._hueState = new State(this._tempColor.hue);
        this._saturationState = new State(this._tempColor.saturation);
        this._valueState = new State(this._tempColor.value);
        
        this.field = DOM.div("picker-field");
        this.cursor = DOM.div("cursor");
        this.hueRange = new HueRange(this._hueState);
        this.saturationRange = new SaturationRange(this.state.hue, this._saturationState);
        this.valueRange = new ColorValueRange(this.state.hue, this.state.saturation, this._valueState);

        this.classList.add("color-picker");

        this.field.append(DOM.div("hue-gradient"));
        this.field.append(DOM.div("saturation-gradient"));
        this.field.append(DOM.div("value-gradient"));
        this.field.append(this.cursor);
        this.append(
            this.field,
            DOM.div("picker-ranges",
                this.hueRange,
                this.saturationRange,
                this.valueRange
            )
        );
    }

    protected _updateCursor() {
        const x = this.saturation / 100;
        const y = 1 - this.colorValue / 100;

        this.cursor.style.left = x * 100 + "%";
        this.cursor.style.top  = y * 100 + "%";
    }
    protected _updateCss() {
        const color = Color.fromHsv([this.hue, this.saturation, this.colorValue]);
        
        this.style.setProperty("--data-hue", this.hue.toString());
        this.style.setProperty("--data-color", color.getRgbString());
    }
    protected _updateRanges() {
        this.saturationRange.update(this.hue);
        this.valueRange.update(this.hue, this.saturation);
        
        this._hueState.set(this.hue);
        this._saturationState.set(this.saturation);
        this._valueState.set(this.colorValue);
    }
    protected _updateState() {
        this.state.setHsv(this._tempColor.hsv);
    }
    
    // On
    onMount(): void {
        super.onMount();
    
        this.listen(this.field, EventName.DOWN, this._onFieldDown.bind(this));
        this.listen(window, EventName.MOVE, this._onWindowMove.bind(this));
        this.listen(window, EventName.UP, this._onWindowUp.bind(this));

        this.listen(this.hueRange, EventName.INPUT, this._onHueRangeInput.bind(this));
        this.listen(this.saturationRange, EventName.INPUT, this._onSaturationRangeInput.bind(this));
        this.listen(this.valueRange, EventName.INPUT, this._onValueRangeInput.bind(this));
        this.listen(this.hueRange, EventName.CHANGE, this._onHueRangeChange.bind(this));
        this.listen(this.saturationRange, EventName.CHANGE, this._onSaturationRangeChange.bind(this));
        this.listen(this.valueRange, EventName.CHANGE, this._onValueRangeChange.bind(this));

        this.listen(this.state, this._onColorChange.bind(this));

        this._setTempColorHsv(this.state.hsv);
            
        this._updateRanges();
    }
    
    protected _onChangeStart(event: PointerEvent) {
        this.setColorFromMouse(event);
    }
    protected _onChanging(event: PointerEvent) {
        this.setColorFromMouse(event);
    }
    protected _onChangeEnd(event: PointerEvent) {
        this._updateState();
    }

    protected _onFieldDown(event: PointerEvent) {
        this._isChanging = true;
        this._onChangeStart(event);
    }
    protected _onWindowMove(event: PointerEvent) {
        if (!this.isChanging) return;
        this._onChanging(event);
    }
    protected _onWindowUp(event: PointerEvent) {
        if (!this.isChanging) return;
        
        this._isChanging = false;
        this._onChangeEnd(event);
    }

    protected _onHueRangeInput(event: Event) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;

        this._setTempColorHsv([target.value, this.saturation, this.colorValue]);
    }
    protected _onSaturationRangeInput(event: Event) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;

        this._setTempColorHsv([this.hue, target.value, this.colorValue]);
    }
    protected _onValueRangeInput(event: Event) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;

        this._setTempColorHsv([this.hue, this.saturation, target.value]);
    }
    protected _onHueRangeChange(event: Event) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;

        this._setTempColorHsv([target.value, this.saturation, this.colorValue]);
        this._updateState();
    }
    protected _onSaturationRangeChange(event: Event) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;

        this._setTempColorHsv([this.hue, target.value, this.colorValue]);
        this._updateState();
    }
    protected _onValueRangeChange(event: Event) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;

        this._setTempColorHsv([this.hue, this.saturation, target.value]);
        this._updateState();
    }

    protected _onColorChange(color: Color) {
        this._setTempColorHsv(color.hsv);
    }
    
    // Set
    setColorFromMouse(event: MouseEvent) {
        const fieldBounds = this.field.getBoundingClientRect();
        
        let x = Utils.clamp((event.clientX - fieldBounds.left) / fieldBounds.width, 0, 1);
        let y = Utils.clamp((event.clientY - fieldBounds.top) / fieldBounds.height, 0, 1);
        
        this._setTempColorHsv([this.hue, x * 100, (1 - y) * 100]);
        this.saturationRange.setValue(this.saturation);
        this.valueRange.setValue(this.colorValue);
    }
    setColor(color: Color): this {
        this.state.setHsv(color.hsv);

        return this;
    }
    protected _setTempColorHsv(hsv: HsvColor) {
        this._tempColor.setHsv(...hsv);

        this._updateCursor();
        this._updateCss();
        this._updateRanges();
    }

    // Get
    /** Returns cloned protected `._tempColor`, so you cant mutate it */
    getColor(): Color {
        return this._tempColor.clone();
    }
    get hsv(): HsvColor {
        return this._tempColor.hsv;
    }
    get hue(): number {
        return this._tempColor.hue;
    }
    get saturation(): number {
        return this._tempColor.saturation;
    }
    get colorValue(): number {
        return this._tempColor.value;
    }
    get isChanging(): boolean {
        return this._isChanging;
    }
}
