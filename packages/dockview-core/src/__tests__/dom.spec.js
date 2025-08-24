"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = require("../dom");
describe('dom', () => {
    test('quasiPreventDefault', () => {
        const event = new Event('myevent');
        expect(event['dv-quasiPreventDefault']).toBeUndefined();
        (0, dom_1.quasiPreventDefault)(event);
        expect(event['dv-quasiPreventDefault']).toBe(true);
    });
    test('quasiDefaultPrevented', () => {
        const event = new Event('myevent');
        expect((0, dom_1.quasiDefaultPrevented)(event)).toBeFalsy();
        event['dv-quasiPreventDefault'] = false;
        expect((0, dom_1.quasiDefaultPrevented)(event)).toBeFalsy();
        event['dv-quasiPreventDefault'] = true;
        expect((0, dom_1.quasiDefaultPrevented)(event)).toBeTruthy();
    });
    test('isInDocument: DOM element', () => {
        const el = document.createElement('div');
        expect((0, dom_1.isInDocument)(el)).toBeFalsy();
        document.body.appendChild(el);
        expect((0, dom_1.isInDocument)(el)).toBeTruthy();
    });
    test('isInDocument: Shadow DOM element', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const shadow = el.attachShadow({ mode: 'open' });
        const el2 = document.createElement('div');
        expect((0, dom_1.isInDocument)(el2)).toBeFalsy();
        shadow.appendChild(el2);
        expect((0, dom_1.isInDocument)(el2)).toBeTruthy();
    });
    test('disableIframePointEvents', () => {
        const el1 = document.createElement('iframe');
        const el2 = document.createElement('iframe');
        const el3 = document.createElement('webview');
        const el4 = document.createElement('webview');
        document.body.appendChild(el1);
        document.body.appendChild(el2);
        document.body.appendChild(el3);
        document.body.appendChild(el4);
        el1.style.pointerEvents = 'inherit';
        el3.style.pointerEvents = 'inherit';
        expect(el1.style.pointerEvents).toBe('inherit');
        expect(el2.style.pointerEvents).toBe('');
        expect(el3.style.pointerEvents).toBe('inherit');
        expect(el4.style.pointerEvents).toBe('');
        const f = (0, dom_1.disableIframePointEvents)();
        expect(el1.style.pointerEvents).toBe('none');
        expect(el2.style.pointerEvents).toBe('none');
        expect(el3.style.pointerEvents).toBe('none');
        expect(el4.style.pointerEvents).toBe('none');
        f.release();
        expect(el1.style.pointerEvents).toBe('inherit');
        expect(el2.style.pointerEvents).toBe('');
        expect(el3.style.pointerEvents).toBe('inherit');
        expect(el4.style.pointerEvents).toBe('');
    });
});
