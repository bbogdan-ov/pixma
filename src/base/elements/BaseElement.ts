import { HTMLTagNames, IListener } from "@base/types/types";
import { DOM } from "@base/utils";

export default abstract class BaseElement extends HTMLElement implements IListener {
    readonly unlistens: VoidFunction[] = [];
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
    /** Replaces `token` with `newToken` if first is exists in classList, otherwise adds `newToken` to classList */
    replaceClassName(token: string, newToken: string): this {
        DOM.replaceClassName(this, token, newToken);
        return this;
    }

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
