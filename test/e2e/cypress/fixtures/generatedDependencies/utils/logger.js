import { basename } from 'path';
class Log {
    // TODO: improve typing to avoid repeating method declarations
    log(...args) { }
    ;
    warn(...args) { }
    ;
    error(...args) { }
    ;
}
class Logger extends Log {
    constructor(moduleName) {
        super();
        this.moduleName = moduleName;
        this.moduleName = moduleName;
        this.loggingEnabled = process.env.NODE_ENV !== 'test';
        this.msgPrefix = `([Module: ${this.moduleName}]):: `;
        this.setupLogger();
    }
    setupLogger() {
        const allowedMethodNames = ['log', 'warn', 'error'];
        Object.keys(globalThis.console).forEach((methodName) => {
            if (allowedMethodNames.includes(methodName)) {
                this[methodName] = (...args) => {
                    if (this.loggingEnabled) {
                        globalThis.console[methodName](this.msgPrefix, ...args);
                    }
                };
            }
            else {
                this[methodName] = () => {
                    throw new ReferenceError(`${methodName} is not implemented in logger!`);
                };
            }
        });
    }
}
function getLogger(moduleFileName) {
    if (moduleFileName.endsWith('.spec.js')) {
        throw TypeError('Logger may not be used in *.spec.js files!');
    }
    else if (moduleFileName.includes('frontend')) {
        throw TypeError('Logger may not be used by modules from frontend/** directory!');
    }
    return new Logger(basename(moduleFileName));
}
export default getLogger;
