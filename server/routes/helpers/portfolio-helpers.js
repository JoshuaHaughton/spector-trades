/**
 * 
 * @param {*} options set options for the query
 * 
 * {user_id, portfolio_name, portfolio_id, live}
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


module.exports = { getPortfoliosByUser }
