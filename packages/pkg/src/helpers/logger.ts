import { consola } from 'consola';
import picocolors from 'picocolors';

// copy from consola
enum LogLevel {
  Fatal = 0,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Error = 0,
  Warn = 1,
  Log = 2,
  Info = 3,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Success = 3,
  Debug = 4,
  Trace = 5,
  Silent = -Infinity,
  Verbose = Infinity,
}

const colorize = (type: LogLevel) => (msg: string) => {
  const color =
    type === LogLevel.Info ? 'green' : type === LogLevel.Error ? 'red' : type === LogLevel.Warn ? 'yellow' : 'white';
  return picocolors[color](msg);
};

function colorizeNamespace(name: string, type: LogLevel) {
  return `${picocolors.dim('[')}${colorize(type)(name.toUpperCase())}${picocolors.dim(']')} `;
}

/**
 * create logger
 * @param name
 * @returns
 */
export function createLogger(namespace: string) {
  return {
    info(...args: any[]) {
      const prefix = colorizeNamespace(namespace, LogLevel.Info);
      consola.info(prefix, ...args.map((item) => colorize(LogLevel.Info)(item)));
    },

    error(...args: any[]) {
      const prefix = colorizeNamespace(namespace, LogLevel.Error);
      consola.error(prefix, ...args.map((item) => colorize(LogLevel.Error)(item)));
    },

    warn(...args: any[]) {
      const prefix = colorizeNamespace(namespace, LogLevel.Warn);
      consola.warn(prefix, ...args.map((item) => colorize(LogLevel.Warn)(item)));
    },

    debug(...args: any[]) {
      const prefix = colorizeNamespace(namespace, LogLevel.Debug);
      consola.debug(prefix, ...args.map((item) => colorize(LogLevel.Debug)(item)));
    },
  };
}

export type CreateLoggerReturns = ReturnType<typeof createLogger>;
