import { type LoggerColors, type NodeLoggerConfig } from '../utils';
export default class NodeLogger {
    closeByNewLine: boolean;
    useIcons: boolean;
    useSingleTimestamp: boolean;
    useGroupTimestamp: boolean;
    logTitle: string;
    warningTitle: string;
    errorTitle: string;
    informationTitle: string;
    successTitle: string;
    debugTitle: string;
    assertTitle: string;
    constructor(config?: NodeLoggerConfig);
    private getColor;
    private getColorReset;
    private formatLogEntry;
    private constructPrint;
    print(foregroundColor?: LoggerColors, backgroundColor?: LoggerColors, ...strings: any): void;
    clear(): void;
    log(...strings: any): void;
    warn(...strings: any): void;
    error(...strings: any): void;
    info(...strings: any): void;
    success(...strings: any): void;
    debug(...strings: any): void;
    assert(...strings: any): void;
}
