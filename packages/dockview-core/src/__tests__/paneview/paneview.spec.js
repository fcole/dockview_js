"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lifecycle_1 = require("../../lifecycle");
const paneview_1 = require("../../paneview/paneview");
const paneviewPanel_1 = require("../../paneview/paneviewPanel");
const splitview_1 = require("../../splitview/splitview");
class TestPanel extends paneviewPanel_1.PaneviewPanel {
    getBodyComponent() {
        return {
            element: document.createElement('div'),
            update: () => {
                //
            },
            dispose: () => {
                //
            },
            init: () => {
                // /
            },
        };
    }
    getHeaderComponent() {
        return {
            element: document.createElement('div'),
            update: () => {
                //
            },
            dispose: () => {
                //
            },
            init: () => {
                // /
            },
        };
    }
}
describe('paneview', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        container.className = 'container';
    });
    test('onDidAddView and onDidRemoveView events', () => {
        const paneview = new paneview_1.Paneview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        const added = [];
        const removed = [];
        const disposable = new lifecycle_1.CompositeDisposable(paneview.onDidAddView((view) => added.push(view)), paneview.onDidRemoveView((view) => removed.push(view)));
        const view1 = new TestPanel({
            id: 'id',
            component: 'component',
            headerComponent: 'headerComponent',
            orientation: splitview_1.Orientation.VERTICAL,
            isExpanded: true,
            isHeaderVisible: true,
            headerSize: 22,
            minimumBodySize: 0,
            maximumBodySize: Number.MAX_SAFE_INTEGER,
        });
        const view2 = new TestPanel({
            id: 'id2',
            component: 'component',
            headerComponent: 'headerComponent',
            orientation: splitview_1.Orientation.VERTICAL,
            isExpanded: true,
            isHeaderVisible: true,
            headerSize: 22,
            minimumBodySize: 0,
            maximumBodySize: Number.MAX_SAFE_INTEGER,
        });
        expect(added.length).toBe(0);
        expect(removed.length).toBe(0);
        paneview.addPane(view1);
        expect(added.length).toBe(1);
        expect(removed.length).toBe(0);
        expect(added[0]).toBe(view1);
        paneview.addPane(view2);
        expect(added.length).toBe(2);
        expect(removed.length).toBe(0);
        expect(added[1]).toBe(view2);
        paneview.removePane(0);
        expect(added.length).toBe(2);
        expect(removed.length).toBe(1);
        expect(removed[0]).toBe(view1);
        paneview.removePane(0);
        expect(added.length).toBe(2);
        expect(removed.length).toBe(2);
        expect(removed[1]).toBe(view2);
        disposable.dispose();
    });
    test('dispose of paneview', () => {
        expect(container.childNodes.length).toBe(0);
        const paneview = new paneview_1.Paneview(container, {
            orientation: splitview_1.Orientation.HORIZONTAL,
        });
        const view1 = new TestPanel({
            id: 'id',
            component: 'component',
            headerComponent: 'headerComponent',
            orientation: splitview_1.Orientation.VERTICAL,
            isExpanded: true,
            isHeaderVisible: true,
            headerSize: 22,
            minimumBodySize: 0,
            maximumBodySize: Number.MAX_SAFE_INTEGER,
        });
        const view2 = new TestPanel({
            id: 'id2',
            component: 'component',
            headerComponent: 'headerComponent',
            orientation: splitview_1.Orientation.VERTICAL,
            isExpanded: true,
            isHeaderVisible: true,
            headerSize: 22,
            minimumBodySize: 0,
            maximumBodySize: Number.MAX_SAFE_INTEGER,
        });
        paneview.addPane(view1);
        paneview.addPane(view2);
        expect(container.childNodes.length).toBeGreaterThan(0);
        paneview.dispose();
        expect(container.childNodes.length).toBe(0);
    });
});
