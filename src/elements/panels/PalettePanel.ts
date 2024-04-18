import { Color } from "@base/common/misc";
import { Button } from "@base/elements/buttons";
import { Panel, WindowContent, WindowFooter } from "@base/elements/windows";
import { EventName, IconName, Orientation } from "@base/types/enums";
import { PaletteColor } from "@source/common/colors";
import type { Project } from "@source/common/project";
import type { App } from "@source/App";
import { BaseElement } from "@base/elements";
import { PaletteManager } from "@source/managers";
import { ProjectPanel } from "./ProjectPanel";

// Palette panel
@Panel.define("palette-panel")
export class PalettePanel extends ProjectPanel {
	static readonly NAME = "palette";

    readonly content = new WindowContent();
    protected _paletteList: PaletteList | null = null;
    readonly addButton = Button.icon(IconName.ADD_COLOR).setIsGhost().addClassName("add-button");
    
    constructor(app: App) {
        super(PalettePanel.NAME, app.windows, Orientation.VERTICAL);

        this.append(
            this.content,
			new WindowFooter(
				this.addButton
			)
        );
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.addButton, EventName.CLICK, this._onAddButtonClick.bind(this));
    }
	// FIXME: there is also bad perfomance when changing current project
	protected _onProjectEnter(project: Project): void {
	    super._onProjectEnter(project);

		this._paletteList = project.paletteList;
		this.content.appendChild(this._paletteList);
	}
	protected _onProjectLeave(project: Project): void {
	    super._onProjectLeave(project);

		this._paletteList?.remove();
		this._paletteList = null;
	}
    protected _onAddButtonClick() {
		const palette = this.project?.palette;
		if (!palette) return;

        palette.add(new PaletteColor(palette, Color.random()));
    }
}

// Palette list
@BaseElement.define("palette-list")
export class PaletteList extends BaseElement {
	readonly manager: PaletteManager;

	constructor(manager: PaletteManager) {
		super();

		this.manager = manager;

		this.classList.add("palette-list");
	}

	appendColor(color: PaletteColor) {
		this.appendChild(color.createElement());
	}

	// On
	onMount(): void {
	    super.onMount();

		if (!this.isMountedOnce) {
			for (const color of this.manager.list) {
				this.appendColor(color);
			}
		}

        this.listen(this.manager.onDidAdded, this._onColorAdd.bind(this));
	}
    protected _onColorAdd(color: PaletteColor) {
		this.appendColor(color);
    }
}
