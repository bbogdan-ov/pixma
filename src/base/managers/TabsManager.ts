import { Manager } from "./Manager";
import { Trigger } from "@base/common/listenable";
import { Utils } from "@base/utils";
import type { Tab } from "@base/common/tabs";
import type { BaseApp } from "@base/BaseApp";

export class TabsManager extends Manager {
	readonly app: BaseApp;

    protected _active: Tab | null = null;
    protected readonly _list: Tab[] = [];

    readonly onDidOpened = new Trigger<Tab>();
    readonly onDidClosed = new Trigger<Tab>();
    readonly onDidEntered = new Trigger<Tab>();
    readonly onDidLeaved = new Trigger<Tab>();

    constructor(app: BaseApp) {
        super()

		this.app = app;
    }

    open(tab: Tab): boolean {
        if (this.getIsExists(tab)) return false;

        this._list.push(tab);

        tab.onOpen();
        this.onDidOpened.trigger(tab);

        return true;
    }
    close(tab: Tab): boolean {
        const removedIndex = Utils.removeItem(this._list, tab);
        if (!Utils.exists(removedIndex) || removedIndex < 0) return false;

        this.leave(tab);
        tab.onClose();
        this.onDidClosed.trigger(tab);
        return true;
    }
    enter(tab: Tab): boolean {
        if (!this.getIsExists(tab) || this.getIsActive(tab)) return false;

        if (this.active) this.leave(this.active);

        this._active = tab;
        tab.onEnter();

        this.onDidEntered.trigger(tab);
        return true;
    }
	enterByIndex(index: number): boolean {
		const tab = this.list[index];
		if (!tab) return false;
		return this.enter(tab);
	}
    leave(tab: Tab): boolean {
        if (this.active !== tab) return false;

        tab.onLeave();
        this.onDidLeaved.trigger(tab);
        this._active = null;
        return true;
    }

    // Get
    getIsExists(tab: Tab): boolean {
        return this.list.includes(tab);
    }
    getIsActive(tab: Tab): boolean {
        return this.active === tab;
    }
    get active(): Tab | null {
        return this._active;
    }
    get list(): Tab[] {
        return this._list;
    }
}
