"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const voidContainer_1 = require("../../../../dockview/components/titlebar/voidContainer");
const shoehorn_1 = require("@total-typescript/shoehorn");
const dom_1 = require("@testing-library/dom");
describe('voidContainer', () => {
    test('that `pointerDown` triggers activation', () => {
        const accessor = (0, shoehorn_1.fromPartial)({
            doSetGroupActive: jest.fn(),
            options: {}
        });
        const group = (0, shoehorn_1.fromPartial)({});
        const cut = new voidContainer_1.VoidContainer(accessor, group);
        expect(accessor.doSetGroupActive).not.toHaveBeenCalled();
        dom_1.fireEvent.pointerDown(cut.element);
        expect(accessor.doSetGroupActive).toHaveBeenCalledWith(group);
    });
    describe('disableDnd option', () => {
        test('that void container is draggable by default (disableDnd not set)', () => {
            const accessor = (0, shoehorn_1.fromPartial)({
                options: {}
            });
            const group = (0, shoehorn_1.fromPartial)({});
            const cut = new voidContainer_1.VoidContainer(accessor, group);
            expect(cut.element.draggable).toBe(true);
        });
        test('that void container is draggable when disableDnd is false', () => {
            const accessor = (0, shoehorn_1.fromPartial)({
                options: { disableDnd: false }
            });
            const group = (0, shoehorn_1.fromPartial)({});
            const cut = new voidContainer_1.VoidContainer(accessor, group);
            expect(cut.element.draggable).toBe(true);
        });
        test('that void container is not draggable when disableDnd is true', () => {
            const accessor = (0, shoehorn_1.fromPartial)({
                options: { disableDnd: true }
            });
            const group = (0, shoehorn_1.fromPartial)({});
            const cut = new voidContainer_1.VoidContainer(accessor, group);
            expect(cut.element.draggable).toBe(false);
        });
        test('that updateDragAndDropState updates draggable attribute based on disableDnd option', () => {
            const options = { disableDnd: false };
            const accessor = (0, shoehorn_1.fromPartial)({
                options
            });
            const group = (0, shoehorn_1.fromPartial)({});
            const cut = new voidContainer_1.VoidContainer(accessor, group);
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
        test('that void container has dv-draggable class when draggable', () => {
            const accessor = (0, shoehorn_1.fromPartial)({
                options: { disableDnd: false }
            });
            const group = (0, shoehorn_1.fromPartial)({});
            const cut = new voidContainer_1.VoidContainer(accessor, group);
            expect(cut.element.classList.contains('dv-draggable')).toBe(true);
        });
        test('that void container does not have dv-draggable class when not draggable', () => {
            const accessor = (0, shoehorn_1.fromPartial)({
                options: { disableDnd: true }
            });
            const group = (0, shoehorn_1.fromPartial)({});
            const cut = new voidContainer_1.VoidContainer(accessor, group);
            expect(cut.element.classList.contains('dv-draggable')).toBe(false);
        });
        test('that updateDragAndDropState updates dv-draggable class based on disableDnd option', () => {
            const options = { disableDnd: false };
            const accessor = (0, shoehorn_1.fromPartial)({
                options
            });
            const group = (0, shoehorn_1.fromPartial)({});
            const cut = new voidContainer_1.VoidContainer(accessor, group);
            expect(cut.element.classList.contains('dv-draggable')).toBe(true);
            // Simulate option change
            options.disableDnd = true;
            cut.updateDragAndDropState();
            expect(cut.element.classList.contains('dv-draggable')).toBe(false);
            // Change back
            options.disableDnd = false;
            cut.updateDragAndDropState();
            expect(cut.element.classList.contains('dv-draggable')).toBe(true);
        });
    });
});
