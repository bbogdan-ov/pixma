import { ColorState, Trigger } from "@base/common/listenable";
import { Color } from "@base/common/misc";
import { PaletteColorElement } from "@source/elements/colors";
import type { HexColor, HslColor, HsvColor } from "@base/types/types";
import type { PaletteManager } from "@source/managers";

export class PaletteColor {
    readonly manager: PaletteManager;
    readonly state: ColorState;

    readonly onDidAdded = new Trigger<PaletteColor>();
    readonly onDidRemoved = new Trigger<PaletteColor>();
    
    constructor(manager: PaletteManager, color: Color) {
        this.manager = manager;
        this.state = new ColorState(color);
    }

    pickFront(): this {
        this.manager.project.app.brushes.setFrontColor(this.color);
        return this;
    }
    pickBack(): this {
        this.manager.project.app.brushes.setBackColor(this.color);
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
	get color(): Color {
		return this.state.color;
	}
	get isFront(): boolean {
		return this.color.compareRgb(this.manager.project.app.brushes.frontColor);
	}
	get isBack(): boolean {
		return this.color.compareRgb(this.manager.project.app.brushes.backColor);
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
	static transparent(manager: PaletteManager): PaletteColor {
		return new PaletteColor(manager, Color.TRANSPARENT);
	}
}
