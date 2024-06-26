import type { HTMLTagNames } from "@base/types/types";
import test_img from "../assets/images/test.png";

export class DOM {
	//
    static addEventListener<K extends keyof GlobalEventHandlersEventMap>(element: EventTarget, eventName: K, listener: (event: GlobalEventHandlersEventMap[K]) => void, options?: boolean | AddEventListenerOptions): VoidFunction;
    static addEventListener(element: EventTarget, eventName: string, listener: (event: Event) => void, options?: boolean | AddEventListenerOptions): VoidFunction;
    static addEventListener(element: EventTarget, eventName: string, listener: (event: Event) => void, options?: boolean | AddEventListenerOptions): VoidFunction {
        element.addEventListener(eventName, listener, options);
        return () => element.removeEventListener(eventName, listener);
    }

    static create<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, htmlContent?: string): HTMLElementTagNameMap[K];
    static create(tag: string, className?: string, htmlContent?: string): HTMLElement;
    static create(tag: string, className: string="", htmlContent?: string): HTMLElement {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (htmlContent) element.innerHTML = htmlContent;
        return element;
    }
    static div(className: string="", ...children: Node[]): HTMLDivElement {
        const el = this.create("div", className);
        el.append(...children);
        return el;
    }
    static span(htmlContent: string, className: string=""): HTMLSpanElement {
        return this.create("span", className, htmlContent);
    }
    static html(html: string | TemplateStringsArray): Node[] {
        const div = document.createElement("div");
        div.innerHTML = html.toString();
        return [...div.childNodes];
    }

    static define(name: string, constructor: CustomElementConstructor, extend?: HTMLTagNames) {
        customElements.define(name, constructor, { extends: extend });
    }
    static template(htmlContent: string): Node {
        return (this.html(`<template>${ htmlContent }</template>`) as any).content?.cloneNode(true);
    }

    static blurFocused() {
        const element = document.activeElement as any;
        if (element && element.blur !== undefined)
            element.blur();
    }
    static selectContent(element: Node): boolean {
        const range = document.createRange();
        range.selectNodeContents(element);
        const sel = document.getSelection();
        if (!sel) return false;

        sel.removeAllRanges();
        sel.addRange(range);

        return true;
    }
    /** Replaces `token` with `newToken` if first is exists in classList, otherwise adds `newToken` to classList */
    static replaceClassName(element: Element, token: string, newToken: string): void {
        const replaced = element.classList.replace(token, newToken);

        if (!replaced)
            element.classList.add(token);
    }

    static shake<T extends HTMLElement>(element: T): T {
        element.animate({
            translate: [ "10px 0", "-8px 0", "6px 0", "-4px 0", "2px 0", "-1px 0", "0px 0" ],
        }, { duration: 400 })
        return element;
    }

    // Hey
    static createTestImage(): HTMLImageElement {
        const image = new Image();
        image.src = test_img;
        image.style.imageRendering = "pixelated";
        return image;
    }
}

