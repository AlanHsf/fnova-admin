"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var badge_component_1 = require("./badge.component");
var BadgeModule = (function () {
    function BadgeModule() {
    }
    BadgeModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule,
                        forms_1.FormsModule
                    ],
                    exports: [
                        badge_component_1.BadgeComponent
                    ],
                    declarations: [
                        badge_component_1.BadgeComponent
                    ],
                    providers: [],
                },] },
    ];
    /** @nocollapse */
    BadgeModule.ctorParameters = function () { return []; };
    return BadgeModule;
}());
exports.BadgeModule = BadgeModule;
//# sourceMappingURL=badge.module.js.map