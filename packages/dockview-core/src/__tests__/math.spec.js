"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("../math");
describe('math', () => {
    describe('clamp', () => {
        it('should clamp between a minimum and maximum value', () => {
            expect((0, math_1.clamp)(45, 40, 50)).toBe(45);
            expect((0, math_1.clamp)(35, 40, 50)).toBe(40);
            expect((0, math_1.clamp)(55, 40, 50)).toBe(50);
        });
        it('if min > max return min', () => {
            expect((0, math_1.clamp)(55, 50, 40)).toBe(50);
        });
    });
    test('range', () => {
        expect((0, math_1.range)(0, 5)).toEqual([0, 1, 2, 3, 4]);
        expect((0, math_1.range)(5, 0)).toEqual([5, 4, 3, 2, 1]);
        expect((0, math_1.range)(5)).toEqual([0, 1, 2, 3, 4]);
    });
});
