"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultTab_1 = require("../../../../dockview/components/tab/defaultTab");
const shoehorn_1 = require("@total-typescript/shoehorn");
const events_1 = require("../../../../events");
const dom_1 = require("@testing-library/dom");
describe('defaultTab', () => {
    test('that title updates', () => {
        const cut = new defaultTab_1.DefaultTab();
        let el = cut.element.querySelector('.dv-default-tab-content');
        expect(el).toBeTruthy();
        expect(el.textContent).toBe('');
        const onDidTitleChange = new events_1.Emitter();
        const api = (0, shoehorn_1.fromPartial)({
            onDidTitleChange: onDidTitleChange.event,
        });
        const containerApi = (0, shoehorn_1.fromPartial)({});
        cut.init({
            api,
            containerApi,
            params: {},
            title: 'title_abc',
        });
        el = cut.element.querySelector('.dv-default-tab-content');
        expect(el).toBeTruthy();
        expect(el.textContent).toBe('title_abc');
        onDidTitleChange.fire({ title: 'title_def' });
        expect(el.textContent).toBe('title_def');
    });
    test('that click closes tab', () => {
        const cut = new defaultTab_1.DefaultTab();
        const api = (0, shoehorn_1.fromPartial)({
            onDidTitleChange: jest.fn(),
            close: jest.fn(),
        });
        const containerApi = (0, shoehorn_1.fromPartial)({});
        cut.init({
            api,
            containerApi,
            params: {},
            title: 'title_abc',
        });
        let el = cut.element.querySelector('.dv-default-tab-action');
        dom_1.fireEvent.pointerDown(el);
        expect(api.close).toHaveBeenCalledTimes(0);
        dom_1.fireEvent.click(el);
        expect(api.close).toHaveBeenCalledTimes(1);
    });
    test('that close button prevents default behavior', () => {
        const cut = new defaultTab_1.DefaultTab();
        const api = (0, shoehorn_1.fromPartial)({
            onDidTitleChange: jest.fn(),
            close: jest.fn(),
        });
        const containerApi = (0, shoehorn_1.fromPartial)({});
        cut.init({
            api,
            containerApi,
            params: {},
            title: 'title_abc',
        });
        let el = cut.element.querySelector('.dv-default-tab-action');
        // Create a custom event to verify preventDefault is called
        const clickEvent = new Event('click', { cancelable: true });
        const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
        el.dispatchEvent(clickEvent);
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        expect(api.close).toHaveBeenCalledTimes(1);
    });
    test('that close button respects already prevented events', () => {
        const cut = new defaultTab_1.DefaultTab();
        const api = (0, shoehorn_1.fromPartial)({
            onDidTitleChange: jest.fn(),
            close: jest.fn(),
        });
        const containerApi = (0, shoehorn_1.fromPartial)({});
        cut.init({
            api,
            containerApi,
            params: {},
            title: 'title_abc',
        });
        let el = cut.element.querySelector('.dv-default-tab-action');
        // Create a custom event and prevent it before dispatching
        const clickEvent = new Event('click', { cancelable: true });
        clickEvent.preventDefault();
        el.dispatchEvent(clickEvent);
        // Close should not be called if event was already prevented
        expect(api.close).not.toHaveBeenCalled();
    });
    test('that close button is visible by default', () => {
        const cut = new defaultTab_1.DefaultTab();
        const api = (0, shoehorn_1.fromPartial)({
            onDidTitleChange: jest.fn(),
            close: jest.fn(),
        });
        const containerApi = (0, shoehorn_1.fromPartial)({});
        cut.init({
            api,
            containerApi,
            params: {},
            title: 'title_abc',
        });
        let el = cut.element.querySelector('.dv-default-tab-action');
        expect(el).toBeTruthy();
        expect(el.style.display).not.toBe('none');
    });
});
