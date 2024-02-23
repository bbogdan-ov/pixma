import { ProjectManager } from "..";
import { PaletteColor } from "@source/common/colors";
import type { Project } from "@source/common/project";

export default class PaletteManager extends ProjectManager {
    protected _list: PaletteColor[] = [];
    
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

    // Get
    get list(): PaletteColor[] {
        return this._list;
    }
}
