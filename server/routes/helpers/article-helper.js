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
  console.log('PPRE COMPRESS', article.media.title)
  let compressedArticle = article.media.title.split(" ").join("").split("%").join("").split(`’`).join("").split(`'`).join("").split(",").join("").split(".").join("");
  console.log('COMPRESSED', compressedArticle)

  //exist check
  
  let test = await db.query(
    `
      SELECT *
      FROM articles
      WHERE url = $1; 
      `,
    [article.media.url],
  );
  
  if (test.rows.length > 0) {
    //Already Exists
    return;
  }

  //Create new article if it doesnt exist already

   let response = await db
    .query(
      `
    INSERT INTO articles (url, original_title, created_at) 
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
      [article.media.url, compressedArticle, article.mediaPublish],
    )
    console.log('CREATED', response)
    return response;
    
};

module.exports = { getArticleByOldId, insertArticle };
