import { Utils } from "@base/utils";
import { ProjectManager } from "..";
import { PaletteColor } from "@source/common/colors";
import { Trigger } from "@base/common/listenable";
import type { Project } from "@source/common/project";

export default class PaletteManager extends ProjectManager {
    protected _list: PaletteColor[] = [];
    
    readonly onDidAdded = new Trigger<PaletteColor>();
    readonly onDidRemoved = new Trigger<PaletteColor>();
    
    constructor(project: Project) {
        super(project);

        this._list = [
            PaletteColor.fromHex(this, "#fff"),
            PaletteColor.fromHex(this, "#000"),
            PaletteColor.fromHex(this, "#f00"),
            PaletteColor.fromHex(this, "#0f0"),
            PaletteColor.fromHex(this, "#00f"),
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
