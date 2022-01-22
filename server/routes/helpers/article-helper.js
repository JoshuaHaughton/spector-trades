const getArticleByOldId = (values, type, idType, db) => {

  let queryString = 
                    `
                    SELECT * 
                    FROM ${idType}
                    WHERE ${type} = $1;
                    `;

  const queryParams = [values];

  return db.query(queryString, queryParams)
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    return err.message
  });
}





module.exports = { getArticleByOldId};
