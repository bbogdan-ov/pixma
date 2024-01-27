import { EventData } from ".";
import type { KeyBind } from "../binds";

export default class KeyboardData extends EventData<KeyBind> {
    constructor(event: Event) {
        super(event);

        this._isValid = (event as any).code !== undefined;
    }
}
