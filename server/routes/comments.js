const express = require('express');
const app = express.Router();
const { getCommentsByUser, getCommentsByPost} = require('./helpers/comment-helper');
//Default route is /api/comments

module.exports = (db) => {

app.get('/', async (req, res) => {
  try {
    const comments = await db.query(`
    SELECT * FROM comments;
    `);

    res.status(200).json({
      status: "success",
      results: comments.rows.length,
      data: {
        comments: comments.rows
      }
    })
    res.send(comments.rows);

  } catch(err) {

    res.status(500).send;
    console.log(res)
  }
})

app.get('/user_id/:user_id', (req, res) => {
  const { user_id } = req.params;
  getCommentsByUser(user_id, db)
  .then(resp => {
    res.status(200).json({
      status: "success",
      results: resp.length,
      data: {
        comments: resp
      }
    })
  }).catch(err => {
    console.log("ERROR IN getCommentsByUser: ", err)
  });
});

app.get('/post_id/:post_id', (req, res) => {
  const { post_id } = req.params;
  getCommentsByPost(post_id, db)
  .then(resp => {
    res.status(200).json({
      status: "success",
      results: resp.length,
      data: {
        comments: resp
      }
    })
  }).catch(err => {
    console.log("ERROR IN getCommentsByUser: ", err)
  });
});

app.post('/', (req, res) => {
  console.log('COMMENTS')

  
  const { articleId, body } = req.body;
  console.log(req.body)
  // try {
  //   const newComment = await db.query(`
  //   INSERT INTO comments (user_id, post_id, body, created_at) 
  //   VALUES ($1, $2, $3, NOW())
  //   RETURNING *;
  //   `, [???, req.body.articleId, req.body.body]);

  //   res.status(200).json({
  //     status: "success",
  //     results: newComment.rows.length,
  //     data: {
  //       newComment: newComment.rows
  //     }
  //   })
  //   res.send(newComment.rows);
  //   console.log(newComment.rows)

  // } catch(err) {

  //   res.status(500).send;
  //   console.log(res)
  // }
})

return app;

}
