import { Point } from "@base/common/math";
import { KeyCode } from "@base/types/enums";
import { IMouseData } from "@base/types/types";
import { Utils } from ".";

export default class EventUtils {
    static getKeyCode(event: Event): KeyCode | null {
        const e = event as KeyboardEvent;
        if (e.code === undefined) return null;

        return (KeyCode as any)[Utils.formatKeyCode(e.code)] || null;
    }

    static getMouseData(event: Event): IMouseData | null {
        const ev = event as MouseEvent;
        if (ev.button === undefined) return null;

        return {
            pos: new Point(ev.clientX, ev.clientY),
            start: new Point(ev.clientX, ev.clientY),
            end: new Point(ev.clientX, ev.clientY),
            last: new Point(ev.clientX, ev.clientY),
            movement: new Point(0, 0),

            pressedButton: ev.button,
            isCtrlPressed: ev.ctrlKey,
            isShiftPressed: ev.shiftKey,
            isAltPressed: ev.altKey,
        }
    }
}
