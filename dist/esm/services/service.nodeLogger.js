import { colorMap } from '../utils';
export default class NodeLogger {
    constructor(config = {}) {
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
    getColor(foregroundColor, backgroundColor) {
        if (foregroundColor && !backgroundColor)
            return `\x1b[${colorMap.fg[foregroundColor]}m`;
        if (backgroundColor && !foregroundColor)
            return `\x1b[${colorMap.bg[backgroundColor]}m`;
        if (foregroundColor && backgroundColor)
            return `\x1b[${colorMap.fg[foregroundColor]};${colorMap.bg[backgroundColor]}m`;
        return '';
    }
    getColorReset() {
        return '\x1b[0m';
    }
    formatLogEntry(entry) {
        if (typeof entry === 'string') {
            return entry;
        }
        else {
            const formattedEntry = JSON.stringify(entry, null, 2);
            const formattedLines = formattedEntry.split('\n');
            return formattedLines
                .map((line, index) => (index === formattedLines.length - 1 ? ` ${line}` : line))
                .join('\n');
        }
    }
    constructPrint(config, ...strings) {
        const { fg, bg, icon, groupTitle } = config;
        const timestamp = new Date().toISOString();
        if (strings.length > 1) {
            const c = this.getColor(fg, bg);
            const timeString = `\x1b[90m${this.useGroupTimestamp ? timestamp : ''}`;
            console.group(c, `${this.useIcons ? `${icon} ` : ''}\u001b[1m${groupTitle.trim()}`, this.getColorReset(), timeString, this.getColorReset());
            const nl = this.closeByNewLine;
            this.closeByNewLine = false;
            strings.forEach((item) => {
                this.print(fg, bg, this.formatLogEntry(item), this.getColorReset());
            });
            this.closeByNewLine = nl;
            console.groupEnd();
            if (nl)
                console.log();
        }
        else {
            const timeString = `\x1b[90m${this.useSingleTimestamp ? ' | ' + timestamp : ''}`;
            this.print(fg, bg, strings
                .map((item) => `${this.useIcons ? `${icon} ` : ''}${this.formatLogEntry(item)}`)
                .join(), this.getColorReset(), timeString);
        }
    }
    print(foregroundColor = 'white', backgroundColor, ...strings) {
        const c = this.getColor(foregroundColor, backgroundColor);
        console.log(c, strings.join(''), this.getColorReset());
        if (this.closeByNewLine) {
            console.log('');
        }
    }
    clear() {
        console.clear();
    }
    log(...strings) {
        this.constructPrint({ icon: '\u25ce', groupTitle: ` ${this.logTitle}` }, ...strings);
    }
    warn(...strings) {
        this.constructPrint({ fg: 'yellow', icon: '\u26a0', groupTitle: ` ${this.warningTitle}` }, ...strings);
    }
    error(...strings) {
        this.constructPrint({ fg: 'red', icon: '\u26D4', groupTitle: ` ${this.errorTitle}` }, ...strings);
    }
    info(...strings) {
        this.constructPrint({ fg: 'blue', icon: '\u2139', groupTitle: ` ${this.informationTitle}` }, ...strings);
    }
    success(...strings) {
        this.constructPrint({ fg: 'green', icon: '\u2713', groupTitle: ` ${this.successTitle}` }, ...strings);
    }
    debug(...strings) {
        this.constructPrint({ fg: 'magenta', icon: '\u1367', groupTitle: ` ${this.debugTitle}` }, ...strings);
    }
    assert(...strings) {
        this.constructPrint({ fg: 'cyan', icon: '\u0021', groupTitle: ` ${this.assertTitle}` }, ...strings);
    }
}
