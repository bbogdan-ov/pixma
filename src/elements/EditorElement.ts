import { ActionAttachableElement, BaseElement } from "@base/elements";
import { DOM } from "@base/utils";
import type { Editor } from "@source/Editor";
import type { Project } from "@source/common/project";
import { ColorPickerPanel, LayersPanel, PalettePanel, ToolParamsPanel, ToolsPanel } from "./panels";
import { App } from "@source/App";
import { AppCommand } from "@source/types/enums";
import { AddDrawingLayerAction, RemoveCurrentLayer, SwapColorsAction } from "@source/actions";

// Editor
@BaseElement.define("editor-element")
export class EditorElement extends ActionAttachableElement<App> {
	readonly editor: Editor;

	readonly canvasZoomableWrapper = DOM.div("canvas-zoomable-wrapper");
    
	constructor(editor: Editor) {
		super(editor.app);

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

		// Actions
		this.attachAction(AppCommand.SWAP_COLORS, 				new SwapColorsAction(this));
		this.attachAction(AppCommand.ADD_DRAWING_LAYER_ABOVE, 	new AddDrawingLayerAction(true, this));
		this.attachAction(AppCommand.ADD_DRAWING_LAYER_BELOW, 	new AddDrawingLayerAction(false, this));
		this.attachAction(AppCommand.REMOVE_CURRENT_LAYER,	 	new RemoveCurrentLayer(this));

		// Events
		this.listen(this.editor.app.projects.onDidEntered, this._onProjectEnter.bind(this));
	}
	protected _onProjectEnter(project: Project) {
		this.canvasZoomableWrapper.append(project.canvasZoomable)
	}

	// Get
	getAllowExecCommands(): boolean {
		return true;
	}
}
