import { Manager } from "@base/managers";
import { ColorState, State, Trigger } from "@base/common/listenable";
import { Utils } from "@base/utils";
import { Color } from "@base/common/misc";
import type App from "@source/App";
import { CircleBrush, type Brush } from "@source/common/brushes";
import { RgbColor } from "@base/types/types";

export default class BrushesManager extends Manager {
    readonly app: App;

    protected _current: Brush | null = null;
    readonly colorState = new State<RgbColor>([255, 255, 255]);
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

        this.sizeState.listen(value=> {
            this.current?.render(this.getColor(), value);
        })
        this.colorState.listen(color=> {
            this.current?.render(color, this.size);
        })
    }

    choose(brush: Brush): boolean {
        if (this.current === brush) return false;

        this._current = brush;
        this.onDidChosen.trigger(brush);
        return true;
    }

    setSize(value: number): boolean {
        this.sizeState.set(value);
        return true;
    }
    setColor(color: Color): boolean {
        this.colorState.set(color);
        return true;
    }

    // Get
    getColor(): Color {
        return this.colorState.getColor();
    }
    get current(): Brush | null {
        return this._current;
    }
    get size(): number {
        return this.sizeState.value;
    }
}
