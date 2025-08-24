"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = require("@testing-library/dom");
const abstractDragHandler_1 = require("../../dnd/abstractDragHandler");
describe('abstractDragHandler', () => {
    test('that className dv-dragged is added to element after dragstart event', () => {
        jest.useFakeTimers();
        const element = document.createElement('div');
        const handler = new (class TestClass extends abstractDragHandler_1.DragHandler {
            constructor(el) {
                super(el);
            }
            getData() {
                return {
                    dispose: () => {
                        // /
                    },
                };
            }
        })(element);
        expect(element.classList.contains('dv-dragged')).toBeFalsy();
        dom_1.fireEvent.dragStart(element);
        expect(element.classList.contains('dv-dragged')).toBeTruthy();
        jest.runAllTimers();
        expect(element.classList.contains('dv-dragged')).toBeFalsy();
        handler.dispose();
    });
    test('that iframes and webviews have pointerEvents=none set whilst drag action is in process', () => {
        jest.useFakeTimers();
        const element = document.createElement('div');
        const iframe = document.createElement('iframe');
        const webview = document.createElement('webview');
        const span = document.createElement('span');
        document.body.appendChild(element);
        document.body.appendChild(iframe);
        document.body.appendChild(webview);
        document.body.appendChild(span);
        const handler = new (class TestClass extends abstractDragHandler_1.DragHandler {
            constructor(el) {
                super(el);
            }
            getData() {
                return {
                    dispose: () => {
                        // /
                    },
                };
            }
        })(element);
        expect(iframe.style.pointerEvents).toBeFalsy();
        expect(webview.style.pointerEvents).toBeFalsy();
        expect(span.style.pointerEvents).toBeFalsy();
        dom_1.fireEvent.dragStart(element);
        expect(iframe.style.pointerEvents).toBe('none');
        expect(webview.style.pointerEvents).toBe('none');
        expect(span.style.pointerEvents).toBeFalsy();
        dom_1.fireEvent.dragEnd(element);
        expect(iframe.style.pointerEvents).toBe('');
        expect(webview.style.pointerEvents).toBe('');
        expect(span.style.pointerEvents).toBeFalsy();
        handler.dispose();
    });
    test('that the disabling of pointerEvents is restored on a premature disposal of the handler', () => {
        jest.useFakeTimers();
        const element = document.createElement('div');
        const iframe = document.createElement('iframe');
        const webview = document.createElement('webview');
        const span = document.createElement('span');
        document.body.appendChild(element);
        document.body.appendChild(iframe);
        document.body.appendChild(webview);
        document.body.appendChild(span);
        const handler = new (class TestClass extends abstractDragHandler_1.DragHandler {
            constructor(el) {
                super(el);
            }
            getData() {
                return {
                    dispose: () => {
                        // /
                    },
                };
            }
        })(element);
        expect(iframe.style.pointerEvents).toBeFalsy();
        expect(webview.style.pointerEvents).toBeFalsy();
        expect(span.style.pointerEvents).toBeFalsy();
        dom_1.fireEvent.dragStart(element);
        expect(iframe.style.pointerEvents).toBe('none');
        expect(webview.style.pointerEvents).toBe('none');
        expect(span.style.pointerEvents).toBeFalsy();
        handler.dispose();
        expect(iframe.style.pointerEvents).toBe('');
        expect(webview.style.pointerEvents).toBe('');
        expect(span.style.pointerEvents).toBeFalsy();
    });
    test('that .preventDefault() is called for cancelled events', () => {
        const element = document.createElement('div');
        const handler = new (class TestClass extends abstractDragHandler_1.DragHandler {
            constructor(el) {
                super(el);
            }
            isCancelled(_event) {
                return true;
            }
            getData() {
                return {
                    dispose: () => {
                        // /
                    },
                };
            }
        })(element);
        const event = new Event('dragstart');
        const spy = jest.spyOn(event, 'preventDefault');
        (0, dom_1.fireEvent)(element, event);
        expect(spy).toBeCalledTimes(1);
        handler.dispose();
    });
    test('that .preventDefault() is not called for non-cancelled events', () => {
        const element = document.createElement('div');
        const handler = new (class TestClass extends abstractDragHandler_1.DragHandler {
            constructor(el) {
                super(el);
            }
            isCancelled(_event) {
                return false;
            }
            getData() {
                return {
                    dispose: () => {
                        // /
                    },
                };
            }
        })(element);
        const event = new Event('dragstart');
        const spy = jest.spyOn(event, 'preventDefault');
        (0, dom_1.fireEvent)(element, event);
        expect(spy).toHaveBeenCalledTimes(0);
        handler.dispose();
    });
});
