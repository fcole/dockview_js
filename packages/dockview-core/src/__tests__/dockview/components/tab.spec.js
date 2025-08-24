"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = require("@testing-library/dom");
const dataTransfer_1 = require("../../../dnd/dataTransfer");
const tab_1 = require("../../../dockview/components/tab/tab");
const shoehorn_1 = require("@total-typescript/shoehorn");
describe('tab', () => {
    test('that empty tab has inactive-tab class', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            options: {}
        });
        const groupMock = jest.fn();
        const cut = new tab_1.Tab({ id: 'panelId' }, accessor, new groupMock());
        expect(cut.element.className).toBe('dv-tab dv-inactive-tab');
    });
    test('that active tab has active-tab class', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            options: {}
        });
        const groupMock = jest.fn();
        const cut = new tab_1.Tab({ id: 'panelId' }, accessor, new groupMock());
        cut.setActive(true);
        expect(cut.element.className).toBe('dv-tab dv-active-tab');
        cut.setActive(false);
        expect(cut.element.className).toBe('dv-tab dv-inactive-tab');
    });
    test('that an external event does not render a drop target and calls through to the group model', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            id: 'testcomponentid',
            options: {}
        });
        const groupView = (0, shoehorn_1.fromPartial)({
            canDisplayOverlay: jest.fn(),
        });
        const groupPanel = (0, shoehorn_1.fromPartial)({
            id: 'testgroupid',
            model: groupView,
        });
        const cut = new tab_1.Tab({ id: 'panelId' }, accessor, groupPanel);
        jest.spyOn(cut.element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(cut.element, 'offsetWidth', 'get').mockImplementation(() => 100);
        dom_1.fireEvent.dragEnter(cut.element);
        dom_1.fireEvent.dragOver(cut.element);
        expect(groupView.canDisplayOverlay).toHaveBeenCalled();
        expect(cut.element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(0);
    });
    test('that if you drag over yourself a drop target is shown', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            id: 'testcomponentid',
            options: {}
        });
        const groupView = (0, shoehorn_1.fromPartial)({
            canDisplayOverlay: jest.fn(),
        });
        const groupPanel = (0, shoehorn_1.fromPartial)({
            id: 'testgroupid',
            model: groupView,
        });
        const cut = new tab_1.Tab({ id: 'panel1' }, accessor, groupPanel);
        jest.spyOn(cut.element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(cut.element, 'offsetWidth', 'get').mockImplementation(() => 100);
        dataTransfer_1.LocalSelectionTransfer.getInstance().setData([new dataTransfer_1.PanelTransfer('testcomponentid', 'anothergroupid', 'panel1')], dataTransfer_1.PanelTransfer.prototype);
        dom_1.fireEvent.dragEnter(cut.element);
        dom_1.fireEvent.dragOver(cut.element);
        expect(groupView.canDisplayOverlay).toHaveBeenCalledTimes(0);
        expect(cut.element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(1);
    });
    test('that if you drag over another tab a drop target is shown', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            id: 'testcomponentid',
            options: {}
        });
        const groupView = (0, shoehorn_1.fromPartial)({
            canDisplayOverlay: jest.fn(),
        });
        const groupPanel = (0, shoehorn_1.fromPartial)({
            id: 'testgroupid',
            model: groupView,
        });
        const cut = new tab_1.Tab({ id: 'panel1' }, accessor, groupPanel);
        jest.spyOn(cut.element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(cut.element, 'offsetWidth', 'get').mockImplementation(() => 100);
        dataTransfer_1.LocalSelectionTransfer.getInstance().setData([new dataTransfer_1.PanelTransfer('testcomponentid', 'anothergroupid', 'panel2')], dataTransfer_1.PanelTransfer.prototype);
        dom_1.fireEvent.dragEnter(cut.element);
        dom_1.fireEvent.dragOver(cut.element);
        expect(groupView.canDisplayOverlay).toBeCalledTimes(0);
        expect(cut.element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(1);
    });
    test('that dropping on a tab with the same id but from a different component should not render a drop over and call through to the group model', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            id: 'testcomponentid',
            options: {}
        });
        const groupView = (0, shoehorn_1.fromPartial)({
            canDisplayOverlay: jest.fn(),
        });
        const groupPanel = (0, shoehorn_1.fromPartial)({
            id: 'testgroupid',
            model: groupView,
        });
        const cut = new tab_1.Tab({ id: 'panel1' }, accessor, groupPanel);
        jest.spyOn(cut.element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(cut.element, 'offsetWidth', 'get').mockImplementation(() => 100);
        dataTransfer_1.LocalSelectionTransfer.getInstance().setData([
            new dataTransfer_1.PanelTransfer('anothercomponentid', 'anothergroupid', 'panel1'),
        ], dataTransfer_1.PanelTransfer.prototype);
        dom_1.fireEvent.dragEnter(cut.element);
        dom_1.fireEvent.dragOver(cut.element);
        expect(groupView.canDisplayOverlay).toBeCalledTimes(1);
        expect(cut.element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(0);
    });
    test('that dropping on a tab from a different component should not render a drop over and call through to the group model', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            id: 'testcomponentid',
            options: {}
        });
        const groupView = (0, shoehorn_1.fromPartial)({
            canDisplayOverlay: jest.fn(),
        });
        const groupPanel = (0, shoehorn_1.fromPartial)({
            id: 'testgroupid',
            model: groupView,
        });
        const cut = new tab_1.Tab({ id: 'panel1' }, accessor, groupPanel);
        jest.spyOn(cut.element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(cut.element, 'offsetWidth', 'get').mockImplementation(() => 100);
        dataTransfer_1.LocalSelectionTransfer.getInstance().setData([
            new dataTransfer_1.PanelTransfer('anothercomponentid', 'anothergroupid', 'panel2'),
        ], dataTransfer_1.PanelTransfer.prototype);
        dom_1.fireEvent.dragEnter(cut.element);
        dom_1.fireEvent.dragOver(cut.element);
        expect(groupView.canDisplayOverlay).toBeCalledTimes(1);
        expect(cut.element.getElementsByClassName('dv-drop-target-dropzone').length).toBe(0);
    });
    describe('disableDnd option', () => {
        test('that tab is draggable by default (disableDnd not set)', () => {
            const accessor = (0, shoehorn_1.fromPartial)({
                options: {}
            });
            const groupMock = jest.fn();
            const cut = new tab_1.Tab({ id: 'panelId' }, accessor, new groupMock());
            expect(cut.element.draggable).toBe(true);
        });
        test('that tab is draggable when disableDnd is false', () => {
            const accessor = (0, shoehorn_1.fromPartial)({
                options: { disableDnd: false }
            });
            const groupMock = jest.fn();
            const cut = new tab_1.Tab({ id: 'panelId' }, accessor, new groupMock());
            expect(cut.element.draggable).toBe(true);
        });
        test('that tab is not draggable when disableDnd is true', () => {
            const accessor = (0, shoehorn_1.fromPartial)({
                options: { disableDnd: true }
            });
            const groupMock = jest.fn();
            const cut = new tab_1.Tab({ id: 'panelId' }, accessor, new groupMock());
            expect(cut.element.draggable).toBe(false);
        });
        test('that updateDragAndDropState updates draggable attribute based on disableDnd option', () => {
            const options = { disableDnd: false };
            const accessor = (0, shoehorn_1.fromPartial)({
                options
            });
            const groupMock = jest.fn();
            const cut = new tab_1.Tab({ id: 'panelId' }, accessor, new groupMock());
            expect(cut.element.draggable).toBe(true);
            // Simulate option change
            options.disableDnd = true;
            cut.updateDragAndDropState();
            expect(cut.element.draggable).toBe(false);
            // Change back
            options.disableDnd = false;
            cut.updateDragAndDropState();
            expect(cut.element.draggable).toBe(true);
        });
    });
});
