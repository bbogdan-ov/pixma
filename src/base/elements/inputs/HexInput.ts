import { State } from "@base/common/listenable";
import { BaseInput } from ".";
import { Color } from "@base/common/misc";

@BaseInput.define("hex-input")
export default class HexInput extends BaseInput<string> {
	protected _showHashChar = true;

	constructor(state: State<string>) {
		super("#000000", state);

		this.classList.add("hex-input");
	}

    formatInputValue(value: string | number): string {
        return Color.formatHex(value.toString());
    }
    formatDisplayValue(value: string): string {
		const v = Color.formatHex(value);

		if (!this._showHashChar)
			return v.slice(1);
        return v
    }
	
	// Set
	hideHashChar(hidden=true): this {
		this._showHashChar = !hidden;
		return this;
	}
}
