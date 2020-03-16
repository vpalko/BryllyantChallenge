const PostgresHelper = require('../utils/postgres-helper');
const POSTGRES_ERRORS = require('pg-error-constants');
const SERVICE_CONSTANTS = require('../utils/service-constants');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

class Poll {
    getpoll(req, res){
        let query;
        if(req.params.id){
            query = `SELECT * FROM bryllyant.poll WHERE id='${req.params.id}'`;
        } else if(req.params.authorid){
            query = `SELECT * FROM bryllyant.poll WHERE authorid='${req.params.authorid}'`;
        }
        
        PostgresHelper.query(query, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err: err })
                // if (err.code && err.code === POSTGRES_ERRORS.FOREIGN_KEY_VIOLATION) {
                //     return res.status(400).send({ error: SERVICE_CONSTANTS.POLL.INVALIDAUTHORID });
                // } else {
                    return res.status(400).send(err);
                // }
            } else if (!response.rowCount || response.rowCount === 0) {
                return res.status(404).end();
            } else {
                return res.status(200).send(response.rows);

                // return res.status(200).send({ 
                //     id: response.rows[0].id,
                //     name: response.rows[0].name,
                //     description: response.rows[0].description,
                //     authorid: response.rows[0].authorid 
                // });
            }
        });
  
    }

    newpoll(req, res) {
            //get credentials coming in from form
            var name = req.body.name;
            var description = req.body.description ? req.body.description : '';
            var authorid = req.body.authorid;

            if(!name || !authorid) {
                return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
            }

            let query = 'INSERT INTO bryllyant.poll(name, description, authorid) VALUES($1, $2, $3)';
            let data = [name, description, authorid];

            PostgresHelper.queryData(query, data, (err, response) => {
                logger.debug({ context: { query } }, 'Dumping query');
                if (err) {
                    logger.error({ err: err })
                    if (err.code && err.code === POSTGRES_ERRORS.FOREIGN_KEY_VIOLATION) {
                        return res.status(400).send({ error: SERVICE_CONSTANTS.POLL.INVALIDAUTHORID });
                    } else {
                        return res.status(400).send(err);
                    }
                } else {
                    return res.status(200).send({ msg: SERVICE_CONSTANTS.POLL.CREATED });
                }
            });







        // for (index = 0; index < req.body.length; index++) {
        //     console.log(req.body[index]);
        //   }


        // let users = [['test@example.com', 'Fred'], ['test2@example.com', 'Lynda']];
        // let query1 = format('INSERT INTO users (email, name) VALUES %L returning id', users);
        
        // async function run() {
        //   let client;
        //   try {
        //     client = new pg.Client({
        //       connectionString: 'postgresql://localhost/node_example'
        //     });
        //     await client.connect();
        //     let {rows} = await client.query(query1);
        //     console.log(rows);
        //   } catch (e) {
        //     console.error(e);
        //   } finally {
        //     client.end();
        //   }
        // }
    }
}

module.exports = new Poll();
