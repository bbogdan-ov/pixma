import { Canvas, Color } from "@base/common/misc";
import { Algorithms } from "@source/utils";

export default class Brush {
    protected readonly _canvas = new Canvas();

    protected _color: Color = Color.BLACK;
    protected _size: number = 1;

    protected _maxSize = 100;
    
    constructor() {}

    draw(context: CanvasRenderingContext2D, x: number, y: number) {
        const size = this._size;
        const half = Math.floor(size/2);
        const rem = (size%2)/2;
        
        context.drawImage(
            this.image,
            Math.round(x - half - rem),
            Math.round(y - half - rem)
        );
    }
    drawLine(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
        Algorithms.line(
            fromX, fromY,
            toX, toY,
            (x, y)=> this.draw(context, x, y)
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
