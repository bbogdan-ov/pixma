import { ActionAttachableElement, BaseElement } from "@base/elements";
import { ProjectsTabsPanel } from "./panels";
import { Project } from "@source/common/project";
import { DrawingLayer } from "@source/common/layers";
import { EventName } from "@base/types/enums";
import { AppCommand } from "@source/types/enums";
import { EnterProjectAction, HelloAction } from "@source/actions";
import type { App } from "@source/App";
import type { CommandAction } from "@base/managers";

@BaseElement.define("app-element")
export default class AppElement extends ActionAttachableElement<App> {
    constructor(app: App) {
        super(app);

        this.classList.add("app");
    }

	attachAction(commandName: string, action: CommandAction): boolean {
		// Do not detach action on app dismount
		const remove = this.app.commands.add(commandName, action);
		if (!remove) return false;
		return true;
	}

	//
    onMount(): void {
        super.onMount();

		// CRUTCH: this thing doesn't work in constructor(), but should be there
		if (!this.isMountedOnce)
			this.append(
				new ProjectsTabsPanel(this.app),
				this.app.editor.element,
				this.app.windows.floatingWrapper
			);

        // TEMP {
        const a = new Project(this.app.projects);
        const b = new Project(this.app.projects);
        const l = new DrawingLayer(a.layers).setDisplayName("Hey yo");
        a.layers.add(l);

		a.open();
		b.open();
        // }

		// Actions
		this.attachAction(AppCommand.HELLO, 			new HelloAction(this));

		this.attachAction(AppCommand.ENTER_FIRST_TAB, 	new EnterProjectAction(0, this));
		this.attachAction(AppCommand.ENTER_SECOND_TAB, 	new EnterProjectAction(1, this));
		this.attachAction(AppCommand.ENTER_THIRD_TAB, 	new EnterProjectAction(2, this));
		this.attachAction(AppCommand.ENTER_FOURTH_TAB, 	new EnterProjectAction(3, this));
		this.attachAction(AppCommand.ENTER_FIFTH_TAB, 	new EnterProjectAction(4, this));
		this.attachAction(AppCommand.ENTER_SIXTH_TAB, 	new EnterProjectAction(5, this));
		this.attachAction(AppCommand.ENTER_SEVENTH_TAB, new EnterProjectAction(6, this));
		this.attachAction(AppCommand.ENTER_EIGHTH_TAB, 	new EnterProjectAction(7, this));
		this.attachAction(AppCommand.ENTER_NINETH_TAB, 	new EnterProjectAction(8, this));
		this.attachAction(AppCommand.ENTER_TENTH_TAB, 	new EnterProjectAction(9, this));

		// Events
		this.listen(window, EventName.CONTEXT_MENU, this._onContextMenu.bind(this));
        this.listen(window, EventName.SCROLL, this._onScroll.bind(this));
		this.listen(window, EventName.KEY_DOWN, this._onKeyDown.bind(this));
    }
	protected _onContextMenu(event: MouseEvent) {
		event.preventDefault();
	}
	protected _onKeyDown(event: KeyboardEvent) {
		this.app.keymaps.onKeyDown(event);
	}
    protected _onScroll() {
        this.scrollTo(0, 0); // its a crutch
    }
}
