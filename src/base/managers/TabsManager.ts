import Manager from "./Manager";
import { Tab } from "@base/common/tabs";
import { Trigger } from "@base/common/listenable";
import Utils from "@base/utils/Utils";

export default class TabsManager extends Manager {
    protected _active: Tab | null = null;
    protected readonly _list: Tab[] = [];

    readonly onDidOpened = new Trigger<Tab>();
    readonly onDidClosed = new Trigger<Tab>();
    readonly onDidEntered = new Trigger<Tab>();
    readonly onDidLeaved = new Trigger<Tab>();

    constructor() {
        super()
    }

    open(tab: Tab): boolean {
        if (this.getIsExists(tab)) return false;

        this._list.push(tab);

        tab.onOpen();
        this.onDidOpened.trigger(tab);

        return true;
    }
    close(tab: Tab): boolean {
        if (!this.getIsExists(tab)) return false;

        Utils.removeItem(this._list, tab);

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
