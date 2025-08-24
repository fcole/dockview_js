"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dockviewPanelModel_1 = require("../../dockview/dockviewPanelModel");
const defaultTab_1 = require("../../dockview/components/tab/defaultTab");
const shoehorn_1 = require("@total-typescript/shoehorn");
describe('dockviewGroupPanel', () => {
    let contentMock;
    let tabMock;
    let accessorMock;
    beforeEach(() => {
        contentMock = jest.fn(() => {
            const partial = {
                element: document.createElement('div'),
                dispose: jest.fn(),
                update: jest.fn(),
            };
            return partial;
        });
        tabMock = jest.fn(() => {
            const partial = {
                element: document.createElement('div'),
                dispose: jest.fn(),
                update: jest.fn(),
            };
            return partial;
        });
        accessorMock = (0, shoehorn_1.fromPartial)({
            options: {
                createComponent(options) {
                    switch (options.name) {
                        case 'contentComponent':
                            return new contentMock(options.id, options.name);
                        default:
                            throw new Error(`unsupported`);
                    }
                },
                createTabComponent(options) {
                    switch (options.name) {
                        case 'tabComponent':
                            return new tabMock(options.id, options.name);
                        default:
                            throw new Error(`unsupported`);
                    }
                },
            },
        });
    });
    test('that dispose is called on content and tab renderers when present', () => {
        const cut = new dockviewPanelModel_1.DockviewPanelModel(accessorMock, 'id', 'contentComponent', 'tabComponent');
        cut.dispose();
        expect(cut.content.dispose).toHaveBeenCalled();
        expect(cut.tab.dispose).toHaveBeenCalled();
    });
    test('that update is called on content and tab renderers when present', () => {
        const cut = new dockviewPanelModel_1.DockviewPanelModel(accessorMock, 'id', 'contentComponent', 'tabComponent');
        cut.update({
            params: {},
        });
        expect(cut.content.update).toHaveBeenCalled();
        expect(cut.tab.update).toHaveBeenCalled();
    });
    test('that the default tab is created', () => {
        accessorMock = (0, shoehorn_1.fromPartial)({
            options: {
                createComponent(options) {
                    switch (options.name) {
                        case 'contentComponent':
                            return new contentMock(options.id, options.name);
                        default:
                            throw new Error(`unsupported`);
                    }
                },
                createTabComponent(options) {
                    switch (options.name) {
                        case 'tabComponent':
                            return tabMock;
                        default:
                            throw new Error(`unsupported`);
                    }
                },
            },
        });
        const cut = new dockviewPanelModel_1.DockviewPanelModel(accessorMock, 'id', 'contentComponent', 'tabComponent');
        expect(cut.tab).toEqual(tabMock);
    });
    test('that the provided default tab is chosen when no implementation is provided', () => {
        accessorMock = (0, shoehorn_1.fromPartial)({
            options: {
                defaultTabComponent: 'tabComponent',
                createComponent(options) {
                    switch (options.name) {
                        case 'contentComponent':
                            return new contentMock(options.id, options.name);
                        default:
                            throw new Error(`unsupported`);
                    }
                },
                createTabComponent(options) {
                    switch (options.name) {
                        case 'tabComponent':
                            return tabMock;
                        default:
                            throw new Error(`unsupported`);
                    }
                },
            },
        });
        const cut = new dockviewPanelModel_1.DockviewPanelModel(accessorMock, 'id', 'contentComponent');
        expect(cut.tab).toEqual(tabMock);
    });
    test('that is library default tab instance is created when no alternative exists', () => {
        accessorMock = (0, shoehorn_1.fromPartial)({
            options: {
                createComponent(options) {
                    switch (options.name) {
                        case 'contentComponent':
                            return new contentMock(options.id, options.name);
                        default:
                            throw new Error(`unsupported`);
                    }
                },
            },
        });
        const cut = new dockviewPanelModel_1.DockviewPanelModel(accessorMock, 'id', 'contentComponent');
        expect(cut.tab instanceof defaultTab_1.DefaultTab).toBeTruthy();
    });
    test('that the default content is created', () => {
        accessorMock = (0, shoehorn_1.fromPartial)({
            options: {
                createComponent(options) {
                    switch (options.name) {
                        case 'contentComponent':
                            return contentMock;
                        default:
                            throw new Error(`unsupported`);
                    }
                },
                createTabComponent(options) {
                    switch (options.name) {
                        case 'tabComponent':
                            return tabMock;
                        default:
                            throw new Error(`unsupported`);
                    }
                },
            },
        });
        const cut = new dockviewPanelModel_1.DockviewPanelModel(accessorMock, 'id', 'contentComponent');
        expect(cut.content).toEqual(contentMock);
    });
});
