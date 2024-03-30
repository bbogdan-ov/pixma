import { KeyCode } from "@base/types/enums";
import { Bind } from ".";
import { Utils } from "@base/utils";

export class KeyBind extends Bind {
    readonly code: KeyCode;

    constructor(code: KeyCode, ctrl=false, shift=false, alt=false) {
        super(ctrl, shift, alt);

        this.code = code;
    }

    get(event: Event): boolean {
        return Utils.formatKeyCode((event as any).code) == Utils.formatKeyCode(this.code) && super.get(event);
    }

    // Static
	static fromEvent(event: Event): KeyBind | null { 
		const ev = event as KeyboardEvent;
		if (!ev.code) return null;
		return new KeyBind(
			Utils.formatKeyCode(ev.code) as KeyCode,
			ev.ctrlKey,
			ev.shiftKey,
			ev.shiftKey
		);
	}
	
    static get A(): KeyBind {
        return new KeyBind(KeyCode.A);
    }
    static get B(): KeyBind {
        return new KeyBind(KeyCode.B);
    }
    static get C(): KeyBind {
        return new KeyBind(KeyCode.C);
    }
    static get D(): KeyBind {
        return new KeyBind(KeyCode.D);
    }
    static get E(): KeyBind {
        return new KeyBind(KeyCode.E);
    }
    static get F(): KeyBind {
        return new KeyBind(KeyCode.F);
    }
    static get G(): KeyBind {
        return new KeyBind(KeyCode.G);
    }
    static get H(): KeyBind {
        return new KeyBind(KeyCode.H);
    }
    static get I(): KeyBind {
        return new KeyBind(KeyCode.I);
    }
    static get J(): KeyBind {
        return new KeyBind(KeyCode.J);
    }
    static get K(): KeyBind {
        return new KeyBind(KeyCode.K);
    }
    static get L(): KeyBind {
        return new KeyBind(KeyCode.L);
    }
    static get M(): KeyBind {
        return new KeyBind(KeyCode.M);
    }
    static get N(): KeyBind {
        return new KeyBind(KeyCode.N);
    }
    static get O(): KeyBind {
        return new KeyBind(KeyCode.O);
    }
    static get P(): KeyBind {
        return new KeyBind(KeyCode.P);
    }
    static get Q(): KeyBind {
        return new KeyBind(KeyCode.Q);
    }
    static get R(): KeyBind {
        return new KeyBind(KeyCode.R);
    }
    static get S(): KeyBind {
        return new KeyBind(KeyCode.S);
    }
    static get T(): KeyBind {
        return new KeyBind(KeyCode.T);
    }
    static get U(): KeyBind {
        return new KeyBind(KeyCode.U);
    }
    static get V(): KeyBind {
        return new KeyBind(KeyCode.V);
    }
    static get W(): KeyBind {
        return new KeyBind(KeyCode.W);
    }
    static get X(): KeyBind {
        return new KeyBind(KeyCode.X);
    }
    static get Y(): KeyBind {
        return new KeyBind(KeyCode.Y);
    }
    static get Z(): KeyBind {
        return new KeyBind(KeyCode.Z);
    }

    static get F1(): KeyBind {
        return new KeyBind(KeyCode.F1);
    }
    static get F2(): KeyBind {
        return new KeyBind(KeyCode.F2);
    }
    static get F3(): KeyBind {
        return new KeyBind(KeyCode.F3);
    }
    static get F4(): KeyBind {
        return new KeyBind(KeyCode.F4);
    }
    static get F5(): KeyBind {
        return new KeyBind(KeyCode.F5);
    }
    static get F6(): KeyBind {
        return new KeyBind(KeyCode.F6);
    }
    static get F7(): KeyBind {
        return new KeyBind(KeyCode.F7);
    }
    static get F8(): KeyBind {
        return new KeyBind(KeyCode.F8);
    }
    static get F9(): KeyBind {
        return new KeyBind(KeyCode.F9);
    }
    static get F10(): KeyBind {
        return new KeyBind(KeyCode.F10);
    }
    static get F11(): KeyBind {
        return new KeyBind(KeyCode.F11);
    }
    static get F12(): KeyBind {
        return new KeyBind(KeyCode.F12);
    }

    static get PAGE_UP(): KeyBind {
        return new KeyBind(KeyCode.PAGE_UP);
    }
    static get PAGE_DOWN(): KeyBind {
        return new KeyBind(KeyCode.PAGE_DOWN);
    }
    static get HOME(): KeyBind {
        return new KeyBind(KeyCode.HOME);
    }
    static get END(): KeyBind {
        return new KeyBind(KeyCode.END);
    }
    static get DELETE(): KeyBind {
        return new KeyBind(KeyCode.DELETE);
    }
    static get PAUSE(): KeyBind {
        return new KeyBind(KeyCode.PAUSE);
    }

    static get ONE(): KeyBind {
        return new KeyBind(KeyCode.ONE);
    }
    static get TWO(): KeyBind {
        return new KeyBind(KeyCode.TWO);
    }
    static get THREE(): KeyBind {
        return new KeyBind(KeyCode.THREE);
    }
    static get FOUR(): KeyBind {
        return new KeyBind(KeyCode.FOUR);
    }
    static get FIVE(): KeyBind {
        return new KeyBind(KeyCode.FIVE);
    }
    static get SIX(): KeyBind {
        return new KeyBind(KeyCode.SIX);
    }
    static get SEVEN(): KeyBind {
        return new KeyBind(KeyCode.SEVEN);
    }
    static get EIGHT(): KeyBind {
        return new KeyBind(KeyCode.EIGHT);
    }
    static get NINE(): KeyBind {
        return new KeyBind(KeyCode.NINE);
    }
    static get ZERO(): KeyBind {
        return new KeyBind(KeyCode.ZERO);
    }

    static get MINUS(): KeyBind {
        return new KeyBind(KeyCode.MINUS);
    }
    static get ADD(): KeyBind {
        return new KeyBind(KeyCode.ADD);
    }
    static get MULTIPLY(): KeyBind {
        return new KeyBind(KeyCode.MULTIPLY);
    }
    static get DIVIDE(): KeyBind {
        return new KeyBind(KeyCode.DIVIDE);
    }
    static get BACKQUOTE(): KeyBind {
        return new KeyBind(KeyCode.BACKQUOTE);
    }
    static get QUOTE(): KeyBind {
        return new KeyBind(KeyCode.QUOTE);
    }
    static get SLASH(): KeyBind {
        return new KeyBind(KeyCode.SLASH);
    }
    static get BACKSLASH(): KeyBind {
        return new KeyBind(KeyCode.BACKSLASH);
    }
    static get SEMICOLON(): KeyBind {
        return new KeyBind(KeyCode.SEMICOLON);
    }
    static get BRACKET_LEFT(): KeyBind {
        return new KeyBind(KeyCode.BRACKET_LEFT);
    }
    static get BRACKET_RIGHT(): KeyBind {
        return new KeyBind(KeyCode.BRACKET_RIGHT);
    }

    static get CONTROL(): KeyBind {
        return new KeyBind(KeyCode.CONTROL);
    }
    static get SHIFT(): KeyBind {
        return new KeyBind(KeyCode.SHIFT);
    }
    static get ALT(): KeyBind {
        return new KeyBind(KeyCode.ALT);
    }
    static get TAB(): KeyBind {
        return new KeyBind(KeyCode.TAB);
    }
    static get ENTER(): KeyBind {
        return new KeyBind(KeyCode.ENTER);
    }
    static get SPACE(): KeyBind {
        return new KeyBind(KeyCode.SPACE);
    }
    static get BACKSPACE(): KeyBind {
        return new KeyBind(KeyCode.BACKSPACE);
    }
    static get ESCAPE(): KeyBind {
        return new KeyBind(KeyCode.ESCAPE);
    }
    static get CONTEXT_MENU(): KeyBind {
        return new KeyBind(KeyCode.CONTEXT_MENU);
    }

    static get ARROW_LEFT(): KeyBind {
        return new KeyBind(KeyCode.ARROW_LEFT);
    }
    static get ARROW_RIGHT(): KeyBind {
        return new KeyBind(KeyCode.ARROW_RIGHT);
    }
    static get ARROW_UP(): KeyBind {
        return new KeyBind(KeyCode.ARROW_UP);
    }
    static get ARROW_DOWN(): KeyBind {
        return new KeyBind(KeyCode.ARROW_DOWN);
    }
}
