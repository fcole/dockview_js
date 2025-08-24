"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ghost_1 = require("../../dnd/ghost");
describe('ghost', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllTimers();
    });
    test('that a custom class is added, the element is added to the document and all is removed afterwards', () => {
        const dataTransferMock = jest.fn(() => {
            return {
                setDragImage: jest.fn(),
            };
        });
        const element = document.createElement('div');
        const dataTransfer = new dataTransferMock();
        (0, ghost_1.addGhostImage)(dataTransfer, element);
        expect(element.className).toBe('dv-dragged');
        expect(element.parentElement).toBe(document.body);
        expect(dataTransfer.setDragImage).toBeCalledTimes(1);
        expect(dataTransfer.setDragImage).toBeCalledWith(element, 0, 0);
        jest.runAllTimers();
        expect(element.className).toBe('');
        expect(element.parentElement).toBe(null);
    });
});
