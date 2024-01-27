import { EventData } from ".";
import type { MouseBind } from "../binds";

export default class MouseData extends EventData<MouseBind> {
    constructor(event: Event) {
        super(event);

        this._isValid = (event as any).button !== undefined && (event as any).clientX !== undefined;
    }
}
