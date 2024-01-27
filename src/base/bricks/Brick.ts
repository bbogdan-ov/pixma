export default class Brick<P> {
    readonly parent: P;

    constructor(parent: P) {
        this.parent = parent;
    }
}
