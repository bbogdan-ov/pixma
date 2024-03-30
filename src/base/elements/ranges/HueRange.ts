import { State } from "@base/common/listenable";
import { ThumbRange } from "./ThumbRange";

@ThumbRange.define("hue-range")
export class HueRange extends ThumbRange {
    constructor(state?: State<number>) {
        super(state);

        this.classList.add("hue-range");

        this.setClamp(0, 360);
        this.setStep(.1);
    }
}
