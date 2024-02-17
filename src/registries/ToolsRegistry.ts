import { Registry } from "@base/registries";
import { EraseTool, PenTool, Tool } from "@source/common/tools";
import type App from "@source/App";

export default class ToolsRegistry extends Registry<Tool> {
    constructor(app: App) {
        super();

        this.register(PenTool.NAME, new PenTool(app));
        this.register(EraseTool.NAME, new EraseTool(app));
    }
}
