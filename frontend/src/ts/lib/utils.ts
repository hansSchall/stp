import { Lock, unlock, waitFor } from "./waitFor";

export const windowLoad: Lock = Symbol();
export const whenReady = () => waitFor(windowLoad);
window.addEventListener("load", () => {
    unlock(windowLoad);
})


export function $<T extends HTMLElement>(query: string): T | null {
    return document.querySelector(query);
}
export function $_<T extends HTMLElement>(query: string): T {
    const el = document.querySelector(query);
    if (!el) throw new TypeError("[Not Expected] querySelector is null");
    return el as any as T;
}
export function $$<T extends HTMLElement>(query: string): T[] {
    return [...document.querySelectorAll(query)] as T[];
}
interface Element {
    $<T extends HTMLElement>(query: string): T | null;
    $_<T extends HTMLElement>(query: string): T;
    $$<T extends HTMLElement>(query: string): T[];
}
// @ts-expect-error
HTMLElement.prototype.$ = function (query: string) {
    return this.querySelector(query);
}
// @ts-expect-error
HTMLElement.prototype.$_ = function (query: string) {
    const el = this.querySelector(query);
    if (!el) throw new TypeError("[Not Expected] querySelector is null");
    return el;
}
// @ts-expect-error
HTMLElement.prototype.$$ = function (query: string) {
    return [...this.querySelectorAll(query)] as HTMLElement[];
}

Object.defineProperty(Array.prototype, 'last', {
    get: function () { return this[this.length - 1] },
    set: function (value) { this[this.length - 1] = value },
});

export function $elC(className: string): HTMLDivElement {
    const el = document.createElement("div");
    el.className = className;
    return el;
}
export function $elG(fn: (el: HTMLDivElement) => void): HTMLDivElement {
    const el = document.createElement("div");
    fn(el);
    return el;
}
export function $elCG(className: string, fn: (el: HTMLDivElement) => void): HTMLDivElement {
    const el = document.createElement("div");
    el.className = className;
    fn(el);
    return el;
}
export function $elCT(className: string, tag: string): HTMLElement {
    const el = document.createElement(tag);
    el.className = className;
    return el;
}
export function $elGT(tag: string, fn: (el: HTMLElement) => void): HTMLElement {
    const el = document.createElement(tag);
    fn(el);
    return el;
}
export function $elCGT(className: string, tag: string, fn: (el: HTMLElement) => void): HTMLElement {
    const el = document.createElement(tag);
    el.className = className;
    fn(el);
    return el;
}

export function $elL(label: string): HTMLDivElement {
    const el = document.createElement("div");
    el.innerText = label;
    return el;
}

export function $elCL(className: string, label: string): HTMLDivElement {
    const el = document.createElement("div");
    el.className = className;
    el.innerText = label;
    return el;
}
export function $elGL(label: string, fn: (el: HTMLDivElement) => void): HTMLDivElement {
    const el = document.createElement("div");
    fn(el);
    return el;
}
export function $elCGL(className: string, label: string, fn: (el: HTMLDivElement) => void): HTMLDivElement {
    const el = document.createElement("div");
    el.className = className;
    el.innerText = label;
    fn(el);
    return el;
}
export function $elCTL(className: string, tag: string, label: string): HTMLElement {
    const el = document.createElement(tag);
    el.className = className;
    el.innerText = label;
    return el;
}
export function $elGTL(tag: string, label: string, fn: (el: HTMLElement) => void): HTMLElement {
    const el = document.createElement(tag);
    el.innerText = label;
    fn(el);
    return el;
}
export function $elCGTL(className: string, tag: string, label: string, fn: (el: HTMLElement) => void): HTMLElement {
    const el = document.createElement(tag);
    el.className = className;
    el.innerText = label;
    fn(el);
    return el;
}