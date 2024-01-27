import { Bind } from "../binds";

export default class EventData<B extends Bind> {
    readonly event: Event;

    protected _isCtrl = false;
    protected _isShift = false;
    protected _isAlt = false;

    protected _isValid = false;

    constructor(event: Event) {
        this.event = event;

        const ev = event as any;
        this._isCtrl = ev.ctrlKey || false;
        this._isShift = ev.shiftKey || false;
        this._isAlt = ev.altKey || false;
    }

    // Get
    get(...binds: B[]): boolean {
        if (!this.isValid) return false;

        for (const bind of binds) {
            if (bind.get(this.event))
                return true;
        }

        return false;
    }

    get isValid(): boolean {
        return this._isValid;
    }
    get isCtrl(): boolean {
        return this._isCtrl;
    }
    get isShift(): boolean {
        return this._isShift;
    }
    get isAlt(): boolean {
        return this._isAlt;
    }
}
