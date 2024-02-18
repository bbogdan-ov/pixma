import { ProjectManager } from "..";
import type { PaletteColor } from "@source/common/colors";
import type { Project } from "@source/common/project";

export default class PaletteManager extends ProjectManager {
    protected _list: PaletteColor[] = [];
    
    constructor(project: Project) {
        super(project);
    }

    // Get
    get list(): PaletteColor[] {
        return this._list;
    }
}
