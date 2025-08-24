"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../events");
const branchNode_1 = require("../../gridview/branchNode");
const gridview_1 = require("../../gridview/gridview");
const splitview_1 = require("../../splitview/splitview");
class MockGridview {
    constructor(id) {
        this.id = id;
        this.minimumWidth = 0;
        this.maximumWidth = Number.MAX_VALUE;
        this.minimumHeight = 0;
        this.maximumHeight = Number.MAX_VALUE;
        this.onDidChange = new events_1.Emitter().event;
        this.element = document.createElement('div');
        this.isVisible = true;
        this.width = 0;
        this.height = 0;
        this.element.className = 'mock-grid-view';
        this.element.id = `${id !== null && id !== void 0 ? id : ''}`;
    }
    layout(width, height) {
        this.width = width;
        this.height = height;
    }
    toJSON() {
        if (this.id) {
            return { id: this.id };
        }
        return {};
    }
}
describe('gridview', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
    });
    test('dispose of gridview', () => {
        expect(container.childNodes.length).toBe(0);
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        container.appendChild(gridview.element);
        expect(container.childNodes.length).toBe(1);
        gridview.dispose();
        expect(container.childNodes.length).toBe(0);
    });
    test('insertOrthogonalSplitviewAtRoot #1', () => {
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [0]);
        gridview.insertOrthogonalSplitviewAtRoot();
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [0, 1]);
        function checkOrientationFlipsAtEachLevel(root) {
            const orientation = root.orientation;
            const orthogonalOrientation = (0, gridview_1.orthogonal)(orientation);
            for (const child of root.children) {
                if (child.orientation !== orthogonalOrientation) {
                    fail('child cannot have the same orientation as parent');
                }
                if (child instanceof branchNode_1.BranchNode) {
                    checkOrientationFlipsAtEachLevel(child);
                }
            }
        }
        checkOrientationFlipsAtEachLevel(gridview.root);
    });
    test('insertOrthogonalSplitviewAtRoot #2', () => {
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1]);
        gridview.insertOrthogonalSplitviewAtRoot();
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1]);
        function checkOrientationFlipsAtEachLevel(root) {
            const orientation = root.orientation;
            const orthogonalOrientation = (0, gridview_1.orthogonal)(orientation);
            for (const child of root.children) {
                if (child.orientation !== orthogonalOrientation) {
                    fail('child cannot have the same orientation as parent');
                }
                if (child instanceof branchNode_1.BranchNode) {
                    checkOrientationFlipsAtEachLevel(child);
                }
            }
        }
        checkOrientationFlipsAtEachLevel(gridview.root);
    });
    test('removeView: remove leaf from branch where branch becomes leaf and parent is root', () => {
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0]);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: [
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                        ],
                        size: 500,
                        type: 'branch',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(3);
        gridview.removeView([1, 0], splitview_1.Sizing.Distribute);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(2);
    });
    test('removeView: remove leaf from branch where branch remains branch and parent is root', () => {
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 1]);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: [
                            {
                                data: {},
                                size: 333,
                                type: 'leaf',
                            },
                            {
                                data: {},
                                size: 333,
                                type: 'leaf',
                            },
                            {
                                data: {},
                                size: 334,
                                type: 'leaf',
                            },
                        ],
                        size: 500,
                        type: 'branch',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(4);
        gridview.removeView([1, 0], splitview_1.Sizing.Distribute);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: [
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                        ],
                        size: 500,
                        type: 'branch',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(3);
    });
    test('removeView: remove leaf where parent is root', () => {
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0]);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: [
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                        ],
                        size: 500,
                        type: 'branch',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(3);
        gridview.removeView([0], splitview_1.Sizing.Distribute);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'VERTICAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(2);
    });
    test('removeView: remove leaf from branch where branch becomes leaf and parent is not root', () => {
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0, 0]);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: [
                            {
                                data: [
                                    {
                                        data: {},
                                        size: 250,
                                        type: 'leaf',
                                    },
                                    {
                                        data: {},
                                        size: 250,
                                        type: 'leaf',
                                    },
                                ],
                                size: 500,
                                type: 'branch',
                            },
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                        ],
                        size: 500,
                        type: 'branch',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(4);
        gridview.removeView([1, 0, 0], splitview_1.Sizing.Distribute);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: [
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                        ],
                        size: 500,
                        type: 'branch',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(3);
    });
    test('removeView: remove leaf from branch where branch remains branch and parent is not root', () => {
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0, 0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0, 1]);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: [
                            {
                                data: [
                                    {
                                        data: {},
                                        size: 166,
                                        type: 'leaf',
                                    },
                                    {
                                        data: {},
                                        size: 166,
                                        type: 'leaf',
                                    },
                                    {
                                        data: {},
                                        size: 168,
                                        type: 'leaf',
                                    },
                                ],
                                size: 500,
                                type: 'branch',
                            },
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                        ],
                        size: 500,
                        type: 'branch',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(5);
        gridview.removeView([1, 0, 1], splitview_1.Sizing.Distribute);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: [
                            {
                                data: [
                                    {
                                        data: {},
                                        size: 250,
                                        type: 'leaf',
                                    },
                                    {
                                        data: {},
                                        size: 250,
                                        type: 'leaf',
                                    },
                                ],
                                size: 500,
                                type: 'branch',
                            },
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                        ],
                        size: 500,
                        type: 'branch',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(4);
    });
    test('removeView: remove leaf where parent is root', () => {
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0, 0]);
        gridview.addView(new MockGridview(), splitview_1.Sizing.Distribute, [1, 0, 1]);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: [
                            {
                                data: [
                                    {
                                        data: {},
                                        size: 166,
                                        type: 'leaf',
                                    },
                                    {
                                        data: {},
                                        size: 166,
                                        type: 'leaf',
                                    },
                                    {
                                        data: {},
                                        size: 168,
                                        type: 'leaf',
                                    },
                                ],
                                size: 500,
                                type: 'branch',
                            },
                            {
                                data: {},
                                size: 500,
                                type: 'leaf',
                            },
                        ],
                        size: 500,
                        type: 'branch',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(5);
        gridview.removeView([1, 1], splitview_1.Sizing.Distribute);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [
                    {
                        data: {},
                        size: 500,
                        type: 'leaf',
                    },
                    {
                        data: {},
                        size: 166,
                        type: 'leaf',
                    },
                    {
                        data: {},
                        size: 166,
                        type: 'leaf',
                    },
                    {
                        data: {},
                        size: 168,
                        type: 'leaf',
                    },
                ],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(4);
    });
    test('that calling insertOrthogonalSplitviewAtRoot() for an empty view doesnt add any nodes', () => {
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'HORIZONTAL',
            root: {
                data: [],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
        gridview.insertOrthogonalSplitviewAtRoot();
        expect(gridview.serialize()).toEqual({
            height: 1000,
            orientation: 'VERTICAL',
            root: {
                data: [],
                size: 1000,
                type: 'branch',
            },
            width: 1000,
        });
    });
    test('re-structuring deep gridivew where a branchnode becomes of length one and is coverted to a leaf node', () => {
        const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        const view4 = new MockGridview('4');
        const view5 = new MockGridview('5');
        const view6 = new MockGridview('6');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 0]);
        gridview.addView(view4, splitview_1.Sizing.Distribute, [1, 1, 0]);
        gridview.addView(view5, splitview_1.Sizing.Distribute, [1, 1, 0, 0]);
        gridview.addView(view6, splitview_1.Sizing.Distribute, [1, 1, 0, 0, 0]);
        let el = gridview.element.querySelectorAll('.mock-grid-view');
        expect(el.length).toBe(6);
        gridview.remove(view2);
        el = gridview.element.querySelectorAll('.mock-grid-view');
        expect(el.length).toBe(5);
    });
    test('gridview nested proportional layouts', () => {
        const gridview = new gridview_1.Gridview(true, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        const view4 = new MockGridview('4');
        const view5 = new MockGridview('5');
        const view6 = new MockGridview('6');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 1]);
        gridview.addView(view4, splitview_1.Sizing.Distribute, [1, 1, 0]);
        gridview.addView(view5, splitview_1.Sizing.Distribute, [1, 1, 0, 0]);
        gridview.addView(view6, splitview_1.Sizing.Distribute, [1, 1, 0, 0, 0]);
        const views = [view1, view2, view3, view4, view5, view6];
        const dimensions = [
            { width: 500, height: 1000 },
            { width: 500, height: 500 },
            { width: 250, height: 500 },
            { width: 250, height: 250 },
            { width: 125, height: 250 },
            { width: 125, height: 250 },
        ];
        expect(views.map((view) => ({
            width: view.width,
            height: view.height,
        }))).toEqual(dimensions);
        gridview.layout(2000, 1500);
        expect(views.map((view) => ({
            width: view.width,
            height: view.height,
        }))).toEqual(dimensions.map(({ width, height }) => ({
            width: width * 2,
            height: height * 1.5,
        })));
        gridview.layout(200, 2000);
        expect(views.map((view) => ({
            width: view.width,
            height: view.height,
        }))).toEqual(dimensions.map(({ width, height }) => ({
            width: width * 0.2,
            height: height * 2,
        })));
    });
    test('that maximizeView retains original dimensions when restored', () => {
        const gridview = new gridview_1.Gridview(true, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        let counter = 0;
        const subscription = gridview.onDidMaximizedNodeChange(() => {
            counter++;
        });
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        const view4 = new MockGridview('4');
        const view5 = new MockGridview('5');
        const view6 = new MockGridview('6');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 1]);
        gridview.addView(view4, splitview_1.Sizing.Distribute, [1, 1, 0]);
        gridview.addView(view5, splitview_1.Sizing.Distribute, [1, 1, 0, 0]);
        gridview.addView(view6, splitview_1.Sizing.Distribute, [1, 1, 0, 0, 0]);
        /**
         *   _____________________________________________
         *  |                     |                       |
         *  |                     |           2           |
         *  |                     |                       |
         *  |          1          |_______________________|
         *  |                     |         |      4      |
         *  |                     |    3    |_____________|
         *  |                     |         |   5  |   6  |
         *  |_____________________|_________|______|______|
         */
        const views = [view1, view2, view3, view4, view5, view6];
        const dimensions = [
            { width: 500, height: 1000 },
            { width: 500, height: 500 },
            { width: 250, height: 500 },
            { width: 250, height: 250 },
            { width: 125, height: 250 },
            { width: 125, height: 250 },
        ];
        function assertLayout() {
            expect(views.map((view) => ({
                width: view.width,
                height: view.height,
            }))).toEqual(dimensions);
        }
        // base case assertions
        assertLayout();
        expect(gridview.hasMaximizedView()).toBeFalsy();
        expect(counter).toBe(0);
        /**
         * maximize each view individually and then return to the standard view
         * checking on each iteration that the original layout dimensions
         * are restored
         */
        for (let i = 0; i < views.length; i++) {
            const view = views[i];
            gridview.maximizeView(view);
            expect(counter).toBe(i * 2 + 1);
            expect(gridview.hasMaximizedView()).toBeTruthy();
            gridview.exitMaximizedView();
            expect(counter).toBe(i * 2 + 2);
            assertLayout();
        }
        subscription.dispose();
    });
    test('that maximizedView is exited when a views visibility is changed', () => {
        const gridview = new gridview_1.Gridview(true, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 1]);
        expect(gridview.hasMaximizedView()).toBeFalsy();
        gridview.maximizeView(view2);
        expect(gridview.hasMaximizedView()).toBeTruthy();
        gridview.setViewVisible([0], true);
        expect(gridview.hasMaximizedView()).toBeFalsy();
    });
    test('that maximizedView is exited when a view is moved', () => {
        const gridview = new gridview_1.Gridview(true, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        const view4 = new MockGridview('4');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 1]);
        gridview.addView(view4, splitview_1.Sizing.Distribute, [1, 1, 0]);
        expect(gridview.hasMaximizedView()).toBeFalsy();
        gridview.maximizeView(view2);
        expect(gridview.hasMaximizedView()).toBeTruthy();
        gridview.moveView([1, 1], 0, 1);
        expect(gridview.hasMaximizedView()).toBeFalsy();
    });
    test('that maximizedView is exited when a view is added', () => {
        const gridview = new gridview_1.Gridview(true, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        const view4 = new MockGridview('4');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 1]);
        expect(gridview.hasMaximizedView()).toBeFalsy();
        gridview.maximizeView(view2);
        expect(gridview.hasMaximizedView()).toBeTruthy();
        gridview.addView(view4, splitview_1.Sizing.Distribute, [1, 1, 0]);
        expect(gridview.hasMaximizedView()).toBeFalsy();
    });
    test('that maximizedView is exited when a view is removed', () => {
        const gridview = new gridview_1.Gridview(true, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 1]);
        expect(gridview.hasMaximizedView()).toBeFalsy();
        gridview.maximizeView(view2);
        expect(gridview.hasMaximizedView()).toBeTruthy();
        gridview.removeView([1, 1]);
        expect(gridview.hasMaximizedView()).toBeFalsy();
    });
    test('that maximizedView is cleared when layout is cleared', () => {
        const gridview = new gridview_1.Gridview(true, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 1]);
        expect(gridview.hasMaximizedView()).toBeFalsy();
        gridview.maximizeView(view2);
        expect(gridview.hasMaximizedView()).toBeTruthy();
        gridview.clear();
        expect(gridview.hasMaximizedView()).toBeFalsy();
    });
    test('that maximizedView is cleared when layout is disposed', () => {
        const gridview = new gridview_1.Gridview(true, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 1]);
        expect(gridview.hasMaximizedView()).toBeFalsy();
        gridview.maximizeView(view2);
        expect(gridview.hasMaximizedView()).toBeTruthy();
        gridview.dispose();
        expect(gridview.hasMaximizedView()).toBeFalsy();
    });
    test('that maximizedView is cleared when layout is reset', () => {
        const gridview = new gridview_1.Gridview(true, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 1]);
        expect(gridview.hasMaximizedView()).toBeFalsy();
        gridview.maximizeView(view2);
        expect(gridview.hasMaximizedView()).toBeTruthy();
        gridview.deserialize({
            height: 1000,
            width: 1000,
            root: {
                type: 'leaf',
                data: [],
            },
            orientation: splitview_1.Orientation.HORIZONTAL,
        }, {
            fromJSON: (data) => {
                return new MockGridview('');
            },
        });
        expect(gridview.hasMaximizedView()).toBeFalsy();
    });
    test('visibility check', () => {
        const gridview = new gridview_1.Gridview(true, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
        gridview.layout(1000, 1000);
        const view1 = new MockGridview('1');
        const view2 = new MockGridview('2');
        const view3 = new MockGridview('3');
        const view4 = new MockGridview('4');
        const view5 = new MockGridview('5');
        const view6 = new MockGridview('6');
        gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
        gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
        gridview.addView(view3, splitview_1.Sizing.Distribute, [1, 1]);
        gridview.addView(view4, splitview_1.Sizing.Distribute, [1, 1, 0]);
        gridview.addView(view5, splitview_1.Sizing.Distribute, [1, 1, 0, 0]);
        gridview.addView(view6, splitview_1.Sizing.Distribute, [1, 1, 0, 0, 0]);
        /**
         *   _____________________________________________
         *  |                     |                       |
         *  |                     |           2           |
         *  |                     |                       |
         *  |          1          |_______________________|
         *  |                     |         |      4      |
         *  |                     |    3    |_____________|
         *  |                     |         |   5  |   6  |
         *  |_____________________|_________|______|______|
         */
        function assertVisibility(visibility) {
            expect(gridview.isViewVisible((0, gridview_1.getGridLocation)(view1.element))).toBe(visibility[0]);
            expect(gridview.isViewVisible((0, gridview_1.getGridLocation)(view2.element))).toBe(visibility[1]);
            expect(gridview.isViewVisible((0, gridview_1.getGridLocation)(view3.element))).toBe(visibility[2]);
            expect(gridview.isViewVisible((0, gridview_1.getGridLocation)(view4.element))).toBe(visibility[3]);
            expect(gridview.isViewVisible((0, gridview_1.getGridLocation)(view5.element))).toBe(visibility[4]);
            expect(gridview.isViewVisible((0, gridview_1.getGridLocation)(view6.element))).toBe(visibility[5]);
        }
        // hide each view one by one
        assertVisibility([true, true, true, true, true, true]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view5.element), false);
        assertVisibility([true, true, true, true, false, true]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view4.element), false);
        assertVisibility([true, true, true, false, false, true]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view1.element), false);
        assertVisibility([false, true, true, false, false, true]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view2.element), false);
        assertVisibility([false, false, true, false, false, true]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view3.element), false);
        assertVisibility([false, false, false, false, false, true]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view6.element), false);
        assertVisibility([false, false, false, false, false, false]);
        // un-hide each view one by one
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view1.element), true);
        assertVisibility([true, false, false, false, false, false]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view5.element), true);
        assertVisibility([true, false, false, false, true, false]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view6.element), true);
        assertVisibility([true, false, false, false, true, true]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view2.element), true);
        assertVisibility([true, true, false, false, true, true]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view3.element), true);
        assertVisibility([true, true, true, false, true, true]);
        gridview.setViewVisible((0, gridview_1.getGridLocation)(view4.element), true);
        assertVisibility([true, true, true, true, true, true]);
    });
    describe('normalize', () => {
        test('should normalize after structure correctly', () => {
            // This test verifies that the normalize method works correctly
            // Since gridview already normalizes during remove operations, 
            // we'll test the method directly with known scenarios
            const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
            gridview.layout(1000, 1000);
            // Create a simple structure and test that normalize doesn't break anything
            const view1 = new MockGridview('1');
            const view2 = new MockGridview('2');
            gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
            gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
            const beforeNormalize = gridview.serialize();
            // Normalize should not change a balanced structure
            gridview.normalize();
            const afterNormalize = gridview.serialize();
            expect(afterNormalize).toEqual(beforeNormalize);
            expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(2);
        });
        test('should not normalize when root has single leaf child', () => {
            const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
            gridview.layout(1000, 1000);
            const view1 = new MockGridview('1');
            gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
            const beforeNormalize = gridview.serialize();
            gridview.normalize();
            const afterNormalize = gridview.serialize();
            // Structure should remain unchanged
            expect(afterNormalize).toEqual(beforeNormalize);
        });
        test('should not normalize when root has multiple children', () => {
            const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
            gridview.layout(1000, 1000);
            const view1 = new MockGridview('1');
            const view2 = new MockGridview('2');
            const view3 = new MockGridview('3');
            gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
            gridview.addView(view2, splitview_1.Sizing.Distribute, [1]);
            gridview.addView(view3, splitview_1.Sizing.Distribute, [2]);
            const beforeNormalize = gridview.serialize();
            gridview.normalize();
            const afterNormalize = gridview.serialize();
            // Structure should remain unchanged since root has multiple children
            expect(afterNormalize).toEqual(beforeNormalize);
        });
        test('should not normalize when no root exists', () => {
            const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
            gridview.layout(1000, 1000);
            // Call normalize on empty gridview
            expect(() => gridview.normalize()).not.toThrow();
            // Should still be able to add views after normalizing empty gridview
            const view1 = new MockGridview('1');
            gridview.addView(view1, splitview_1.Sizing.Distribute, [0]);
            expect(gridview.element.querySelectorAll('.mock-grid-view').length).toBe(1);
        });
        test('normalize method exists and is callable', () => {
            const gridview = new gridview_1.Gridview(false, { separatorBorder: '' }, splitview_1.Orientation.HORIZONTAL);
            gridview.layout(1000, 1000);
            // Verify the normalize method exists and can be called
            expect(typeof gridview.normalize).toBe('function');
            expect(() => gridview.normalize()).not.toThrow();
        });
    });
});
