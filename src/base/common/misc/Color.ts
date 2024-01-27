import { Random, ColorUtils } from "@base/utils";
import { HexColor, HslColor, HslStringColor, HsvColor, RgbColor, RgbStringColor } from "@base/types/types";

/** @deprecated */
export default class Color {
    protected _rgb: RgbColor;
    protected _hex: HexColor;
    protected _hsl: HslColor;
    protected _hsv: HsvColor;
    protected _alpha: number = 1;
    
    constructor(rgb: RgbColor) {
        this._rgb = rgb;
        this._hex = this.getHex();
        this._hsl = this.getHsl();
        this._hsv = this.getHsv();
    }

    copy(color: Color): this {
        this.setRgb([...color.rgb]);
        return this;
    }
    clone(): Color {
        return Color.from(this);
    }

    // Set
    setRgb(rgb: RgbColor): this {
        this._rgb = rgb;
        this._hex = this.getHex();
        this._hsl = this.getHsl();
        this._hsv = this.getHsv();
        return this;
    }
    setHex(hex: HexColor): this {
        this._rgb = ColorUtils.hexToRgb(hex);
        // TODO: format hex
        this._hex = hex;
        this._hsl = this.getHsl();
        this._hsv = this.getHsv();
        return this;
    }
    setHsl(hsl: HslColor): this {
        this._rgb = ColorUtils.hslToRgb(hsl);
        this._hex = this.getHex();
        this._hsl = hsl;
        this._hsv = this.getHsv();
        return this;
    }
    setHsv(hsv: HsvColor): this {
        this._rgb = ColorUtils.hsvToRgb(hsv);
        this._hex = this.getHex();
        this._hsl = this.getHsl();
        this._hsv = hsv;
        return this;
    }
    setAlpha(value: number): this {
        this._alpha = value;
        return this;
    }
    setRed(value: number): this {
        return this.setRgb([value, this.green, this.blue]);
    }
    setGreen(value: number): this {
        return this.setRgb([this.red, value, this.blue]);
    }
    setBlue(value: number): this {
        return this.setRgb([this.red, this.blue, value]);
    }
    setHue(value: number): this {
        return this.setHsv([value, this.saturation, this.value]);
    }
    setSaturation(value: number): this {
        return this.setHsv([this.hue, value, this.value]);
    }
    setValue(value: number): this {
        return this.setHsv([this.hue, this.saturation, value]);
    }

    // Get
    getHex(): HexColor {
        return ColorUtils.rgbToHex(this._rgb);
    }
    getHsl(): HslColor {
        return ColorUtils.rgbToHsl(this._rgb);
    }
    getHsv(): HsvColor {
        return ColorUtils.rgbToHsv(this._rgb);
    }

    /** @alias color.getRgbString() */
    getString(): RgbStringColor {
        return this.getRgbString();
    }
    getRgbString(): RgbStringColor {
        return ColorUtils.rgbToString(this._rgb) ;
    }
    getHslString(): HslStringColor {
        return ColorUtils.hslToString(this.getHsl());
    }

    get rgb(): RgbColor {
        return this._rgb.slice() as RgbColor;
    }
    get hex(): HexColor {
        return this._hex;
    }
    get hsl(): HslColor {
        return this._hsl.slice() as HslColor;
    }
    get hsv(): HsvColor {
        return this._hsv.slice() as HsvColor;
    }
    get red(): number {
        return this._rgb[0];
    }
    get green(): number {
        return this._rgb[1];
    }
    get blue(): number {
        return this._rgb[2];
    }
    get hue(): number {
        return this.hsv[0];
    }
    get saturation(): number {
        return this.hsv[1];
    }
    get value(): number {
        return this.hsv[2];
    }
    get alpha(): number {
        return this._alpha;
    }

    // Static
    static from(color: Color): Color {
        return new Color(color.rgb);
    }
    static random(): Color {
        return new Color([Random.int(0, 255), Random.int(0, 255), Random.int(0, 255)]);
    }
    static fromHex(hex: HexColor): Color {
        return new Color(ColorUtils.hexToRgb(hex));
    }
    static fromHsl(hsl: HslColor): Color {
        return new Color(ColorUtils.hslToRgb(hsl));
    }
    static fromHsv(hsv: HsvColor): Color {
        return new Color(ColorUtils.hsvToRgb(hsv));
    }
    static get BLACK(): Color {
        return new Color([0, 0, 0]);
    }
    static get WHITE(): Color {
        return new Color([255, 255, 255]);
    }
    static get RED(): Color {
        return new Color([255, 0, 0]);
    }
    static get GREEN(): Color {
        return new Color([0, 255, 0]);
    }
    static get BLUE(): Color {
        return new Color([0, 0, 255]);
    }
}
