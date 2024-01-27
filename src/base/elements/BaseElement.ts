import { Listenable, State } from "@base/common/listenable";
import { ListenableListener } from "@base/common/listenable/Listenable";
import { HTMLTagNames } from "@base/types/types";
import { Dev, DOM } from "@base/utils";

export default abstract class BaseElement extends HTMLElement {
    protected _unlistens: VoidFunction[] = [];
    protected _isMountedOnce = false;

    constructor() {
        super();
    }

    wrap<T extends Node>(other: T): T {
        other.appendChild(this);
        return other;
    }
    addClassName(value: string): this {
        this.classList.add(value);
        return this;
    }

    listen<K extends keyof GlobalEventHandlersEventMap>(element: EventTarget, eventName: K, listener: (event: GlobalEventHandlersEventMap[K]) => void, options?: boolean | AddEventListenerOptions): VoidFunction;
    listen(element: EventTarget, eventName: string, listener: (event: Event) => void, options?: boolean | AddEventListenerOptions): VoidFunction;
    listen<T>(listenable: Listenable<T>, listener: ListenableListener<T>, invoke?: boolean): VoidFunction;
    listen(lisOrEl: EventTarget | Listenable<any>, eventOrListener: any, listenerOrInvoke?: any, options?: any): VoidFunction {
        let unlisten = () => {};

        if (lisOrEl instanceof Listenable) {
            // Listenable
            unlisten = lisOrEl.listen(eventOrListener);
            if (listenerOrInvoke) {
                if (lisOrEl instanceof State) eventOrListener(lisOrEl.value);
                else eventOrListener();
            }
        } else if (lisOrEl instanceof EventTarget) {
            // Element
            unlisten = DOM.addEventListener(lisOrEl, eventOrListener, listenerOrInvoke, options);
        } else {
            Dev.throwError("Unable to listen listenable or element!");
        }

        this._unlistens.push(unlisten);
        return unlisten;
    }

    unlistenAll() {
        for (const unlisten of this._unlistens) {
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
    setStyle(property: keyof CSSStyleDeclaration, value: string | number): this {
        if (typeof value == "number")
            value = value + "px";

        Object.assign(this.style, { [property]: value });
        return this;
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
