const { basename } = require('path');

class Logger {
  constructor(moduleName) {
    this._moduleName = moduleName;
    this._loggingEnabled = process.env.NODE_ENV !== 'test';
    this._msgPrefix = `[(Module: ${this._moduleName}]):: `;

    this.setupLogger();
  }

  setupLogger() {
    const allowedMethodNames = ['log', 'warn', 'error'];

    Object.keys(global.console).forEach((methodName) => {
      if (allowedMethodNames.includes(methodName)) {
        this[methodName] = (...args) => {
          if (this._loggingEnabled) {
            console[methodName](this._msgPrefix, ...args);
          }
        };
      } else {
        this[methodName] = () => {
          throw new ReferenceError(`${methodName} is not implemented in logger!`);
        };
      }
    });
  }
}

module.exports = (moduleFileName) => {
  if (!moduleFileName || typeof moduleFileName !== 'string') {
    throw TypeError('moduleFileName param should be provided as a string!');
  } else if (moduleFileName.endsWith('.spec.js')) {
    throw TypeError('Logger may not be used in *.spec.js files!');
  } else if (moduleFileName.includes('frontend')) {
    throw TypeError('Logger may not be used by modules from frontend/** directory!');
  }

  return new Logger(basename(moduleFileName));
};
