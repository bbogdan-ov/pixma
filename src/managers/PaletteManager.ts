import { Utils } from "@base/utils";
import { PaletteColor } from "@source/common/colors";
import { Trigger } from "@base/common/listenable";
import { Manager } from "@base/managers";
import type { Project } from "@source/common/project";

export class PaletteManager extends Manager {
	readonly project: Project;

    protected _list: PaletteColor[] = [];
    
    readonly onDidAdded = new Trigger<PaletteColor>();
    readonly onDidRemoved = new Trigger<PaletteColor>();
    
    constructor(project: Project) {
        super();

		this.project = project;

        this._list = [
			PaletteColor.transparent(this),
            PaletteColor.fromHex(this, "#000000"),
            PaletteColor.fromHex(this, "#1D2B53"),
            PaletteColor.fromHex(this, "#7E2553"),
            PaletteColor.fromHex(this, "#008751"),
            PaletteColor.fromHex(this, "#AB5236"),
			PaletteColor.fromHex(this, "#5F574F"),
			PaletteColor.fromHex(this, "#C2C3C7"),
			PaletteColor.fromHex(this, "#FFF1E8"),
			PaletteColor.fromHex(this, "#FF004D"),
			PaletteColor.fromHex(this, "#FFA300"),
			PaletteColor.fromHex(this, "#FFEC27"),
			PaletteColor.fromHex(this, "#00E436"),
			PaletteColor.fromHex(this, "#29ADFF"),
			PaletteColor.fromHex(this, "#83769C"),
			PaletteColor.fromHex(this, "#FF77A8"),
			PaletteColor.fromHex(this, "#FFCCAA"),
        ];
    }

    add(color: PaletteColor, index: number | null=null): boolean {
        if (this.getIsExists(color)) return false;
            
        if (!Utils.exists(index) || index < 0)
            this._list.push(color);
        else
            Utils.insertItem(this._list, color, index);

        color.onAdd();
        this.onDidAdded.trigger(color);
        return true;
    }
    remove(color: PaletteColor): boolean {
        const removedIndex = Utils.removeItem(this._list, color);
        if (!Utils.exists(removedIndex) || removedIndex < 0) return false;

        color.onRemove();
        this.onDidRemoved.trigger(color);
        return true;
    }

    // Get
    get(index: number): PaletteColor | null {
        return this.list[index] || null;
    }
    getIsExists(color: PaletteColor): boolean {
        return this.list.includes(color);
    }
    getIndexOf(color: PaletteColor): number | null {
        return Utils.indexOf(this.list, color);
    }
    get list(): PaletteColor[] {
        return this._list;
    }
}
