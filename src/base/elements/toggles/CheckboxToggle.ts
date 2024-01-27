import { BaseToggle } from ".";
import type { State } from "@base/common/listenable";
import { Icon } from "../media";
import { IconName } from "@base/types/enums";

@BaseToggle.define("base-checkbox-toggle")
export default class CheckboxToggle extends BaseToggle {
    constructor(state?: State<boolean>) {
        super(state);

        this.classList.add("checkbox-toggle");

        this.append(new Icon(IconName.CHECKMARK));
    }
}
