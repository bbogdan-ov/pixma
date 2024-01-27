import { Registry } from "@base/registries";
import { EraseTool, PenTool, Tool } from "@source/common/tools";

export default class ToolsRegistry extends Registry<Tool> {
    constructor() {
        super();

        this.register(PenTool.NAME, new PenTool());
        this.register(EraseTool.NAME, new EraseTool());
    }
}
