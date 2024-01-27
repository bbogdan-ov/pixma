import { MouseButton } from "@base/types/enums";
import { Bind } from ".";

export default class MouseBind extends Bind {
    readonly button: MouseButton;

    constructor(button: MouseButton, isCtrl=false, isShift=false, isAlt=false) {
        super(isCtrl, isShift, isAlt);

        this.button = button;
    }

    get(event: Event): boolean {
        return (event as any).button == this.button && super.get(event);
    }

    // Static
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
