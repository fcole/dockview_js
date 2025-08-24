"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = require("@testing-library/dom");
const content_1 = require("../../../../dockview/components/panel/content");
const lifecycle_1 = require("../../../../lifecycle");
const shoehorn_1 = require("@total-typescript/shoehorn");
const overlayRenderContainer_1 = require("../../../../overlay/overlayRenderContainer");
class TestContentRenderer extends lifecycle_1.CompositeDisposable {
    constructor(id) {
        super();
        this.id = id;
        this.element = document.createElement('div');
        this.element.id = id;
    }
    init(parameters) {
        //
    }
    layout(width, height) {
        //
    }
    update(event) {
        //
    }
    toJSON() {
        return {};
    }
    focus() {
        //
    }
}
describe('contentContainer', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    test('basic focus test', () => {
        let focus = 0;
        let blur = 0;
        const disposable = new lifecycle_1.CompositeDisposable();
        const overlayRenderContainer = new overlayRenderContainer_1.OverlayRenderContainer(document.createElement('div'), (0, shoehorn_1.fromPartial)({}));
        const cut = new content_1.ContentContainer((0, shoehorn_1.fromPartial)({
            renderer: 'onlyWhenVisible',
            overlayRenderContainer,
        }), (0, shoehorn_1.fromPartial)({
            renderContainer: overlayRenderContainer,
        }));
        disposable.addDisposables(cut.onDidFocus(() => {
            focus++;
        }), cut.onDidBlur(() => {
            blur++;
        }));
        const contentRenderer = new TestContentRenderer('id-1');
        const panel = (0, shoehorn_1.fromPartial)({
            view: {
                content: contentRenderer,
            },
            api: { renderer: 'onlyWhenVisible' },
        });
        cut.openPanel(panel);
        expect(focus).toBe(0);
        expect(blur).toBe(0);
        // container has focus within
        dom_1.fireEvent.focus(contentRenderer.element);
        expect(focus).toBe(1);
        expect(blur).toBe(0);
        // container looses focus
        dom_1.fireEvent.blur(contentRenderer.element);
        jest.runAllTimers();
        expect(focus).toBe(1);
        expect(blur).toBe(1);
        const contentRenderer2 = new TestContentRenderer('id-2');
        const panel2 = {
            view: {
                content: contentRenderer2,
            },
            api: { renderer: 'onlyWhenVisible' },
        };
        cut.openPanel(panel2);
        // expect(focus).toBe(2);
        // expect(blur).toBe(1);
        // new panel recieves focus
        dom_1.fireEvent.focus(contentRenderer2.element);
        expect(focus).toBe(2);
        expect(blur).toBe(1);
        // new panel looses focus
        dom_1.fireEvent.blur(contentRenderer2.element);
        jest.runAllTimers();
        expect(focus).toBe(2);
        expect(blur).toBe(2);
        disposable.dispose();
    });
    test("that panels renderered as 'onlyWhenVisible' are removed when closed", () => {
        const overlayRenderContainer = (0, shoehorn_1.fromPartial)({
            detatch: jest.fn(),
        });
        const cut = new content_1.ContentContainer((0, shoehorn_1.fromPartial)({
            overlayRenderContainer,
        }), (0, shoehorn_1.fromPartial)({
            renderContainer: overlayRenderContainer,
        }));
        const panel1 = (0, shoehorn_1.fromPartial)({
            api: {
                renderer: 'onlyWhenVisible',
            },
            view: { content: new TestContentRenderer('panel_1') },
        });
        const panel2 = (0, shoehorn_1.fromPartial)({
            api: {
                renderer: 'onlyWhenVisible',
            },
            view: { content: new TestContentRenderer('panel_2') },
        });
        cut.openPanel(panel1);
        expect(panel1.view.content.element.parentElement).toBe(cut.element);
        expect(cut.element.childNodes.length).toBe(1);
        cut.openPanel(panel2);
        expect(panel1.view.content.element.parentElement).toBeNull();
        expect(panel2.view.content.element.parentElement).toBe(cut.element);
        expect(cut.element.childNodes.length).toBe(1);
    });
});
