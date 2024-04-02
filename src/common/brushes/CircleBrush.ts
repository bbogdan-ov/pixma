import { Color } from "@base/common/misc";
import { Brush } from "./Brush";
import { Utils } from "@base/utils";
import { CompositeOperation } from "@source/types/enums";

export class CircleBrush extends Brush {
    readonly frames: HTMLImageElement[] = [];
    
    constructor() {
        super();

        for (let i = 1; i <= this.maxSize; i ++) {
            const frame = new Image();
            frame.src = new URL(`/src/assets/images/brushes/circle/${ i }.png`, import.meta.url).href;
            this.frames.push(frame);
        }
    }

    render(context: CanvasRenderingContext2D, color: Color, size: number): void {
        super.render(context, color, size);
        size = Utils.clamp(Math.floor(size), 1, this.maxSize);

        const frame = this.frames[size-1];

		context.canvas.width = size;
		context.canvas.height = size;
		context.imageSmoothingEnabled = false;

        context.globalCompositeOperation = CompositeOperation.DEFAULT;
        context.fillStyle = color.getRgbString();
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalCompositeOperation = CompositeOperation.MASK;

        context.drawImage(frame, 0, 0);
    }
}
