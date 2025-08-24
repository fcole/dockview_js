"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dockviewGroupPanel_1 = require("../../dockview/dockviewGroupPanel");
const shoehorn_1 = require("@total-typescript/shoehorn");
const dockviewPanel_1 = require("../../dockview/dockviewPanel");
const mockDockviewPanelModel_1 = require("../__mocks__/mockDockviewPanelModel");
const content_1 = require("../../dockview/components/panel/content");
describe('dockviewGroupPanel', () => {
    test('default minimum/maximium width/height', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            onDidActivePanelChange: jest.fn(),
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            options: {},
            onDidOptionsChange: jest.fn(),
        });
        const options = (0, shoehorn_1.fromPartial)({});
        const cut = new dockviewGroupPanel_1.DockviewGroupPanel(accessor, 'test_id', options);
        expect(cut.minimumWidth).toBe(100);
        expect(cut.minimumHeight).toBe(100);
        expect(cut.maximumHeight).toBe(Number.MAX_SAFE_INTEGER);
        expect(cut.maximumWidth).toBe(Number.MAX_SAFE_INTEGER);
    });
    test('that onDidActivePanelChange is configured at inline', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            onDidActivePanelChange: jest.fn(),
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            options: {},
            api: {},
            renderer: 'always',
            overlayRenderContainer: {
                attach: jest.fn(),
                detatch: jest.fn(),
            },
            doSetGroupActive: jest.fn(),
            onDidOptionsChange: jest.fn(),
        });
        const options = (0, shoehorn_1.fromPartial)({});
        const cut = new dockviewGroupPanel_1.DockviewGroupPanel(accessor, 'test_id', options);
        let counter = 0;
        cut.api.onDidActivePanelChange((event) => {
            counter++;
        });
        cut.model.openPanel((0, shoehorn_1.fromPartial)({
            updateParentGroup: jest.fn(),
            view: {
                tab: { element: document.createElement('div') },
                content: new content_1.ContentContainer(accessor, cut.model),
            },
            api: {
                renderer: 'onlyWhenVisible',
                onDidTitleChange: jest.fn(),
                onDidParametersChange: jest.fn(),
            },
            layout: jest.fn(),
            runEvents: jest.fn(),
        }));
        expect(counter).toBe(1);
    });
    test('group constraints', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            onDidActivePanelChange: jest.fn(),
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            doSetGroupActive: jest.fn(),
            overlayRenderContainer: (0, shoehorn_1.fromPartial)({
                attach: jest.fn(),
                detatch: jest.fn(),
            }),
            options: {},
            onDidOptionsChange: jest.fn(),
        });
        const options = (0, shoehorn_1.fromPartial)({});
        const cut = new dockviewGroupPanel_1.DockviewGroupPanel(accessor, 'test_id', options);
        cut.api.setConstraints({
            minimumHeight: 10,
            maximumHeight: 100,
            minimumWidth: 20,
            maximumWidth: 200,
        });
        // initial constraints
        expect(cut.minimumWidth).toBe(20);
        expect(cut.minimumHeight).toBe(10);
        expect(cut.maximumHeight).toBe(100);
        expect(cut.maximumWidth).toBe(200);
        const panelModel = new mockDockviewPanelModel_1.DockviewPanelModelMock('content_component', (0, shoehorn_1.fromPartial)({
            element: document.createElement('div'),
        }), 'tab_component', (0, shoehorn_1.fromPartial)({
            element: document.createElement('div'),
        }));
        const panel = new dockviewPanel_1.DockviewPanel('panel_id', 'component_id', undefined, accessor, accessor.api, cut, panelModel, {
            renderer: 'onlyWhenVisible',
            minimumWidth: 21,
            minimumHeight: 11,
            maximumHeight: 101,
            maximumWidth: 201,
        });
        cut.model.openPanel(panel);
        // active panel constraints
        expect(cut.minimumWidth).toBe(21);
        expect(cut.minimumHeight).toBe(11);
        expect(cut.maximumHeight).toBe(101);
        expect(cut.maximumWidth).toBe(201);
        const panel2 = new dockviewPanel_1.DockviewPanel('panel_id', 'component_id', undefined, accessor, accessor.api, cut, panelModel, {
            renderer: 'onlyWhenVisible',
            minimumWidth: 22,
            minimumHeight: 12,
            maximumHeight: 102,
            maximumWidth: 202,
        });
        cut.model.openPanel(panel2);
        // active panel constraints
        expect(cut.minimumWidth).toBe(22);
        expect(cut.minimumHeight).toBe(12);
        expect(cut.maximumHeight).toBe(102);
        expect(cut.maximumWidth).toBe(202);
        const panel3 = new dockviewPanel_1.DockviewPanel('panel_id', 'component_id', undefined, accessor, accessor.api, cut, panelModel, {
            renderer: 'onlyWhenVisible',
        });
        cut.model.openPanel(panel3);
        // active panel without specified constraints so falls back to group constraints
        expect(cut.minimumWidth).toBe(20);
        expect(cut.minimumHeight).toBe(10);
        expect(cut.maximumHeight).toBe(100);
        expect(cut.maximumWidth).toBe(200);
    });
});
