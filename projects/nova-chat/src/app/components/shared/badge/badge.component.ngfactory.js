"use strict";
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
Object.defineProperty(exports, "__esModule", { value: true });
var i0 = require("@angular/core");
var i1 = require("@angular/common");
var i2 = require("./badge.component");
var styles_BadgeComponent = [".jui-badge[_ngcontent-%COMP%] {\n          position: relative;\n          box-sizing: border-box;\n          padding: 0;\n          margin: 0;\n          display: inline-block;\n      }\n      [_nghost-%COMP%]     .jui-badge>div {\n          display: inline-block;\n      }\n      .jui-badge[_ngcontent-%COMP%]   .display-text[_ngcontent-%COMP%] {\n          display: inline-block;\n          padding: 0 6px;\n          border-radius: 10px;\n          height: 20px;\n          text-align: center;\n          line-height: 20px;\n          min-width: 20px;\n          position:absolute;\n          top: -10px;\n          left: 100%;\n          -webkit-transform: translateX(-50%);\n          -ms-transform: translateX(-50%);\n          transform: translateX(-50%);\n          -webkit-transform-origin: -10% center;\n          -ms-transform-origin: -10% center;\n          transform-origin: -10% center;\n      }\n      .jui-badge[_ngcontent-%COMP%]   .display-dot[_ngcontent-%COMP%] {\n          display: inline-block;\n          border-radius: 50%;\n          height: 8px;\n          width: 8px;\n          position:absolute;\n          top: -4px;\n          left: 100%;\n          -webkit-transform: translateX(-50%);\n          -ms-transform: translateX(-50%);\n          transform: translateX(-50%);\n          -webkit-transform-origin: -10% center;\n          -ms-transform-origin: -10% center;\n          transform-origin: -10% center;\n      }\n      .jui-badge[_ngcontent-%COMP%]   .display-no-wrapper[_ngcontent-%COMP%] {\n          display: inline-block;\n          position: inherit;\n          padding: 0 6px;\n          border-radius: 10px;\n          height: 20px;\n          text-align: center;\n          line-height: 20px;\n          min-width: 20px;\n          background-color: #f04134;\n          color: white;\n      }"];
var RenderType_BadgeComponent = i0.ɵcrt({ encapsulation: 0, styles: styles_BadgeComponent, data: {} });
exports.RenderType_BadgeComponent = RenderType_BadgeComponent;
function View_BadgeComponent_1(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 0, "span", [["class", "display-text"]], [[8, "innerHTML", 1], [4, "background-color", null], [4, "color", null]], null, null, null, null))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.displayNum; var currVal_1 = _co.bgColor; var currVal_2 = _co.fontColor; _ck(_v, 0, 0, currVal_0, currVal_1, currVal_2); }); }
function View_BadgeComponent_2(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 0, "span", [["class", "display-dot"]], [[4, "background-color", null]], null, null, null, null))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bgColor; _ck(_v, 0, 0, currVal_0); }); }
function View_BadgeComponent_3(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 1, "span", [["class", "display-no-wrapper"]], [[8, "innerHTML", 1]], null, null, null, null)), i0.ɵdid(1, 278528, null, 0, i1.NgStyle, [i0.KeyValueDiffers, i0.ElementRef, i0.Renderer2], { ngStyle: [0, "ngStyle"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.styleObj; _ck(_v, 1, 0, currVal_1); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.displayNum; _ck(_v, 0, 0, currVal_0); }); }
function View_BadgeComponent_0(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵted(-1, null, ["\n      "])), (_l()(), i0.ɵeld(1, 0, null, null, 12, "div", [["class", "jui-badge"]], null, null, null, null, null)), (_l()(), i0.ɵted(-1, null, ["\n          "])), i0.ɵncd(null, 0), (_l()(), i0.ɵted(-1, null, ["\n          "])), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_BadgeComponent_1)), i0.ɵdid(6, 16384, null, 0, i1.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵted(-1, null, ["\n          "])), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_BadgeComponent_2)), i0.ɵdid(9, 16384, null, 0, i1.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵted(-1, null, ["\n          "])), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_BadgeComponent_3)), i0.ɵdid(12, 16384, null, 0, i1.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵted(-1, null, ["\n      "])), (_l()(), i0.ɵted(-1, null, ["\n    "]))], function (_ck, _v) { var _co = _v.component; var currVal_0 = ((_co.displayType === "text") && (_co.displayNum || _co.showZero)); _ck(_v, 6, 0, currVal_0); var currVal_1 = ((_co.displayType === "dot") && _co.showDot); _ck(_v, 9, 0, currVal_1); var currVal_2 = ((_co.displayType === "no-wrapper") && (_co.displayNum || _co.showZero)); _ck(_v, 12, 0, currVal_2); }, null); }
exports.View_BadgeComponent_0 = View_BadgeComponent_0;
function View_BadgeComponent_Host_0(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 1, "jui-badge", [], null, null, null, View_BadgeComponent_0, RenderType_BadgeComponent)), i0.ɵdid(1, 114688, null, 0, i2.BadgeComponent, [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
exports.View_BadgeComponent_Host_0 = View_BadgeComponent_Host_0;
var BadgeComponentNgFactory = i0.ɵccf("jui-badge", i2.BadgeComponent, View_BadgeComponent_Host_0, { maxNum: "maxNum", showZero: "showZero", showDot: "showDot", badgeNum: "badgeNum", displayType: "displayType", bgColor: "bgColor", fontColor: "fontColor", styleObj: "styleObj" }, {}, ["[badge-body]"]);
exports.BadgeComponentNgFactory = BadgeComponentNgFactory;
//# sourceMappingURL=badge.component.ngfactory.js.map