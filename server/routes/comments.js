const express = require('express');
const app = express.Router();
const { getCommentsByUser, getCommentsByPost, addArticleComment, addPostComment} = require('./helpers/comment-helper');
const { authenticateToken } = require('../middleware/authenticateToken');
//Default route is /api/comments
//curl statement for post
// { user_id: 4, user_email: 'eatdem@cookies.com', iat: 1642529502 }
/*
curl -X POST http://localhost:3001/api/comments -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ1c2VyX2VtYWlsIjoiZWF0ZGVtQGNvb2tpZXMuY29tIiwiaWF0IjoxNjQyNTI5NTAyfQ.I4wkKqnv9fuPCxHob8dIwOrrlzF-F_FLvT2r5bTtROs" -H "Content-Type: application/json" --data-binary @- <<DATA
{"post_id":"1",
"body":"I LIKE COOOKIES"}
DATA
*/
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

app.post('/post', authenticateToken, (req, res) => {
  if (!req.body.user|| !req.body.post_id || !req.body.body) {
    console.log("FAILED POST TO COMMENTS, req.body: ", req.body)
    return res.sendStatus(422)
  }

  const { post_id, body, user } = req.body;

  console.log(req.body)

  addPostComment({
    user_id: user.id,
    post_id,
    body
  }, db)
    .then(result => {
      if (result == 'insert or update on table \"comments\" violates foreign key constraint \"comments_post_id_fkey\"') {
        res.send({status: 500, error: "post_id does not exist"})
      }
      console.log("addPostComment result: ", result);
      res.send({status: 200, result})

    })
    .catch(err => {

      console.log("ERROR in addPostComment: ", err);
      res.send({status: 500, error: err})
    });
    
});




app.post('/article', authenticateToken, (req, res) => {

  if (!req.body.user|| !req.body.article_id || !req.body.body) {
    console.log("FAILED POST TO COMMENTS, req.body: ", req.body)
    return res.sendStatus(422)
  }

  const { article_id, body, user } = req.body;

  console.log(req.body)

  addArticleComment({
    user_id: user.id,
    article_id,
    body
  }, db)
    .then(result => {
      if (result == 'insert or update on table \"comments\" violates foreign key constraint \"comments_article_id_fkey\"') {
        res.send({status: 500, error: "article_id does not exist"})
      }
      console.log("addArticleComment result: ", result);
      res.send({status: 200, result})

    })
    .catch(err => {

      console.log("ERROR in addArticleComment: ", err);
      res.send({status: 500, error: err})
    });
    
});





app.post('/', (req, res) => {
  console.log('COMMENTS')

  
  const { articleId, body } = req.body;
  // console.log(req)
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

