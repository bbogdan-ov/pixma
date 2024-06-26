import { State } from "@base/common/listenable";
import { ThumbRange } from "./ThumbRange";

@ThumbRange.define("saturation-range")
export class SaturationRange extends ThumbRange {
    constructor(hue: number, state?: State<number>) {
        super(state);

        this.classList.add("saturation-range");

        this.setClamp(0, 100);
        this.setStep(.1);
        this.update(hue);
    }

    update(hue: number) {
        this.style.setProperty("--data-color", `hsl(${ hue }, 100%, 50%)`);
    }
}
