"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tabs_1 = require("../../../../dockview/components/titlebar/tabs");
const shoehorn_1 = require("@total-typescript/shoehorn");
describe('tabs', () => {
    describe('disableCustomScrollbars', () => {
        test('enabled by default', () => {
            const cut = new tabs_1.Tabs((0, shoehorn_1.fromPartial)({}), (0, shoehorn_1.fromPartial)({
                options: {},
            }), {
                showTabsOverflowControl: true,
            });
            expect(cut.element.querySelectorAll('.dv-scrollable > .dv-tabs-container').length).toBe(1);
        });
        test('enabled when disabled flag is false', () => {
            const cut = new tabs_1.Tabs((0, shoehorn_1.fromPartial)({}), (0, shoehorn_1.fromPartial)({
                options: {
                    scrollbars: 'custom',
                },
            }), {
                showTabsOverflowControl: true,
            });
            expect(cut.element.querySelectorAll('.dv-scrollable > .dv-tabs-container').length).toBe(1);
        });
        test('disabled when disabled flag is true', () => {
            const cut = new tabs_1.Tabs((0, shoehorn_1.fromPartial)({}), (0, shoehorn_1.fromPartial)({
                options: {
                    scrollbars: 'native',
                },
            }), {
                showTabsOverflowControl: true,
            });
            expect(cut.element.querySelectorAll('.dv-scrollable > .dv-tabs-container').length).toBe(0);
        });
    });
    describe('updateDragAndDropState', () => {
        test('that updateDragAndDropState calls updateDragAndDropState on all tabs', () => {
            const cut = new tabs_1.Tabs((0, shoehorn_1.fromPartial)({}), (0, shoehorn_1.fromPartial)({
                options: {},
            }), {
                showTabsOverflowControl: true,
            });
            // Mock tab to verify the method is called
            const mockTab1 = { updateDragAndDropState: jest.fn() };
            const mockTab2 = { updateDragAndDropState: jest.fn() };
            // Add mock tabs to the internal tabs array
            cut._tabs = [
                { value: mockTab1 },
                { value: mockTab2 }
            ];
            cut.updateDragAndDropState();
            expect(mockTab1.updateDragAndDropState).toHaveBeenCalledTimes(1);
            expect(mockTab2.updateDragAndDropState).toHaveBeenCalledTimes(1);
        });
    });
});
