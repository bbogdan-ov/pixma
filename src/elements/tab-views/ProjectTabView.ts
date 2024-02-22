import { ToolsPanel, LayersPanel, ColorPickerPanel } from "../panels";
import { DOM } from "@base/utils";
import { CanvasZoomable } from "../canvas";
import ToolParamsPanel from "../panels/ToolParamsPanel";
import type { ProjectTab } from "@source/common/tabs";
import { TabView } from "@base/elements/tabs";
import PalettePanel from "../panels/PalettePanel";

@TabView.define("project-tab-view")
export default class ProjectTabView extends TabView {
    readonly canvasZoomable: CanvasZoomable;
    
    constructor(tab: ProjectTab) {
        super(tab);

        const project = tab.project;

        this.classList.add("project-tab-view");

        this.canvasZoomable = new CanvasZoomable(project);

        this.append(
            DOM.div("panel-slot orientation-vertical",
                new ToolsPanel(project.app),
            ),
            DOM.div("size-fill col",
                DOM.div("panel-slot orientation-horizontal ph-0",
                    new ToolParamsPanel(project.app),
                ),
                this.canvasZoomable
            ),
            DOM.div("row",
                DOM.div("panel-slot orientation-vertical pr-0",
                    new PalettePanel(project),
                ),
                DOM.div("col",
                    DOM.div("panel-slot orientation-vertical pb-0",
                        new LayersPanel(project),
                    ),
                    DOM.div("panel-slot orientation-vertical",
                        new ColorPickerPanel(project.app)
                    )
                )
            )
        )
    }
}
