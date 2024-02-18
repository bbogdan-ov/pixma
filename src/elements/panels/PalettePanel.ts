import { Panel } from "@base/elements/panels";
import { Orientation } from "@base/types/enums";
import type { Project } from "@source/common/project";

@Panel.define("palette-panel")
export default class PalettePanel extends Panel {
    readonly project: Project;
    
    constructor(project: Project) {
        super(Orientation.VERTICAL);

        this.project = project;
        
        this.classList.add("palette-panel")
    }
}
