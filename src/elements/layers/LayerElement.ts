import { FocusableElement } from "@base/elements";
import { Button } from "@base/elements/buttons";
import { EventName, IconName } from "@base/types/enums";
import { DOM } from "@base/utils";
import { Layer } from "@source/common/layers";

// TODO: make layer selectable and reordable
@FocusableElement.define("layer-element")
export class LayerElement extends FocusableElement {
    readonly layer: Layer;

    protected _isFocused = false;

    protected readonly _content = DOM.div("layer-content");
    protected readonly _nameText = DOM.span("", "layer-name");
    protected readonly _visibilityButton = Button.action(IconName.VISIBLE);
    protected readonly _locknessButton = Button.action(IconName.UNLOCKED);

    constructor(layer: Layer) {
        super();

        this.layer = layer;

        this.id = "layer-" + layer.id;
        this.classList.add("layer", layer.name + "-layer", "focusable");
        this.tabIndex = 0;

        //
        this._content.append(this._nameText);
        this.append(
            this._content,
            DOM.div("layer-buttons",
                this._visibilityButton,
                this._locknessButton
            )
        );
    }

	startRenaming(): this {
		console.log("Rename!");
		return this;
	}
    shake(): this {
        return DOM.shake(this);
    }

    protected _updateClassList() {
        this.classList.toggle("current", this.layer.isCurrent);
        this.classList.toggle("selected", this.layer.isSelected);
        this.classList.toggle("layer-hidden", !this.layer.isVisible);
        this.classList.toggle("layer-locked", this.layer.isLocked);
    }
    protected _updateButtonsState() {
        this._visibilityButton
            .setIcon(this.layer.isVisible ? IconName.VISIBLE : IconName.HIDDEN)
            .setIsActive(!this.layer.isVisible);
        this._locknessButton
            .setIcon(this.layer.isLocked ? IconName.LOCKED : IconName.UNLOCKED)
            .setIsActive(this.layer.isLocked);
    }
    protected _updateOrder() {
        const index = this.layer.index;
        if (index !== null)
            this.setStyle("order", index.toString());
    }    

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.layer.onDidChosen, this._onChoose.bind(this));
        this.listen(this.layer.onDidUnchosen, this._onUnchoose.bind(this));
        this.listen(this.layer.onDidRemoved, this._onRemove.bind(this));
        this.listen(this.layer.onDidToolDown, this._onToolDown.bind(this));
        this.listen(this.layer.onDidSelected, this._onSelect.bind(this));
        this.listen(this.layer.onDidUnselected, this._onUnselect.bind(this));
        this.listen(this.layer.onDidIndexChanged, this._onIndexChange.bind(this));

        this.listen(this.layer.displayNameState, this._onNameChange.bind(this), true);
        this.listen(this.layer.isVisibleState, this._onVisibilityChange.bind(this), true);
        this.listen(this.layer.isLockedState, this._onLocknessChange.bind(this), true);

        this.listen(this._content, EventName.DOWN, this._onContentDown.bind(this));
        this.listen(this._visibilityButton, EventName.CLICK, this._onVisibilityClick.bind(this));
        this.listen(this._locknessButton, EventName.CLICK, this._onLocknessClick.bind(this));

        this._updateClassList();
        this._updateButtonsState();
        this._updateOrder();
    }
    protected _onInteract(event: KeyboardEvent) {
        super._onInteract(event);
        this.layer.choose();
    }

    protected _onChoose() {
        this.scrollIntoView({ block: "center" });
        this._updateClassList();
    }
    protected _onUnchoose() {
        this._updateClassList();
    }
    protected _onRemove() {
        this.remove();
    }
    protected _onToolDown() {
        if (!this.layer.isEditable) {
            this.shake();
            this.scrollIntoView({ block: "center", behavior: "instant" });
        }
    }
    protected _onSelect() {
        this._updateClassList();
    }
    protected _onUnselect() {
        this._updateClassList();
    }
	protected _onIndexChange() {
		this._updateOrder();
	}
    
    protected _onNameChange(name: string) {
        this._nameText.textContent = name;
    }
    protected _onVisibilityChange(visible: boolean) {
        this._updateClassList();
        this._updateButtonsState();
    }
    protected _onLocknessChange(locked: boolean) {
        this._updateClassList();
        this._updateButtonsState();
    }

    protected _onContentDown(event: PointerEvent) {
        this.layer.choose();
    }
    protected _onVisibilityClick() {
        this.layer.isVisibleState.set(old=> !old);
    }
    protected _onLocknessClick() {
        this.layer.isLockedState.set(old=> !old);
    }
}
