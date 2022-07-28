import { unlock, waitFor } from "./waitFor";
export const windowLoad = Symbol();
export const whenReady = () => waitFor(windowLoad);
window.addEventListener("load", () => {
    unlock(windowLoad);
});
export function $(query) {
    return document.querySelector(query);
}
export function $_(query) {
    const el = document.querySelector(query);
    if (!el)
        throw new TypeError("[Not Expected] querySelector is null");
    return el;
}
export function $$(query) {
    return [...document.querySelectorAll(query)];
}
// @ts-expect-error
HTMLElement.prototype.$ = function (query) {
    return this.querySelector(query);
};
// @ts-expect-error
HTMLElement.prototype.$_ = function (query) {
    const el = this.querySelector(query);
    if (!el)
        throw new TypeError("[Not Expected] querySelector is null");
    return el;
};
// @ts-expect-error
HTMLElement.prototype.$$ = function (query) {
    return [...this.querySelectorAll(query)];
};
Object.defineProperty(Array.prototype, 'last', {
    get: function () { return this[this.length - 1]; },
    set: function (value) { this[this.length - 1] = value; },
});
export function $elC(className) {
    const el = document.createElement("div");
    el.className = className;
    return el;
}
export function $elG(fn) {
    const el = document.createElement("div");
    fn(el);
    return el;
}
export function $elCG(className, fn) {
    const el = document.createElement("div");
    el.className = className;
    fn(el);
    return el;
}
export function $elCT(className, tag) {
    const el = document.createElement(tag);
    el.className = className;
    return el;
}
export function $elGT(tag, fn) {
    const el = document.createElement(tag);
    fn(el);
    return el;
}
export function $elCGT(className, tag, fn) {
    const el = document.createElement(tag);
    el.className = className;
    fn(el);
    return el;
}
export function $elL(label) {
    const el = document.createElement("div");
    el.innerText = label;
    return el;
}
export function $elCL(className, label) {
    const el = document.createElement("div");
    el.className = className;
    el.innerText = label;
    return el;
}
export function $elGL(label, fn) {
    const el = document.createElement("div");
    fn(el);
    return el;
}
export function $elCGL(className, label, fn) {
    const el = document.createElement("div");
    el.className = className;
    el.innerText = label;
    fn(el);
    return el;
}
export function $elCTL(className, tag, label) {
    const el = document.createElement(tag);
    el.className = className;
    el.innerText = label;
    return el;
}
export function $elGTL(tag, label, fn) {
    const el = document.createElement(tag);
    el.innerText = label;
    fn(el);
    return el;
}
export function $elCGTL(className, tag, label, fn) {
    const el = document.createElement(tag);
    el.className = className;
    el.innerText = label;
    fn(el);
    return el;
}
