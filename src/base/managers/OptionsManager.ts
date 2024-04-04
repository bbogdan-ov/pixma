import { Manager } from ".";

// Option
export type AnyOption = Option<any>;
export class Option<T> {
	readonly namespace: string;
	readonly category: string;
	readonly defaultValue: T;
	protected _value: T;

	constructor(namespace: string, category: string, value: T) {
		this.namespace = namespace;
		this.category = category;
		this.defaultValue = value;
		this._value = value;
	}

	/** Returns `null` if value is invalid, otherwise just returns `value` */
	validate(value: T): T | null {
		return value;
	}

	/**
	 * Set value
	 * Returns successfully or not
	 */
	set(value: T): boolean {
		const v = this.validate(value);
		if (v === null) return false;

		this._value = v;
		return true;
	}
	/** Reset/set value to default */
	reset(): T {
		this._value = this.defaultValue;
		return this._value;
	}
	get value(): T {
		return this._value;
	}
}

// Boolean option
export class BooleanOption extends Option<boolean> {
	validate(value: boolean): boolean | null {
	    return !!value;
	}
	toggle(): boolean {
		this.set(!this.value);
		return this.value;
	}
}
export class FloatOption extends Option<number> {
	validate(value: number): number | null {
		if (typeof value != "number") return null;
		return value;
	}
	increment(): number {
		this.set(this.value + 1);
		return this.value;
	}
	decrement(): number {
		this.set(this.value - 1);
		return this.value;
	}
}
export class IntOption extends FloatOption {
	validate(value: number): number | null {
		if (typeof value != "number") return null;
		return Math.ceil(value);
	}
}
export class StringOption extends Option<string> {
	validate(value: string): string | null {
	    if (typeof value != "string") return null
		return value;
	}
}

// Options manager
export class OptionsManager extends Manager {
	readonly options: Record<string, AnyOption> = {};

	constructor() {
		super();
	}

	// Register
	register(name: string, option: AnyOption, override=false): boolean {
		if (!override && this.getOption(name)) return false;

		this.options[name] = option;
		return true;
	}
	registerBoolean(namespace: string, category: string, name: string, value: boolean): boolean {
		return this.register(name, new BooleanOption(namespace, category, value));
	}
	registerFloat(namespace: string, category: string, name: string, value: number): boolean {
		return this.register(name, new FloatOption(namespace, category, value));
	}
	registerInt(namespace: string, category: string, name: string, value: number): boolean {
		return this.register(name, new IntOption(namespace, category, value));
	}
	registerString(namespace: string, category: string, name: string, value: string): boolean {
		return this.register(name, new StringOption(namespace, category, value));
	}

	// Set
	/**
	 * Set option value
	 * Returns successfully or not
	 */
	set(name: string, value: boolean | string | number): boolean {
		return this.getOption(name)?.set(value) ?? false;
	}
	/**
	 * Set boolean option value
	 * Returns successfully or not
	 */
	setBoolean(name: string, value: boolean): boolean {
		return this.getBooleanOption(name)?.set(value) ?? false;
	}
	/**
	 * Set float option value
	 * Returns successfully or not
	 */
	setFloat(name: string, value: number): boolean {
		return this.getFloatOption(name)?.set(value) ?? false;
	}
	/**
	 * Set int option value
	 * Returns successfully or not
	 */
	setInt(name: string, value: number): boolean {
		return this.getIntOption(name)?.set(value) ?? false;
	}
	/**
	 * Set string option value
	 * Returns successfully or not
	 */
	setString(name: string, value: string): boolean {
		return this.getStringOption(name)?.set(value) ?? false;
	}

	// Get
	get<T=boolean | number | string>(name: string): T | null {
		return this.getOption(name)?.value ?? null;
	}
	getBoolean(name: string): boolean | null {
		return this.getBooleanOption(name)?.value ?? null;
	}
	getFloat(name: string): number | null {
		return this.getFloatOption(name)?.value ?? null;
	}
	getInt(name: string): number | null {
		return this.getIntOption(name)?.value ?? null;
	}
	getString(name: string): string | null {
		return this.getStringOption(name)?.value ?? null;
	}

	// Get option
	getOption<T=any>(name: string): Option<T> | null {
		return this.options[name] || null;
	}
	getOptionByClass<T=any>(name: string, klass: any): T | null {
		const option = this.getOption(name);
		if (!(option instanceof klass)) return null;
		return option as T;
	}
	getBooleanOption(name: string): BooleanOption | null {
		return this.getOptionByClass<BooleanOption>(name, BooleanOption);
	}
	getFloatOption(name: string): FloatOption | null {
		return this.getOptionByClass<FloatOption>(name, FloatOption);
	}
	getIntOption(name: string): IntOption | null {
		return this.getOptionByClass<IntOption>(name, IntOption);
	}
	getStringOption(name: string): StringOption | null {
		return this.getOptionByClass<StringOption>(name, StringOption);
	}
}
