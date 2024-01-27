import { RgbaColor } from "@base/types/types";

export default class ImageUtils {
    static getColorAt(data: Uint8Array, byteIndex: number): RgbaColor {
        return [
            data[byteIndex],
            data[byteIndex+1],
            data[byteIndex+2],
            data[byteIndex+3],
        ]
    }
}
