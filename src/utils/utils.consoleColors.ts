// Enum representing available logger colors.
export type LoggerColors =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white';

// ANSI color codes mapping for foreground and background colors.
export const colorMap: {
  [key in 'fg' | 'bg']: {
    [k in LoggerColors]: number;
  };
} = {
  fg: {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 97,
  },
  bg: {
    black: 40,
    red: 41,
    green: 42,
    yellow: 43,
    blue: 44,
    magenta: 45,
    cyan: 46,
    white: 107,
  },
} as const;
