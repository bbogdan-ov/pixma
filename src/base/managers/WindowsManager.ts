import { BaseApp } from "@base/BaseApp";
import { Command, CommandAction, Manager } from ".";
import { BaseWindow } from "@base/elements/windows";
import { Trigger } from "@base/common/listenable";
import { ActionAttachableElement } from "@base/elements";
import { AppCommand } from "@source/types/enums";

export type RegisteredWindow = ()=> BaseWindow;

// Actions
export class CloseWindowAction<A extends BaseApp=BaseApp> extends CommandAction<FloatingWindowsWrapper<A>> {
	execute(command: Command): boolean {
		super.execute(command);
		return this.attachable.manager.closeActive();
	}
}

// Floating windows wrapper
@ActionAttachableElement.define("floating-windows-wrapper")
export class FloatingWindowsWrapper<A extends BaseApp=BaseApp> extends ActionAttachableElement<A> {
	readonly manager: WindowsManager<A>;

	constructor(manager: WindowsManager<A>) {
		super(manager.app);

		this.manager = manager;

		this.classList.add("windows-wrapper")
	}

	// On
	onMount(): void {
	    super.onMount();

		this.attachAction(AppCommand.CLOSE_WINDOW, new CloseWindowAction(this));
	}
}

// Windows manager
export class WindowsManager<A extends BaseApp> extends Manager {
	readonly app: A;

	protected _active: BaseWindow<A> | null = null;

	readonly floatingWrapper: FloatingWindowsWrapper<A>;

	readonly onDidOpened = new Trigger<BaseWindow<A>>();
	readonly onDidClosed = new Trigger<BaseWindow<A>>();
	readonly onDidActivated = new Trigger<BaseWindow<A>>();
	readonly onDidDisactivated = new Trigger<BaseWindow<A>>();

	constructor(app: A) {
		super();

		this.app = app;

		this.floatingWrapper = new FloatingWindowsWrapper(this);
	}

	openFloating(window: BaseWindow<A>): boolean {
		this.floatingWrapper.append(window);
		this.onDidOpened.trigger(window);

		this.activateLast();
		return true;
	}

	close(window: BaseWindow<A>, force=false, activateNext=true): boolean {
		if (!window.allowClose && !force)
			return false;

		const wasActive = window == this.active;
		this.disactivate(window);

		window.remove();
		this.onDidClosed.trigger(window);

		if (activateNext && wasActive) {
			this.activateLast();
		}
		return true;
	}
	closeActive(force?: boolean, activateNext?: boolean): boolean {
		if (!this.active) return false;
		return this.close(this.active, force, activateNext);
	}
	activate(window: BaseWindow<A>): boolean {
		this.disactivate(null);

		this._active = window;

		window.onActivate();
		this.onDidActivated.trigger(window);
		return true;
	}
	activateLast(): boolean {
		const win = this.getLast();
		if (!win) return false;
		return this.activate(win);
	}
	disactivate(window: BaseWindow<A> | null): boolean {
        if (!this._active)
			return false;
		if (!!window && this._active !== window)
			return false;

		this._active.onDisactivate();
		this.onDidDisactivated.trigger(this._active);

		this._active = null;
		return true;
	}

	// Get
	getLast(): BaseWindow<A> | null {
		const last = this.floatingWrapper.lastElementChild;
		if (last instanceof BaseWindow)
			return last;
		return null;
	}
	get active(): BaseWindow<A> | null {
		return this._active;
	}
}
