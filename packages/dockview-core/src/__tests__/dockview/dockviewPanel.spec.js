"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dockviewPanel_1 = require("../../dockview/dockviewPanel");
const shoehorn_1 = require("@total-typescript/shoehorn");
describe('dockviewPanel', () => {
    test('update title', () => {
        const api = (0, shoehorn_1.fromPartial)({});
        const accessor = (0, shoehorn_1.fromPartial)({});
        const group = (0, shoehorn_1.fromPartial)({
            api: {
                onDidVisibilityChange: jest.fn(),
                onDidLocationChange: jest.fn(),
                onDidActiveChange: jest.fn(),
            },
        });
        const model = (0, shoehorn_1.fromPartial)({
            update: jest.fn(),
            init: jest.fn(),
            dispose: jest.fn(),
        });
        const cut = new dockviewPanel_1.DockviewPanel('fake-id', 'fake-component', undefined, accessor, api, group, model, {
            renderer: 'onlyWhenVisible',
        });
        let latestTitle = undefined;
        const disposable = cut.api.onDidTitleChange((event) => {
            latestTitle = event.title;
        });
        expect(cut.title).toBeUndefined();
        cut.init({ title: 'new title', params: {} });
        expect(latestTitle).toBe('new title');
        expect(cut.title).toBe('new title');
        cut.setTitle('another title');
        expect(latestTitle).toBe('another title');
        expect(cut.title).toBe('another title');
        disposable.dispose();
    });
    test('that .setTitle updates the title', () => {
        const api = (0, shoehorn_1.fromPartial)({});
        const accessor = (0, shoehorn_1.fromPartial)({});
        const group = (0, shoehorn_1.fromPartial)({
            api: {
                onDidVisibilityChange: jest.fn(),
                onDidLocationChange: jest.fn(),
                onDidActiveChange: jest.fn(),
            },
        });
        const model = (0, shoehorn_1.fromPartial)({
            update: jest.fn(),
            init: jest.fn(),
        });
        const cut = new dockviewPanel_1.DockviewPanel('fake-id', 'fake-component', undefined, accessor, api, group, model, {
            renderer: 'onlyWhenVisible',
        });
        cut.init({ title: 'myTitle', params: {} });
        expect(cut.title).toBe('myTitle');
        cut.setTitle('newTitle');
        expect(cut.title).toBe('newTitle');
        cut.api.setTitle('new title 2');
        expect(cut.title).toBe('new title 2');
    });
    test('dispose cleanup', () => {
        const api = (0, shoehorn_1.fromPartial)({});
        const accessor = (0, shoehorn_1.fromPartial)({});
        const group = (0, shoehorn_1.fromPartial)({
            api: {
                onDidVisibilityChange: jest
                    .fn()
                    .mockReturnValue({ dispose: jest.fn() }),
                onDidLocationChange: jest
                    .fn()
                    .mockReturnValue({ dispose: jest.fn() }),
                onDidActiveChange: jest
                    .fn()
                    .mockReturnValue({ dispose: jest.fn() }),
            },
        });
        const model = (0, shoehorn_1.fromPartial)({
            update: jest.fn(),
            init: jest.fn(),
            dispose: jest.fn(),
        });
        const cut = new dockviewPanel_1.DockviewPanel('fake-id', 'fake-component', undefined, accessor, api, group, model, {
            renderer: 'onlyWhenVisible',
        });
        cut.init({ params: {}, title: 'title' });
        cut.dispose();
        expect(model.dispose).toHaveBeenCalled();
    });
    test('get params', () => {
        const api = (0, shoehorn_1.fromPartial)({});
        const accessor = (0, shoehorn_1.fromPartial)({});
        const group = (0, shoehorn_1.fromPartial)({
            api: {
                onDidVisibilityChange: jest.fn(),
                onDidLocationChange: jest.fn(),
                onDidActiveChange: jest.fn(),
            },
        });
        const model = (0, shoehorn_1.fromPartial)({
            update: jest.fn(),
            init: jest.fn(),
            dispose: jest.fn(),
        });
        const cut = new dockviewPanel_1.DockviewPanel('fake-id', 'fake-component', undefined, accessor, api, group, model, {
            renderer: 'onlyWhenVisible',
        });
        expect(cut.params).toEqual(undefined);
        cut.update({ params: { variableA: 'A', variableB: 'B' } });
        expect(cut.params).toEqual({ variableA: 'A', variableB: 'B' });
    });
    test('setSize propagates to underlying group', () => {
        const api = (0, shoehorn_1.fromPartial)({});
        const accessor = (0, shoehorn_1.fromPartial)({});
        const group = (0, shoehorn_1.fromPartial)({
            api: {
                onDidVisibilityChange: jest.fn(),
                onDidLocationChange: jest.fn(),
                onDidActiveChange: jest.fn(),
                setSize: jest.fn(),
            },
        });
        const model = (0, shoehorn_1.fromPartial)({
            update: jest.fn(),
            init: jest.fn(),
            dispose: jest.fn(),
        });
        const cut = new dockviewPanel_1.DockviewPanel('fake-id', 'fake-component', undefined, accessor, api, group, model, {
            renderer: 'onlyWhenVisible',
        });
        cut.api.setSize({ height: 123, width: 456 });
        expect(group.api.setSize).toHaveBeenCalledWith({
            height: 123,
            width: 456,
        });
        expect(group.api.setSize).toHaveBeenCalledTimes(1);
    });
    test('updateParameter', () => {
        const api = (0, shoehorn_1.fromPartial)({});
        const accessor = (0, shoehorn_1.fromPartial)({});
        const group = (0, shoehorn_1.fromPartial)({
            api: {
                onDidVisibilityChange: jest.fn(),
                onDidLocationChange: jest.fn(),
                onDidActiveChange: jest.fn(),
            },
        });
        const model = (0, shoehorn_1.fromPartial)({
            update: jest.fn(),
            init: jest.fn(),
            dispose: jest.fn(),
        });
        const cut = new dockviewPanel_1.DockviewPanel('fake-id', 'fake-component', undefined, accessor, api, group, model, {
            renderer: 'onlyWhenVisible',
        });
        cut.init({ params: { a: '1', b: '2' }, title: 'A title' });
        expect(cut.params).toEqual({ a: '1', b: '2' });
        // update 'a' and add 'c'
        cut.update({ params: { a: '-1', c: '3' } });
        expect(cut.params).toEqual({ a: '-1', b: '2', c: '3' });
        expect(model.update).toHaveBeenCalledWith({
            params: { a: '-1', b: '2', c: '3' },
        });
        cut.update({ params: { d: '4', e: '5', f: '6' } });
        expect(cut.params).toEqual({
            a: '-1',
            b: '2',
            c: '3',
            d: '4',
            e: '5',
            f: '6',
        });
        expect(model.update).toHaveBeenCalledWith({
            params: { a: '-1', b: '2', c: '3', d: '4', e: '5', f: '6' },
        });
        cut.update({
            params: {
                d: '',
                e: null,
                f: undefined,
                g: '',
                h: null,
                i: undefined,
            },
        });
        expect(cut.params).toEqual({
            a: '-1',
            b: '2',
            c: '3',
            d: '',
            e: null,
            g: '',
            h: null,
        });
        expect(model.update).toHaveBeenCalledWith({
            params: { a: '-1', b: '2', c: '3', d: '', e: null, g: '', h: null },
        });
    });
});
