import { Manager } from "@base/managers";
import { ColorState, State, Trigger } from "@base/common/listenable";
import { Utils } from "@base/utils";
import { Color } from "@base/common/misc";
import type App from "@source/App";
import { CircleBrush, type Brush } from "@source/common/brushes";

export default class BrushesManager extends Manager {
    readonly app: App;

    protected _current: Brush | null = null;
    readonly frontColorState = new ColorState(Color.WHITE);
    readonly backColorState = new ColorState(Color.BLACK);
    readonly sizeState = new State<number>(1);

    readonly onDidChosen = new Trigger<Brush>();
    
    constructor(app: App) {
        super();

        this.app = app;

        // TEMP:
        this._current = new CircleBrush();

        this.sizeState.apply = value=> {
            let max = 100;
            if (this.current) max = this.current.maxSize;
            return Utils.clamp(value, 1, max);
        }

        this.current?.render(this.getFrontColor(), this.size);
        this.sizeState.listen(value=> {
            this.current?.render(this.getFrontColor(), value);
        })
        this.frontColorState.listen(color=> {
            this.current?.render(color, this.size);
        })
    }

    choose(brush: Brush): boolean {
        if (this.current === brush) return false;

        this._current = brush;
        this.onDidChosen.trigger(brush);
        return true;
    }
    swapColors(): boolean {
        const front = this.getFrontColor();
        this.setFrontColor(this.getBackColor());
        this.setBackColor(front);
        return true;
    }

    // Set
    setSize(value: number): boolean {
        this.sizeState.set(value);
        return true;
    }
    setFrontColor(color: Color): boolean {
        this.frontColorState.set(color);
        return true;
    }
    setBackColor(color: Color): boolean {
        this.backColorState.set(color);
        return true;
    }

    // Get
    getFrontColor(): Color {
        return this.frontColorState.getColor();
    }
    getBackColor(): Color {
        return this.backColorState.getColor();
    }
    get current(): Brush | null {
        return this._current;
    }
    get size(): number {
        return this.sizeState.value;
    }
}
