import { BaseToggle } from "./BaseToggle";
import { Icon } from "../media";
import { IconName } from "@base/types/enums";
import type { State } from "@base/common/listenable";

@BaseToggle.define("base-checkbox-toggle")
export class CheckboxToggle extends BaseToggle {
    constructor(state?: State<boolean>) {
        super(state);

        this.classList.add("checkbox-toggle");

        this.append(new Icon(IconName.CHECKMARK));
    }
}
