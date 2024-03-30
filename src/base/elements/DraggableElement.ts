import { EventName } from "@base/types/enums";
import { BaseElement } from ".";

@BaseElement.define("draggable-element")
export class DraggableElement extends BaseElement {
	protected _isDragging = false;

	constructor() {
		super();

		this.classList.add("draggable");
		this.draggable = true;
	}

	// On	
	onMount(): void {
        super.onMount();

		this.listen(this, EventName.DRAG_START, this._onDragStart.bind(this));
		this.listen(this, EventName.DRAG, this._onDrag.bind(this));
		this.listen(this, EventName.DRAG_END, this._onDragEnd.bind(this));
    }
	protected _onDragStart(event: DragEvent) {
		this._isDragging = true;
	}
	protected _onDrag(event: DragEvent) {}
	protected _onDragEnd(event: DragEvent) {
		this._isDragging = false;
	}

	// Get
	get isDragging(): boolean {
		return this._isDragging;
	}
}
