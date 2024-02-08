import { HexColor, HsvColor, RgbColor } from "@base/types/types";
import { Listenable } from ".";
import { Color } from "../misc";
import { ListenableListener } from "./Listenable";

export default class ColorState extends Listenable<Color> {
    protected _color: Color;
    
    constructor(color: Color) {
        super();

        this._color = color;
    }

    listen(listener: ListenableListener<Color>, invoke?: boolean, key?: string | undefined, override?: boolean): VoidFunction {
        if (invoke)
            listener(this.getColor());
        
        return super.listen(listener, invoke, key, override);
    }
    notify(): this {
        return this._notify(this.getColor());
    }

    // Set
    /** Alias to `colorState.setColor()` */
    set(color: Color, notify=true): this {
        return this.setColor(color, notify);
    }
    setColor(color: Color, notify=true): this {
        this._color.copy(color);
        if (notify) this.notify();
        return this;
    }
    setRgb(rgb: RgbColor, notify=true): this {
        this._color.setRgb(...rgb);
        if (notify) this.notify();
        return this;
    }
    setHsv(hsv: HsvColor, notify=true): this {
        this._color.setHsv(...hsv);
        if (notify) this.notify();
        return this;
    }
    setHex(hex: HexColor, notify=true): this {
        this._color.setHex(hex);
        if (notify) this.notify();
        return this;
    }
    setRed(value: number, notify=true): this {
        this._color.setRed(value);
        if (notify) this.notify();
        return this;
    }
    setGreen(value: number, notify=true): this {
        this._color.setGreen(value);
        if (notify) this.notify();
        return this;
    }
    setBlue(value: number, notify=true): this {
        this._color.setBlue(value);
        if (notify) this.notify();
        return this;
    }
    setHue(value: number, notify=true): this {
        this._color.setHue(value);
        if (notify) this.notify();
        return this;
    }
    setSaturation(value: number, notify=true): this {
        this._color.setSaturation(value);
        if (notify) this.notify();
        return this;
    }
    setValue(value: number, notify=true): this {
        this._color.setValue(value);
        if (notify) this.notify();
        return this;
    }
    setAlpha(value: number, notify=true): this {
        this._color.setAlpha(value);
        if (notify) this.notify();
        return this;
    }
    
    // Get
    /** Returs cloned protected `._color`, so you cant mutate it */
    getColor(): Color {
        return this._color.clone();
    }
    get rgb(): RgbColor {
        return this._color.rgb;
    }
    get hsv(): HsvColor {
        return this._color.hsv;
    }
    get hex(): HexColor {
        return this._color.hex;
    }
    get red(): number {
        return this._color.red;
    }
    get green(): number {
        return this._color.green;
    }
    get blue(): number {
        return this._color.blue;
    }
    get hue(): number {
        return this._color.hue;
    }
    get saturation(): number {
        return this._color.saturation;
    }
    /** HSV value */
    get value(): number {
        return this._color.value;
    }
    get alpha(): number {
        return this._color.alpha;
    }
}
