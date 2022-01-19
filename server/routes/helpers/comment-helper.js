/**
 * 
 * @param {*} id user id
 * @param {*} db POOL connection
 * @returns all comments and assiciated posts of the given user id
 */
const getCommentsByUser = (id, db) => {
  return db.query(
  `
  SELECT comments.id as comment_id, comments.created_at as comment_created_at,
  comments.body as comment_body,
  posts.id as post_id, posts.description as post_description,
  posts.created_at as post_created
  FROM comments
  JOIN users ON comments.user_id = users.id
  JOIN posts ON users.id = posts.user_id
  WHERE users.id = $1;
  `, [ id ])
  .then(response => {
    return response.rows;
  }).catch(err => {
    console.log(`ERROR in getCommentsByUser user_id: ${id}`);
    console.log(err.message)
  });
}; 
/**
 * 
 * @param {*} id of the post
 * @param {*} db POOL connection
 * @returns rows including all comments associated to the post id
 */
const getCommentsByPost = (id, db) => {
  return db.query(
  `
  SELECT * FROM comments
  JOIN posts ON comments.post_id = posts.id
  WHERE post_id = $1;
  `, [ id ])
  .then(response => {
    return response.rows;
  }).catch(err => {
    console.log(`ERROR in getCommentsByUser user_id: ${id}`);
    console.log(err.message)
  });
}; 
/**
 * 
 * @param {*} values {user_id, post_id, user_id}
 * @param {*} db POOL connection to pg
 * @returns rows from query
 */
const addPostComment = (values, db) => {
  let queryString = 
                    `
                    INSERT INTO 
                    comments (user_id, post_id, body)
                    VALUES ($1, $2, $3)
                    RETURNING *;
                    `;

  const queryParams = [ values.user_id, values.post_id, values.body ];

  return db.query(queryString, queryParams)
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    return err.message
  });
};
/**
 * 
 * @param {*} values {user_id, article_id, user_id}
 * @param {*} db POOL connection to pg
 * @returns rows from query
 */
const addArticleComment = (values, db) => {
  console.log("add article comment")
  console.log(values)
  let queryString = 
                    `
                    INSERT INTO 
                    comments (user_id, article_id, body)
                    VALUES ($1, $2, $3)
                    RETURNING *;
                    `;

  const queryParams = [ values.user_id, values.article_id, values.body ];

  return db.query(queryString, queryParams)
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    return err.message
  });
};


module.exports = { getCommentsByUser, getCommentsByPost, addPostComment, addArticleComment };
