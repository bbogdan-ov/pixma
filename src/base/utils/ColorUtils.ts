import { HexColor, HslColor, HslStringColor, HslaColor, HslaStringColor, HsvColor, HsvaColor, RgbColor, RgbStringColor, RgbaColor, RgbaStringColor } from "@base/types/types";
import convert from "color-convert";

export default class ColorUtils {
    static compareHex(a: HexColor, b: HexColor): boolean {
        return this.formatHex(a) == this.formatHex(b);
    }
    static compareRgb(a: RgbaColor | RgbColor, b: RgbaColor | RgbColor): boolean {
        let alpha = true;
        if (a[3] !== undefined && b[3] !== undefined)
            alpha = a[3] == b[3];
        return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && alpha;
    }
    static compareHsl(a: HslaColor | HslColor, b: HslaColor | HslColor): boolean {
        let alpha = true;
        if (a[3] !== undefined && b[3] !== undefined)
            alpha = a[3] == b[3];
        return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && alpha;
    }
    static compareHsv(a: HsvaColor | HsvColor, b: HsvaColor | HsvColor): boolean {
        let alpha = true;
        if (a[3] !== undefined && b[3] !== undefined)
            alpha = a[3] == b[3];
        return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && alpha;
    }

    // TODO
    static formatHex(hex: string): HexColor {
        if (hex.charAt(0) != "#")
            hex = "#" + hex;
        
        return hex.slice(0, 7).toUpperCase() as HexColor;
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
    
    static rgbToHex(rgb: RgbColor): HexColor {
        return this.formatHex(convert.rgb.hex(rgb));
    }
    static rgbToHsl(rgb: RgbColor): HslColor {
        return convert.rgb.hsl(rgb);
    }
    static rgbToHsv(rgb: RgbColor): HsvColor {
        return convert.rgb.hsv(rgb);
    }
    static hexToRgb(hex: HexColor): RgbColor {
        return convert.hex.rgb(this.formatHex(hex));
    }
    static hslToRgb(hsl: HslColor): RgbColor {
        return convert.hsl.rgb(hsl);
    }
    static hsvToRgb(hsv: HsvColor): RgbColor {
        return convert.hsv.rgb(hsv);
    }
    static hsvToHsl(hsv: HsvColor): HslColor {
        return convert.hsv.hsl(hsv);
    }
}
