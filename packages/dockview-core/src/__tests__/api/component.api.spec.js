"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_api_1 = require("../../api/component.api");
describe('component.api', () => {
    describe('splitview', () => {
        test('splitviewapi', () => {
            const list = [
                'minimumSize',
                'maximumSize',
                'height',
                'width',
                'length',
                'orientation',
                'onDidLayoutChange',
                'onDidAddView',
                'onDidRemoveView',
                'panels',
                'focus',
                'toJSON',
            ];
            for (const _ of list) {
                const f = jest.fn();
                const component = {
                    [_]: f(),
                };
                const cut = new component_api_1.SplitviewApi(component);
                cut[_];
                expect(f).toBeCalledTimes(1);
            }
        });
    });
    describe('paneview', () => {
        test('panviewapi', () => {
            const list = [
                'minimumSize',
                'maximumSize',
                'height',
                'width',
                'onDidLayoutChange',
                'onDidAddView',
                'onDidRemoveView',
                'panels',
                'focus',
                'toJSON',
            ];
            for (const _ of list) {
                const f = jest.fn();
                const component = {
                    [_]: f(),
                };
                const cut = new component_api_1.PaneviewApi(component);
                cut[_];
                expect(f).toBeCalledTimes(1);
            }
        });
    });
    describe('gridview', () => {
        test('gridviewapi', () => {
            const list = [
                'minimumHeight',
                'maximumHeight',
                'minimumWidth',
                'maximumWidth',
                'width',
                'height',
                'onDidLayoutChange',
                'orientation',
                'focus',
                'toJSON',
                'onDidActiveGroupChange',
                'onDidAddGroup',
                'onDidRemoveGroup',
                'onDidLayoutFromJSON',
            ];
            for (const _ of list) {
                const f = jest.fn();
                const component = {
                    [_]: f(),
                };
                const cut = new component_api_1.GridviewApi(component);
                cut[_];
                expect(f).toBeCalledTimes(1);
            }
        });
    });
    describe('dockview', () => {
        test('dockviewapi', () => {
            const list = [
                'minimumHeight',
                'maximumHeight',
                'minimumWidth',
                'maximumWidth',
                'width',
                'height',
                'size',
                'totalPanels',
                'onDidLayoutChange',
                'panels',
                'groups',
                'activeGroup',
                'activePanel',
                'focus',
                'closeAllGroups',
                'toJSON',
                'onDidActiveGroupChange',
                'onDidAddGroup',
                'onDidRemoveGroup',
                'onDidActivePanelChange',
                'onDidAddPanel',
                'onDidRemovePanel',
                'onDidLayoutFromJSON',
            ];
            for (const _ of list) {
                const f = jest.fn();
                const component = {
                    [_]: f(),
                };
                const cut = new component_api_1.DockviewApi(component);
                cut[_];
                expect(f).toBeCalledTimes(1);
            }
        });
    });
});
