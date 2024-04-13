import { Color } from "@base/common/misc";
import { Button } from "@base/elements/buttons";
import { Panel, PanelContent } from "@base/elements/windows";
import { EventName, IconName, Orientation } from "@base/types/enums";
import { DOM } from "@base/utils";
import { PaletteColor } from "@source/common/colors";
import type { Project } from "@source/common/project";
import type { App } from "@source/App";

@Panel.define("palette-panel")
export class PalettePanel extends Panel<App> {
	static readonly NAME = "palette";

    readonly project: Project;

    readonly colorsList = DOM.div("colors-list");
    readonly addButton = Button.icon(IconName.ADD_COLOR).setIsGhost().addClassName("add-button");
    
    constructor(project: Project) {
        super(PalettePanel.NAME, project.app.windows, Orientation.VERTICAL);

        this.project = project;

        this.append(new PanelContent(
            this.colorsList,
            this.addButton
        ));

        for (const color of project.palette.list) {
            this.colorsList.append(color.createElement());
        }
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.addButton, EventName.CLICK, this._onAddButtonClick.bind(this));
        
        this.listen(this.project.palette.onDidAdded, this._onPaletteColorAdd.bind(this));
    }
    protected _onAddButtonClick() {
        this.project.palette.add(new PaletteColor(this.project.palette, Color.random()));
    }
    protected _onPaletteColorAdd(color: PaletteColor) {
        // TODO: sorting colors in right order (like in the palette list itself)
        this.colorsList.append(color.createElement());
    }
}
