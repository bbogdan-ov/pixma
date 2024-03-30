import { MouseButton } from "@base/types/enums";
import { Bind } from ".";

export class MouseBind extends Bind {
    readonly button: MouseButton;

    constructor(button: MouseButton, ctrl=false, shift=false, alt=false) {
        super(ctrl, shift, alt);

        this.button = button;
    }

    test(event: Event): boolean {
        return (event as any).button == this.button && super.test(event);
    }

    // Static
	static fromEvent(event: Event): MouseBind | null {
		const ev = event as MouseEvent;
		if (!ev.button) return null;
		return new MouseBind(ev.button, ev.ctrlKey, ev.shiftKey, ev.shiftKey);
	}
    static get LEFT(): MouseBind {
        return new MouseBind(MouseButton.LEFT);
    }
    static get MIDDLE(): MouseBind {
        return new MouseBind(MouseButton.MIDDLE);
    }
    static get RIGHT(): MouseBind {
        return new MouseBind(MouseButton.RIGHT);
    }
}
