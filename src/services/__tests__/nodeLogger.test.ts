/* eslint-disable @typescript-eslint/no-explicit-any */
import NodeLogger from '../service.nodeLogger';

describe('NodeLogger', () => {
  let defaultLogger: NodeLogger;
  let configuredLogger: NodeLogger;
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const groupSpy = jest.spyOn(console, 'group').mockImplementation(() => {});
  const groupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation(() => {});

  beforeEach(() => {
    defaultLogger = new NodeLogger();
    configuredLogger = new NodeLogger({
      groupTitles: {
        assertion: 'assertion',
        debug: 'debug',
        success: 'success',
        error: 'error',
        info: 'info',
        log: 'log',
        warning: 'warning',
      },
      useIcons: false,
      useTimestamp: { group: true, single: true },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should construct a Logger with default settings', () => {
    expect(defaultLogger.closeByNewLine).toBe(true);
    expect(defaultLogger.useIcons).toBe(true);
    expect(defaultLogger.useGroupTimestamp).toBe(false);
    expect(defaultLogger.useSingleTimestamp).toBe(false);
    expect(defaultLogger.logTitle).toBe('LOGS');
    expect(defaultLogger.warningTitle).toBe('WARNINGS');
    expect(defaultLogger.errorTitle).toBe('ERRORS');
    expect(defaultLogger.informationTitle).toBe('INFORMATION');
    expect(defaultLogger.successTitle).toBe('SUCCESS');
    expect(defaultLogger.debugTitle).toBe('DEBUG');
    expect(defaultLogger.assertTitle).toBe('ASSERTIONS');
  });

  it('should construct a Logger with configured settings', () => {
    expect(configuredLogger.closeByNewLine).toBe(true);
    expect(configuredLogger.useIcons).toBe(false);
    expect(configuredLogger.useGroupTimestamp).toBe(true);
    expect(configuredLogger.useSingleTimestamp).toBe(true);
    expect(configuredLogger.logTitle).toBe('log');
    expect(configuredLogger.warningTitle).toBe('warning');
    expect(configuredLogger.errorTitle).toBe('error');
    expect(configuredLogger.informationTitle).toBe('info');
    expect(configuredLogger.successTitle).toBe('success');
    expect(configuredLogger.debugTitle).toBe('debug');
    expect(configuredLogger.assertTitle).toBe('assertion');
  });

  it('should construct ANSI color codes', () => {
    const fgColor = 'red';
    const bgColor = 'green';

    const colorCode = (defaultLogger as any).getColor(fgColor, bgColor);
    const fgCode = (defaultLogger as any).getColor(fgColor, undefined);
    const bgCode = (defaultLogger as any).getColor(undefined, bgColor);

    expect(colorCode).toBe('\x1b[31;42m');
    expect(fgCode).toBe('\x1b[31m');
    expect(bgCode).toBe('\x1b[42m');
  });

  it('should reset ANSI color codes', () => {
    const resetCode = (defaultLogger as any).getColorReset();

    expect(resetCode).toBe('\x1b[0m');
  });

  it('should return the entry as is if it is a string', () => {
    const inputString = 'This is a string';
    const formattedEntry = defaultLogger['formatLogEntry'](inputString);

    expect(formattedEntry).toBe(inputString);
  });

  it('should format non-string entries using JSON.stringify and handle newlines', () => {
    const inputObject = {
      key1: 'value1',
      key2: 'value2',
      key3: {
        nestedKey: 'nestedValue',
      },
    };

    const formattedEntry = defaultLogger['formatLogEntry'](inputObject);

    expect(formattedEntry).toMatchInlineSnapshot(`
      "{
        "key1": "value1",
        "key2": "value2",
        "key3": {
          "nestedKey": "nestedValue"
        }
       }"
    `);
  });

  it('should print log message with default settings', () => {
    const singleString = 'This is a log message.';

    defaultLogger.log(singleString);

    expect(groupSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(2);

    const receivedArgs = logSpy.mock.calls[0];

    expect(receivedArgs[0]).toContain('');
    expect(receivedArgs[1]).toEqual(expect.stringContaining('◎ This is a log message.'));
    expect(receivedArgs[2]).toContain('');

    expect(logSpy).toHaveBeenLastCalledWith('');
  });

  it('should format log entries in a group with default settings', () => {
    const logEntry1 = 'Log entry 1';
    const logEntry2 = 'Log entry 2';

    defaultLogger.log(logEntry1, logEntry2);

    const receivedGroupArgs = groupSpy.mock.calls[0];
    expect(receivedGroupArgs[0]).toContain('');
    expect(receivedGroupArgs[1]).toEqual(expect.stringContaining('◎ \u001b[1mLOGS'));
    expect(receivedGroupArgs[2]).toContain('');
    expect(receivedGroupArgs[3]).toContain('');

    // Check if console.log is called for each item in the strings array.
    expect(logSpy).toHaveBeenCalledTimes(3);

    const receivedLogArgs = logSpy.mock.calls;
    expect(receivedLogArgs[0][0]).toContain('');
    expect(receivedLogArgs[0][1]).toEqual(expect.stringContaining(logEntry1));
    expect(receivedLogArgs[0][2]).toContain('');
    expect(receivedLogArgs[1][0]).toContain('');
    expect(receivedLogArgs[1][1]).toEqual(expect.stringContaining(logEntry2));
    expect(receivedLogArgs[1][2]).toContain('');
    expect(groupEndSpy).toHaveBeenCalled();
  });

  it('should print log message with configured settings', () => {
    const singleString = 'This is a log message.';

    configuredLogger.log(singleString);

    expect(groupSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(2);

    const receivedArgs = logSpy.mock.calls[0];

    expect(receivedArgs[0]).toContain('');
    expect(receivedArgs[1]).toEqual(expect.stringContaining('This is a log message.'));
    expect(receivedArgs[1]).toEqual(expect.stringContaining(' | '));
    expect(receivedArgs[1]).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+\s*Z/);

    expect(receivedArgs[2]).toContain('');

    expect(logSpy).toHaveBeenLastCalledWith('');
  });

  it('should format log entries in a group with configured settings', () => {
    const logEntry1 = 'Log entry 1';
    const logEntry2 = 'Log entry 2';

    configuredLogger.log(logEntry1, logEntry2);

    const receivedGroupArgs = groupSpy.mock.calls[0];
    expect(receivedGroupArgs[0]).toContain('');
    expect(receivedGroupArgs[1]).toEqual(expect.stringContaining('\u001b[1mlog'));
    expect(receivedGroupArgs[2]).toContain('');
    expect(receivedGroupArgs[3]).toContain('');

    // Check if console.log is called for each item in the strings array.
    expect(logSpy).toHaveBeenCalledTimes(3);

    const receivedLogArgs = logSpy.mock.calls;
    expect(receivedLogArgs[0][0]).toContain('');
    expect(receivedLogArgs[0][1]).toEqual(expect.stringContaining(logEntry1));
    expect(receivedLogArgs[0][2]).toContain('');
    expect(receivedLogArgs[1][0]).toContain('');
    expect(receivedLogArgs[1][1]).toEqual(expect.stringContaining(logEntry2));
    expect(receivedLogArgs[1][2]).toContain('');
    expect(groupEndSpy).toHaveBeenCalled();
  });

  it('should print log with icon', () => {
    defaultLogger.log('This is a log message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.stringContaining('◎'));
  });

  it('should print warning with icon', () => {
    defaultLogger.warn('This is a warning message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.stringContaining('⚠'));
  });

  it('should print error with icon', () => {
    defaultLogger.error('This is an error message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.stringContaining('⛔'));
  });

  it('should print info with icon', () => {
    defaultLogger.info('This is an info message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.stringContaining('ℹ'));
  });

  it('should print success with icon', () => {
    defaultLogger.success('This is a success message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.stringContaining('✓'));
  });

  it('should print debug with icon', () => {
    defaultLogger.debug('This is a debug message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.stringContaining('፧'));
  });

  it('should print assert with icon', () => {
    defaultLogger.assert('This is a asser message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.stringContaining('!'));
  });

  it('should print log without icon', () => {
    configuredLogger.log('This is a log message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.not.stringContaining('◎'));
  });

  it('should print warning without icon', () => {
    configuredLogger.warn('This is a warning message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.not.stringContaining('⚠'));
  });

  it('should print error without icon', () => {
    configuredLogger.error('This is an error message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.not.stringContaining('⛔'));
  });

  it('should print info without icon', () => {
    configuredLogger.info('This is an info message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.not.stringContaining('ℹ'));
  });

  it('should print success without icon', () => {
    configuredLogger.success('This is a success message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.not.stringContaining('✓'));
  });

  it('should print debug without icon', () => {
    configuredLogger.debug('This is a debug message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.not.stringContaining('፧'));
  });

  it('should print assert without icon', () => {
    configuredLogger.assert('This is a asser message.');

    const receivedArgs = logSpy.mock.calls[0];
    expect(receivedArgs[1]).toEqual(expect.not.stringContaining('!'));
  });

  it('should print warning message with yellow color', () => {
    const getColorMock = jest.spyOn(defaultLogger as any, 'getColor');

    defaultLogger.warn('This is a warning message.');
    expect(getColorMock).toHaveBeenCalledWith('yellow', undefined);

    getColorMock.mockRestore();
  });

  it('should print error message with red color', () => {
    const getColorMock = jest.spyOn(defaultLogger as any, 'getColor');

    defaultLogger.error('This is an error message.');
    expect(getColorMock).toHaveBeenCalledWith('red', undefined);

    getColorMock.mockRestore();
  });

  it('should print info message with blue color', () => {
    const getColorMock = jest.spyOn(defaultLogger as any, 'getColor');

    defaultLogger.info('This is an info message.');
    expect(getColorMock).toHaveBeenCalledWith('blue', undefined);

    getColorMock.mockRestore();
  });

  it('should print success message with green color', () => {
    const getColorMock = jest.spyOn(defaultLogger as any, 'getColor');

    defaultLogger.success('This is a success message.');
    expect(getColorMock).toHaveBeenCalledWith('green', undefined);

    getColorMock.mockRestore();
  });

  it('should print debug message with magenta color', () => {
    const getColorMock = jest.spyOn(defaultLogger as any, 'getColor');

    defaultLogger.debug('This is a debug message.');
    expect(getColorMock).toHaveBeenCalledWith('magenta', undefined);

    getColorMock.mockRestore();
  });

  it('should print assert message with cyan color', () => {
    const getColorMock = jest.spyOn(defaultLogger as any, 'getColor');

    defaultLogger.assert('This is an assert message.');
    expect(getColorMock).toHaveBeenCalledWith('cyan', undefined);

    getColorMock.mockRestore();
  });
});
