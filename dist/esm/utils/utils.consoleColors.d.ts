export type LoggerColors = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white';
export declare const colorMap: {
    [key in 'fg' | 'bg']: {
        [k in LoggerColors]: number;
    };
};
