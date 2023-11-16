export type Nullable<T> = T | null | undefined;

export type LoggerLogTypes = 'group' | 'single';

export type LoggerTimestamps = { [key in LoggerLogTypes]?: boolean };

export type LoggerLogLevels =
  | 'log'
  | 'warning'
  | 'error'
  | 'info'
  | 'success'
  | 'debug'
  | 'assertion';

export type LoggerGroupTitles = { [key in LoggerLogLevels]?: string };

export interface NodeLoggerConfig {
  useIcons?: boolean;
  useTimestamp?: LoggerTimestamps;
  groupTitles?: LoggerGroupTitles;
}
