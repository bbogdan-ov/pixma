import { Brick } from "..";

export default class ElementBrick<P extends HTMLElement> extends Brick<P> {
    constructor(parent: P) {
        super(parent);
    }
}
