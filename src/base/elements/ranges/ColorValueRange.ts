import { State } from "@base/common/listenable";
import { Color } from "@base/common/misc";
import { ThumbRange } from "@base/elements/ranges";

@ThumbRange.define("color-value-range")
export default class ColorValueRange extends ThumbRange {
    constructor(hue: number, saturation: number, state?: State<number>) {
        super(state);

        this.classList.add("color-value-range");

        this.setClamp(0, 100);
        this.setStep(.1);
        this.update(hue, saturation);
    }

    update(hue: number, saturation: number) {
        const hsl = Color.convert.hsv.hsl([hue, saturation, 100]);
        this.style.setProperty("--data-color", `hsl(${ hsl[0] }, ${ hsl[1] }%, ${ hsl[2] }%)`);
    }
}
