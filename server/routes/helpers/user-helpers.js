// Helpers for Users interactions

const getUserByColumn = function(column, value, db) {
  return db.query(
    `
    SELECT * FROM users
    WHERE ${column} = $1;
    `, [ value ])
    .then(response => {
    return response.rows[0];
  }).catch(err => {
    console.log(`ERROR in getUserByColumn with column: ${column} and value: ${value}`);
    console.log(err.message)
  });
};
/**
 * 
 * @param {object} columnData containing columns to be checked for uniqueness
 * 
 * data = { email: email@gmail.com, username: someusername}
 * @param {database pool} db pool connection setup in db/index
 * @returns true if both are unique false otherwise
 */
const verifyUniqueColumns = function(columnData, db) {
  return db.query(
    `
    SELECT * FROM users
    WHERE email = $1
    OR
    username = $2;
    `, [ columnData.email, columnData.username ])
    .then(response => {
    return response.rows[0] ? false : true;
  }).catch(err => {
    console.log(`ERROR in verifyUniqueColumns with email: ${columnData.email} and username: ${columnData.username}`);
    console.log(err.message)
  });
};







module.exports = { getUserByColumn, verifyUniqueColumns };
