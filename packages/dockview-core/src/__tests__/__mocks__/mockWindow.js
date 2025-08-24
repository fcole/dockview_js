"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMockWindow = void 0;
const shoehorn_1 = require("@total-typescript/shoehorn");
function setupMockWindow() {
    const listeners = {};
    let width = 1000;
    let height = 2000;
    return (0, shoehorn_1.fromPartial)({
        addEventListener: (type, listener) => {
            if (!listeners[type]) {
                listeners[type] = [];
            }
            listeners[type].push(listener);
            if (type === 'load') {
                listener();
            }
        },
        removeEventListener: (type, listener) => {
            if (listeners[type]) {
                const index = listeners[type].indexOf(listener);
                if (index > -1) {
                    listeners[type].splice(index, 1);
                }
            }
        },
        dispatchEvent: (event) => {
            const items = listeners[event.type];
            if (!items) {
                return;
            }
            items.forEach((item) => item());
        },
        document: document,
        close: () => {
            var _a;
            (_a = listeners['beforeunload']) === null || _a === void 0 ? void 0 : _a.forEach((f) => f());
        },
        get innerWidth() {
            return width++;
        },
        get innerHeight() {
            return height++;
        },
    });
}
exports.setupMockWindow = setupMockWindow;
