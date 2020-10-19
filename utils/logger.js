const path = require('path');
const pino = require('pino');
const appRoot = require('app-root-path');

const LOG_DIR = process.env.LOG_PATH || `${appRoot}/logs`;

/**
 * Logger factory which exports 4 loggers
 *
 * serverAccessLogger: Logs all express requests and responses metadata
 * apiLogger: Logs all axios requests and responses metadata
 * apiErrorLogger: Logs all errors occurred during axios calls
 * logger: : Custom logger to be used by the app for all app specific logs within express routes and middlewares
 */
module.exports = (function(env) {
  let serverAccessLogger;
  let apiLogger;
  let apiErrorLogger;
  let logger = pino(pino.destination(path.join(LOG_DIR, 'export-server.log')));
  switch (env) {
    case 'qa':
      serverAccessLogger = pino(pino.destination(path.join(LOG_DIR, 'serveraccess.log')));
      apiLogger = pino(pino.destination(path.join(LOG_DIR, 'api.log')));
      apiErrorLogger = pino(pino.destination(path.join(LOG_DIR, 'api-error.log')));
      break;
    case 'production':
      serverAccessLogger = pino(pino.destination(path.join(LOG_DIR, 'serveraccess.log')));
      apiLogger = pino({ level: 'error' }, pino.destination(path.join(LOG_DIR, 'api.log')));
      apiErrorLogger = pino(
        { level: 'error' },
        pino.destination(path.join(LOG_DIR, 'api-error.log'))
      );
      break;
    case 'development':
    default:
      serverAccessLogger = pino({ level: 'debug', prettyPrint: { translateTime: 'SYS:standard' } });
      apiLogger = pino({ level: 'debug', prettyPrint: { translateTime: 'SYS:standard' } });
      apiErrorLogger = pino({ level: 'debug', prettyPrint: { translateTime: 'SYS:standard' } });
      logger = pino({ level: 'debug', prettyPrint: { translateTime: 'SYS:standard' } });
  }
  return { serverAccessLogger, apiLogger, apiErrorLogger, logger };
})(process.env.NODE_ENV);
