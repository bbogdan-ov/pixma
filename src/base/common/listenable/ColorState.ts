import { HexColor, HslStringColor, HsvColor, RgbColor, RgbStringColor } from "@base/types/types";
import { Color } from "../misc";
import { Listenable, ListenableListener } from "./Listenable";

export class ColorState extends Listenable<Color> {
    readonly color: Color;
    
    constructor(color: Color) {
        super();

        this.color = color;
    }

    listen(listener: ListenableListener<Color>, invoke?: boolean, key?: string | undefined, override?: boolean): VoidFunction {
        if (invoke)
            listener(this.color);
        
        return super.listen(listener, invoke, key, override);
    }
    notify(): this {
        return this._notify(this.color);
    }

    // Set
    /** Alias to `colorState.setColor()` */
    set(color: Color, notify=true): this {
        return this.setColor(color, notify);
    }
    setColor(color: Color, notify=true): this {
        this.color.copy(color);
        if (notify) this.notify();
        return this;
    }
    setRgb(rgb: RgbColor, notify=true): this {
        this.color.setRgb(...rgb);
        if (notify) this.notify();
        return this;
    }
    setHsv(hsv: HsvColor, notify=true): this {
        this.color.setHsv(...hsv);
        if (notify) this.notify();
        return this;
    }
    setHex(hex: HexColor, notify=true): this {
        this.color.setHex(hex);
        if (notify) this.notify();
        return this;
    }
    setRed(value: number, notify=true): this {
        this.color.setRed(value);
        if (notify) this.notify();
        return this;
    }
    setGreen(value: number, notify=true): this {
        this.color.setGreen(value);
        if (notify) this.notify();
        return this;
    }
    setBlue(value: number, notify=true): this {
        this.color.setBlue(value);
        if (notify) this.notify();
        return this;
    }
    setHue(value: number, notify=true): this {
        this.color.setHue(value);
        if (notify) this.notify();
        return this;
    }
    setSaturation(value: number, notify=true): this {
        this.color.setSaturation(value);
        if (notify) this.notify();
        return this;
    }
    setValue(value: number, notify=true): this {
        this.color.setValue(value);
        if (notify) this.notify();
        return this;
    }
    setAlpha(value: number, notify=true): this {
        this.color.setAlpha(value);
        if (notify) this.notify();
        return this;
    }
    
    // Get
    getHexString(): HexColor {
        return this.color.getHex();
    }
    getRgbString(): RgbStringColor {
        return this.color.getRgbString();
    }
    getHslString(): HslStringColor {
        return this.color.getHslString();
    }
    get rgb(): RgbColor {
        return this.color.rgb;
    }
    get hsv(): HsvColor {
        return this.color.hsv;
    }
    get hex(): HexColor {
        return this.color.hex;
    }
    get red(): number {
        return this.color.red;
    }
    get green(): number {
        return this.color.green;
    }
    get blue(): number {
        return this.color.blue;
    }
    get hue(): number {
        return this.color.hue;
    }
    get saturation(): number {
        return this.color.saturation;
    }
    /** HSV value */
    get value(): number {
        return this.color.value;
    }
    get alpha(): number {
        return this.color.alpha;
    }
	get isTransparent(): boolean {
		return this.color.isTransparent;
	}

	// Static
	static get TRANSPARENT(): ColorState {
		return new ColorState(Color.TRANSPARENT);
	}
}
