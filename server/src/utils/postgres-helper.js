const { Pool } = require('pg')
const format = require('pg-format');
const SERVICE_CONSTANTS = require('./service-constants');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

class PostgresHelper {
    init() {
        // initiate
        if(SERVICE_CONSTANTS.DB === "POSTGRES") {
            this.createPostgresClient();
        }
    }

    // Get Postgres Client for local / cloud
    createPostgresClient() {
        if (!this.postgresClient) {
            this.postgresClient = new Pool({
                user: SERVICE_CONSTANTS.POSTGRES.USER,
                host: SERVICE_CONSTANTS.POSTGRES.HOST,
                database: SERVICE_CONSTANTS.POSTGRES.DATABASE,
                password: SERVICE_CONSTANTS.POSTGRES.PASSWORD,
                port: SERVICE_CONSTANTS.POSTGRES.PORT,
            });

            logger.debug("Postgres client pool created");
        }
    }

    // Close Postgres connection
    closePostgresConnection() {
        if (this.postgresClient) {
            this.postgresClient.end()
        }
    }

    query(query, callback) {
        return this.postgresClient.query(query, callback)
    }

    queryData(query, data, callback) {
        return this.postgresClient.query(query, data, callback)
    }
}

module.exports = new PostgresHelper()
