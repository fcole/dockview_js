"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dockviewGroupPanel_1 = require("../../dockview/dockviewGroupPanel");
describe('gridviewPanel', () => {
    test('get panel', () => {
        const accessorMock = jest.fn(() => {
            return {
                onDidAddPanel: jest.fn(),
                onDidRemovePanel: jest.fn(),
                options: {},
                onDidOptionsChange: jest.fn(),
            };
        });
        const accessor = new accessorMock();
        const cut = new dockviewGroupPanel_1.DockviewGroupPanel(accessor, 'id', {});
        expect(cut.params).toEqual(undefined);
        cut.update({ params: { variableA: 'A', variableB: 'B' } });
        expect(cut.params).toEqual({ variableA: 'A', variableB: 'B' });
    });
});
