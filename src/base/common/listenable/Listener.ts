import { HTMLEventsMap } from "@base/types/types";
import { Listenable, ListenableListener } from "./Listenable";
import { DOM } from "@base/utils";

export type ListenOptions = boolean | AddEventListenerOptions;
export interface IListener {
	listen(callback: VoidFunction): VoidFunction
    listen<K extends keyof HTMLEventsMap>(
		element: EventTarget,
		event: K,
		callback: (event: HTMLEventsMap[K])=> void,
		options?: ListenOptions
	): VoidFunction
    listen(
		element: EventTarget,
		event: string,
		callback: (event: Event)=> void,
		options?: ListenOptions
	): VoidFunction
    listen<T>(
		listenable: Listenable<T>,
		listener: ListenableListener<T>,
		invoke?: boolean
	): VoidFunction

    unlisten(): this
}

export class Listener implements IListener {
	protected _unlistens: VoidFunction[] = [];

	listen(callback: VoidFunction): VoidFunction;
	listen<K extends keyof HTMLEventsMap>(element: EventTarget, event: K, callback: (event: HTMLEventsMap[K]) => void, options?: ListenOptions): VoidFunction;
	listen(element: EventTarget, event: string, callback: (event: Event) => void, options?: ListenOptions): VoidFunction;
	listen<T>(listenable: Listenable<T>, listener: ListenableListener<T>, invoke?: boolean): VoidFunction;
	listen(element: any, event?: any, callback?: any, options?: any): VoidFunction {
		const unlisten = Listener.listen(element, event, callback, options);
		this._unlistens.push(unlisten);
		return unlisten;
	}

	unlisten(): this {
	    for (const unlisten of this._unlistens)
			unlisten();
		this._unlistens = [];
		return this;
	}

	// Static
	static listen(callback: VoidFunction): VoidFunction;
    static listen<K extends keyof HTMLEventsMap>(element: EventTarget, event: K, callback: (event: HTMLEventsMap[K]) => void, options?: ListenOptions): VoidFunction;
    static listen(element: EventTarget, event: string, callback: (event: Event) => void, options?: ListenOptions): VoidFunction;
    static listen<T>(listenable: Listenable<T>, listener: ListenableListener<T>, invoke?: boolean): VoidFunction;
    static listen(lisOrElOrCb: any, eventOrListener?: any, callbackOrInvoke?: any, options?: any): VoidFunction {
		if (typeof lisOrElOrCb == "function") {
			// Callback
			return lisOrElOrCb;
		} else if (lisOrElOrCb instanceof Listenable) {
            // Listenable
            return lisOrElOrCb.listen(eventOrListener, callbackOrInvoke);
        } else if (lisOrElOrCb instanceof EventTarget) {
            // Element
            return DOM.addEventListener(lisOrElOrCb, eventOrListener, callbackOrInvoke, options);
        }

		throw new Error("Unable to subscribe. Wrong listenable/element/callback type");
    }
}
