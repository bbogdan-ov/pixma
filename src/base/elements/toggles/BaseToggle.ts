import { State } from "@base/common/listenable";
import { FocusableElement } from "..";
import { EventName } from "@base/types/enums";

@FocusableElement.define("base-toggle")
export default class BaseToggle extends FocusableElement {
    readonly state: State<boolean>;

    constructor(state?: State<boolean>) {
        super();

        this.state = state ?? new State(false);

        this.classList.add("toggle");
    }

    toggle(value?: boolean) {
        if (value !== undefined)
            this.state.set(value);
        else
            this.state.set(v=> !v);
    }

    protected _updateState() {
        this.classList.toggle("active", this.value);
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.CLICK, this._onClick.bind(this));
        this.listen(this.state, this._onValueChange.bind(this));

        this._updateState();
    }
    protected _onClick(event: MouseEvent) {
        this.toggle();
    }
    protected _onInteract(event: KeyboardEvent): void {
        super._onInteract(event);
        this.click();
    }
    protected _onValueChange(value: boolean) {
        this._updateState();
    }

    // Get
    get value(): boolean {
        return this.state.value;
    }
}
