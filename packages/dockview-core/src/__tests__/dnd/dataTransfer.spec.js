"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataTransfer_1 = require("../../dnd/dataTransfer");
describe('dataTransfer', () => {
    describe('getPanelData', () => {
        test('should be undefined when there is no local transfer object', () => {
            expect((0, dataTransfer_1.getPanelData)()).toBeUndefined();
        });
        test('should be undefined when there is a local transfer object that is not a PanelTransfer', () => {
            dataTransfer_1.LocalSelectionTransfer.getInstance().setData([new dataTransfer_1.PaneTransfer('viewId', 'groupId')], dataTransfer_1.PaneTransfer.prototype);
            expect((0, dataTransfer_1.getPanelData)()).toBeUndefined();
        });
        test('should retrieve the PanelTransfer object when transfer is active', () => {
            const transferObject = new dataTransfer_1.PanelTransfer('viewId', 'groupId', 'panelId');
            dataTransfer_1.LocalSelectionTransfer.getInstance().setData([transferObject], dataTransfer_1.PanelTransfer.prototype);
            expect((0, dataTransfer_1.getPanelData)()).toBe(transferObject);
        });
        test('should retrieve the PanelTransfer when a new transfer overrides an existing one', () => {
            dataTransfer_1.LocalSelectionTransfer.getInstance().setData([new dataTransfer_1.PaneTransfer('viewId', 'groupId')], dataTransfer_1.PaneTransfer.prototype);
            expect((0, dataTransfer_1.getPanelData)()).toBeUndefined();
            const transferObject = new dataTransfer_1.PanelTransfer('viewId', 'groupId', 'panelId');
            dataTransfer_1.LocalSelectionTransfer.getInstance().setData([transferObject], dataTransfer_1.PanelTransfer.prototype);
            expect((0, dataTransfer_1.getPanelData)()).toBe(transferObject);
        });
    });
    describe('getPaneData', () => {
        test('should be undefined when there is no local transfer object', () => {
            expect((0, dataTransfer_1.getPaneData)()).toBeUndefined();
        });
        test('should be undefined when there is a local transfer object that is not a PaneTransfer', () => {
            dataTransfer_1.LocalSelectionTransfer.getInstance().setData([new dataTransfer_1.PanelTransfer('viewId', 'groupId', 'panelId')], dataTransfer_1.PanelTransfer.prototype);
            expect((0, dataTransfer_1.getPaneData)()).toBeUndefined();
        });
        test('should retrieve the PaneTransfer object when transfer is active', () => {
            const transferObject = new dataTransfer_1.PaneTransfer('viewId', 'groupId');
            dataTransfer_1.LocalSelectionTransfer.getInstance().setData([transferObject], dataTransfer_1.PaneTransfer.prototype);
            expect((0, dataTransfer_1.getPaneData)()).toBe(transferObject);
        });
        test('should retrieve the PanelTransfer when a new transfer overrides an existing one', () => {
            dataTransfer_1.LocalSelectionTransfer.getInstance().setData([new dataTransfer_1.PanelTransfer('viewId', 'groupId', 'panelId')], dataTransfer_1.PanelTransfer.prototype);
            expect((0, dataTransfer_1.getPaneData)()).toBeUndefined();
            const transferObject = new dataTransfer_1.PaneTransfer('viewId', 'groupId');
            dataTransfer_1.LocalSelectionTransfer.getInstance().setData([transferObject], dataTransfer_1.PaneTransfer.prototype);
            expect((0, dataTransfer_1.getPaneData)()).toBe(transferObject);
        });
    });
});
