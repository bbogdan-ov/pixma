import type { State } from "@base/common/listenable";
import type { AccentName, ColorName, SizeName } from "./enums";
import { BaseApp } from "@base/BaseApp";

export type HTMLTagNames = keyof HTMLElementTagNameMap;
export type HTMLEventsMap = GlobalEventHandlersEventMap;

export type ValueType = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

export interface IPoint {
    x: number
    y: number
}

export type RgbColor = [red: number, green: number, blue: number];
export type HslColor = [hue: number, saturation: number, lightness: number];
export type HsvColor = [hue: number, saturation: number, value: number];
export type RgbaColor = [...RgbColor, alpha: number];
export type HslaColor = [...HslColor, alpha: number];
export type HsvaColor = [...HsvColor, alpha: number];
export type HexColor = `#${ string }`;
export type RgbStringColor = `rgb(${ string })`;
export type RgbaStringColor = `rgba(${ string })`;
export type HslStringColor = `hsl(${ string })`;
export type HslaStringColor = `hsla(${ string })`;
export type AnyStringColor = `#${ string }` | RgbStringColor | RgbaStringColor | HslStringColor | HslaStringColor;
export type ArrayColor = RgbColor | RgbaColor | HsvColor | HsvaColor | HslColor | HslaColor;

export interface ThemeColorful {
    color: ColorName | AccentName
    setColor(name: ColorName | AccentName): this
}
export interface ThemeResizeable {
    size: SizeName
    setSize(name: SizeName): this
}
export interface Enablable {
	enable(): this
	disable(): this
	setIsEnabled(value: boolean): this
}

export interface Focusable {
	focus(options?: FocusOptions): void
	blur(): void

	isFocused: boolean
}
export interface Clamped {
    min: number | null
    max: number | null
    
    setMax(value: number): this
    setMin(value: number): this
    setClamp(min: number, max: number): this
}
export interface Stepped {
    step: number

    setStep(value: number): this
}
export interface ValueContained<T> {
	value: T
}
export interface StateValueContained<T> extends ValueContained<T> {
	state: State<T>
}
export interface AppContained<A extends BaseApp=BaseApp> {
	app: A
}
