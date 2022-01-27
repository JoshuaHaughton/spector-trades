/**
 * 
 * @param {*} options set options for the query
 * 
 * {user_id :REQUIRED, portfolio_name, portfolio_id, live}
 * @param {*} db POOL connection to pg
 * @returns am array containing the results
 */
const getPortfoliosByUser = (options, db) => {
  const queryParams = [options.user_id];
  let queryString = `
      SELECT * FROM portfolios
      WHERE user_id = $1
    `;

  if (options.live) {
    queryParams.push(options.live);
    queryString += `AND live = $${queryParams.length}`;
  }

  if (options.portfolio_id) {
    queryParams.push(options.portfolio_id);
    queryString += `AND id = $${queryParams.length}`;
  }

  if (options.portfolio_name) {
    queryParams.push(options.portfolio_name);
    queryString += `AND name = $${queryParams.length}`;
  }

  queryString += `;`;
  return db.query(queryString, queryParams)
    .then(response => {
      return response.rows;
    })
    .catch(err => {
      console.log(`ERROR in getPortfoliosByUser user_id: ${options.user_id}`);
      console.log(err.message)
      return err;
    });
};
/**
 * 
 * @param {*} values REQUIRED: Object {name, live, spec_money, user_id}
 * @param {*} db POOL connection db
 * @returns New portfolio entry
 */
const addPortfolio = (values, db) => {
  let queryString = 
  `
  INSERT INTO 
  portfolios (name, live, spec_money, user_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `;

const queryParams = [
  values.name,
  values.live,
  values.spec_money,
  values.user_id
  ];

return db.query(queryString, queryParams)
.then((result) => {
return result.rows[0];
})
.catch((err) => {
return err.message
});
};
/**
 * Checks to see if portfolio is unique in users account (if live boolean is different it is unique)
 * @param {*} values REQUIRED: Object {live :boolean, name :string, user_id :number}
 * @param {*} db POOL connectiong pg
 * @returns true if unique false if not
 */
const verifyUniquePortfolioName = (values, db) => {
  return db.query(
    `
    SELECT * FROM portfolios
    WHERE name = $1
    AND
    user_id = $2
    AND
    live = $3;
    `, [ values.name, values.user_id, values.live ])
    .then(response => {
      console.log(response.rows)
      if(!response.rows[0]) {
        return true;
      }
      return false;
  }).catch(err => {
    console.log(`ERROR in verifyUniquePortfolioName with name: ${name} and user_id: ${user_id}`);
    console.log(err.message)
  });
};

module.exports = { getPortfoliosByUser, addPortfolio,  verifyUniquePortfolioName}
