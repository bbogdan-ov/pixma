import { Color } from "@base/common/misc";

export class Brush {
    constructor() {}

    render(context: CanvasRenderingContext2D, color: Color, size: number) {
		// your implement goes here
    }

    // Get
    get maxSize(): number {
        return 100;
    }
}
