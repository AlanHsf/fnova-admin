"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var BadgeComponent = (function () {
    function BadgeComponent() {
        // pass
        this.showZero = false;
        this.showDot = true;
        this.displayType = 'text';
        this.bgColor = '#f04134';
        this.bgColorList = {
            error: '#f04134',
            success: '#00a854',
            warning: '#ffbf00',
            info: '#108ee9'
        };
        this.fontColor = '#ffffff';
    }
    Object.defineProperty(BadgeComponent.prototype, "badgeNum", {
        set: function (value) {
            if (this.maxNum && value >= this.maxNum) {
                this.displayNum = (this.maxNum - 1) + '+';
            }
            else {
                this.displayNum = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    BadgeComponent.prototype.ngOnInit = function () {
        var patt = new RegExp(/^#([0-9a-f]{3}){1,2}$/i); // test hex color
        !patt.test(this.bgColor) ? this.bgColor = this.bgColorList[this.bgColor] : '';
    };
    BadgeComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'jui-badge',
                    template: "\n      <div class=\"jui-badge\">\n          <ng-content select=\"[badge-body]\"></ng-content>\n          <span *ngIf=\"displayType === 'text' && (displayNum || showZero)\" class=\"display-text\" [innerHTML]=\"displayNum\" [style.background-color]=\"bgColor\" [style.color]=\"fontColor\"></span>\n          <span *ngIf=\"displayType === 'dot' && showDot\" class=\"display-dot\" [style.background-color]=\"bgColor\"></span>\n          <span *ngIf=\"displayType === 'no-wrapper' && (displayNum || showZero)\" class=\"display-no-wrapper\" [innerHTML]=\"displayNum\" [ngStyle]=\"styleObj\" ></span>\n      </div>\n    ",
                    styles: ["\n      .jui-badge {\n          position: relative;\n          box-sizing: border-box;\n          padding: 0;\n          margin: 0;\n          display: inline-block;\n      }\n      :host /deep/ .jui-badge>div {\n          display: inline-block;\n      }\n      .jui-badge .display-text {\n          display: inline-block;\n          padding: 0 6px;\n          border-radius: 10px;\n          height: 20px;\n          text-align: center;\n          line-height: 20px;\n          min-width: 20px;\n          position:absolute;\n          top: -10px;\n          left: 100%;\n          -webkit-transform: translateX(-50%);\n          -ms-transform: translateX(-50%);\n          transform: translateX(-50%);\n          -webkit-transform-origin: -10% center;\n          -ms-transform-origin: -10% center;\n          transform-origin: -10% center;\n      }\n      .jui-badge .display-dot {\n          display: inline-block;\n          border-radius: 50%;\n          height: 8px;\n          width: 8px;\n          position:absolute;\n          top: -4px;\n          left: 100%;\n          -webkit-transform: translateX(-50%);\n          -ms-transform: translateX(-50%);\n          transform: translateX(-50%);\n          -webkit-transform-origin: -10% center;\n          -ms-transform-origin: -10% center;\n          transform-origin: -10% center;\n      }\n      .jui-badge .display-no-wrapper {\n          display: inline-block;\n          position: inherit;\n          padding: 0 6px;\n          border-radius: 10px;\n          height: 20px;\n          text-align: center;\n          line-height: 20px;\n          min-width: 20px;\n          background-color: #f04134;\n          color: white;\n      }\n      /*.jui-badge.success .display-num {*/\n          /*background-color: #00a854;*/\n      /*}*/\n      /*.jui-badge.error .display-num {*/\n          /*background-color: #f04134;*/\n      /*}*/\n      /*.jui-badge.warning .display-num {*/\n          /*background-color: #ffbf00;*/\n      /*}*/\n      /*.jui-badge.info .display-num {*/\n          /*background-color: #108ee9;*/\n      /*}*/\n    "]
                },] },
    ];
    /** @nocollapse */
    BadgeComponent.ctorParameters = function () { return []; };
    BadgeComponent.propDecorators = {
        "maxNum": [{ type: core_1.Input },],
        "showZero": [{ type: core_1.Input },],
        "showDot": [{ type: core_1.Input },],
        "badgeNum": [{ type: core_1.Input },],
        "displayType": [{ type: core_1.Input },],
        "bgColor": [{ type: core_1.Input },],
        "fontColor": [{ type: core_1.Input },],
        "styleObj": [{ type: core_1.Input },],
    };
    return BadgeComponent;
}());
exports.BadgeComponent = BadgeComponent;
//# sourceMappingURL=badge.component.js.map