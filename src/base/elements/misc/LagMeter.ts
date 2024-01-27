import { Utils } from "@base/utils";
import { BaseElement } from "..";

@BaseElement.define("lag-meter")
export default class LagMeter extends BaseElement {
    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    
    constructor(width=220, height=40) {
        super();

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d")!;
        this.canvas.style.imageRendering = "pixelated";
        this.canvas.width = width;
        this.canvas.height = height;

        this.append(this.canvas);
    }

    onMount(): void {
        super.onMount();

        const LINE_WIDTH = 2;
        const BAD_DELTA = 70;
        
        const values: number[] = [];

        let lastTime = Date.now();

        const loop = ()=> {
            requestAnimationFrame(loop);

            this.context.fillStyle = "#000";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const delta = Date.now() - lastTime;

            values.push(delta);

            for (let i = 0; i < values.length; i ++) {
                const value = values[i];
                const percent = Math.min(value / BAD_DELTA, 1);
                const color = 90 - percent * 90;
                const height = percent * this.canvas.height;

                this.context.fillStyle = `hsl(${ color }, 100%, 50%)`;
                this.context.fillRect(i*LINE_WIDTH, this.canvas.height - height, LINE_WIDTH, height);
            }

            if (values.length > this.canvas.width / LINE_WIDTH)
                values.shift();

            lastTime = Date.now();
        }
        loop();
    }
}
