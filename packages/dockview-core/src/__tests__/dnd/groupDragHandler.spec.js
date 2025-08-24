"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = require("@testing-library/dom");
const groupDragHandler_1 = require("../../dnd/groupDragHandler");
const dataTransfer_1 = require("../../dnd/dataTransfer");
describe('groupDragHandler', () => {
    test('that the dnd transfer object is setup and torndown', () => {
        const element = document.createElement('div');
        const groupMock = jest.fn(() => {
            const partial = {
                id: 'test_group_id',
                api: { location: { type: 'grid' } },
            };
            return partial;
        });
        const group = new groupMock();
        const cut = new groupDragHandler_1.GroupDragHandler(element, { id: 'test_accessor_id' }, group);
        dom_1.fireEvent.dragStart(element, new Event('dragstart'));
        expect(dataTransfer_1.LocalSelectionTransfer.getInstance().hasData(dataTransfer_1.PanelTransfer.prototype)).toBeTruthy();
        const transferObject = dataTransfer_1.LocalSelectionTransfer.getInstance().getData(dataTransfer_1.PanelTransfer.prototype)[0];
        expect(transferObject).toBeTruthy();
        expect(transferObject.viewId).toBe('test_accessor_id');
        expect(transferObject.groupId).toBe('test_group_id');
        expect(transferObject.panelId).toBeNull();
        dom_1.fireEvent.dragStart(element, new Event('dragend'));
        expect(dataTransfer_1.LocalSelectionTransfer.getInstance().hasData(dataTransfer_1.PanelTransfer.prototype)).toBeFalsy();
        cut.dispose();
    });
    test('that the event is cancelled when floating and shiftKey=true', () => {
        const element = document.createElement('div');
        const groupMock = jest.fn(() => {
            const partial = {
                api: { location: { type: 'floating' } },
            };
            return partial;
        });
        const group = new groupMock();
        const cut = new groupDragHandler_1.GroupDragHandler(element, { id: 'accessor_id' }, group);
        const event = new KeyboardEvent('dragstart', { shiftKey: false });
        const spy = jest.spyOn(event, 'preventDefault');
        (0, dom_1.fireEvent)(element, event);
        expect(spy).toBeCalledTimes(1);
        const event2 = new KeyboardEvent('dragstart', { shiftKey: true });
        const spy2 = jest.spyOn(event2, 'preventDefault');
        (0, dom_1.fireEvent)(element, event);
        expect(spy2).toBeCalledTimes(0);
        cut.dispose();
    });
    test('that the event is never cancelled when the group is not floating', () => {
        const element = document.createElement('div');
        const groupMock = jest.fn(() => {
            const partial = {
                api: { location: { type: 'grid' } },
            };
            return partial;
        });
        const group = new groupMock();
        const cut = new groupDragHandler_1.GroupDragHandler(element, { id: 'accessor_id' }, group);
        const event = new KeyboardEvent('dragstart', { shiftKey: false });
        const spy = jest.spyOn(event, 'preventDefault');
        (0, dom_1.fireEvent)(element, event);
        expect(spy).toBeCalledTimes(0);
        const event2 = new KeyboardEvent('dragstart', { shiftKey: true });
        const spy2 = jest.spyOn(event2, 'preventDefault');
        (0, dom_1.fireEvent)(element, event);
        expect(spy2).toBeCalledTimes(0);
        cut.dispose();
    });
});
