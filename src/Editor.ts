import type { App } from "./App";
import { EditorElement } from "./elements/EditorElement";

export class Editor {
	readonly app: App;

	readonly element: EditorElement;

	constructor(app: App) {
		this.app = app;

		this.element = new EditorElement(this);
	}
}
