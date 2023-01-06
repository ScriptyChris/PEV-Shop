/**
 * Custom wrapper for a commonly used global `console` methods.
 * @module Logger
 */

import { basename } from 'path';

// TODO: improve typing to avoid repeating method declarations
abstract class Log {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public log(...args: any[]): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public warn(...args: any[]): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public error(...args: any[]): void {}
}

class Logger extends Log {
  private readonly loggingEnabled: boolean;
  private readonly msgPrefix: string;

  constructor(private readonly moduleName: string) {
    super();

    this.moduleName = moduleName;
    this.loggingEnabled = process.env.NODE_ENV !== 'test';
    this.msgPrefix = `([Module: ${this.moduleName}]):: `;

    this.setupLogger();
  }

  private setupLogger() {
    type TLog = keyof Log;
    const allowedMethodNames: Array<TLog> = ['log', 'warn', 'error'];

    Object.keys(globalThis.console).forEach((methodName): void => {
      if (allowedMethodNames.includes(methodName as TLog)) {
        this[methodName as TLog] = (...args: unknown[]) => {
          if (this.loggingEnabled) {
            globalThis.console[methodName as TLog](this.msgPrefix, ...args);
          }
        };
      } else {
        this[methodName as TLog] = () => {
          throw new ReferenceError(`${methodName} is not implemented in logger!`);
        };
      }
    });
  }
}

/**
 * Creates a module bound logger, which name will be visually emphased in output logs.
 * @example <caption>Log output for `middleware-index` module</caption>
 * ([Module: middleware-index.js])::  Server is listening on port 3000
 * @param {string} moduleFileName
 * @returns {TLogger}
 */
function getLogger(moduleFileName: string): Logger {
  if (moduleFileName.endsWith('.spec.js')) {
    throw TypeError('Logger may not be used in *.spec.js files!');
  } else if (moduleFileName.includes('frontend')) {
    throw TypeError('Logger may not be used by modules from frontend/** directory!');
  }

  return new Logger(basename(moduleFileName));
}

export type TLogger = Logger;

export default getLogger;
