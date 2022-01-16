const getUserByEmail = function(email, db) {
  return db.query(
    `
    SELECT * FROM users
    WHERE email = $1;
    `, [ email ])
    .then(response => {
    return response.rows[0];
  }).catch(err => {
    console.log("ERROR in checkEmail", err.message);
  });
};









module.exports = { getUserByEmail };
