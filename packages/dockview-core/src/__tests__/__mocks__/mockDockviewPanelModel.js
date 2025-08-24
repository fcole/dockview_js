"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockviewPanelModelMock = void 0;
class DockviewPanelModelMock {
    constructor(contentComponent, content, tabComponent, tab) {
        this.contentComponent = contentComponent;
        this.content = content;
        this.tabComponent = tabComponent;
        this.tab = tab;
        //
    }
    createTabRenderer(tabLocation) {
        return this.tab;
    }
    init(params) {
        //
    }
    updateParentGroup(group, isPanelVisible) {
        //
    }
    update(event) {
        //
    }
    layout(width, height) {
        //
    }
    dispose() {
        //
    }
}
exports.DockviewPanelModelMock = DockviewPanelModelMock;
