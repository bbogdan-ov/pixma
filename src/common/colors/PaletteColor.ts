import { ColorState } from "@base/common/listenable";
import type { Color } from "@base/common/misc";

export default class PaletteColor {
    readonly state: ColorState;
    
    constructor(color: Color) {
        this.state = new ColorState(color);
    }

    // Set
    setColor(color: Color): this {
        this.state.set(color);
        return this;
    }

    // Get
    getColor() {
        return this.state.getColor();
    }
}
