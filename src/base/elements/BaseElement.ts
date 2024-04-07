import type { ListenableListener } from "@base/common/listenable/Listenable";
import type { Listenable } from "@base/common/listenable";
import { HTMLTagNames, Listener } from "@base/types/types";
import { DOM } from "@base/utils";

export abstract class BaseElement extends HTMLElement implements Listener {
    readonly unlistens: VoidFunction[] = [];
    protected _isMountedOnce = false;

    constructor() {
        super();
    }

    wrap<T extends Node>(other: T): T {
        other.appendChild(this);
        return other;
    }
    addClassName(...names: string[]): this {
        this.classList.add(...names);
        return this;
    }
    /** Replaces `token` with `newToken` if first is exists in classList, otherwise adds `newToken` to classList */
    replaceClassName(token: string, newToken: string): this {
        DOM.replaceClassName(this, token, newToken);
        return this;
    }

    listen<K extends keyof GlobalEventHandlersEventMap>(element: EventTarget, eventName: K, listener: (event: GlobalEventHandlersEventMap[K]) => void, options?: boolean | AddEventListenerOptions): VoidFunction;
    listen(element: EventTarget, eventName: string, listener: (event: Event) => void, options?: boolean | AddEventListenerOptions): VoidFunction;
    listen<T>(listenable: Listenable<T>, listener: ListenableListener<T>, invoke?: boolean): VoidFunction;
    listen(lisOrEl: any, eventOrListener: any, listenerOrInvoke?: any, options?: any): VoidFunction {
        return DOM.listen(this, lisOrEl, eventOrListener, listenerOrInvoke, options);
    }

    unlistenAll() {
        for (const unlisten of this.unlistens) {
            unlisten();
        }
    }

    // On
    onMount() {}
    onDismount() {
        this.unlistenAll();
    }
    connectedCallback() {
        this.onMount();
        this._isMountedOnce = true;
    }
    disconnectedCallback() {
        this.onDismount();
    }

    // Set
    setInnerHtml(value: string): this {
        this.innerHTML = value;
        return this;
    }
    setTextContent(value: string): this {
        this.textContent = value;
        return this;
    }
    setStyle(property: keyof CSSStyleDeclaration, value: string | number | null): this {
        if (typeof value == "number")
            value = value + "px";

        Object.assign(this.style, { [property]: value });
        return this;
    }
	/** Set elements's CSS `visibility` property (clear property if `true`, otherwise set it to `hidden`) */
	setVisibility(visible: boolean): this {
		return this.setStyle("visibility", visible ? null : "hidden");
	}
	/** Set element's CSS `display` property (clear property if `true`, otherwise set it to `none`) */
	setDisplacement(display: boolean): this {
		return this.setStyle("display", display ? null : "none");
	}
    setProperty<T extends keyof typeof this>(key: T, value: typeof this[T]): this {
        this[key] = value;
        return this;
    }

    // Get
    get isMountedOnce() {
        return this._isMountedOnce;
    }
    /** Alias to `baseElement.isConnected` */
    get isMounted() {
        return this.isConnected;
    }

    // Static
    static define(name: string, extend?: HTMLTagNames) {
        return function(constructor: CustomElementConstructor) {
            DOM.define(name, constructor, extend);
        }
    }
}
