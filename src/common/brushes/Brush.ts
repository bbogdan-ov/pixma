import { Canvas, Color } from "@base/common/misc";
import { Algorithms } from "@source/utils";

export default class Brush {
    protected readonly _canvas = new Canvas();

    protected _color: Color = Color.BLACK;
    protected _size: number = 1;

    protected _maxSize = 100;
    
    constructor() {}

    drawOn(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
        Algorithms.line(
            Math.floor(fromX), Math.floor(fromY),
            Math.floor(toX), Math.floor(toY),
            (x, y)=> context.drawImage(this.image, x - Math.floor(this._size/2), y - Math.floor(this._size/2))
        )
    }
    
    render(color: Color, size: number) {
        this._color = color;
        this._size = size;
    }

    // Get
    get image(): CanvasImageSource {
        return this._canvas.element;
    }
    get maxSize(): number {
        return this._maxSize;
    }
}
