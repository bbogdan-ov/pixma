import { IPoint } from "@base/types/types";

export default class Point implements IPoint {
    x: number;
    y: number;

    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    set(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }
    add(x: number, y: number): this {
        this.x += x;
        this.y += y;
        return this;
    }
    sub(x: number, y: number): this {
        this.x -= x;
        this.y -= y;
        return this;
    }
    mul(value: number): this {
        this.x *= value;
        this.y *= value;
        return this;
    }
    div(value: number): this {
        this.x /= value;
        this.y /= value;
        return this;
    }

    apply(func: (value: number)=> number): this {
        this.x = func(this.x);
        this.y = func(this.y);
        return this;
    }
    floor(): this {
        return this.apply(Math.floor);
    }
    ceil(): this {
        return this.apply(Math.ceil);
    }
    round(): this {
        return this.apply(Math.round);
    }

    zero(): this {
        this.x = 0;
        this.y = 0;
        return this;
    }
    copy(point: IPoint): this {
        this.x = point.x;
        this.y = point.y;
        return this;
    }
    clone(): Point {
        return Point.from(this);
    }

    inBounds(left: number, top: number, right: number, bottom: number): boolean {
        return (
            this.x >= left && this.y >= top &&
            this.x <= right && this.y <= bottom
        )
    }

    // Static
    static from(point: IPoint): Point {
        return new Point(point.x, point.y);
    }
    static fromIndex(index: number, width: number): Point {
        return new Point(index % width, Math.floor(index / width));
    }
}
