"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("../array");
describe('array', () => {
    test('tail', () => {
        expect((0, array_1.tail)([1, 2, 3, 4, 5])).toEqual([[1, 2, 3, 4], 5]);
        expect((0, array_1.tail)([1, 2])).toEqual([[1], 2]);
        expect((0, array_1.tail)([1])).toEqual([[], 1]);
        expect(() => (0, array_1.tail)([])).toThrow('Invalid tail call');
    });
    test('last', () => {
        expect((0, array_1.last)([1, 2, 3, 4])).toBe(4);
        expect((0, array_1.last)([])).toBeUndefined();
    });
    test('pushToEnd', () => {
        const arr1 = [1, 2, 3, 4];
        (0, array_1.pushToEnd)(arr1, 3);
        expect(arr1).toEqual([1, 2, 4, 3]);
        (0, array_1.pushToEnd)(arr1, 5);
        expect(arr1).toEqual([1, 2, 4, 3]);
    });
    test('pushToStart', () => {
        const arr1 = [1, 2, 3, 4];
        (0, array_1.pushToStart)(arr1, 3);
        expect(arr1).toEqual([3, 1, 2, 4]);
        (0, array_1.pushToStart)(arr1, 5);
        expect(arr1).toEqual([3, 1, 2, 4]);
    });
    test('firstIndex', () => {
        expect((0, array_1.firstIndex)([1, 2, 3, 4, 3], (item) => item === 3)).toBe(2);
        expect((0, array_1.firstIndex)([1, 2, 3, 4, 3], (item) => item === 5)).toBe(-1);
    });
    test('firstIndex', () => {
        expect((0, array_1.sequenceEquals)([1, 2, 3, 4], [1, 2, 3, 4])).toBeTruthy();
        expect((0, array_1.sequenceEquals)([1, 2, 3, 4], [4, 3, 2, 1])).toBeFalsy();
        expect((0, array_1.sequenceEquals)([1, 2, 3, 4], [1, 2, 3])).toBeFalsy();
        expect((0, array_1.sequenceEquals)([1, 2, 3, 4], [1, 2, 3, 4, 5])).toBeFalsy();
    });
    test('remove', () => {
        const arr1 = [1, 2, 3, 4];
        (0, array_1.remove)(arr1, 2);
        expect(arr1).toEqual([1, 3, 4]);
        const arr2 = [1, 2, 2, 3, 4];
        (0, array_1.remove)(arr2, 2);
        expect(arr2).toEqual([1, 2, 3, 4]);
        const arr3 = [1];
        (0, array_1.remove)(arr3, 2);
        expect(arr3).toEqual([1]);
        (0, array_1.remove)(arr3, 1);
        expect(arr3).toEqual([]);
        (0, array_1.remove)(arr3, 1);
        expect(arr3).toEqual([]);
    });
});
