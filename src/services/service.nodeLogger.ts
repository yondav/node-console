/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { colorMap, type LoggerColors, type NodeLoggerConfig } from '../utils';

export default class NodeLogger {
  public closeByNewLine: boolean; // Determines whether a newline should be added after each log message.
  public useIcons: boolean; // Enables or disables the use of icons in log messages.
  public useSingleTimestamp: boolean; // Enables or disables timestamp for single line messages.
  public useGroupTimestamp: boolean; // Enables or disables timestamp for grouped messages.
  public logTitle: string; // Title for regular log messages.
  public warningTitle: string; // Title for warning log messages.
  public errorTitle: string; // Title for error log messages.
  public informationTitle: string; // Title for info log messages.
  public successTitle: string; // Title for success log messages.
  public debugTitle: string; // Title for debug log messages.
  public assertTitle: string; // Title for assert log messages.

  // Constructs a new Logger instance with default settings.
  constructor(config: NodeLoggerConfig = {}) {
    this.closeByNewLine = true;
    this.useIcons = config.useIcons ?? true;
    this.useGroupTimestamp = config.useTimestamp?.group ?? false;
    this.useSingleTimestamp = config.useTimestamp?.single ?? false;
    this.logTitle = config.groupTitles?.log ?? 'LOGS';
    this.warningTitle = config.groupTitles?.warning ?? 'WARNINGS';
    this.errorTitle = config.groupTitles?.error ?? 'ERRORS';
    this.informationTitle = config.groupTitles?.info ?? 'INFORMATION';
    this.successTitle = config.groupTitles?.success ?? 'SUCCESS';
    this.debugTitle = config.groupTitles?.debug ?? 'DEBUG';
    this.assertTitle = config.groupTitles?.assertion ?? 'ASSERTIONS';
  }

  /**
   * Generates ANSI color codes for foreground and background colors.
   * @param foregroundColor - Foreground color from LoggerColors enum.
   * @param backgroundColor - Background color from LoggerColors enum.
   * @returns ANSI color codes for the given foreground and background colors.
   */
  private getColor(
    foregroundColor?: LoggerColors,
    backgroundColor?: LoggerColors
  ): string {
    if (foregroundColor && !backgroundColor)
      return `\x1b[${colorMap.fg[foregroundColor]}m`;
    if (backgroundColor && !foregroundColor)
      return `\x1b[${colorMap.bg[backgroundColor]}m`;
    if (foregroundColor && backgroundColor)
      return `\x1b[${colorMap.fg[foregroundColor]};${colorMap.bg[backgroundColor]}m`;
    return '';
  }

  /**
   * Resets the console color settings.
   * @returns ANSI code to reset console color settings.
   */
  private getColorReset(): string {
    return '\x1b[0m';
  }

  /**
   * Formats a log entry or group for display.
   *
   * @param entry - The log entry to format, which can be a string or any other object.
   * @returns A formatted string representing the log entry or group.
   */
  private formatLogEntry(entry: any): string {
    if (typeof entry === 'string') {
      // If the entry is already a string, return it as is.
      return entry;
    } else {
      // Handle formatting for non-string entries using JSON.stringify.
      const formattedEntry = JSON.stringify(entry, null, 2);
      const formattedLines = formattedEntry.split('\n');

      // Correct formatting issues with newlines to display a readable log entry.
      return formattedLines
        .map((line, index) => (index === formattedLines.length - 1 ? ` ${line}` : line))
        .join('\n');
    }
  }

  /**
   * Constructs and prints log entries with color and formatting.
   * @param config - Configuration object with color and formatting options.
   * @param strings - Log messages to be printed.
   */
  private constructPrint(
    config: {
      fg?: LoggerColors;
      bg?: LoggerColors;
      icon: string;
      groupTitle: string;
    },
    ...strings: any
  ) {
    const { fg, bg, icon, groupTitle } = config;
    const timestamp = new Date().toISOString();

    if (strings.length > 1) {
      const c = this.getColor(fg, bg);
      const timeString = `\x1b[90m${this.useGroupTimestamp ? timestamp : ''}`;

      console.group(
        c,
        `${this.useIcons ? `${icon} ` : ''}\u001b[1m${groupTitle.trim()}`,
        this.getColorReset(),
        timeString,
        this.getColorReset()
      );

      const nl = this.closeByNewLine;
      this.closeByNewLine = false;

      // For each item, format and print the log entry.
      strings.forEach((item: any) => {
        this.print(fg, bg, this.formatLogEntry(item), this.getColorReset());
      });

      this.closeByNewLine = nl;
      console.groupEnd();

      if (nl) console.log();
    } else {
      const timeString = `\x1b[90m${this.useSingleTimestamp ? ' | ' + timestamp : ''}`;

      // Format and print the single log entry.
      this.print(
        fg,
        bg,
        strings
          .map(
            (item: any) =>
              `${this.useIcons ? `${icon} ` : ''}${this.formatLogEntry(item)}`
          )
          .join(),
        this.getColorReset(),
        timeString
      );
    }
  }

  /**
   * Prints log entries with color and formatting.
   * @param foregroundColor - Foreground color for log entries.
   * @param backgroundColor - Background color for log entries.
   * @param strings - Log messages to be printed.
   */
  public print(
    foregroundColor: LoggerColors = 'white',
    backgroundColor?: LoggerColors,
    ...strings: any
  ) {
    const c = this.getColor(foregroundColor, backgroundColor);

    console.log(c, strings.join(''), this.getColorReset());
    if (this.closeByNewLine) {
      console.log('');
    }
  }

  // Clears the console.
  public clear(): void {
    console.clear();
  }

  /**
   * Prints log entries with default settings.
   * @param strings - Log messages to be printed.
   */
  public log(...strings: any): void {
    this.constructPrint({ icon: '\u25ce', groupTitle: ` ${this.logTitle}` }, ...strings);
  }

  /**
   * Prints warning log entries with yellow color and an exclamation mark icon.
   * @param strings - Warning log messages to be printed.
   */
  public warn(...strings: any): void {
    this.constructPrint(
      { fg: 'yellow', icon: '\u26a0', groupTitle: ` ${this.warningTitle}` },
      ...strings
    );
  }

  /**
   * Prints error log entries with red color and a red exclamation icon.
   * @param strings - Error log messages to be printed.
   */
  public error(...strings: any): void {
    this.constructPrint(
      { fg: 'red', icon: '\u26D4', groupTitle: ` ${this.errorTitle}` },
      ...strings
    );
  }

  /**
   * Prints informational log entries with blue color and an 'i' icon.
   * @param strings - Informational log messages to be printed.
   */
  public info(...strings: any): void {
    this.constructPrint(
      { fg: 'blue', icon: '\u2139', groupTitle: ` ${this.informationTitle}` },
      ...strings
    );
  }

  /**
   * Prints success log entries with green color and a checkmark icon.
   * @param strings - Success log messages to be printed.
   */
  public success(...strings: any): void {
    this.constructPrint(
      { fg: 'green', icon: '\u2713', groupTitle: ` ${this.successTitle}` },
      ...strings
    );
  }

  /**
   * Prints debug log entries with magenta color and a custom debug icon.
   * @param strings - Debug log messages to be printed.
   */
  public debug(...strings: any): void {
    this.constructPrint(
      { fg: 'magenta', icon: '\u1367', groupTitle: ` ${this.debugTitle}` },
      ...strings
    );
  }

  /**
   * Prints assert log entries with cyan color and an exclamation icon.
   * @param strings - Assert log messages to be printed.
   */
  public assert(...strings: any): void {
    this.constructPrint(
      { fg: 'cyan', icon: '\u0021', groupTitle: ` ${this.assertTitle}` },
      ...strings
    );
  }
}
