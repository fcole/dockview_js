"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockGetBoundingClientRect = exports.exhaustAnimationFrame = exports.exhaustMicrotaskQueue = exports.createOffsetDragOverEvent = void 0;
function createOffsetDragOverEvent(params) {
    const event = new Event('dragover', {
        bubbles: true,
        cancelable: true,
    });
    Object.defineProperty(event, 'clientX', { get: () => params.clientX });
    Object.defineProperty(event, 'clientY', { get: () => params.clientY });
    return event;
}
exports.createOffsetDragOverEvent = createOffsetDragOverEvent;
/**
 * `jest.runAllTicks` doesn't seem to exhaust all events in the micro-task queue so
 * as a **hacky** alternative we'll wait for an empty Promise to complete which runs
 * on the micro-task queue so will force a run-to-completion emptying the queue
 * of any pending micro-task
 */
function exhaustMicrotaskQueue() {
    return new Promise((resolve) => resolve());
}
exports.exhaustMicrotaskQueue = exhaustMicrotaskQueue;
function exhaustAnimationFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
    });
}
exports.exhaustAnimationFrame = exhaustAnimationFrame;
const mockGetBoundingClientRect = ({ left, top, height, width, }) => {
    const result = {
        left,
        top,
        height,
        width,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
    };
    return Object.assign(Object.assign({}, result), { toJSON: () => result });
};
exports.mockGetBoundingClientRect = mockGetBoundingClientRect;
