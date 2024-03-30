import { State } from "@base/common/listenable";
import { BaseInput } from "./BaseInput";

@BaseInput.define("text-input")
export class TextInput extends BaseInput<string> {
    constructor(state?: State<string>) {
        super("", state);

        this.classList.add("text-input");
    }

    formatInputValue(value: string | number): string {
        return value.toString();
    }
}
