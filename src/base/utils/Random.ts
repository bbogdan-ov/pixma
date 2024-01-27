export default class Random {
    static float(from: number, to: number): number {
        return Math.random() * (to - from) + from;
    }
    static int(from: number, to: number): number {
        return Math.ceil(this.float(from, to));
    }
    static bool(chance=.5): boolean {
        return Math.random() <= chance;
    }
    static index(length: number): number {
        return this.int(0, length-1);
    }
    static item<T>(array: T[]): T {
        return array[this.index(array.length)];
    }
}
