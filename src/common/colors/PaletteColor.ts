import { ColorState, Trigger } from "@base/common/listenable";
import { Color } from "@base/common/misc";
import { PaletteColorElement } from "@source/elements/colors";
import type { HexColor, HslColor, HsvColor } from "@base/types/types";
import type PaletteManager from "@source/managers/project/PaletteManager";

export default class PaletteColor {
    readonly manager: PaletteManager;
    readonly state: ColorState;

    readonly onDidAdded = new Trigger<PaletteColor>();
    readonly onDidRemoved = new Trigger<PaletteColor>();
    
    constructor(manager: PaletteManager, color: Color) {
        this.manager = manager;
        this.state = new ColorState(color);
    }

    pick(): this {
        this.manager.project.app.brushes.setFrontColor(this.getColor());
        return this;
    }
    remove(): boolean {
        return this.manager.remove(this);
    }

    createElement(): HTMLElement {
        return new PaletteColorElement(this);
    }

    // On
    onAdd() {
        this.onDidAdded.trigger(this);
    }
    onRemove() {
        this.onDidRemoved.trigger(this);
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
    getRgbString() {
        return this.state.getRgbString();
    }
    getHslString() {
        return this.state.getHslString();
    }
    get rgb() {
        return this.state.rgb;
    }
    get hex() {
        return this.state.hex;
    }
    get hsv() {
        return this.state.hsv;
    }
    get red() {
        return this.state.red;
    }
    get green() {
        return this.state.green;
    }
    get blue() {
        return this.state.blue;
    }
    get hue() {
        return this.state.hue;
    }
    get saturation() {
        return this.state.saturation;
    }
    get value() {
        return this.state.value;
    }

    // Static
    static fromHex(manager: PaletteManager, hex: HexColor): PaletteColor {
        return new PaletteColor(manager, Color.fromHex(hex));
    }
    static fromHsl(manager: PaletteManager, hsl: HslColor): PaletteColor {
        return new PaletteColor(manager, Color.fromHsl(hsl));
    }
    static fromHsv(manager: PaletteManager, hsv: HsvColor): PaletteColor {
        return new PaletteColor(manager, Color.fromHsv(hsv));
    }
}
