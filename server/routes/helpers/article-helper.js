const getArticleByOldId = (values, db) => {
  let queryString = 
                    `
                    SELECT * 
                    FROM articles
                    WHERE original_id = $1;
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
