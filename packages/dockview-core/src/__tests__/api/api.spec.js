"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const panelApi_1 = require("../../api/panelApi");
describe('api', () => {
    let api;
    beforeEach(() => {
        api = new panelApi_1.PanelApiImpl('dummy_id', 'fake-component');
    });
    test('updateParameters', () => {
        const panel = {
            update: jest.fn(),
        };
        api.initialize(panel);
        expect(panel.update).toHaveBeenCalledTimes(0);
        api.updateParameters({ keyA: 'valueA' });
        expect(panel.update).toHaveBeenCalledTimes(1);
        expect(panel.update).toHaveBeenCalledWith({
            params: { keyA: 'valueA' },
        });
    });
    test('should update isFcoused getter', () => {
        expect(api.isFocused).toBeFalsy();
        api._onDidChangeFocus.fire({ isFocused: true });
        expect(api.isFocused).toBeTruthy();
        api._onDidChangeFocus.fire({ isFocused: false });
        expect(api.isFocused).toBeFalsy();
    });
    test('should update isActive getter', () => {
        expect(api.isFocused).toBeFalsy();
        api._onDidActiveChange.fire({ isActive: true });
        expect(api.isActive).toBeTruthy();
        api._onDidActiveChange.fire({ isActive: false });
        expect(api.isActive).toBeFalsy();
    });
    test('should update isActive getter', () => {
        expect(api.isVisible).toBeTruthy();
        api._onDidVisibilityChange.fire({ isVisible: false });
        expect(api.isVisible).toBeFalsy();
        api._onDidVisibilityChange.fire({ isVisible: true });
        expect(api.isVisible).toBeTruthy();
    });
    test('should update width and height getter', () => {
        expect(api.height).toBe(0);
        expect(api.width).toBe(0);
        api._onDidDimensionChange.fire({ height: 10, width: 20 });
        expect(api.height).toBe(10);
        expect(api.width).toBe(20);
        api._onDidDimensionChange.fire({ height: 20, width: 10 });
        expect(api.height).toBe(20);
        expect(api.width).toBe(10);
    });
});
