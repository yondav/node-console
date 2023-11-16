"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var NodeLogger = (function () {
    function NodeLogger(config) {
        if (config === void 0) { config = {}; }
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        this.closeByNewLine = true;
        this.useIcons = (_a = config.useIcons) !== null && _a !== void 0 ? _a : true;
        this.useGroupTimestamp = (_c = (_b = config.useTimestamp) === null || _b === void 0 ? void 0 : _b.group) !== null && _c !== void 0 ? _c : false;
        this.useSingleTimestamp = (_e = (_d = config.useTimestamp) === null || _d === void 0 ? void 0 : _d.single) !== null && _e !== void 0 ? _e : false;
        this.logTitle = (_g = (_f = config.groupTitles) === null || _f === void 0 ? void 0 : _f.log) !== null && _g !== void 0 ? _g : 'LOGS';
        this.warningTitle = (_j = (_h = config.groupTitles) === null || _h === void 0 ? void 0 : _h.warning) !== null && _j !== void 0 ? _j : 'WARNINGS';
        this.errorTitle = (_l = (_k = config.groupTitles) === null || _k === void 0 ? void 0 : _k.error) !== null && _l !== void 0 ? _l : 'ERRORS';
        this.informationTitle = (_o = (_m = config.groupTitles) === null || _m === void 0 ? void 0 : _m.info) !== null && _o !== void 0 ? _o : 'INFORMATION';
        this.successTitle = (_q = (_p = config.groupTitles) === null || _p === void 0 ? void 0 : _p.success) !== null && _q !== void 0 ? _q : 'SUCCESS';
        this.debugTitle = (_s = (_r = config.groupTitles) === null || _r === void 0 ? void 0 : _r.debug) !== null && _s !== void 0 ? _s : 'DEBUG';
        this.assertTitle = (_u = (_t = config.groupTitles) === null || _t === void 0 ? void 0 : _t.assertion) !== null && _u !== void 0 ? _u : 'ASSERTIONS';
    }
    NodeLogger.prototype.getColor = function (foregroundColor, backgroundColor) {
        if (foregroundColor && !backgroundColor)
            return "\u001B[".concat(utils_1.colorMap.fg[foregroundColor], "m");
        if (backgroundColor && !foregroundColor)
            return "\u001B[".concat(utils_1.colorMap.bg[backgroundColor], "m");
        if (foregroundColor && backgroundColor)
            return "\u001B[".concat(utils_1.colorMap.fg[foregroundColor], ";").concat(utils_1.colorMap.bg[backgroundColor], "m");
        return '';
    };
    NodeLogger.prototype.getColorReset = function () {
        return '\x1b[0m';
    };
    NodeLogger.prototype.formatLogEntry = function (entry) {
        if (typeof entry === 'string') {
            return entry;
        }
        else {
            var formattedEntry = JSON.stringify(entry, null, 2);
            var formattedLines_1 = formattedEntry.split('\n');
            return formattedLines_1
                .map(function (line, index) { return (index === formattedLines_1.length - 1 ? " ".concat(line) : line); })
                .join('\n');
        }
    };
    NodeLogger.prototype.constructPrint = function (config) {
        var _this = this;
        var strings = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            strings[_i - 1] = arguments[_i];
        }
        var fg = config.fg, bg = config.bg, icon = config.icon, groupTitle = config.groupTitle;
        var timestamp = new Date().toISOString();
        if (strings.length > 1) {
            var c = this.getColor(fg, bg);
            var timeString = "\u001B[90m".concat(this.useGroupTimestamp ? timestamp : '');
            console.group(c, "".concat(this.useIcons ? "".concat(icon, " ") : '', "\u001B[1m").concat(groupTitle.trim()), this.getColorReset(), timeString, this.getColorReset());
            var nl = this.closeByNewLine;
            this.closeByNewLine = false;
            strings.forEach(function (item) {
                _this.print(fg, bg, _this.formatLogEntry(item), _this.getColorReset());
            });
            this.closeByNewLine = nl;
            console.groupEnd();
            if (nl)
                console.log();
        }
        else {
            var timeString = "\u001B[90m".concat(this.useSingleTimestamp ? ' | ' + timestamp : '');
            this.print(fg, bg, strings
                .map(function (item) {
                return "".concat(_this.useIcons ? "".concat(icon, " ") : '').concat(_this.formatLogEntry(item));
            })
                .join(), this.getColorReset(), timeString);
        }
    };
    NodeLogger.prototype.print = function (foregroundColor, backgroundColor) {
        if (foregroundColor === void 0) { foregroundColor = 'white'; }
        var strings = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            strings[_i - 2] = arguments[_i];
        }
        var c = this.getColor(foregroundColor, backgroundColor);
        console.log(c, strings.join(''), this.getColorReset());
        if (this.closeByNewLine) {
            console.log('');
        }
    };
    NodeLogger.prototype.clear = function () {
        console.clear();
    };
    NodeLogger.prototype.log = function () {
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        this.constructPrint.apply(this, __spreadArray([{ icon: '\u25ce', groupTitle: " ".concat(this.logTitle) }], strings, false));
    };
    NodeLogger.prototype.warn = function () {
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        this.constructPrint.apply(this, __spreadArray([{ fg: 'yellow', icon: '\u26a0', groupTitle: " ".concat(this.warningTitle) }], strings, false));
    };
    NodeLogger.prototype.error = function () {
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        this.constructPrint.apply(this, __spreadArray([{ fg: 'red', icon: '\u26D4', groupTitle: " ".concat(this.errorTitle) }], strings, false));
    };
    NodeLogger.prototype.info = function () {
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        this.constructPrint.apply(this, __spreadArray([{ fg: 'blue', icon: '\u2139', groupTitle: " ".concat(this.informationTitle) }], strings, false));
    };
    NodeLogger.prototype.success = function () {
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        this.constructPrint.apply(this, __spreadArray([{ fg: 'green', icon: '\u2713', groupTitle: " ".concat(this.successTitle) }], strings, false));
    };
    NodeLogger.prototype.debug = function () {
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        this.constructPrint.apply(this, __spreadArray([{ fg: 'magenta', icon: '\u1367', groupTitle: " ".concat(this.debugTitle) }], strings, false));
    };
    NodeLogger.prototype.assert = function () {
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        this.constructPrint.apply(this, __spreadArray([{ fg: 'cyan', icon: '\u0021', groupTitle: " ".concat(this.assertTitle) }], strings, false));
    };
    return NodeLogger;
}());
exports.default = NodeLogger;
