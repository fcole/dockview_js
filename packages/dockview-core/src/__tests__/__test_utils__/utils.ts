/**
 * useful utility type to erase readonly signatures for testing purposes
 *
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#readonly-mapped-type-modifiers-and-readonly-arrays
 */
export type Writable<T> = T extends object
    ? { -readonly [K in keyof T]: Writable<T[K]> }
    : T;

export function createOffsetDragOverEvent(params: {
    clientX: number;
    clientY: number;
}): Event {
    const event = new Event('dragover', {
        bubbles: true,
        cancelable: true,
    });
    Object.defineProperty(event, 'clientX', { get: () => params.clientX });
    Object.defineProperty(event, 'clientY', { get: () => params.clientY });
    return event;
}

/**
 * `jest.runAllTicks` doesn't seem to exhaust all events in the micro-task queue so
 * as a **hacky** alternative we'll wait for an empty Promise to complete which runs
 * on the micro-task queue so will force a run-to-completion emptying the queue
 * of any pending micro-task
 */
export function exhaustMicrotaskQueue(): Promise<void> {
    return new Promise<void>((resolve) => resolve());
}

export function exhaustAnimationFrame(): Promise<void> {
    return new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
    });
}

export const mockGetBoundingClientRect = ({
    left,
    top,
    height,
    width,
}: {
    left: number;
    top: number;
    height: number;
    width: number;
}) => {
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
    return {
        ...result,
        toJSON: () => result,
    };
};
