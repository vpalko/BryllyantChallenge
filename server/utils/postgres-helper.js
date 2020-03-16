const { Pool } = require('pg')
const format = require('pg-format');
const SERVICE_CONSTANTS = require('./service-constants');

class PostgresHelper {
    init() {
        // initiate
        this.createPostgresClient()
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
            })
        }
    }

    // Close Postgres connection
    closePostgresConnection() {
        if (this.postgresClient) {
            this.postgresClient.end()
        }
    }

    query(query, data, callback) {
        if(data) {
            return this.postgresClient.query(query, data, callback)
        } else {
            return this.postgresClient.query(query, callback)
        }

    }
}

module.exports = new PostgresHelper()
