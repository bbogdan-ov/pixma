import { ColorState } from "@base/common/listenable";
import { Tool } from ".";
import type { App } from "@source/App";
import { MouseButton } from "@base/types/enums";
import { Color } from "@base/common/misc";

export class ColorfulTool extends Tool {
	constructor(namespace: string, name: string, app: App) {
		super(namespace, name, app);
	}

	// Get
	getColor(button: MouseButton | null): Color {
		if (button == MouseButton.RIGHT)
			return this.backColor;
		return this.frontColor;
	}
    get frontColor(): Color {
        return this.frontColorState?.color ?? Color.TRANSPARENT;
    }
    get backColor(): Color {
        return this.backColorState?.color ?? Color.TRANSPARENT;
    }
	get frontColorState(): ColorState | null {
		return this.app.brushes.frontColorState;
	}
	get backColorState(): ColorState | null {
		return this.app.brushes.backColorState;
	}
}
