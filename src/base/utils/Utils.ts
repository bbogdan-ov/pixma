export class Utils {
    // Value
    /** Asserts that value isn't equal to `undefined` or `null` */
    static exists<T>(value: T | undefined | null): value is T {
        return value !== undefined && value !== null;
    }
    /** Parses a number from a string using regular expressions *(smarter than `parseFloat()` :) )* */
    static safeParseNumber(string: string, safe=0, int=true): number {
        string = string.trim();
        if (!string)
            return safe;

        const parseFunc = (v: string)=> int ? parseInt(v) : parseFloat(v);

        const num = parseFunc(parseFunc(string.replace(/(?!\.(?!.*\.))\D/gm, "")).toFixed(8).slice(0, 16));
        if (num.toString() === "NaN")
            return safe;
        return num;
    }
    /**
     * Calculates a math expression from a string
     * 
     * Examples:
     * - `"2+2"` -> `4`
     * - `"3 asoicjaosicj* 2"` -> `6`
     * - `""` -> `0`
     * - `"Math.sin(Math.PI)"` -> `0` because it's removes all symbols except numbers, `+-*.` and `slash`
     */
    static safeEvalNumber(expr: string, safe=0): number {
        expr = expr.trim();
        if (!expr)
            return safe;

        expr = expr.replace(/(?!\.|-|\+|\/|\*)\D|(?<=\D)\.(?=\D)/gmi, "");

        try {
            return eval(expr) ?? safe;
        } catch {
            return safe;
        }
    }

    // String
    /** Makes only first letter in a string UPPERCASE */
    static capitalize(string: string): string {
        return string[0].toUpperCase() + string.slice(1);
    }

    // Array
    /** Removes an item from the array and returns its index if exists, otherwise returns `null` */
    static removeItem<T>(array: T[], item: T): number | null {
        const index = this.indexOf(array, item);
        if (!this.exists(index) || index < 0) return null

        array.splice(index, 1);
        return index;
    }
    /** Inserts an item at specific index into an array */
    static insertItem<T>(array: T[], item: T, index: number) {
        array.splice(index, 0, item);
    }
    /**
     * Clears the array without creating a new one
     * Useful when need to save a ref to this array
     */
    static clearArray<T>(array: T[]) {
        array.splice(0, array.length);
    }
    /** Check if `array` contain at least one item in `items` array */
    static includesAnyOf<T>(array: T[], items: T[]): boolean {
        for (const item of items) {
            if (array.includes(item))
                return true;
        }

        return false;
    }
    /** Returns index of `item` in `array` if exists, otherwise returns `null` */
    static indexOf<T>(array: T[], item: T): number | null {
        const index = array.indexOf(item);
        if (index >= 0)
            return index;
        return null;
    }

    // Object
    /** Returns a value of the object at some index if exists, otherwise returns `null` */
    static getValueAt<T extends object>(obj: T, index: number): (T[keyof T]) | null {
        return Object.values(obj)[index] || null;
    }

    // Math
    /** Keeps `value` between `min` and `max` */
    static clamp(value: number, min: number | null, max: number | null): number {
        if (min !== null && value < min)
            return min;
        if (max !== null && value > max)
            return max;
        return value;
    }
}
