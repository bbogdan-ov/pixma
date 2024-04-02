import { Manager } from "@base/managers";
import { ColorState, State, Trigger } from "@base/common/listenable";
import { Color } from "@base/common/misc";
import { type Brush, CircleBrush } from "@source/common/brushes";
import type { App } from "@source/App";

export class BrushesManager extends Manager {
    readonly app: App;

    protected _current: Brush | null = null;
    readonly frontColorState = new ColorState(Color.WHITE);
    readonly backColorState = new ColorState(Color.BLACK);
    readonly sizeState = new State<number>(1);

    readonly onDidChosen = new Trigger<Brush>();
    
    constructor(app: App) {
        super();

        this.app = app;

        this._current = new CircleBrush();
    }

    choose(brush: Brush): boolean {
        if (this.current === brush) return false;

        this._current = brush;
        this.onDidChosen.trigger(brush);
        return true;
    }
    swapColors(): boolean {
        const front = this.frontColor.clone();
        this.setFrontColor(this.backColor.clone());
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
    get frontColor(): Color {
        return this.frontColorState.color;
    }
    get backColor(): Color {
        return this.backColorState.color;
    }
    get current(): Brush | null {
        return this._current;
    }
    get size(): number {
        return this.sizeState.value;
    }
}
