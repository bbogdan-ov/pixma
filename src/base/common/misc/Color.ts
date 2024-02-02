import { Random, ColorUtils, Utils } from "@base/utils";
import { HexColor, HslColor, HslStringColor, HsvColor, RgbColor, RgbStringColor } from "@base/types/types";

export default class Color {
    protected _red!: number;
    protected _green!: number;
    protected _blue!: number;
    protected _hue!: number;
    protected _saturation!: number;
    protected _value!: number;
    protected _hex!: HexColor;
    protected _alpha: number = 1;
    
    constructor(...rgb: RgbColor) {
        this.setRgb(...rgb);
    }

    copy(color: Color): this {
        this.setRgb(...color.rgb);
        return this;
    }
    clone(): Color {
        return Color.from(this);
    }

    // Set
    setRgb(...rgb: RgbColor): this {
        // TODO: clamp RGB

        this._red = rgb[0];
        this._green = rgb[1];
        this._blue = rgb[2];

        const hsv = this.getHsv();
        this._hue = hsv[0];
        this._saturation = hsv[1];
        this._value = hsv[2];
        
        this._hex = this.getHex();

        return this;
    }
    setHsv(...hsv: HsvColor): this {
        // TODO: clamp HSV

        const rgb = ColorUtils.hsvToRgb(hsv);
        this._red = rgb[0];
        this._green = rgb[1];
        this._blue = rgb[2];

        this._hue = hsv[0];
        this._saturation = hsv[1];
        this._value = hsv[2];

        this._hex = this.getHex();

        return this;
    }
    setHex(hex: HexColor): this {
        // TODO: format HEX

        const rgb = ColorUtils.hexToRgb(hex);
        this._red = rgb[0];
        this._green = rgb[1];
        this._blue = rgb[2];

        const hsv = this.getHsv();
        this._hue = hsv[0];
        this._saturation = hsv[1];
        this._value = hsv[2];

        this._hex = hex;

        return this;
    }
    setAlpha(value: number): this {
        this._alpha = Utils.clamp(value, 0, 1);
        return this;
    }
    setRed(value: number): this {
        return this.setRgb(value, this.green, this.blue);
    }
    setGreen(value: number): this {
        return this.setRgb(this.red, value, this.blue);
    }
    setBlue(value: number): this {
        return this.setRgb(this.red, this.blue, value);
    }
    setHue(value: number): this {
        return this.setHsv(value, this.saturation, this.value);
    }
    setSaturation(value: number): this {
        return this.setHsv(this.hue, value, this.value);
    }
    setValue(value: number): this {
        return this.setHsv(this.hue, this.saturation, value);
    }

    // Get
    getHex(): HexColor {
        return ColorUtils.rgbToHex(this.rgb);
    }
    getHsl(): HslColor {
        return ColorUtils.rgbToHsl(this.rgb);
    }
    getHsv(): HsvColor {
        return ColorUtils.rgbToHsv(this.rgb);
    }

    /** @alias color.getRgbString() */
    getString(): RgbStringColor {
        return this.getRgbString();
    }
    getRgbString(): RgbStringColor {
        return ColorUtils.rgbToString(this.rgb);
    }
    getHslString(): HslStringColor {
        return ColorUtils.hslToString(this.getHsl());
    }

    get rgb(): RgbColor {
        return [this.red, this.green, this.blue];
    }
    get hex(): HexColor {
        return this._hex;
    }
    get hsv(): HsvColor {
        return [this.hue, this.saturation, this.value];
    }
    get red(): number {
        return this._red;
    }
    get green(): number {
        return this._green;
    }
    get blue(): number {
        return this._blue;
    }
    get hue(): number {
        return this._hue;
    }
    get saturation(): number {
        return this._saturation;
    }
    get value(): number {
        return this._value;
    }
    get alpha(): number {
        return this._alpha;
    }

    // Static
    static from(color: Color): Color {
        return new Color(...color.rgb);
    }
    static random(): Color {
        return new Color(Random.int(0, 255), Random.int(0, 255), Random.int(0, 255));
    }
    static fromHex(hex: HexColor): Color {
        return new Color(...ColorUtils.hexToRgb(hex));
    }
    static fromHsl(hsl: HslColor): Color {
        return new Color(...ColorUtils.hslToRgb(hsl));
    }
    static fromHsv(hsv: HsvColor): Color {
        return new Color(...ColorUtils.hsvToRgb(hsv));
    }
    static get BLACK(): Color {
        return new Color(0, 0, 0);
    }
    static get WHITE(): Color {
        return new Color(255, 255, 255);
    }
    static get RED(): Color {
        return new Color(255, 0, 0);
    }
    static get GREEN(): Color {
        return new Color(0, 255, 0);
    }
    static get BLUE(): Color {
        return new Color(0, 0, 255);
    }
}
