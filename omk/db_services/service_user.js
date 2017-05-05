const pg = require('pg');
const con = require('./connection');

var config = {
  user: con.user, //env var: PGUSER
  database: con.db_name, //env var: PGDATABASE
  password: con.pass, //env var: PGPASSWORD
  host: con.host, // Server hosting the postgres database
  port: con.port, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
//it will keep idle connections open for 30 seconds
//and set a limit of maximum 10 idle clients
const pool = new pg.Pool(config);

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack);
});

//export the query method for passing queries to the pool
module.exports.query = function (text, values, callback) {
  console.log('query:', text, values);
  return pool.query(text, values, callback);
};

module.exports.connect = function (callback) {
  return pool.connect(callback);
};

/*
 * send element tested + boolean to handler
 */
const is_element_exists = function(row_name, value, handler){
        pool.query("SELECT * FROM app_user WHERE "+row_name+"=$1::text;",[value] , function(err, result){
        if(err){
            handler(row_name, false, err);
            return;// console.error("error is_element_exists", err);
        }
        
        if((result.rows).length > 0){
            handler(row_name, true, err);
        }else{
            handler(row_name, false, err);
        }
    });
};

/*
 * send true to handler if insertion is ok
 */
const insert = function(person, handler){
    pool.query("INSERT INTO app_user (\"login\", \"mail\", \"pwd\") VALUES ($1::text, $2::text, $3::text);",[person.nname, person.mail, person.pwd] , function(err, res) {
        if(err) {
            handler(false, err);
        }else{
            handler(true, err);
        }
    });
};

module.exports = {
    is_element_exists,
    insert
};