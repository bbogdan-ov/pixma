import { HexColor, HslColor, HsvColor, RgbColor } from "@base/types/types";
import { Listenable } from ".";
import { Color } from "../misc";
import { ListenableListener } from "./Listenable";

/** @deprecated */
export default class ColorState extends Listenable<Color> {
    protected _color: Color;
    
    constructor(color: Color) {
        super();

        this._color = color;
    }

    listen(listener: ListenableListener<Color>, invoke?: boolean, key?: string | undefined, override?: boolean): VoidFunction {
        if (invoke)
            listener(this._color);

        return super.listen(listener, invoke, key, override);
    }
    notify(): this {
        return this._notify(this.getColor());
    }

    /** Alias to `colorState.setColor(color)` */
    set(color: Color, notify=true): this {
        return this.setColor(color, notify);
    }
    setColor(color: Color, notify=true): this {
        this._color.copy(color);
        if (notify) this.notify();
        return this;
    }
    setRgb(rgb: RgbColor, notify=true): this {
        this._color.setRgb(rgb);
        if (notify) this.notify();
        return this;
    }
    setHex(hex: HexColor, notify=true): this {
        this._color.setHex(hex);
        if (notify) this.notify();
        return this;
    }
    setHsl(hsl: HslColor, notify=true): this {
        this._color.setHsl(hsl);
        if (notify) this.notify();
        return this;
    }
    setHsv(hsv: HsvColor, notify=true): this {
        this._color.setHsv(hsv);
        if (notify) this.notify();
        return this;
    }

    getColor(): Color {
        return this._color.clone();
    }
    get rgb(): RgbColor {
        return this._color.rgb;
    }
    get hex(): HexColor {
        return this._color.hex;
    }
    get hsl(): HslColor {
        return this._color.hsl;
    }
    get hsv(): HsvColor {
        return this._color.hsv;
    }
    get red(): number {
        return this._color.red;
    }
    get blue(): number {
        return this._color.blue;
    }
    get green(): number {
        return this._color.green;
    }
    get hue(): number {
        return this._color.hue;
    }
    get saturation(): number {
        return this._color.saturation;
    }
    get colorValue(): number {
        return this._color.value;
    }
    get alpha(): number {
        return this._color.alpha;
    }
}
