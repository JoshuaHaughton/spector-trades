const getArticleByOldId = (values, type, idType, db) => {
  let queryString = `
                    SELECT * 
                    FROM ${idType}
                    WHERE ${type} = $1;
                    `;

  const queryParams = [values];

  return db
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
};

const insertArticle = async (article, db) => {
  //exist check
  
  let test = await db.query(
    `
      SELECT *
      FROM articles
      WHERE url = $1; 
      `,
    [article.link],
  );
  if (test.rows.length > 0) {
    return res.status(402).send("Already exists in database");
  }

  //Create new article if it doesnt exist already

  articleResponse = await db
    .query(
      `
    INSERT INTO articles (url, original_id, created_at) 
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
      [article.link, article._id, article.published_date],
    )
    .then((resp) => {

      res.status(200).json({
        status: "success",
        results: resp.length,
        data: {
          article: resp.rows[0],
        },
      });
      return resp.rows;
    });
};

module.exports = { getArticleByOldId, insertArticle };
