import { ValueType } from "@base/types/types";

export default class Dev {
    static readonly IS_DEV = import.meta.env.DEV;

    static todo(message="") {
        if (this.IS_DEV) {
            if (message)
                console.warn(`The code isnt implemented! TODO: ${ message }`);
            else
                console.warn("The code isnt implemented!");
        }
    }
    
    static assertType(value: any, type: ValueType): boolean {
        return this.assert(typeof value == type, `typeof value (${ value }) == "${ type }"`);
    }
    static assert(condidtion: boolean, ...message: any[]): boolean {
        if (condidtion) return true;

        this.throwError("Assertion failed:", ...message);
        return false;
    }
    static throwError(...message: any[]) {
        if (this.IS_DEV)
            throw new Error(message.join(" "));
        else
            this.error(...message);
    }
    static error(...message: any[]) {
        console.error(...message)
    }
    static log(...message: any[]) {
        if (this.IS_DEV)
            console.log(...message);
    }
    static warn(...message: any[]) {
        if (this.IS_DEV)
            console.warn(...message);
    }
}
