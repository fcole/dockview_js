"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dockviewPanelApi_1 = require("../../api/dockviewPanelApi");
const dockviewGroupPanel_1 = require("../../dockview/dockviewGroupPanel");
const shoehorn_1 = require("@total-typescript/shoehorn");
describe('groupPanelApi', () => {
    test('title', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            options: {},
            onDidOptionsChange: jest.fn(),
        });
        const panelMock = jest.fn(() => {
            return {
                update: jest.fn(),
                setTitle: jest.fn(),
            };
        });
        const panel = new panelMock();
        const group = (0, shoehorn_1.fromPartial)({
            api: {
                onDidVisibilityChange: jest.fn(),
                onDidLocationChange: jest.fn(),
                onDidActiveChange: jest.fn(),
            },
        });
        const cut = new dockviewPanelApi_1.DockviewPanelApiImpl(panel, group, accessor, 'fake-component');
        cut.setTitle('test_title');
        expect(panel.setTitle).toBeCalledTimes(1);
        expect(panel.setTitle).toBeCalledWith('test_title');
    });
    test('updateParameters', () => {
        const groupPanel = {
            id: 'test_id',
            update: jest.fn(),
        };
        const accessor = (0, shoehorn_1.fromPartial)({
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            options: {},
            onDidOptionsChange: jest.fn(),
        });
        const groupViewPanel = new dockviewGroupPanel_1.DockviewGroupPanel(accessor, '', {});
        const cut = new dockviewPanelApi_1.DockviewPanelApiImpl(groupPanel, groupViewPanel, accessor, 'fake-component');
        cut.updateParameters({ keyA: 'valueA' });
        expect(groupPanel.update).toHaveBeenCalledWith({
            params: { keyA: 'valueA' },
        });
        expect(groupPanel.update).toHaveBeenCalledTimes(1);
    });
    test('onDidGroupChange', () => {
        const groupPanel = {
            id: 'test_id',
        };
        const accessor = (0, shoehorn_1.fromPartial)({
            onDidAddPanel: jest.fn(),
            onDidRemovePanel: jest.fn(),
            options: {},
            onDidOptionsChange: jest.fn(),
        });
        const groupViewPanel = new dockviewGroupPanel_1.DockviewGroupPanel(accessor, '', {});
        const cut = new dockviewPanelApi_1.DockviewPanelApiImpl(groupPanel, groupViewPanel, accessor, 'fake-component');
        let events = 0;
        const disposable = cut.onDidGroupChange(() => {
            events++;
        });
        expect(events).toBe(0);
        expect(cut.group).toBe(groupViewPanel);
        const groupViewPanel2 = new dockviewGroupPanel_1.DockviewGroupPanel(accessor, '', {});
        cut.group = groupViewPanel2;
        expect(events).toBe(1);
        expect(cut.group).toBe(groupViewPanel2);
        disposable.dispose();
    });
});
