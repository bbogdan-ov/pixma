import { Panel, PanelContent } from "@base/elements/panels";
import { Orientation } from "@base/types/enums";
import { DOM } from "@base/utils";
import type { PaletteColor } from "@source/common/colors";
import type { Project } from "@source/common/project";

@Panel.define("palette-panel")
export default class PalettePanel extends Panel {
    readonly project: Project;

    readonly colorsList = DOM.div("colors-list");
    
    constructor(project: Project) {
        super(Orientation.VERTICAL);

        this.project = project;
        
        this.classList.add("palette-panel");

        this.append(new PanelContent(this.colorsList));

        for (const color of project.palette.list) {
            this.colorsList.append(color.createElement());
        }
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.project.palette.onDidAdded, this._onPaletteColorAdd.bind(this));
    }
    protected _onPaletteColorAdd(color: PaletteColor) {
        // TODO: sorting colors in right order (like in the palette list itself)
        this.colorsList.append(color.createElement());
    }
}
