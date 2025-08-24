"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../events");
describe('events', () => {
    describe('emitter', () => {
        it('debug mode is off', () => {
            expect(events_1.Emitter.ENABLE_TRACKING).toBeFalsy();
        });
        it('should emit values', () => {
            const emitter = new events_1.Emitter();
            let value = undefined;
            emitter.fire(-1);
            expect(value).toBeUndefined();
            const stream = emitter.event((x) => {
                value = x;
            });
            emitter.fire(0);
            expect(value).toBe(0);
            emitter.fire(1);
            expect(value).toBe(1);
            stream.dispose();
        });
        it('should stop emitting after dispose', () => {
            const emitter = new events_1.Emitter();
            let value = undefined;
            const stream = emitter.event((x) => {
                value = x;
            });
            emitter.fire(0);
            expect(value).toBe(0);
            stream.dispose();
            value = undefined;
            emitter.fire(1);
            expect(value).toBeUndefined();
        });
        it('should stop emitting after dispose', () => {
            const emitter = new events_1.Emitter();
            let value = undefined;
            const stream = emitter.event((x) => {
                value = x;
            });
            emitter.fire(0);
            expect(value).toBe(0);
            stream.dispose();
            value = undefined;
            emitter.fire(1);
            expect(value).toBeUndefined();
        });
        it('should replay last value in replay mode', () => {
            const emitter = new events_1.Emitter({ replay: true });
            let value = undefined;
            emitter.fire(1);
            const stream = emitter.event((x) => {
                value = x;
            });
            expect(value).toBe(1);
            stream.dispose();
        });
        it('should not replay last value in replay mode', () => {
            const emitter = new events_1.Emitter();
            let value = undefined;
            emitter.fire(1);
            const stream = emitter.event((x) => {
                value = x;
            });
            expect(value).toBeUndefined();
            stream.dispose();
        });
    });
    describe('asapEvent', () => {
        test('that asapEvents fire once per event-loop-cycle', () => {
            jest.useFakeTimers();
            const event = new events_1.AsapEvent();
            let preFireCount = 0;
            let postFireCount = 0;
            event.onEvent(() => {
                preFireCount++;
            });
            for (let i = 0; i < 100; i++) {
                event.fire();
            }
            /**
             * check that subscribing after the events have fired but before the event-loop cycle completes
             * results in no event fires.
             */
            event.onEvent((e) => {
                postFireCount++;
            });
            expect(preFireCount).toBe(0);
            expect(postFireCount).toBe(0);
            jest.runAllTimers();
            expect(preFireCount).toBe(1);
            expect(postFireCount).toBe(0);
        });
    });
    it('should emit a value when any event fires', () => {
        const emitter1 = new events_1.Emitter();
        const emitter2 = new events_1.Emitter();
        const emitter3 = new events_1.Emitter();
        let value = 0;
        const stream = events_1.Event.any(emitter1.event, emitter2.event, emitter3.event)((x) => {
            value = x;
        });
        emitter2.fire(2);
        expect(value).toBe(2);
        emitter1.fire(1);
        expect(value).toBe(1);
        emitter3.fire(3);
        expect(value).toBe(3);
    });
    it('addDisposableListener with capture options', () => {
        const element = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };
        const handler = jest.fn();
        const disposable = (0, events_1.addDisposableListener)(element, 'pointerdown', handler, true);
        expect(element.addEventListener).toBeCalledTimes(1);
        expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', handler, true);
        expect(element.removeEventListener).toBeCalledTimes(0);
        disposable.dispose();
        expect(element.addEventListener).toBeCalledTimes(1);
        expect(element.removeEventListener).toBeCalledTimes(1);
        expect(element.removeEventListener).toBeCalledWith('pointerdown', handler, true);
    });
    it('addDisposableListener without capture options', () => {
        const element = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };
        const handler = jest.fn();
        const disposable = (0, events_1.addDisposableListener)(element, 'pointerdown', handler);
        expect(element.addEventListener).toBeCalledTimes(1);
        expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', handler, undefined);
        expect(element.removeEventListener).toBeCalledTimes(0);
        disposable.dispose();
        expect(element.addEventListener).toBeCalledTimes(1);
        expect(element.removeEventListener).toBeCalledTimes(1);
        expect(element.removeEventListener).toBeCalledWith('pointerdown', handler, undefined);
    });
    it('addDisposableListener with capture options', () => {
        const element = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };
        const handler = jest.fn();
        const disposable = (0, events_1.addDisposableListener)(element, 'pointerdown', handler, true);
        expect(element.addEventListener).toBeCalledTimes(1);
        expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', handler, true);
        expect(element.removeEventListener).toBeCalledTimes(0);
        disposable.dispose();
        expect(element.addEventListener).toBeCalledTimes(1);
        expect(element.removeEventListener).toBeCalledTimes(1);
        expect(element.removeEventListener).toBeCalledWith('pointerdown', handler, true);
    });
    it('addDisposableListener without capture options', () => {
        const element = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };
        const handler = jest.fn();
        const disposable = (0, events_1.addDisposableListener)(element, 'pointerdown', handler);
        expect(element.addEventListener).toBeCalledTimes(1);
        expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', handler, undefined);
        expect(element.removeEventListener).toBeCalledTimes(0);
        disposable.dispose();
        expect(element.addEventListener).toBeCalledTimes(1);
        expect(element.removeEventListener).toBeCalledTimes(1);
        expect(element.removeEventListener).toBeCalledWith('pointerdown', handler, undefined);
    });
});
