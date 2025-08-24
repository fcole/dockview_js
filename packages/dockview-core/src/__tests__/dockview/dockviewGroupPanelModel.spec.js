"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPanel = void 0;
const dockviewComponent_1 = require("../../dockview/dockviewComponent");
const dockviewGroupPanelModel_1 = require("../../dockview/dockviewGroupPanelModel");
const dom_1 = require("@testing-library/dom");
const dataTransfer_1 = require("../../dnd/dataTransfer");
const lifecycle_1 = require("../../lifecycle");
const dockviewGroupPanel_1 = require("../../dockview/dockviewGroupPanel");
const utils_1 = require("../__test_utils__/utils");
const overlayRenderContainer_1 = require("../../overlay/overlayRenderContainer");
const events_1 = require("../../events");
const shoehorn_1 = require("@total-typescript/shoehorn");
var GroupChangeKind2;
(function (GroupChangeKind2) {
    GroupChangeKind2[GroupChangeKind2["ADD_PANEL"] = 0] = "ADD_PANEL";
    GroupChangeKind2[GroupChangeKind2["REMOVE_PANEL"] = 1] = "REMOVE_PANEL";
    GroupChangeKind2[GroupChangeKind2["PANEL_ACTIVE"] = 2] = "PANEL_ACTIVE";
})(GroupChangeKind2 || (GroupChangeKind2 = {}));
class TestModel {
    constructor(id) {
        this.id = id;
        this.content = new TestHeaderPart(id);
        this.contentComponent = id;
        this.tab = new TestContentPart(id);
    }
    createTabRenderer(tabLocation) {
        return new TestHeaderPart(this.id);
    }
    update(event) {
        //
    }
    layout(width, height) {
        //
    }
    init(params) {
        //
    }
    updateParentGroup(group, isPanelVisible) {
        //
    }
    dispose() {
        //
    }
}
class Watermark {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = `watermark-test-container`;
    }
    get id() {
        return 'watermark-id';
    }
    init(params) {
        //
    }
    layout(width, height) {
        // noop
    }
    update(event) {
        // noop
    }
    focus() {
        // noop
    }
    toJSON() {
        return {};
    }
    dispose() {
        //
    }
}
class TestContentPart {
    constructor(id) {
        this.id = id;
        this.element = document.createElement('div');
        this.element.className = `content-part-${id}`;
    }
    init(params) {
        //noop
    }
    layout(width, height) {
        //noop
    }
    update(event) {
        //void
    }
    focus() {
        //noop
    }
    dispose() {
        //noop
    }
    toJSON() {
        return {};
    }
}
class TestHeaderPart {
    constructor(id) {
        this.id = id;
        this.element = document.createElement('div');
        this.element.className = `header-part-${id}`;
    }
    init(params) {
        //noop
    }
    layout(width, height) {
        //noop
    }
    update(event) {
        //void
    }
    focus() {
        //noop
    }
    dispose() {
        //noop
    }
    toJSON() {
        return {};
    }
}
class TestPanel {
    get title() {
        return '';
    }
    get group() {
        return this._group;
    }
    get params() {
        return {};
    }
    constructor(id, api) {
        this.id = id;
        this.api = api;
        this.view = new TestModel(id);
        this.init({
            title: `${id}`,
            params: {},
        });
    }
    init(params) {
        this._params = params;
    }
    updateParentGroup(group) {
        //
    }
    runEvents() {
        //
    }
    layout(width, height) {
        //noop
    }
    setTitle(title) {
        //
    }
    update(event) {
        //noop
    }
    focus() {
        //noop
    }
    toJSON() {
        var _a;
        return {
            id: this.id,
            title: (_a = this._params) === null || _a === void 0 ? void 0 : _a.title,
        };
    }
    dispose() {
        //noop
    }
}
exports.TestPanel = TestPanel;
describe('dockviewGroupPanelModel', () => {
    let groupview;
    let dockview;
    let options;
    let removePanelMock;
    let removeGroupMock;
    let panelApi;
    beforeEach(() => {
        removePanelMock = jest.fn();
        removeGroupMock = jest.fn();
        options = {};
        panelApi = (0, shoehorn_1.fromPartial)({
            renderer: 'onlyWhenVisible',
            onDidTitleChange: new events_1.Emitter().event,
            onDidParametersChange: new events_1.Emitter().event,
        });
        dockview = (0, shoehorn_1.fromPartial)({
            options: {},
            createWatermarkComponent: () => new Watermark(),
            doSetGroupActive: jest.fn(),
            id: 'dockview-1',
            removePanel: removePanelMock,
            removeGroup: removeGroupMock,
            onDidAddPanel: () => ({ dispose: jest.fn() }),
            onDidRemovePanel: () => ({ dispose: jest.fn() }),
            overlayRenderContainer: new overlayRenderContainer_1.OverlayRenderContainer(document.createElement('div'), (0, shoehorn_1.fromPartial)({})),
            onDidOptionsChange: () => ({ dispose: jest.fn() }),
        });
        groupview = new dockviewGroupPanel_1.DockviewGroupPanel(dockview, 'groupview-1', options);
        groupview.initialize();
    });
    test('panel events are captured during de-serialization', () => {
        const panel1 = new TestPanel('panel1', panelApi);
        const panel2 = new TestPanel('panel2', panelApi);
        const panel3 = new TestPanel('panel3', panelApi);
        const groupview2 = new dockviewGroupPanel_1.DockviewGroupPanel(dockview, 'groupview-2', {
            panels: [panel1, panel2, panel3],
            activePanel: panel2,
        });
        const events = [];
        const disposable = new lifecycle_1.CompositeDisposable(groupview2.model.onDidAddPanel((e) => {
            events.push({
                kind: GroupChangeKind2.ADD_PANEL,
                panel: e.panel,
            });
        }), groupview2.model.onDidRemovePanel((e) => {
            events.push({
                kind: GroupChangeKind2.REMOVE_PANEL,
                panel: e.panel,
            });
        }), groupview2.model.onDidActivePanelChange((e) => {
            events.push({
                kind: GroupChangeKind2.PANEL_ACTIVE,
                panel: e.panel,
            });
        }));
        groupview2.initialize();
        expect(events).toEqual([
            {
                kind: GroupChangeKind2.ADD_PANEL,
                panel: panel1,
            },
            {
                kind: GroupChangeKind2.ADD_PANEL,
                panel: panel2,
            },
            {
                kind: GroupChangeKind2.ADD_PANEL,
                panel: panel3,
            },
            {
                kind: GroupChangeKind2.PANEL_ACTIVE,
                panel: panel2,
            },
        ]);
        disposable.dispose();
    });
    test('panel events flow', () => {
        let events = [];
        const disposable = new lifecycle_1.CompositeDisposable(groupview.model.onDidAddPanel((e) => {
            events.push({
                kind: GroupChangeKind2.ADD_PANEL,
                panel: e.panel,
            });
        }), groupview.model.onDidRemovePanel((e) => {
            events.push({
                kind: GroupChangeKind2.REMOVE_PANEL,
                panel: e.panel,
            });
        }), groupview.model.onDidActivePanelChange((e) => {
            events.push({
                kind: GroupChangeKind2.PANEL_ACTIVE,
                panel: e.panel,
            });
        }));
        const panel1 = new TestPanel('panel1', panelApi);
        const panel2 = new TestPanel('panel2', panelApi);
        const panel3 = new TestPanel('panel3', panelApi);
        expect(events.length).toBe(0);
        groupview.model.openPanel(panel1);
        expect(events).toEqual([
            {
                kind: GroupChangeKind2.ADD_PANEL,
                panel: panel1,
            },
            {
                kind: GroupChangeKind2.PANEL_ACTIVE,
                panel: panel1,
            },
        ]);
        events = [];
        groupview.model.openPanel(panel2);
        expect(events).toEqual([
            {
                kind: GroupChangeKind2.ADD_PANEL,
                panel: panel2,
            },
            {
                kind: GroupChangeKind2.PANEL_ACTIVE,
                panel: panel2,
            },
        ]);
        events = [];
        groupview.model.openPanel(panel3);
        expect(events).toEqual([
            {
                kind: GroupChangeKind2.ADD_PANEL,
                panel: panel3,
            },
            {
                kind: GroupChangeKind2.PANEL_ACTIVE,
                panel: panel3,
            },
        ]);
        events = [];
        groupview.model.removePanel(panel3);
        expect(events).toEqual([
            {
                kind: GroupChangeKind2.REMOVE_PANEL,
                panel: panel3,
            },
            {
                kind: GroupChangeKind2.PANEL_ACTIVE,
                panel: panel2,
            },
        ]);
        events = [];
        groupview.model.removePanel(panel1);
        expect(events).toEqual([
            {
                kind: GroupChangeKind2.REMOVE_PANEL,
                panel: panel1,
            },
        ]);
        events = [];
        groupview.model.removePanel(panel2);
        expect(events).toEqual([
            {
                kind: GroupChangeKind2.REMOVE_PANEL,
                panel: panel2,
            },
        ]);
        events = [];
        disposable.dispose();
    });
    test('moveToPrevious and moveToNext', () => {
        const panel1 = new TestPanel('panel1', panelApi);
        const panel2 = new TestPanel('panel2', panelApi);
        const panel3 = new TestPanel('panel3', panelApi);
        groupview.model.openPanel(panel1);
        groupview.model.openPanel(panel2);
        groupview.model.openPanel(panel3);
        groupview.model.openPanel(panel2); // set active
        groupview.model.moveToPrevious();
        expect(groupview.model.activePanel).toBe(panel1);
        groupview.model.moveToPrevious({ suppressRoll: true });
        expect(groupview.model.activePanel).toBe(panel1);
        groupview.model.moveToPrevious();
        expect(groupview.model.activePanel).toBe(panel3);
        groupview.model.moveToNext({ suppressRoll: true });
        expect(groupview.model.activePanel).toBe(panel3);
        groupview.model.moveToNext({ suppressRoll: false });
        expect(groupview.model.activePanel).toBe(panel1);
        groupview.model.moveToPrevious({ suppressRoll: false });
        expect(groupview.model.activePanel).toBe(panel3);
        groupview.model.moveToNext();
        groupview.model.moveToNext();
        expect(groupview.model.activePanel).toBe(panel2);
    });
    test('default', () => {
        let viewQuery = groupview.element.querySelectorAll('.dv-groupview > .dv-tabs-and-actions-container');
        expect(viewQuery).toBeTruthy();
        viewQuery = groupview.element.querySelectorAll('.dv-groupview > .dv-content-container');
        expect(viewQuery).toBeTruthy();
    });
    test('closeAllPanels with panels', () => {
        const panel1 = new TestPanel('panel1', panelApi);
        const panel2 = new TestPanel('panel2', panelApi);
        const panel3 = new TestPanel('panel3', panelApi);
        groupview.model.openPanel(panel1);
        groupview.model.openPanel(panel2);
        groupview.model.openPanel(panel3);
        groupview.model.closeAllPanels();
        expect(removePanelMock).toHaveBeenCalledWith(panel1, undefined);
        expect(removePanelMock).toHaveBeenCalledWith(panel2, undefined);
        expect(removePanelMock).toHaveBeenCalledWith(panel3, undefined);
    });
    test('closeAllPanels with no panels', () => {
        groupview.model.closeAllPanels();
        expect(removeGroupMock).toHaveBeenCalledWith(groupview);
    });
    test('that group is set on panel during onDidAddPanel event', () => {
        const cut = new dockviewComponent_1.DockviewComponent(document.createElement('div'), {
            createComponent(options) {
                switch (options.name) {
                    case 'component':
                        return new TestContentPart(options.id);
                    default:
                        throw new Error(`unsupported`);
                }
            },
        });
        const disposable = cut.onDidAddPanel((panel) => {
            expect(panel.group).toBeTruthy();
        });
        const panel = cut.addPanel({ id: 'id', component: 'component' });
        disposable.dispose();
    });
    test('toJSON() default', () => {
        const dockviewComponent = new dockviewComponent_1.DockviewComponent(document.createElement('div'), {
            createComponent(options) {
                switch (options.name) {
                    case 'component':
                        return new TestContentPart(options.id);
                    default:
                        throw new Error(`unsupported`);
                }
            },
        });
        const cut = new dockviewGroupPanelModel_1.DockviewGroupPanelModel(document.createElement('div'), dockviewComponent, 'id', {}, null);
        expect(cut.toJSON()).toEqual({
            views: [],
            activeView: undefined,
            id: 'id',
        });
    });
    test('toJSON() locked and hideHeader', () => {
        const dockviewComponent = new dockviewComponent_1.DockviewComponent(document.createElement('div'), {
            createComponent(options) {
                switch (options.name) {
                    case 'component':
                        return new TestContentPart(options.id);
                    default:
                        throw new Error(`unsupported`);
                }
            },
        });
        const cut = new dockviewGroupPanelModel_1.DockviewGroupPanelModel(document.createElement('div'), dockviewComponent, 'id', {}, null);
        cut.locked = true;
        cut.header.hidden = true;
        expect(cut.toJSON()).toEqual({
            views: [],
            activeView: undefined,
            id: 'id',
            locked: true,
            hideHeader: true,
        });
    });
    test("that openPanel with skipSetActive doesn't set panel to active", () => {
        const dockviewComponent = new dockviewComponent_1.DockviewComponent(document.createElement('div'), {
            createComponent(options) {
                switch (options.name) {
                    case 'component':
                        return new TestContentPart(options.id);
                    default:
                        throw new Error(`unsupported`);
                }
            },
        });
        const groupviewContainer = document.createElement('div');
        const cut = new dockviewGroupPanelModel_1.DockviewGroupPanelModel(groupviewContainer, dockviewComponent, 'id', {}, null);
        const contentContainer = groupviewContainer
            .getElementsByClassName('dv-content-container')
            .item(0).childNodes;
        const panel1 = new TestPanel('id_1', panelApi);
        cut.openPanel(panel1);
        expect(contentContainer.length).toBe(1);
        expect(contentContainer.item(0)).toBe(panel1.view.content.element);
        const panel2 = new TestPanel('id_2', panelApi);
        cut.openPanel(panel2);
        expect(contentContainer.length).toBe(1);
        expect(contentContainer.item(0)).toBe(panel2.view.content.element);
        const panel3 = new TestPanel('id_2', panelApi);
        cut.openPanel(panel3, { skipSetActive: true });
        expect(contentContainer.length).toBe(1);
        expect(contentContainer.item(0)).toBe(panel2.view.content.element);
        cut.openPanel(panel3);
        expect(contentContainer.length).toBe(1);
        expect(contentContainer.item(0)).toBe(panel3.view.content.element);
    });
    test('that should not show drop target is external event', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            id: 'testcomponentid',
            options: {},
            getPanel: jest.fn(),
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            onDidOptionsChange: jest.fn(),
        });
        const groupviewMock = jest.fn(() => {
            return {
                canDisplayOverlay: jest.fn(),
            };
        });
        const groupView = new groupviewMock();
        const groupPanelMock = jest.fn(() => {
            return {
                id: 'testgroupid',
                model: groupView,
            };
        });
        const container = document.createElement('div');
        const cut = new dockviewGroupPanelModel_1.DockviewGroupPanelModel(container, accessor, 'groupviewid', {}, new groupPanelMock());
        let counter = 0;
        cut.onUnhandledDragOverEvent(() => {
            counter++;
        });
        const element = container
            .getElementsByClassName('dv-content-container')
            .item(0);
        jest.spyOn(element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(element, 'offsetWidth', 'get').mockImplementation(() => 100);
        dom_1.fireEvent.dragEnter(element);
        dom_1.fireEvent.dragOver(element);
        expect(counter).toBe(1);
        expect(element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(0);
    });
    test('that the .locked behaviour is as', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            id: 'testcomponentid',
            options: {},
            getPanel: jest.fn(),
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            onDidOptionsChange: jest.fn(),
        });
        const groupviewMock = jest.fn(() => {
            return {
                canDisplayOverlay: jest.fn(),
            };
        });
        const groupView = new groupviewMock();
        const groupPanelMock = jest.fn(() => {
            return {
                id: 'testgroupid',
                model: groupView,
            };
        });
        const container = document.createElement('div');
        const cut = new dockviewGroupPanelModel_1.DockviewGroupPanelModel(container, accessor, 'groupviewid', {}, new groupPanelMock());
        cut.onUnhandledDragOverEvent((e) => {
            e.accept();
        });
        const element = container
            .getElementsByClassName('dv-content-container')
            .item(0);
        jest.spyOn(element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(element, 'offsetWidth', 'get').mockImplementation(() => 100);
        function run(value) {
            dom_1.fireEvent.dragEnter(element);
            (0, dom_1.fireEvent)(element, (0, utils_1.createOffsetDragOverEvent)({ clientX: value, clientY: value }));
        }
        // base case - not locked
        cut.locked = false;
        run(10);
        expect(element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(1);
        dom_1.fireEvent.dragEnd(element);
        // special case - locked with no possible target
        cut.locked = 'no-drop-target';
        run(10);
        expect(element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(0);
        dom_1.fireEvent.dragEnd(element);
        // standard locked - only show if not center target
        cut.locked = true;
        run(10);
        expect(element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(1);
        dom_1.fireEvent.dragEnd(element);
        // standard locked but for center target - expect not shown
        cut.locked = true;
        run(25);
        expect(element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(0);
        dom_1.fireEvent.dragEnd(element);
    });
    test('that should show drop target if dropping on self', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            id: 'testcomponentid',
            options: {},
            getPanel: jest.fn(),
            doSetGroupActive: jest.fn(),
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            overlayRenderContainer: new overlayRenderContainer_1.OverlayRenderContainer(document.createElement('div'), (0, shoehorn_1.fromPartial)({})),
            onDidOptionsChange: jest.fn(),
        });
        const groupView = (0, shoehorn_1.fromPartial)({
            canDisplayOverlay: jest.fn(),
        });
        const groupPanelMock = jest.fn(() => {
            return {
                id: 'testgroupid',
                model: groupView,
            };
        });
        const container = document.createElement('div');
        const cut = new dockviewGroupPanelModel_1.DockviewGroupPanelModel(container, accessor, 'groupviewid', {}, new groupPanelMock());
        let counter = 0;
        cut.onUnhandledDragOverEvent(() => {
            counter++;
        });
        cut.openPanel(new TestPanel('panel1', panelApi));
        const element = container
            .getElementsByClassName('dv-content-container')
            .item(0);
        jest.spyOn(element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(element, 'offsetWidth', 'get').mockImplementation(() => 100);
        dataTransfer_1.LocalSelectionTransfer.getInstance().setData([new dataTransfer_1.PanelTransfer('testcomponentid', 'groupviewid', 'panel1')], dataTransfer_1.PanelTransfer.prototype);
        dom_1.fireEvent.dragEnter(element);
        dom_1.fireEvent.dragOver(element);
        expect(counter).toBe(0);
        expect(element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(1);
    });
    test('that should allow drop when dropping on self for same component id', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            id: 'testcomponentid',
            options: {},
            getPanel: jest.fn(),
            doSetGroupActive: jest.fn(),
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            overlayRenderContainer: new overlayRenderContainer_1.OverlayRenderContainer(document.createElement('div'), (0, shoehorn_1.fromPartial)({})),
            onDidOptionsChange: jest.fn(),
        });
        const groupviewMock = jest.fn(() => {
            return {
                canDisplayOverlay: jest.fn(),
            };
        });
        const groupView = new groupviewMock();
        const groupPanelMock = jest.fn(() => {
            return {
                id: 'testgroupid',
                model: groupView,
            };
        });
        const container = document.createElement('div');
        const cut = new dockviewGroupPanelModel_1.DockviewGroupPanelModel(container, accessor, 'groupviewid', {}, new groupPanelMock());
        let counter = 0;
        cut.onUnhandledDragOverEvent(() => {
            counter++;
        });
        cut.openPanel(new TestPanel('panel1', panelApi));
        cut.openPanel(new TestPanel('panel2', panelApi));
        const element = container
            .getElementsByClassName('dv-content-container')
            .item(0);
        jest.spyOn(element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(element, 'offsetWidth', 'get').mockImplementation(() => 100);
        dataTransfer_1.LocalSelectionTransfer.getInstance().setData([new dataTransfer_1.PanelTransfer('testcomponentid', 'groupviewid', 'panel1')], dataTransfer_1.PanelTransfer.prototype);
        dom_1.fireEvent.dragEnter(element);
        dom_1.fireEvent.dragOver(element);
        expect(counter).toBe(0);
        expect(element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(1);
    });
    test('that should not allow drop when not dropping for different component id', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            id: 'testcomponentid',
            options: {},
            getPanel: jest.fn(),
            doSetGroupActive: jest.fn(),
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            overlayRenderContainer: new overlayRenderContainer_1.OverlayRenderContainer(document.createElement('div'), (0, shoehorn_1.fromPartial)({})),
            onDidOptionsChange: jest.fn(),
        });
        const groupviewMock = jest.fn(() => {
            return {
                canDisplayOverlay: jest.fn(),
            };
        });
        const groupView = new groupviewMock();
        const groupPanelMock = jest.fn(() => {
            return {
                id: 'testgroupid',
                model: groupView,
            };
        });
        const container = document.createElement('div');
        const cut = new dockviewGroupPanelModel_1.DockviewGroupPanelModel(container, accessor, 'groupviewid', {}, new groupPanelMock());
        let counter = 0;
        cut.onUnhandledDragOverEvent(() => {
            counter++;
        });
        cut.openPanel(new TestPanel('panel1', panelApi));
        cut.openPanel(new TestPanel('panel2', panelApi));
        const element = container
            .getElementsByClassName('dv-content-container')
            .item(0);
        jest.spyOn(element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(element, 'offsetWidth', 'get').mockImplementation(() => 100);
        dataTransfer_1.LocalSelectionTransfer.getInstance().setData([new dataTransfer_1.PanelTransfer('anothercomponentid', 'groupviewid', 'panel1')], dataTransfer_1.PanelTransfer.prototype);
        dom_1.fireEvent.dragEnter(element);
        dom_1.fireEvent.dragOver(element);
        expect(counter).toBe(1);
        expect(element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(0);
    });
    test('that the watermark is removed when dispose is called', () => {
        const groupviewMock = jest.fn(() => {
            return {
                canDisplayOverlay: jest.fn(),
            };
        });
        const groupView = new groupviewMock();
        const groupPanelMock = jest.fn(() => {
            return {
                id: 'testgroupid',
                model: groupView,
            };
        });
        const container = document.createElement('div');
        const cut = new dockviewGroupPanelModel_1.DockviewGroupPanelModel(container, dockview, 'groupviewid', {}, new groupPanelMock());
        cut.initialize();
        expect(container.getElementsByClassName('watermark-test-container').length).toBe(1);
        cut.dispose();
        expect(container.getElementsByClassName('watermark-test-container').length).toBe(0);
    });
    test('that watermark is added', () => {
        const groupviewMock = jest.fn(() => {
            return {
                canDisplayOverlay: jest.fn(),
            };
        });
        const groupView = new groupviewMock();
        const groupPanelMock = jest.fn(() => {
            return {
                id: 'testgroupid',
                model: groupView,
            };
        });
        const container = document.createElement('div');
        const cut = new dockviewGroupPanelModel_1.DockviewGroupPanelModel(container, dockview, 'groupviewid', {}, new groupPanelMock());
        cut.initialize();
        expect(container.getElementsByClassName('watermark-test-container').length).toBe(1);
        cut.openPanel(new TestPanel('panel1', panelApi));
        expect(container.getElementsByClassName('watermark-test-container').length).toBe(0);
        expect(container.getElementsByClassName('dv-tabs-and-actions-container')
            .length).toBe(1);
        cut.openPanel(new TestPanel('panel2', panelApi));
        expect(container.getElementsByClassName('watermark-test-container').length).toBe(0);
        cut.removePanel('panel1');
        expect(container.getElementsByClassName('watermark-test-container').length).toBe(0);
        cut.removePanel('panel2');
        expect(container.getElementsByClassName('watermark-test-container').length).toBe(1);
        cut.openPanel(new TestPanel('panel1', panelApi));
        expect(container.getElementsByClassName('watermark-test-container').length).toBe(0);
    });
});
