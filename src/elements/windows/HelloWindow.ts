import { FloatingWindow, WindowContent } from "@base/elements/windows";
import { WindowsManager } from "@base/managers";
import type { App } from "@source/App";
import { AppOption } from "@source/types/enums";

@FloatingWindow.define("hello-window")
export class HelloWindow extends FloatingWindow<App> {
	static readonly NAME = "hello";

	constructor(manager: WindowsManager<App>) {
		super(HelloWindow.NAME, manager, "hello window");

		let text = "goodbye pixma...";

		if (this.app.getBool(AppOption.HELLO))
			text = this.app.getString(AppOption.HELLO_MESSAGE);

		this.append(
			new WindowContent().setInnerHtml(`<h2>${ text }</h2>`),
		)
	}
}
