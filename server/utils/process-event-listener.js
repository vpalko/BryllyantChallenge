var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

const postgresHelper = require('./postgres-helper')

module.exports = class ProcessEventListener {
    static listen(app) {
        process.on('uncaughtException', (err) => {
            logger.error({ event: 'ERROR:APP:PROCESS::UNCAUGHTEXCEPTION', err: err })
        })

        process.on('unhandledRejection', (reason) => {
            logger.error({ event: 'ERROR:APP:PROCESS:UNHANDLEDREJECTION', err: reason })
        })

        process.on('SIGTERM', () => {
            app.close(() => {
                logger.debug('Shutting down server gracefully')
                postgresHelper.closePostgresConnection()
                process.exit()
            })
        })

        process.on('SIGINT', () => {
            logger.debug('SIGINT: Restarting server')
            postgresHelper.closePostgresConnection()
            process.exit()
        })
    }
}
