import { BaseElement } from "@base/elements";
import { DOM } from "@base/utils";
import type { Editor } from "@source/Editor";
import type { Project } from "@source/common/project";
import { ColorPickerPanel, LayersPanel, PalettePanel, ToolParamsPanel, ToolsPanel } from "./panels";

@BaseElement.define("editor-element")
export class EditorElement extends BaseElement {
	readonly editor: Editor;

	readonly canvasZoomableWrapper = DOM.div("canvas-zoomable-wrapper");
    
	constructor(editor: Editor) {
		super();

		this.editor = editor;

		const app = editor.app;

		this.classList.add("editor");
		this.append(
            DOM.div("panel-slot orientation-vertical",
                new ToolsPanel(app)
            ),
            DOM.div("size-fill col",
                DOM.div("panel-slot orientation-horizontal ph-0",
                    new ToolParamsPanel(app),
                ),
				this.canvasZoomableWrapper,
            ),
            DOM.div("row",
                DOM.div("panel-slot orientation-vertical pr-0",
                    new PalettePanel(app),
                ),
                DOM.div("col",
                    DOM.div("panel-slot orientation-vertical pb-0",
                        new LayersPanel(app),
                    ),
                    DOM.div("panel-slot orientation-vertical",
                        new ColorPickerPanel(app)
                    )
                )
            )
		)
	}

	onMount(): void {
	    super.onMount();

		this.listen(this.editor.app.projects.onDidEntered, this._onProjectEnter.bind(this));
	}
	protected _onProjectEnter(project: Project) {
		this.canvasZoomableWrapper.append(project.canvasZoomable)
	}
}
