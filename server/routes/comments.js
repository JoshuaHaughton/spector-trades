const express = require('express');
const app = express.Router();
const { getCommentsByUser, getCommentsByPost, addComment} = require('./helpers/comment-helper');
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

app.post('/', authenticateToken, (req, res) => {
  if (!req.body.user|| !req.body.post_id || !req.body.body) {
    console.log("FAILED POST TO COMMENTS, req.body: ", req.body)
    return res.sendStatus(422)
  }
  // console.log(req.body)
  const { post_id, body, user } = req.body;
  addComment({
    user_id: user.id,
    post_id,
    body
  }, db)
    .then(result => {
      if (result == 'insert or update on table \"comments\" violates foreign key constraint \"comments_post_id_fkey\"') {
        res.send({status: 500, error: "post_id does not exist"})
      }
      console.log("addComment result: ", result);
      res.send({status: 200, result})

    })
    .catch(err => {

      console.log("ERROR in addComment: ", err);
      res.send({status: 500, error: err})
    });
});

return app;
}
