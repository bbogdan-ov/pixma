import { AnyStringColor } from "@base/types/types";
import { Algorithms } from ".";

type Context = CanvasRenderingContext2D

export default class Draw {
    static clear(context: Context, x=0, y=0, width?: number, height?: number) {
        context.clearRect(
            Math.floor(x),
            Math.floor(y),
            Math.floor(width || context.canvas.width),
            Math.floor(height || context.canvas.height)
        );
    }

    static rect(context: Context, x: number, y: number, width: number, height: number, color: AnyStringColor) {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }
    static pixel(context: Context, x: number, y: number, size: number, color: AnyStringColor) {
        this.rect(context, x, y, size, size, color);
    }
    static line(context: Context, fromX: number, fromY: number, toX: number, toY: number, size: number, color: AnyStringColor) {
        Algorithms.line(
            fromX, fromY,
            toX, toY,
            (x, y)=> this.pixel(context, x, y, size, color)
        );
    }

    static image(context: Context, image: CanvasImageSource, x: number, y: number): void;
    static image(context: Context, image: CanvasImageSource, x: number, y: number, width: number, height: number): void;
    static image(context: Context, image: CanvasImageSource, x: number, y: number, width?: number, height?: number) {
        if (width !== undefined && height !== undefined)
            context.drawImage(image, x, y, width, height);
        else
            context.drawImage(image, x, y);
    }
    static slicedimage(context: Context, image: CanvasImageSource, x: number, y: number, sx: number, sy: number, sw: number, sh: number, width: number, height: number): void;
    static slicedimage(context: Context, image: CanvasImageSource, x: number, y: number, sx: number, sy: number, sw: number, sh: number): void;
    static slicedimage(context: Context, image: CanvasImageSource, x: number, y: number, sx: number, sy: number, sw: number, sh: number, width?: number, height?: number) {
        if (width !== undefined && height !== undefined)
            context.drawImage(image, sx, sy, sw, sh, x, y, width, height);
        else
            context.drawImage(image, sx, sy, sw, sh, x, y, sw, sh);
    }
}
