import { BaseElement } from "@base/elements";

@BaseElement.define("palette-color")
export default class PaletteColorElement extends BaseElement {
    constructor() {
        super();

        this.classList.add("palette-color");
    }
}
