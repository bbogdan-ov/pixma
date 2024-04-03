import { Random, Utils } from "@base/utils";
import { ArrayColor, HexColor, HslColor, HslStringColor, HslaColor, HslaStringColor, HsvColor, RgbColor, RgbStringColor, RgbaColor, RgbaStringColor } from "@base/types/types";
import convert from "color-convert";

// I love enums in rust so fckn much!!!
// I CAN'T LIVE WITHOUT THEM
// MICROSOFT, PLEASE ADD THESE ENUMS INTO TYPESCRIPT!
export class Color {
    protected _red!: number;
    protected _green!: number;
    protected _blue!: number;
    protected _hue!: number;
    protected _saturation!: number;
    protected _value!: number;
    protected _hex!: HexColor;
    protected _alpha: number;
    
    constructor(red: number, green: number, blue: number, alpha=1) {
        this.setRgb(red, green, blue);

        this._alpha = alpha;
    }

    copy(color: Color, ignoreAlpha=false): this {
        this.setRgb(...color.rgb);
		if (!ignoreAlpha)
			this.setAlpha(color.alpha);
        return this;
    }
    clone(): Color {
        return Color.from(this);
    }

	compareHsl(color: Color, ignoreAlpha=false): boolean {
		let isAlphaEq = true;

		if (!ignoreAlpha)
			isAlphaEq = this.alpha == color.alpha;

		return (
			this.hue == color.hue &&
			this.saturation == color.saturation &&
			this.value == color.value &&
			isAlphaEq
		);
	}
	compareRgb(color: Color, ignoreAlpha=false): boolean {
		let isAlphaEq = true;

		if (!ignoreAlpha)
			isAlphaEq = this.alpha == color.alpha;

		return (
			this.red == color.red &&
			this.green == color.green &&
			this.blue == color.blue &&
			isAlphaEq
		);
	}

    // Set
    setRgb(red: number, green: number, blue: number, alpha=1): this {
        this._red = Utils.clamp(red, 0, 255);
        this._green = Utils.clamp(green, 0, 255);
        this._blue = Utils.clamp(blue, 0, 255);

        const hsv = this.getHsv();
        this._hue = hsv[0];
        this._saturation = hsv[1];
        this._value = hsv[2];
        
        this._hex = this.getHex();

		this.setAlpha(alpha);
        return this;
    }
    setHsv(hue: number, saturation: number, value: number, alpha=1): this {
		hue = Utils.clamp(hue, 0, 360);
		saturation = Utils.clamp(saturation, 0, 100);
		value = Utils.clamp(value, 0, 100);

        const rgb = Color.convert.hsv.rgb([hue, saturation, value]);
        this._red = rgb[0];
        this._green = rgb[1];
        this._blue = rgb[2];

        this._hue = hue;
        this._saturation = saturation;
        this._value = value;

        this._hex = this.getHex();

        return this;
    }
    setHex(hex: HexColor): this {
        hex = Color.formatHex(hex);

        const rgb = Color.convert.hex.rgb(hex);
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
	/** Calculate and return HEX */
    getHex(): HexColor {
        return Color.formatHex(Color.convert.rgb.hex(this.rgb));
    }
	/** Calculate and return HSL */
    getHsl(): HslColor {
        return Color.convert.rgb.hsl(this.rgb);
    }
	/** Calculate and return HSV */
    getHsv(): HsvColor {
        return Color.convert.rgb.hsv(this.rgb);
    }

    /** Alias to `color.getRgbString()` */
    getString(): RgbStringColor {
        return this.getRgbString();
    }
    getRgbString(): RgbStringColor {
        return Color.rgbToString(this.rgb);
    }
    getHslString(): HslStringColor {
        return Color.hslToString(this.getHsl());
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
    get isTransparent(): boolean {
        return this.alpha == 0;
    }

    // Static
    static from(color: Color): Color {
        return new Color(...color.rgb).setAlpha(color.alpha);
    }
    /** Generates random RGB color */
    static random(): Color {
        return new Color(Random.int(0, 255), Random.int(0, 255), Random.int(0, 255));
    }
    static fromHex(hex: HexColor): Color {
        return new Color(...Color.convert.hex.rgb(hex));
    }
    static fromHsl(hsl: HslColor): Color {
        return new Color(...Color.convert.hsl.rgb(hsl));
    }
    static fromHsv(hsv: HsvColor): Color {
        return new Color(...Color.convert.hsv.rgb(hsv));
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
    static get TRANSPARENT(): Color {
        return new Color(0, 0, 0, 0);
    }

    // Utils
    static compare(a: ArrayColor, b: ArrayColor): boolean {
        let alpha = true;
        if (a[3] !== undefined && b[3] !== undefined)
            alpha = a[3] == b[3];
        return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && alpha;
    }
    static compareHex(a: HexColor, b: HexColor): boolean {
        return this.formatHex(a) == this.formatHex(b);
    }

    static formatHex(hex: string): HexColor {
        if (!hex || hex.length == 0)
            return "#000000";

        hex = hex.replace(/#|[^a-f|1-9|0]/gmi, "");

        if (hex.length == 0) {
            hex = "000000";
        } else if (hex.length == 1) {
            hex = hex.repeat(6);
        } else if (hex.length == 2) {
            hex = hex.repeat(3);
        } else if (hex.length == 3) {
            hex = hex[0].repeat(2) + hex[1].repeat(2) + hex[2].repeat(2);
        } else { 
			hex += hex[hex.length-1].repeat(2);
		}
        
        hex = hex.slice(0, 6);
        return "#" + hex.toUpperCase() as HexColor;
    }
    static rgbToString(rgb: RgbColor): RgbStringColor;
    static rgbToString(rgb: RgbaColor): RgbaStringColor;
    static rgbToString(rgb: RgbColor | RgbaColor): RgbStringColor | RgbaStringColor {
        let alpha = rgb[3];
        if (alpha !== undefined)
            return `rgba(${ rgb[0] }, ${ rgb[1] }, ${ rgb[2] }, ${ alpha })`;
        else
            return `rgb(${ rgb[0] }, ${ rgb[1] }, ${ rgb[2] })`;
    }
    static hslToString(hsl: HslColor): HslStringColor;
    static hslToString(hsl: HslaColor): HslaStringColor;
    static hslToString(hsl: HslColor | HslaColor): HslStringColor | HslaStringColor {
        let alpha = hsl[3];
        if (alpha !== undefined)
            return `hsla(${ hsl[0] }, ${ hsl[1] }, ${ hsl[2] }, ${ alpha })`;
        else
            return `hsl(${ hsl[0] }, ${ hsl[1] }, ${ hsl[2] })`;
    }
    
    static get convert() {
        return convert;
    }
}
