import { Color } from "@base/common/misc";
import { BaseElement } from "..";
import { ColorState, State } from "@base/common/listenable";
import { ColorValueRange, HueRange, SaturationRange } from "../ranges";
import { EventName, MouseButton } from "@base/types/enums";
import { DOM, Utils } from "@base/utils";
import { HexColor, HsvColor, RgbColor } from "@base/types/types";
import { HexInput, NumberInput } from "../inputs";

@BaseElement.define("color-picker")
export class ColorPicker extends BaseElement {
    protected _isChanging = false;

    readonly state: ColorState;

    protected readonly _hueState: State<number>;
    protected readonly _saturationState: State<number>;
    protected readonly _valueState: State<number>;
    protected readonly _redState: State<number>;
    protected readonly _greenState: State<number>;
    protected readonly _blueState: State<number>;
    protected readonly _hexState: State<HexColor>;

    readonly field: HTMLDivElement;
    readonly cursor: HTMLDivElement;

    readonly hueRange: HueRange;
    readonly saturationRange: SaturationRange;
    readonly valueRange: ColorValueRange;

	readonly hsvInputs = DOM.div("row");
	readonly hueInput: NumberInput;
	readonly saturationInput: NumberInput;
	readonly valueInput: NumberInput;

	readonly rgbInputs = DOM.div("row");
	readonly redInput: NumberInput;
	readonly greenInput: NumberInput;
	readonly blueInput: NumberInput;

	readonly hexInput: HexInput;
    
    constructor(state?: ColorState) {
        super();

        this.state = state || new ColorState(Color.WHITE);

        this._hueState = new State(this.state.hue);
        this._saturationState = new State(this.state.saturation);
        this._valueState = new State(this.state.value);
		this._redState = new State(this.state.red);
		this._greenState = new State(this.state.green);
		this._blueState = new State(this.state.blue);
		this._hexState = new State(this.state.hex);
        
        this.field = DOM.div("picker-field");
        this.cursor = DOM.div("cursor");
        this.hueRange = new HueRange(this._hueState);
        this.saturationRange = new SaturationRange(this.state.hue, this._saturationState);
        this.valueRange = new ColorValueRange(this.state.hue, this.state.saturation, this._valueState);
		this.hueInput = new NumberInput(this._hueState)
			.setLabel("H")
			.setFixed(1).setClamp(0, 360);
		this.saturationInput = new NumberInput(this._saturationState)
			.setLabel("S")
			.setFixed(1).setClamp(0, 100);
		this.valueInput = new NumberInput(this._valueState)
			.setLabel("V")
			.setFixed(1).setClamp(0, 100);
		this.redInput = new NumberInput(this._redState)
			.setLabel("R")
			.setFixed(1).setClamp(0, 255);
		this.greenInput = new NumberInput(this._greenState)
			.setLabel("G")
			.setFixed(1).setClamp(0, 255);
		this.blueInput = new NumberInput(this._blueState)
			.setLabel("B")
			.setFixed(1).setClamp(0, 255);
		this.hexInput = new HexInput(this._hexState as State<string>)
			.setLabel("#")
			.hideHashChar();

        this.classList.add("color-picker");

        this.field.append(DOM.div("hue-gradient"));
        this.field.append(DOM.div("saturation-gradient"));
        this.field.append(DOM.div("value-gradient"));
        this.field.append(this.cursor);

		this.hsvInputs.append(
			this.hueInput,
			this.saturationInput,
			this.valueInput
		);
		this.rgbInputs.append(
			this.redInput,
			this.greenInput,
			this.blueInput,
		);

        this.append(
            this.field,
            DOM.div("picker-inputs",
				this.hueRange,
				this.saturationRange,
				this.valueRange,

				this.hsvInputs,
				this.rgbInputs,
				this.hexInput
            )
        );
    }

	hideSaturationRange(hidden=true): this {
		this.saturationRange.setDisplacement(!hidden);
		return this;
	}
	hideValueRange(hidden=true): this {
		this.valueRange.setDisplacement(!hidden);
		return this;
	}
	hideHsvInputs(hidden=true): this {
		this.hsvInputs.style.display = hidden ? "none" : "";
		return this;
	}
	hideRgbInputs(hidden=true): this {
		this.rgbInputs.style.display = hidden ? "none" : "";
		return this;
	}
	hideHexInput(hidden=true): this {
		this.hexInput.setDisplacement(!hidden);
		return this;
	}

    protected _updateCursor() {
        const x = this.saturation / 100;
        const y = 1 - this.colorValue / 100;

        this.cursor.style.left = x * 100 + "%";
        this.cursor.style.top  = y * 100 + "%";
    }
    protected _updateCss() {
        const color = Color.fromHsv([this.hue, this.saturation, this.colorValue]);
        
        this.style.setProperty("--data-hue", this.hue.toString());
        this.style.setProperty("--data-color", color.getRgbString());
    }
    protected _updateRanges() {
        this.saturationRange.update(this.hue);
        this.valueRange.update(this.hue, this.saturation);
    }
	protected _updateHsv() {
		const hsv = Color.convert.rgb.hsv(this.rgb);
		this._hueState.set(hsv[0]);
		this._saturationState.set(hsv[1]);
		this._valueState.set(hsv[2]);
	}
	protected _updateRgb() {
		const rgb = Color.convert.hsv.rgb(this.hsv);
		this._redState.set(rgb[0]);
		this._greenState.set(rgb[1]);
		this._blueState.set(rgb[2]);
	}
	protected _updateHex() {
		const hex = Color.convert.hsv.hex(this.hsv);
		this._hexState.set(Color.formatHex(hex));
	}
    protected _updateState() {
		this.state.setHsv(this.hsv);
    }
    
    // On
    onMount(): void {
        super.onMount();
    
        this.listen(this.field, EventName.DOWN, this._onFieldDown.bind(this));
        this.listen(window, 	EventName.MOVE, this._onWindowMove.bind(this));
        this.listen(window, 	EventName.UP, 	this._onWindowUp.bind(this));

		this.listen(this.hueRange, 			EventName.CHANGE, this._onChange.bind(this));
		this.listen(this.saturationRange, 	EventName.CHANGE, this._onChange.bind(this));
		this.listen(this.valueRange, 		EventName.CHANGE, this._onChange.bind(this));
		this.listen(this.hueInput, 			EventName.CHANGE, this._onChange.bind(this));
		this.listen(this.saturationInput, 	EventName.CHANGE, this._onChange.bind(this));
		this.listen(this.valueInput, 		EventName.CHANGE, this._onChange.bind(this));
		this.listen(this.redInput,	 		EventName.CHANGE, this._onChange.bind(this));
		this.listen(this.greenInput,	 	EventName.CHANGE, this._onRgbChange.bind(this));
		this.listen(this.blueInput,		 	EventName.CHANGE, this._onRgbChange.bind(this));
		this.listen(this.hexInput,		 	EventName.CHANGE, this._onHexChange.bind(this));

        this.listen(this.state, 			this._onStateChange.bind(this));
		this.listen(this._hueState, 		this._onHueChange.bind(this));
		this.listen(this._saturationState, 	this._onSaturationChange.bind(this));
		this.listen(this._valueState, 		this._onValueChange.bind(this));

		this._hueState.set(this.state.hue);
		this._saturationState.set(this.state.saturation);
		this._valueState.set(this.state.value);

        this._updateRanges();
		this._updateCss();
		this._updateRgb();
		this._updateHex();
    }
    
    protected _onInputStart(event: PointerEvent) {
        this.setColorFromMouse(event);
    }
    protected _onInput(event: PointerEvent) {
        this.setColorFromMouse(event);
		this.dispatchEvent(new InputEvent(EventName.INPUT))
    }
    protected _onChange() {
		this._updateRgb();
		this._updateHex();
        this._updateState();
		this.dispatchEvent(new InputEvent(EventName.CHANGE))
    }
	protected _onRgbChange() {
		this._updateHsv();
		this._updateHex();
        this._updateState();
		this.dispatchEvent(new InputEvent(EventName.CHANGE))
	}
	protected _onHexChange() {
		const rgb = Color.convert.hex.rgb(this.hex);
		this._redState.set(rgb[0]);
		this._greenState.set(rgb[1]);
		this._blueState.set(rgb[2]);
		this._updateHsv();
        this._updateState();
		this.dispatchEvent(new InputEvent(EventName.CHANGE))
	}

    protected _onFieldDown(event: PointerEvent) {
		if (event.button != MouseButton.LEFT) return;

        this._isChanging = true;
        this._onInputStart(event);
    }
    protected _onWindowMove(event: PointerEvent) {
        if (!this.isChanging) return;
        this._onInput(event);
    }
    protected _onWindowUp(event: PointerEvent) {
        if (!this.isChanging) return;
        
        this._isChanging = false;
        this._onChange();
    }

    protected _onStateChange(color: Color) {
		this._hueState.set(color.hue);
		this._saturationState.set(color.saturation);
		this._valueState.set(color.value);

		this._updateRgb();
		this._updateHex();
    }
	protected _onHueChange(value: number) {
        this._updateRanges();
		this._updateCss();
	}
	protected _onSaturationChange(value: number) {
        this._updateRanges();
		this._updateCss();
		this._updateCursor();
	}
	protected _onValueChange(value: number) {
		this._updateCss();
		this._updateCursor();
	}
    
    // Set
    setColorFromMouse(event: MouseEvent) {
        const fieldBounds = this.field.getBoundingClientRect();
        
        let x = Utils.clamp((event.clientX - fieldBounds.left) / fieldBounds.width, 0, 1);
        let y = Utils.clamp((event.clientY - fieldBounds.top) / fieldBounds.height, 0, 1);
        
		this._saturationState.set(x * 100);
		this._valueState.set((1 - y) * 100);
    }
    setColor(color: Color): this {
        this.state.setColor(color);
        return this;
    }

    // Get
    get color(): Color        	{ return this.state.color; }

    get hsv(): HsvColor       	{ return [this.hue, this.saturation, this.colorValue]; }
	get rgb(): RgbColor       	{ return [this.red, this.green, this.blue]; }

    get hue(): number         	{ return this._hueState.value; }
    get saturation(): number  	{ return this._saturationState.value; }
    get colorValue(): number  	{ return this._valueState.value; }

	get red(): number			{ return this._redState.value; }
	get green(): number         { return this._greenState.value; }
	get blue(): number          { return this._blueState.value; }

	get hex(): HexColor         { return this._hexState.value; }

    get isChanging(): boolean 	{ return this._isChanging; }
}
