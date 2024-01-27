import { Color } from "@base/common/misc";
import { BaseElement } from "..";
import { ColorState, State, Trigger } from "@base/common/listenable";
import { BaseRange, ColorValueRange, HueRange, SaturationRange } from "../ranges";
import { EventName } from "@base/types/enums";
import { DOM, Utils } from "@base/utils";
import { HsvColor } from "@base/types/types";

@BaseElement.define("color-picker")
export default class ColorPicker extends BaseElement {
    protected _tempColor: Color;
    protected _isChanging = false;

    readonly state: ColorState;
    
    // readonly hueState: State<number>;
    // readonly saturationState: State<number>;
    // readonly valueState: State<number>;

    readonly field: HTMLDivElement;
    readonly cursor: HTMLDivElement;
    readonly hueRange: HueRange;
    readonly saturationRange: SaturationRange;
    readonly valueRange: ColorValueRange;
    
    // readonly onDidChange = new Trigger<Color>();
    
    constructor(state?: ColorState) {
        super();

        this.state = state || new ColorState(Color.WHITE);
        this._tempColor = this.state.getColor();
        
        this.field = DOM.div("picker-field");
        this.cursor = DOM.div("cursor");
        this.hueRange = new HueRange();
        this.saturationRange = new SaturationRange(this.state.hue);
        this.valueRange = new ColorValueRange(this.state.hue, this.state.saturation);

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

    protected _updateCursor(saturation: number, value: number) {
        const x = saturation / 100;
        const y = 1 - value / 100;

        this.cursor.style.left = x * 100 + "%";
        this.cursor.style.top  = y * 100 + "%";
    }
    protected _updateCss(hue: number, saturation: number, value: number) {
        const color = Color.fromHsv([hue, saturation, value]);
        
        this.style.setProperty("--data-hue", hue.toString());
        this.style.setProperty("--data-color", color.getRgbString());
    }
    
    // On
    onMount(): void {
        super.onMount();
    
        this.listen(this.field, EventName.DOWN, this._onFieldDown.bind(this));
        this.listen(window, EventName.MOVE, this._onWindowMove.bind(this));
        this.listen(window, EventName.UP, this._onWindowUp.bind(this));

        this.listen(this.state, this._onColorChange.bind(this));
            
        this.listen(this.hueRange, EventName.CHANGE, this._onHueRangeChange.bind(this) as any);
        this.listen(this.saturationRange, EventName.CHANGE, this._onSaturationRangeChange.bind(this) as any);
        this.listen(this.valueRange, EventName.CHANGE, this._onValueRangeChange.bind(this) as any);
        this.listen(this.hueRange, EventName.INPUT, this._onHueRangeInput.bind(this) as any);
        this.listen(this.saturationRange, EventName.INPUT, this._onSaturationRangeInput.bind(this) as any);
        this.listen(this.valueRange, EventName.INPUT, this._onValueRangeInput.bind(this) as any);

        this._updateCss(this.hue, this.saturation, this.colorValue);
        this._updateCursor(this.saturation, this.colorValue);
    }
    
    protected _onFieldDown(event: PointerEvent) {
        this._isChanging = true;
        this.setColorFromMouse(event);
    }
    protected _onWindowMove(event: PointerEvent) {
        if (!this.isChanging) return;
        this.setColorFromMouse(event);
    }
    protected _onWindowUp(event: PointerEvent) {
        if (!this.isChanging) return;
        
        this._isChanging = false;
        this.state.set(this._tempColor);
    }

    protected _onColorChange(color: Color) {
        this._setTempColorHsv(color.hsv);
    }
    
    protected _onHueRangeChange(event: InputEvent) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;
        
        this.state.setHsv([target.value, this.saturation, this.colorValue]);
    }
    protected _onSaturationRangeChange(event: InputEvent) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;
        
        this.state.setHsv([this.hue, target.value, this.colorValue]);
    }
    protected _onValueRangeChange(event: InputEvent) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;
        
        this.state.setHsv([this.hue, this.saturation, target.value]);
    }
    protected _onHueRangeInput(event: InputEvent) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;

        this.saturationRange.update(target.value);
        this.valueRange.update(target.value, this.saturation);
        this._updateCss(target.value, this.saturation, this.colorValue);
    }
    protected _onSaturationRangeInput(event: InputEvent) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;

        this.valueRange.update(this.hue, target.value);
        this._updateCss(this.hue, target.value, this.colorValue);
        this._updateCursor(target.value, this.colorValue);
    }
    protected _onValueRangeInput(event: InputEvent) {
        const target = event.target;
        if (!(target instanceof BaseRange)) return;

        this._updateCss(this.hue, this.saturation, target.value);
        this._updateCursor(this.saturation, target.value);
    }

    // Set
    setColorFromMouse(event: MouseEvent) {
        const fieldBounds = this.field.getBoundingClientRect();
        
        let x = Utils.clamp((event.clientX - fieldBounds.left) / fieldBounds.width, 0, 1);
        let y = Utils.clamp((event.clientY - fieldBounds.top) / fieldBounds.height, 0, 1);
        
        this._setTempColorHsv([this.hue, x * 100, (1 - y) * 100]);
    }
    setColor(color: Color): this {
        this.state.set(color);

        return this;
    }
    protected _setTempColorHsv(hsv: HsvColor) {
        this._tempColor.setHsv(hsv);
        this._updateCursor(this.saturation, this.colorValue);
    }

    // Get
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
