import { BaseApp } from "@base/BaseApp";
import { Manager } from ".";
import { BaseWindow } from "@base/elements/windows/BaseWindow";

export type RegisteredWindow = ()=> BaseWindow;

export class WindowsManager<A extends BaseApp> extends Manager {
	readonly app: A;

	constructor(app: A) {
		super();

		this.app = app;
	}
}
