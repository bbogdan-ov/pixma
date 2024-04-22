import { Point } from "@base/common/math";
import { RgbaColor } from "@base/types/types";
import { ImageDataPixelCallback, PointCallback } from "@source/types/types";
import { ImageUtils } from ".";
import { Color } from "@base/common/misc";

export class Algorithms {
    /** 
     * Code from https://gist.github.com/DavidMcLaughlin208/60e69e698e3858617c322d80a8f174e2
     * Very cool!
     */
    static line(fromX: number, fromY: number, toX: number, toY: number, pixel: PointCallback): Point {
        const res = new Point(fromX, fromY);
        pixel(fromX, fromY);
        
        if (fromX == toX && fromY == toY) {
            return res;
        }

        const xDiff = fromX - toX;
        const yDiff = fromY - toY;
        const xDiffIsLarger = Math.abs(xDiff) > Math.abs(yDiff);

        const xModifier = xDiff < 0 ? 1 : -1;
        const yModifier = yDiff < 0 ? 1 : -1;

        const longerSideLength = Math.max(Math.abs(xDiff), Math.abs(yDiff));
        const shorterSideLength = Math.min(Math.abs(xDiff), Math.abs(yDiff));
        const slope = (shorterSideLength == 0 || longerSideLength == 0) ? 0 : shorterSideLength / longerSideLength;

        let shorterSideIncrease;
        for (let i = 1; i <= longerSideLength; i++) {
            shorterSideIncrease = Math.round(i * slope);
            let yIncrease, xIncrease;
            if (xDiffIsLarger) {
                xIncrease = i;
                yIncrease = shorterSideIncrease;
            } else {
                yIncrease = i;
                xIncrease = shorterSideIncrease;
            }
            const currentY = fromY + (yIncrease * yModifier);
            const currentX = fromX + (xIncrease * xModifier);

            pixel(currentX, currentY);
            res.x = currentX;
            res.y = currentY;
        }

        return res;
    }

    static linearFill(data: Uint8ClampedArray, fieldWidth: number, fieldHeight: number, atX: number, atY: number, rgbaColorToFill: RgbaColor, diagonally: boolean, pixel: ImageDataPixelCallback, checkVisitedPixels: boolean=true) {
        atX = Math.floor(atX);
        atY = Math.floor(atY);

        if (!new Point(atX, atY).inBounds(0, 0, fieldWidth-1, fieldHeight-1)) return;
        
        const queue: [x: number, y: number][] = [[atX, atY]];
        let isLeft = false;
        let isRight = false;
    
        function compareColorAt(pixelIndex: number, color: RgbaColor): boolean {
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];
            const a = data[pixelIndex + 3];
            
			if (a == color[3])
				return true;
            return (r == color[0] && g == color[1] && b == color[2]);
        }
        
        while (queue.length > 0) {
            isLeft = false;
            isRight = false;
    
            const curPixel = queue[queue.length-1];
            queue.pop()
    
            let posX = curPixel[0];
            let posY = curPixel[1];
    
            let curPixelIndex = (posY * fieldWidth + posX) * 4;
    
            while (posY-- >= 0 && compareColorAt(curPixelIndex, rgbaColorToFill)) {
                curPixelIndex -= fieldWidth * 4;
            }
            curPixelIndex += fieldWidth * 4;
            ++ posY;
            
            while (posY++ < fieldHeight - 1 && compareColorAt(curPixelIndex, rgbaColorToFill)) {
                pixel(posX, posY, curPixelIndex);
                
                if (posX > 0) {
                    if (!isLeft && compareColorAt(curPixelIndex-4, rgbaColorToFill)) {
						queue.push([posX - 1, posY]);
						isLeft = true;
                    } else if (isLeft) {
                        isLeft = false;
                    }
                }
    
                if (posX < fieldWidth - 1) {
					if (!isRight && compareColorAt(curPixelIndex+4, rgbaColorToFill)) {
						queue.push([posX + 1, posY]);
						isRight = true;
                    } else if (isRight) {
                        isRight = false;
                    }
                }
    
                if (checkVisitedPixels) {
                    data[curPixelIndex] = -1;
                    data[curPixelIndex+1] = -1;
                    data[curPixelIndex+2] = -1;
                    data[curPixelIndex+3] = -1;
                }
                curPixelIndex += fieldWidth * 4;
            }
        }
    }
    static fillSame(data: Uint8ClampedArray, fieldWidth: number, rgbaColorToFill: RgbaColor, pixel: ImageDataPixelCallback) {
        for (let pixelIndex = 0; pixelIndex < Math.floor(data.length/4); pixelIndex ++) {
            const pixelPos = Point.fromIndex(pixelIndex, fieldWidth);
            const pixelColor = ImageUtils.getColorAt(data, pixelIndex*4);
            
            if (Color.compare(pixelColor, rgbaColorToFill)) {
                pixel(pixelPos.x, pixelPos.y, pixelIndex*4);
            }
        }
    }
    
    static ellipse(cx: number, cy: number, radiusX: number, radiusY: number, pixel: PointCallback) {
        if (radiusY == 0) {
            this.line(cx-radiusX, cy-radiusY, cx+radiusX, cy+radiusY, pixel);
            return;
        }
        
        var dx, dy, d1, d2, x, y;
        x = 0;
        y = radiusY;
     
        d1 = (radiusY * radiusY) - (radiusX * radiusX * radiusY) + (0.25 * radiusX * radiusX);
        dx = 2 * radiusY * radiusY * x;
        dy = 2 * radiusX * radiusX * y;
     
        while (dx < dy) {        
    
            pixel(x+cx, y+cy);
            pixel(-x+cx, y+cy);
            pixel(x+cx, -y+cy);
            pixel(-x+cx, -y+cy);
     
            if (d1 < 0) {
                x++;
                dx = dx + (2 * radiusY * radiusY);
                d1 = d1 + dx + (radiusY * radiusY);
            }
            else {
                x++;
                y--;
                dx = dx + (2 * radiusY * radiusY);
                dy = dy - (2 * radiusX * radiusX);
                d1 = d1 + dx - dy + (radiusY * radiusY);
            }
        }
     
        d2 = ((radiusY * radiusY) * ((x + 0.5) * (x + 0.5))) +
             ((radiusX * radiusX) * ((y - 1) * (y - 1))) -
              (radiusX * radiusX * radiusY * radiusY);
     
        while (y >= 0) {
     
            pixel(x+cx, y+cy);
            pixel(-x+cx, y+cy);
            pixel(x+cx, -y+cy);
            pixel(-x+cx, -y+cy);
     
            if (d2 > 0) {
                y--;
                dy = dy - (2 * radiusX * radiusX);
                d2 = d2 + (radiusX * radiusX) - dy;
            }
            else {
                y--;
                x++;
                dx = dx + (2 * radiusY * radiusY);
                dy = dy - (2 * radiusX * radiusX);
                d2 = d2 + dx - dy + (radiusX * radiusX);
            }
        }
    }

    static rectangle(x: number, y: number, width: number, height: number, pixel: PointCallback) {
        x = Math.floor(x);
        y = Math.floor(y);
        width = Math.round(width);
        height = Math.round(height);
        
        if (width > 0) {
            for (let top = 0; top < width; top ++) {
                pixel(x + top, y);
            }
            for (let bottom = 0; bottom < width; bottom ++) {
                pixel(x + bottom, y + height);
            }
        } else {
            for (let top = 0; top < Math.abs(width); top ++) {
                pixel(x - top, y);
            }
            for (let bottom = 0; bottom < Math.abs(width); bottom ++) {
                pixel(x - bottom, y + height);
            }
        }

        if (height > 0) {
            for (let right = 0; right < height+1; right ++) {
                pixel(x + width, y + right);
            }
            for (let left = 0; left < height; left ++) {
                pixel(x, y + left);
            }
        } else {
            for (let right = 0; right < Math.abs(height-1); right ++) {
                pixel(x + width, y - right);
            }
            for (let left = 0; left < Math.abs(height); left ++) {
                pixel(x, y - left);
            }
        }
    }
}
