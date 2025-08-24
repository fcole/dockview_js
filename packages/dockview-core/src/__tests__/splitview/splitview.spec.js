"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../events");
const lifecycle_1 = require("../../lifecycle");
const splitview_1 = require("../../splitview/splitview");
const dom_1 = require("@testing-library/dom");
class Testview {
    get minimumSize() {
        return this._minimumSize;
    }
    get maximumSize() {
        return this._maxiumSize;
    }
    get element() {
        this._onRendered.fire();
        return this._element;
    }
    get size() {
        return this._size;
    }
    get orthogonalSize() {
        return this._orthogonalSize;
    }
    get priority() {
        return this._priority;
    }
    constructor(_minimumSize, _maxiumSize, priority) {
        this._minimumSize = _minimumSize;
        this._maxiumSize = _maxiumSize;
        this._element = document.createElement('div');
        this._size = 0;
        this._orthogonalSize = 0;
        this._onDidChange = new events_1.Emitter();
        this.onDidChange = this._onDidChange.event;
        this._onLayoutCalled = new events_1.Emitter();
        this.onLayoutCalled = this._onLayoutCalled.event;
        this._onRendered = new events_1.Emitter();
        this.onRenderered = this._onRendered.event;
        this._priority = priority;
    }
    layout(size, orthogonalSize) {
        this._size = size;
        this._orthogonalSize = orthogonalSize;
        this._onLayoutCalled.fire();
    }
    fireChangeEvent(value) {
        this._onDidChange.fire(value);
    }
    setVisible(isVisible) {
        //
    }
    dispose() {
        this._onDidChange.dispose();
    }
}
describe('splitview', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        container.className = 'container';
        jest.clearAllMocks();
    });
    test('vertical splitview', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        expect(splitview.orientation).toBe(splitview_1.Orientation.HORIZONTAL);
        const viewQuery = container.querySelectorAll('.dv-split-view-container dv-horizontal');
        expect(viewQuery).toBeTruthy();
        splitview.dispose();
    });
    test('horiziontal splitview', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.VERTICAL,
        });
        expect(splitview.orientation).toBe(splitview_1.Orientation.VERTICAL);
        const viewQuery = container.querySelectorAll('.dv-split-view-container dv-vertical');
        expect(viewQuery).toBeTruthy();
        splitview.dispose();
    });
    test('has views and sashes', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        splitview.addView(new Testview(50, 50));
        splitview.addView(new Testview(50, 50));
        splitview.addView(new Testview(50, 50));
        let viewQuery = container.querySelectorAll('.dv-split-view-container > .dv-view-container > .dv-view');
        expect(viewQuery.length).toBe(3);
        let sashQuery = container.querySelectorAll('.dv-split-view-container > .dv-sash-container > .dv-sash');
        expect(sashQuery.length).toBe(2);
        splitview.removeView(2);
        viewQuery = container.querySelectorAll('.dv-split-view-container > .dv-view-container > .dv-view');
        expect(viewQuery.length).toBe(2);
        sashQuery = container.querySelectorAll('.dv-split-view-container > .dv-sash-container > .dv-sash');
        expect(sashQuery.length).toBe(1);
        splitview.removeView(0);
        viewQuery = container.querySelectorAll('.dv-split-view-container > .dv-view-container > .dv-view');
        expect(viewQuery.length).toBe(1);
        sashQuery = container.querySelectorAll('.dv-split-view-container > .dv-sash-container > .dv-sash');
        expect(sashQuery.length).toBe(0);
        splitview.removeView(0);
        viewQuery = container.querySelectorAll('.dv-split-view-container > .dv-view-container > .dv-view');
        expect(viewQuery.length).toBe(0);
        sashQuery = container.querySelectorAll('.dv-split-view-container > .dv-sash-container > .dv-sash');
        expect(sashQuery.length).toBe(0);
        splitview.dispose();
    });
    test('visiblity classnames', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        const view1 = new Testview(50, 50);
        const view2 = new Testview(50, 50);
        splitview.addView(view1);
        splitview.addView(view2);
        let viewQuery = container.querySelectorAll('.dv-split-view-container > .dv-view-container > .dv-view.visible');
        expect(viewQuery.length).toBe(2);
        splitview.setViewVisible(1, false);
        viewQuery = container.querySelectorAll('.dv-split-view-container > .dv-view-container > .dv-view.visible');
        expect(viewQuery.length).toBe(1);
        splitview.dispose();
    });
    test('calls lifecycle methods on view', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        splitview.layout(200, 500);
        let rendered = false;
        let layout = false;
        const view = new Testview(50, Number.POSITIVE_INFINITY);
        const layoutDisposable = view.onLayoutCalled(() => {
            layout = true;
        });
        const renderDisposable = view.onRenderered(() => {
            rendered = true;
        });
        splitview.addView(view);
        splitview.layout(100, 100);
        expect(rendered).toBeTruthy();
        expect(layout).toBeTruthy();
        layoutDisposable.dispose();
        renderDisposable.dispose();
        splitview.dispose();
    });
    test('add view at specified index', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        splitview.layout(200, 500);
        const view1 = new Testview(50, 200);
        const view2 = new Testview(50, 200);
        const view3 = new Testview(50, 200);
        splitview.addView(view1);
        splitview.addView(view2, splitview_1.Sizing.Distribute, 0);
        splitview.addView(view3, splitview_1.Sizing.Distribute, 1);
        expect(splitview.getViews()).toEqual([view2, view3, view1]);
    });
    test('streches to viewport', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        splitview.layout(200, 500);
        const view = new Testview(50, Number.POSITIVE_INFINITY);
        splitview.addView(view);
        expect(view.size).toBe(200);
        splitview.layout(100, 500);
        expect(view.size).toBe(100);
        splitview.layout(50, 500);
        expect(view.size).toBe(50);
        splitview.layout(30, 500);
        expect(view.size).toBe(50);
        splitview.layout(100, 500);
        expect(view.size).toBe(100);
        splitview.dispose();
    });
    test('can resize views 1', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        splitview.layout(200, 500);
        const view1 = new Testview(50, 200);
        const view2 = new Testview(50, 200);
        splitview.addView(view1);
        splitview.addView(view2);
        expect(view1.size).toBe(100);
        expect(view2.size).toBe(100);
        view1.fireChangeEvent({ size: 65 });
        expect(view1.size).toBe(65);
        expect(view2.size).toBe(135);
        view2.fireChangeEvent({ size: 75 });
        expect(view1.size).toBe(125);
        expect(view2.size).toBe(75);
        view2.fireChangeEvent({});
        expect(view1.size).toBe(125);
        expect(view2.size).toBe(75);
        splitview.dispose();
    });
    test('can resize views 2', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        splitview.layout(200, 500);
        const view1 = new Testview(50, 200);
        const view2 = new Testview(50, 200);
        const view3 = new Testview(50, 200);
        splitview.addView(view1);
        splitview.addView(view2);
        splitview.addView(view3);
        expect([view1.size, view2.size, view3.size]).toEqual([66, 66, 68]);
        splitview.resizeView(1, 100);
        expect([view1.size, view2.size, view3.size]).toEqual([50, 100, 50]);
        splitview.resizeView(2, 60);
        expect([view1.size, view2.size, view3.size]).toEqual([50, 90, 60]);
        expect([
            splitview.getViewSize(0),
            splitview.getViewSize(1),
            splitview.getViewSize(2),
            splitview.getViewSize(3),
        ]).toEqual([50, 90, 60, -1]);
        splitview.dispose();
    });
    test('move view', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        splitview.layout(200, 500);
        const view1 = new Testview(50, 200);
        const view2 = new Testview(50, 200);
        const view3 = new Testview(50, 200);
        splitview.addView(view1);
        splitview.addView(view2);
        splitview.addView(view3);
        expect([view1.size, view2.size, view3.size]).toEqual([66, 66, 68]);
        splitview.moveView(2, 0);
        expect(splitview.getViews()).toEqual([view3, view1, view2]);
        expect([view1.size, view2.size, view3.size]).toEqual([66, 66, 68]);
        splitview.moveView(0, 2);
        expect(splitview.getViews()).toEqual([view1, view2, view3]);
        expect([view1.size, view2.size, view3.size]).toEqual([66, 66, 68]);
        splitview.dispose();
    });
    test('layout called after views added', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        const view1 = new Testview(50, 200);
        const view2 = new Testview(50, 200);
        const view3 = new Testview(50, 200);
        splitview.addView(view1);
        splitview.addView(view2);
        splitview.addView(view3);
        splitview.layout(200, 500);
        expect([view1.size, view2.size, view3.size]).toEqual([67, 67, 66]);
        splitview.dispose();
    });
    test('proportional layout', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        splitview.layout(200, 500);
        const view1 = new Testview(20, Number.POSITIVE_INFINITY);
        const view2 = new Testview(20, Number.POSITIVE_INFINITY);
        splitview.addView(view1);
        splitview.addView(view2);
        expect([view1.size, view2.size]).toEqual([100, 100]);
        splitview.layout(100, 500);
        expect([view1.size, view2.size]).toEqual([50, 50]);
        splitview.dispose();
    });
    test('disable proportional layout', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
        });
        splitview.layout(200, 500);
        const view1 = new Testview(20, Number.POSITIVE_INFINITY);
        const view2 = new Testview(20, Number.POSITIVE_INFINITY);
        splitview.addView(view1);
        splitview.addView(view2);
        expect([view1.size, view2.size]).toEqual([100, 100]);
        splitview.layout(100, 500);
        expect([view1.size, view2.size]).toEqual([80, 20]);
        splitview.dispose();
    });
    test('high priority', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
        });
        splitview.layout(300, 500);
        const view1 = new Testview(50, Number.POSITIVE_INFINITY);
        const view2 = new Testview(50, Number.POSITIVE_INFINITY, splitview_1.LayoutPriority.High);
        const view3 = new Testview(50, Number.POSITIVE_INFINITY);
        splitview.addView(view1);
        splitview.addView(view2);
        splitview.addView(view3);
        expect([view1.size, view2.size, view3.size]).toEqual([100, 100, 100]);
        splitview.layout(400, 500);
        expect([view1.size, view2.size, view3.size]).toEqual([100, 200, 100]);
        splitview.dispose();
    });
    test('low priority', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
        });
        splitview.layout(300, 500);
        const view1 = new Testview(50, Number.POSITIVE_INFINITY, splitview_1.LayoutPriority.Low);
        const view2 = new Testview(50, Number.POSITIVE_INFINITY);
        const view3 = new Testview(50, Number.POSITIVE_INFINITY);
        splitview.addView(view1);
        splitview.addView(view2);
        splitview.addView(view3);
        expect([view1.size, view2.size, view3.size]).toEqual([100, 100, 100]);
        splitview.layout(400, 500);
        expect([view1.size, view2.size, view3.size]).toEqual([100, 100, 200]);
        splitview.dispose();
    });
    test('from descriptor', () => {
        const descriptor = {
            size: 300,
            views: [
                {
                    size: 80,
                    view: new Testview(0, Number.POSITIVE_INFINITY),
                },
                {
                    size: 100,
                    view: new Testview(0, Number.POSITIVE_INFINITY),
                },
                {
                    size: 120,
                    view: new Testview(0, Number.POSITIVE_INFINITY),
                },
            ],
        };
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
            descriptor,
        });
        expect([
            descriptor.views[0].size,
            descriptor.views[1].size,
            descriptor.views[2].size,
        ]).toEqual([80, 100, 120]);
        expect(splitview.size).toBe(300);
    });
    test('onDidAddView and onDidRemoveView events', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
        });
        const added = [];
        const removed = [];
        const disposable = new lifecycle_1.CompositeDisposable(splitview.onDidAddView((view) => added.push(view)), splitview.onDidRemoveView((view) => removed.push(view)));
        const view1 = new Testview(0, 100);
        const view2 = new Testview(0, 100);
        expect(added.length).toBe(0);
        expect(removed.length).toBe(0);
        splitview.addView(view1);
        expect(added.length).toBe(1);
        expect(removed.length).toBe(0);
        expect(added[0]).toBe(view1);
        splitview.addView(view2);
        expect(added.length).toBe(2);
        expect(removed.length).toBe(0);
        expect(added[1]).toBe(view2);
        splitview.removeView(0);
        expect(added.length).toBe(2);
        expect(removed.length).toBe(1);
        expect(removed[0]).toBe(view1);
        splitview.removeView(0);
        expect(added.length).toBe(2);
        expect(removed.length).toBe(2);
        expect(removed[1]).toBe(view2);
        disposable.dispose();
    });
    test('dispose of splitview', () => {
        expect(container.childNodes.length).toBe(0);
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
        });
        const view1 = new Testview(0, 100);
        const view2 = new Testview(0, 100);
        splitview.addView(view1);
        splitview.addView(view2);
        expect(container.childNodes.length).toBeGreaterThan(0);
        let anyEvents = false;
        const listener = splitview.onDidRemoveView((e) => {
            anyEvents = true; // disposing of the splitview shouldn't fire onDidRemoveView events
        });
        splitview.dispose();
        listener.dispose();
        expect(anyEvents).toBeFalsy();
        expect(container.childNodes.length).toBe(0);
    });
    test('dnd: pointer events to move sash', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
        });
        splitview.layout(400, 500);
        const view1 = new Testview(0, 1000);
        const view2 = new Testview(0, 1000);
        splitview.addView(view1);
        splitview.addView(view2);
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
        const sashElement = container
            .getElementsByClassName('dv-sash')
            .item(0);
        // validate the expected state before drag
        expect([view1.size, view2.size]).toEqual([200, 200]);
        expect(sashElement).toBeTruthy();
        expect(view1.element.parentElement.style.pointerEvents).toBe('');
        expect(view2.element.parentElement.style.pointerEvents).toBe('');
        // start the drag event
        (0, dom_1.fireEvent)(sashElement, new MouseEvent('pointerdown', { clientX: 50, clientY: 100 }));
        expect(addEventListenerSpy).toBeCalledTimes(3);
        // during a sash drag the views should have pointer-events disabled
        expect(view1.element.parentElement.style.pointerEvents).toBe('none');
        expect(view2.element.parentElement.style.pointerEvents).toBe('none');
        // expect a delta move of 70 - 50 = 20
        (0, dom_1.fireEvent)(document, new MouseEvent('pointermove', { clientX: 70, clientY: 110 }));
        expect([view1.size, view2.size]).toEqual([220, 180]);
        // expect a delta move of 75 - 70 = 5
        (0, dom_1.fireEvent)(document, new MouseEvent('pointermove', { clientX: 75, clientY: 110 }));
        expect([view1.size, view2.size]).toEqual([225, 175]);
        // end the drag event
        (0, dom_1.fireEvent)(document, new MouseEvent('pointerup', { clientX: 70, clientY: 110 }));
        expect(removeEventListenerSpy).toBeCalledTimes(3);
        // expect pointer-eventes on views to be restored
        expect(view1.element.parentElement.style.pointerEvents).toBe('');
        expect(view2.element.parentElement.style.pointerEvents).toBe('');
        (0, dom_1.fireEvent)(document, new MouseEvent('pointermove', { clientX: 100, clientY: 100 }));
        // expect no additional resizes
        expect([view1.size, view2.size]).toEqual([225, 175]);
        // expect no additional document listeners
        expect(addEventListenerSpy).toBeCalledTimes(3);
        expect(removeEventListenerSpy).toBeCalledTimes(3);
    });
    test('setViewVisible', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
        });
        splitview.layout(900, 500);
        const view1 = new Testview(0, 1000);
        const view2 = new Testview(0, 1000);
        const view3 = new Testview(0, 1000);
        splitview.addView(view1);
        splitview.addView(view2);
        splitview.addView(view3);
        expect([view1.size, view2.size, view3.size]).toEqual([300, 300, 300]);
        splitview.setViewVisible(0, false);
        expect([view1.size, view2.size, view3.size]).toEqual([0, 300, 600]);
        splitview.setViewVisible(0, true);
        expect([view1.size, view2.size, view3.size]).toEqual([300, 300, 300]);
    });
    test('setViewVisible with one view having high layout priority', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
        });
        splitview.layout(900, 500);
        const view1 = new Testview(0, 1000);
        const view2 = new Testview(0, 1000, splitview_1.LayoutPriority.High);
        const view3 = new Testview(0, 1000);
        splitview.addView(view1);
        splitview.addView(view2);
        splitview.addView(view3);
        expect([view1.size, view2.size, view3.size]).toEqual([300, 300, 300]);
        splitview.setViewVisible(0, false);
        expect([view1.size, view2.size, view3.size]).toEqual([0, 600, 300]);
        splitview.setViewVisible(0, true);
        expect([view1.size, view2.size, view3.size]).toEqual([300, 300, 300]);
    });
    test('set view size', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
        });
        splitview.layout(900, 500);
        const view1 = new Testview(0, 1000);
        const view2 = new Testview(0, 1000);
        const view3 = new Testview(0, 1000);
        splitview.addView(view1);
        splitview.addView(view2);
        splitview.addView(view3);
        expect([view1.size, view2.size, view3.size]).toEqual([300, 300, 300]);
        view1.fireChangeEvent({ size: 0 });
        expect([view1.size, view2.size, view3.size]).toEqual([0, 300, 600]);
        view1.fireChangeEvent({ size: 300 });
        expect([view1.size, view2.size, view3.size]).toEqual([300, 300, 300]);
    });
    test('set view size with one view having high layout priority', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
        });
        splitview.layout(900, 500);
        const view1 = new Testview(0, 1000);
        const view2 = new Testview(0, 1000, splitview_1.LayoutPriority.High);
        const view3 = new Testview(0, 1000);
        splitview.addView(view1);
        splitview.addView(view2);
        splitview.addView(view3);
        expect([view1.size, view2.size, view3.size]).toEqual([300, 300, 300]);
        view1.fireChangeEvent({ size: 0 });
        expect([view1.size, view2.size, view3.size]).toEqual([0, 600, 300]);
        view1.fireChangeEvent({ size: 300 });
        expect([view1.size, view2.size, view3.size]).toEqual([300, 300, 300]);
    });
    test('that margins are applied to view sizing', () => {
        const splitview = new splitview_1.Splitview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: false,
            margin: 24,
        });
        splitview.layout(924, 500);
        const view1 = new Testview(0, 1000);
        const view2 = new Testview(0, 1000);
        const view3 = new Testview(0, 1000);
        const view4 = new Testview(0, 1000);
        splitview.addView(view1);
        expect([view1.size]).toEqual([924]);
        splitview.addView(view2);
        expect([view1.size, view2.size]).toEqual([450, 450]); // 450 + 24 + 450  = 924
        splitview.addView(view3);
        expect([view1.size, view2.size, view3.size]).toEqual([292, 292, 292]); // 292 + 24 + 292 + 24 + 292 = 924
        splitview.addView(view4);
        expect([view1.size, view2.size, view3.size, view4.size]).toEqual([
            213, 213, 213, 213,
        ]); // 213 + 24 + 213 + 24 + 213 + 24 + 213 = 924
        let viewQuery = Array.from(container
            .querySelectorAll('.dv-split-view-container > .dv-view-container > .dv-view')
            .entries())
            .map(([i, e]) => e)
            .map((e) => ({
            left: e.style.left,
            top: e.style.top,
            height: e.style.height,
            width: e.style.width,
        }));
        let sashQuery = Array.from(container
            .querySelectorAll('.dv-split-view-container > .dv-sash-container > .dv-sash')
            .entries())
            .map(([i, e]) => e)
            .map((e) => ({
            left: e.style.left,
            top: e.style.top,
        }));
        // check HTMLElement positions since these are the ones that really matter
        expect(viewQuery).toEqual([
            { left: '0px', top: '', width: '213px', height: '' },
            // 213 + 24 = 237
            { left: '237px', top: '', width: '213px', height: '' },
            // 237 + 213 + 24 = 474
            { left: '474px', top: '', width: '213px', height: '' },
            // 474 + 213 + 24 = 474
            { left: '711px', top: '', width: '213px', height: '' },
            // 711 + 213 = 924
        ]);
        // 924 / 4 = 231 view size
        // 231 - (24*3/4) = 213 margin adjusted view size
        // 213 - 4/2 + 24/2 = 223
        expect(sashQuery).toEqual([
            // 213 - 4/2 + 24/2 = 223
            { left: '223px', top: '0px' },
            // 213 + 24 + 213 = 450
            // 450 - 4/2 + 24/2 = 460
            { left: '460px', top: '0px' },
            // 213 + 24 + 213 + 24 + 213 = 687
            // 687 - 4/2 + 24/2 = 697
            { left: '697px', top: '0px' },
        ]);
        splitview.setViewVisible(0, false);
        viewQuery = Array.from(container
            .querySelectorAll('.dv-split-view-container > .dv-view-container > .dv-view')
            .entries())
            .map(([i, e]) => e)
            .map((e) => ({
            left: e.style.left,
            top: e.style.top,
            height: e.style.height,
            width: e.style.width,
        }));
        sashQuery = Array.from(container
            .querySelectorAll('.dv-split-view-container > .dv-sash-container > .dv-sash')
            .entries())
            .map(([i, e]) => e)
            .map((e) => ({
            left: e.style.left,
            top: e.style.top,
        }));
        expect(viewQuery).toEqual([
            { left: '0px', top: '', width: '0px', height: '' },
            { left: '0px', top: '', width: '215px', height: '' },
            { left: '239px', top: '', width: '215px', height: '' },
            { left: '478px', top: '', width: '446px', height: '' },
        ]);
        expect(sashQuery).toEqual([
            { left: '0px', top: '0px' },
            { left: '225px', top: '0px' },
            { left: '464px', top: '0px' },
        ]);
    });
});
