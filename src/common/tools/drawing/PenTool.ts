import DrawingTool from "../DrawingTool";
import type App from "@source/App";

export default class PenTool extends DrawingTool {
    static readonly NAME = "pen";

    constructor(app: App) {
        super(PenTool.NAME, app);
    }
}
