export default class Canvas {
    readonly element: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    
    constructor(element?: HTMLCanvasElement) {
        this.element = element || document.createElement("canvas");
        // TODO: catch context 2d missed support
        this.context = this.element.getContext("2d")!;
        this.context.imageSmoothingEnabled = false;
    }

    // Set
    setSize(width: number, height: number): this {
        this.element.width = Math.floor(width);
        this.element.height = Math.floor(height);
        this.context.imageSmoothingEnabled = false;
        return this;
    }

    // Get
    getImageData(x=0, y=0, width=this.width, height=this.height): ImageData {
        return this.context.getImageData(x, y, width, height);
    }
    getDataUrl(type?: string, quality?: number): string {
        return this.element.toDataURL(type, quality);
    }
    get width(): number {
        return this.element.width;
    }
    get height(): number {
        return this.element.height;
    }
    get style(): CSSStyleDeclaration {
        return this.element.style;
    }

    // Static
    static sized(width: number, height: number): Canvas {
        return new Canvas().setSize(width, height);
    }
}
