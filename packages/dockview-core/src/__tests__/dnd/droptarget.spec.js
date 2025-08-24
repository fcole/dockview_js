"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const droptarget_1 = require("../../dnd/droptarget");
const dom_1 = require("@testing-library/dom");
const utils_1 = require("../__test_utils__/utils");
describe('droptarget', () => {
    let element;
    let droptarget;
    beforeEach(() => {
        element = document.createElement('div');
        jest.spyOn(element, 'offsetHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(element, 'offsetWidth', 'get').mockImplementation(() => 200);
    });
    test('that dragover events are marked', () => {
        droptarget = new droptarget_1.Droptarget(element, {
            canDisplayOverlay: () => true,
            acceptedTargetZones: ['center'],
        });
        dom_1.fireEvent.dragEnter(element);
        const event = new Event('dragover');
        (0, dom_1.fireEvent)(element, event);
        expect(event['__dockview_droptarget_event_is_used__']).toBeTruthy();
    });
    test('that the drop target is removed when receiving a marked dragover event', () => {
        let position = undefined;
        droptarget = new droptarget_1.Droptarget(element, {
            canDisplayOverlay: () => true,
            acceptedTargetZones: ['center'],
        });
        droptarget.onDrop((event) => {
            position = event.position;
        });
        dom_1.fireEvent.dragEnter(element);
        dom_1.fireEvent.dragOver(element);
        const target = element.querySelector('.dv-drop-target-dropzone');
        dom_1.fireEvent.drop(target);
        expect(position).toBe('center');
        const event = new Event('dragover');
        event['__dockview_droptarget_event_is_used__'] = true;
        (0, dom_1.fireEvent)(element, event);
        expect(element.querySelector('.dv-drop-target-dropzone')).toBeNull();
    });
    test('directionToPosition', () => {
        expect((0, droptarget_1.directionToPosition)('above')).toBe('top');
        expect((0, droptarget_1.directionToPosition)('below')).toBe('bottom');
        expect((0, droptarget_1.directionToPosition)('left')).toBe('left');
        expect((0, droptarget_1.directionToPosition)('right')).toBe('right');
        expect((0, droptarget_1.directionToPosition)('within')).toBe('center');
        expect(() => (0, droptarget_1.directionToPosition)('bad_input')).toThrow("invalid direction 'bad_input'");
    });
    test('positionToDirection', () => {
        expect((0, droptarget_1.positionToDirection)('top')).toBe('above');
        expect((0, droptarget_1.positionToDirection)('bottom')).toBe('below');
        expect((0, droptarget_1.positionToDirection)('left')).toBe('left');
        expect((0, droptarget_1.positionToDirection)('right')).toBe('right');
        expect((0, droptarget_1.positionToDirection)('center')).toBe('within');
        expect(() => (0, droptarget_1.positionToDirection)('bad_input')).toThrow("invalid position 'bad_input'");
    });
    test('non-directional', () => {
        let position = undefined;
        droptarget = new droptarget_1.Droptarget(element, {
            canDisplayOverlay: () => true,
            acceptedTargetZones: ['center'],
        });
        droptarget.onDrop((event) => {
            position = event.position;
        });
        dom_1.fireEvent.dragEnter(element);
        dom_1.fireEvent.dragOver(element);
        const target = element.querySelector('.dv-drop-target-dropzone');
        dom_1.fireEvent.drop(target);
        expect(position).toBe('center');
    });
    test('drop', () => {
        let position = undefined;
        droptarget = new droptarget_1.Droptarget(element, {
            canDisplayOverlay: () => true,
            acceptedTargetZones: ['top', 'left', 'right', 'bottom', 'center'],
        });
        droptarget.onDrop((event) => {
            position = event.position;
        });
        dom_1.fireEvent.dragEnter(element);
        dom_1.fireEvent.dragOver(element);
        const target = element.querySelector('.dv-drop-target-dropzone');
        jest.spyOn(target, 'clientHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(target, 'clientWidth', 'get').mockImplementation(() => 200);
        (0, dom_1.fireEvent)(target, (0, utils_1.createOffsetDragOverEvent)({
            clientX: 19,
            clientY: 0,
        }));
        expect(position).toBeUndefined();
        dom_1.fireEvent.drop(target);
        expect(position).toBe('left');
    });
    test('default', () => {
        droptarget = new droptarget_1.Droptarget(element, {
            canDisplayOverlay: () => true,
            acceptedTargetZones: ['top', 'left', 'right', 'bottom', 'center'],
        });
        expect(droptarget.state).toBeUndefined();
        dom_1.fireEvent.dragEnter(element);
        dom_1.fireEvent.dragOver(element);
        let viewQuery = element.querySelectorAll('.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection');
        expect(viewQuery.length).toBe(1);
        const target = element.querySelector('.dv-drop-target-dropzone');
        jest.spyOn(target, 'clientHeight', 'get').mockImplementation(() => 100);
        jest.spyOn(target, 'clientWidth', 'get').mockImplementation(() => 200);
        (0, dom_1.fireEvent)(target, (0, utils_1.createOffsetDragOverEvent)({ clientX: 19, clientY: 0 }));
        function check(element, box) {
            // Check positioning (back to top/left with GPU layer maintained)
            expect(element.style.top).toBe(box.top);
            expect(element.style.left).toBe(box.left);
            expect(element.style.width).toBe(box.width);
            expect(element.style.height).toBe(box.height);
            // Ensure GPU layer is maintained
            expect(element.style.transform).toBe('translate3d(0, 0, 0)');
        }
        viewQuery = element.querySelectorAll('.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection');
        expect(viewQuery.length).toBe(1);
        expect(droptarget.state).toBe('left');
        check(element
            .getElementsByClassName('dv-drop-target-selection')
            .item(0), {
            top: '0px',
            left: '0px',
            width: '50%',
            height: '100%',
        });
        (0, dom_1.fireEvent)(target, (0, utils_1.createOffsetDragOverEvent)({ clientX: 40, clientY: 19 }));
        viewQuery = element.querySelectorAll('.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection');
        expect(viewQuery.length).toBe(1);
        expect(droptarget.state).toBe('top');
        check(element
            .getElementsByClassName('dv-drop-target-selection')
            .item(0), {
            top: '0px',
            left: '0px',
            width: '100%',
            height: '50%',
        });
        (0, dom_1.fireEvent)(target, (0, utils_1.createOffsetDragOverEvent)({ clientX: 160, clientY: 81 }));
        viewQuery = element.querySelectorAll('.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection');
        expect(viewQuery.length).toBe(1);
        expect(droptarget.state).toBe('bottom');
        check(element
            .getElementsByClassName('dv-drop-target-selection')
            .item(0), {
            top: '50%',
            left: '0px',
            width: '100%',
            height: '50%',
        });
        (0, dom_1.fireEvent)(target, (0, utils_1.createOffsetDragOverEvent)({ clientX: 161, clientY: 0 }));
        viewQuery = element.querySelectorAll('.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection');
        expect(viewQuery.length).toBe(1);
        expect(droptarget.state).toBe('right');
        check(element
            .getElementsByClassName('dv-drop-target-selection')
            .item(0), {
            top: '0px',
            left: '50%',
            width: '50%',
            height: '100%',
        });
        (0, dom_1.fireEvent)(target, (0, utils_1.createOffsetDragOverEvent)({ clientX: 100, clientY: 50 }));
        expect(droptarget.state).toBe('center');
        // With GPU optimizations, elements always have a base transform layer
        expect(element
            .getElementsByClassName('dv-drop-target-selection')
            .item(0).style.transform).toBe('translate3d(0, 0, 0)');
        dom_1.fireEvent.dragLeave(target);
        expect(droptarget.state).toBe('center');
        viewQuery = element.querySelectorAll('.dv-drop-target');
        expect(viewQuery.length).toBe(0);
    });
    describe('calculateQuadrantAsPercentage', () => {
        test('variety of cases', () => {
            const inputs = [
                { directions: ['left', 'right'], x: 19, y: 50, result: 'left' },
                {
                    directions: ['left', 'right'],
                    x: 81,
                    y: 50,
                    result: 'right',
                },
                {
                    directions: ['top', 'bottom'],
                    x: 50,
                    y: 19,
                    result: 'top',
                },
                {
                    directions: ['top', 'bottom'],
                    x: 50,
                    y: 81,
                    result: 'bottom',
                },
                {
                    directions: ['left', 'right', 'top', 'bottom', 'center'],
                    x: 50,
                    y: 50,
                    result: 'center',
                },
                {
                    directions: ['left', 'right', 'top', 'bottom'],
                    x: 50,
                    y: 50,
                    result: null,
                },
            ];
            for (const input of inputs) {
                expect((0, droptarget_1.calculateQuadrantAsPercentage)(new Set(input.directions), input.x, input.y, 100, 100, 20)).toBe(input.result);
            }
        });
    });
    describe('calculateQuadrantAsPixels', () => {
        test('variety of cases', () => {
            const inputs = [
                { directions: ['left', 'right'], x: 19, y: 50, result: 'left' },
                {
                    directions: ['left', 'right'],
                    x: 81,
                    y: 50,
                    result: 'right',
                },
                {
                    directions: ['top', 'bottom'],
                    x: 50,
                    y: 19,
                    result: 'top',
                },
                {
                    directions: ['top', 'bottom'],
                    x: 50,
                    y: 81,
                    result: 'bottom',
                },
                {
                    directions: ['left', 'right', 'top', 'bottom', 'center'],
                    x: 50,
                    y: 50,
                    result: 'center',
                },
                {
                    directions: ['left', 'right', 'top', 'bottom'],
                    x: 50,
                    y: 50,
                    result: null,
                },
            ];
            for (const input of inputs) {
                expect((0, droptarget_1.calculateQuadrantAsPixels)(new Set(input.directions), input.x, input.y, 100, 100, 20)).toBe(input.result);
            }
        });
    });
});
