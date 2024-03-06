import { Registry } from "@base/registries";
import { EraseTool, PenTool, Tool } from "@source/common/tools";
import type App from "@source/App";

export type RegisteredToolCallback = (app: App)=> Tool;

export default class ToolsRegistry extends Registry<RegisteredToolCallback> {
    constructor() {
        super();

        this.register(PenTool.NAME, a=> new PenTool(a));
        this.register(EraseTool.NAME, a=> new EraseTool(a));
    }
}
