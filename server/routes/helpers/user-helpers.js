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







module.exports = { getUserByColumn, verifyUniqueColumn };
