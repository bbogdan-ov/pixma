import { BaseApp } from "@base/BaseApp";
import { State, Trigger } from "../listenable";
import { TabElement } from "@base/elements/tabs";
import type { TabsManager } from "@base/managers";

export class Tab<A extends BaseApp=BaseApp, V extends HTMLElement=HTMLElement> {
    static _id: number = 0;

    readonly id: number;
    readonly name: string;
    readonly manager: TabsManager<A>;

    protected _viewElement: V | null = null;
	protected _contextName: string | null = null;

    readonly titleState: State<string>;

    protected _isOpened = false;
    protected _isActive = false;

    readonly onDidOpened = new Trigger<Tab>();
    readonly onDidClosed = new Trigger<Tab>();
    readonly onDidEntered = new Trigger<Tab>();
    readonly onDidLeaved = new Trigger<Tab>();

    constructor(name: string, manager: TabsManager<A>, titleState?: State<string>) {
        this.id = ++ Tab._id;
        this.name = name;
        this.manager = manager;
        this.titleState = titleState ?? new State<string>("Tab");
    }

    enter(): boolean {
        return this.manager.enter(this);
    }
    leave(): boolean {
        return this.manager.leave(this);
    }
    close(): boolean {
        return this.manager.close(this);
    }

    createElement(): HTMLElement {
        return new TabElement(this);
    }
    attachView(element: V): this {
        this._viewElement = element;
        return this;
    }

    // On
    onOpen() {
        this._isOpened = true;
        this.onDidOpened.trigger(this);
    }
    onClose() {
        this._isOpened = false;
        this.onDidClosed.trigger(this);
    }
    onEnter() {
		if (this._contextName)
			this.manager.app.addContext(this._contextName);

        this._isActive = true;
        this.onDidEntered.trigger(this);
    }
    onLeave() {
		if (this._contextName)
			this.manager.app.removeContext(this._contextName);

        this._isActive = false;
        this.onDidLeaved.trigger(this);
    }

    // Set
    setTitle(value: string): this {
        this.titleState.set(value);
        return this;
    }

    // Get
    get viewElement() {
        return this._viewElement;
    }
    get title() {
        return this.titleState.value;
    }
    get isOpened() {
        return this._isOpened;
    }
    get isActive() {
        return this._isActive;
    }
}
