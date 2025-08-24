"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../events");
const baseComponentGridview_1 = require("../../gridview/baseComponentGridview");
const lifecycle_1 = require("../../lifecycle");
const splitview_1 = require("../../splitview/splitview");
class TestPanel {
    constructor(id, element, minimumWidth, maximumWidth, minimumHeight, maximumHeight, priority, snap) {
        this.id = id;
        this.element = element;
        this.minimumWidth = minimumWidth;
        this.maximumWidth = maximumWidth;
        this.minimumHeight = minimumHeight;
        this.maximumHeight = maximumHeight;
        this.priority = priority;
        this.snap = snap;
        this._onDidChange = new events_1.Emitter();
        this.onDidChange = this._onDidChange.event;
        this.isVisible = true;
        this.isActive = true;
        this.params = {};
    }
    init(params) {
        //
    }
    setActive(isActive) {
        //
    }
    toJSON() {
        return {};
    }
    layout(width, height) {
        //
    }
    update(event) {
        //
    }
    focus() {
        //
    }
    fromJSON(json) {
        //
    }
    dispose() {
        //
    }
}
class ClassUnderTest extends baseComponentGridview_1.BaseGrid {
    constructor(parentElement, options) {
        super(parentElement, options);
        this.gridview = this.gridview;
    }
    doRemoveGroup(group, options) {
        return super.doRemoveGroup(group, options);
    }
    doAddGroup(group, location, size) {
        this._groups.set(group.id, {
            value: group,
            disposable: {
                dispose: () => {
                    //
                },
            },
        });
        super.doAddGroup(group, location, size);
    }
    fromJSON(data) {
        //
    }
    toJSON() {
        return {};
    }
    clear() {
        //
    }
}
describe('baseComponentGridview', () => {
    test('that the container is not removed when grid is disposed', () => {
        const root = document.createElement('div');
        const container = document.createElement('div');
        root.appendChild(container);
        const cut = new ClassUnderTest(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: true,
        });
        cut.dispose();
        expect(container.parentElement).toBe(root);
    });
    test('that .layout(...) force flag works', () => {
        const cut = new ClassUnderTest(document.createElement('div'), {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: true,
        });
        const spy = jest.spyOn(cut.gridview, 'layout');
        cut.layout(100, 100);
        expect(spy).toHaveBeenCalledTimes(1);
        cut.layout(100, 100, false);
        expect(spy).toHaveBeenCalledTimes(1);
        cut.layout(100, 100, true);
        expect(spy).toHaveBeenCalledTimes(2);
        cut.layout(150, 150, false);
        expect(spy).toHaveBeenCalledTimes(3);
        cut.layout(150, 150, true);
        expect(spy).toHaveBeenCalledTimes(4);
    });
    test('can add group', () => {
        const cut = new ClassUnderTest(document.createElement('div'), {
            orientation: splitview_1.Orientation.HORIZONTAL,
            proportionalLayout: true,
        });
        const events = [];
        const disposable = new lifecycle_1.CompositeDisposable(cut.onDidAdd((event) => {
            events.push({ type: 'add', panel: event });
        }), cut.onDidRemove((event) => {
            events.push({ type: 'remove', panel: event });
        }), cut.onDidActiveChange((event) => {
            events.push({ type: 'active', panel: event });
        }));
        const panel1 = new TestPanel('id', document.createElement('div'), 0, 100, 0, 100, splitview_1.LayoutPriority.Normal, false);
        cut.doAddGroup(panel1);
        expect(events.length).toBe(1);
        expect(events[0]).toEqual({ type: 'add', panel: panel1 });
        const panel2 = new TestPanel('id', document.createElement('div'), 0, 100, 0, 100, splitview_1.LayoutPriority.Normal, false);
        cut.doAddGroup(panel2);
        expect(events.length).toBe(2);
        expect(events[1]).toEqual({ type: 'add', panel: panel2 });
        cut.doRemoveGroup(panel1);
        expect(events.length).toBe(3);
        expect(events[2]).toEqual({ type: 'remove', panel: panel1 });
        disposable.dispose();
        cut.dispose();
    });
});
