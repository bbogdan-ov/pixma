import { Color } from "@base/common/misc";
import { Brush } from "./Brush";
import { Utils } from "@base/utils";

export class CircleBrush extends Brush {
    protected readonly _frames: HTMLImageElement[] = [];
    
    constructor() {
        super();

        this._maxSize = 64;

        for (let i = 1; i <= this.maxSize; i ++) {
            const frame = new Image();
            frame.src = new URL(`/src/assets/images/brushes/circle/${ i }.png`, import.meta.url).href;
            this._frames.push(frame);
            frame.onload = ()=> {
                if (i == this.maxSize)
                    this.render(this._color, this._size);
            }
        }
    }

    render(color: Color, size: number): void {
        super.render(color, size);
        size = Utils.clamp(Math.floor(size), 1, this.maxSize);

        this._canvas.setSize(size, size);
        this._canvas.context.imageSmoothingEnabled = false;

        const frame = this._frames[size-1];

        
        this._canvas.context.globalCompositeOperation = "source-over";
        this._canvas.context.fillStyle = color.getRgbString();
        this._canvas.context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        this._canvas.context.globalCompositeOperation = "destination-in";

        this._canvas.context.drawImage(frame, 0, 0);

    }
}
