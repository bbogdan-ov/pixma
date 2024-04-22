import { RgbaColor } from "@base/types/types";

export class ImageUtils {
    static getColorAt(data: Uint8ClampedArray, byteIndex: number): RgbaColor {
        return [
            data[byteIndex],
            data[byteIndex+1],
            data[byteIndex+2],
            data[byteIndex+3],
        ]
    }
}
