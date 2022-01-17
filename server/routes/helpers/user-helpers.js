// Helpers for Users interactions

/**
 * 
 * @param {string} column name to be searched 
 * @param {string} value value to be checked in given column
 * @param {pool} db pool connection setup in db/index.js
 * @returns 
 */
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
 * @returns object { unique: false, dup_username: true, dup_email: true }
 */
const verifyUniqueColumns = function(columnData, db) {
  console.log(columnData.email)
  return db.query(
    `
    SELECT * FROM users
    WHERE email = $1
    OR
    username = $2;
    `, [ columnData.email, columnData.username ])
    .then(response => {
      let colValues = [];

      let set = new Set()
      response.rows.forEach(item => set.add(item.username).add(item.email));
      set.forEach((item) => colValues.push(item))

      const respObj = {
        unique: true,
        dup_username: null,
        dup_email: null
      };

      if (response.rows[0]) {

        if (colValues.includes(columnData.email)) {
          respObj.dup_email = true;
        };
        
        if (colValues.includes(columnData.username)) {
          respObj.dup_username = true;
        };

        respObj.unique = false;
      }

      return respObj;
  }).catch(err => {
    console.log(`ERROR in verifyUniqueColumns with email: ${columnData.email} and username: ${columnData.username}`);
    console.log(err.message)
  });
};

/**
 * 
 * @param {obj} user = {username, password_digest, email, avatarURL(if supplied NULL if not)} 
 * @param {pool} db pool connection setup in db/index.js
 * @returns an object of newly created user or error
 */
const addUser = function(user, db) {
  let queryString = 
                    `
                    INSERT INTO 
                    users (username, email, password_digest, avatar_url)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *;
                    `;

  const queryParams = [ user.username, user.email, user.password_digest, user.avatar_url ];

  return db.query(queryString, queryParams)
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    return err.message
  });
};





module.exports = { getUserByColumn, verifyUniqueColumns, addUser };
