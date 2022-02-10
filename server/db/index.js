const { Pool } = require('pg');
const promise = require('bluebird');
const dbParams = require("../lib/db.js"); 

const pool = new Pool(dbParams);

const initOptions = {
  promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const promDB = pgp(dbParams)


module.exports = {
  query: (text, params) => pool.query(text, params),
  promDB
};
