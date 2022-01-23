const express = require("express");
const app = express.Router();
const {
  getCommentsByUser,
  addMediaComment,
  getCommentsByMediaId,
} = require("./helpers/comment-helper");
const { getMediaById } = require('./helpers/media-helpers')
const { authenticateToken } = require("../middleware/authenticateToken");
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

  //Retrieve all comments
  app.get("/", async (req, res) => {
    try {
      const comments = await db.query(`
    SELECT * FROM comments;
    `);

      res.status(200).json({
        status: "success",
        results: comments.rows.length,
        data: {
          comments: comments.rows,
        },
      });
      res.send(comments.rows);
    } catch (err) {
      res.status(500).send;
      console.log(res);
    }
  });


  //Retrieve comments by a specific user
  app.get("/user_id/:user_id", (req, res) => {
    const { user_id } = req.params;
    getCommentsByUser(user_id, db)
      .then((resp) => {
        res.status(200).json({
          status: "success",
          results: resp.length,
          data: {
            comments: resp,
          },
        });
      })
      .catch((err) => {
        console.log("ERROR IN getCommentsByUser: ", err);
      });
  });


  // Get article by the article's original id (retrieved via api request),
  // is used for linking articles to comments
  app.get("/media/:type/:media_id", (req, res) => {
    const { media_id } = req.params;
    const { type } = req.params;

    getMediaById(media_id, type, db)
      .then((resp) => {
        if (!resp) {
          resp = {};
        }

        res.status(200).json({
          status: "success",
          results: resp.length,
          data: {
            media_id: resp.id,
          },
        });
      })
      .catch((err) => {
        console.log("ERROR IN getCommentsByUser: ", err);
      });
  });

  // Get comments by article/post ID
  app.get("/:type/:media_id", (req, res) => {
    const { media_id } = req.params;
    const { type } = req.params;
 

    getCommentsByMediaId(media_id, type, db)
      .then((resp) => {
        if (!resp) {
          resp = {};
        }

        res.status(200).json({
          status: "success",
          results: resp.length,
          data: {
            comments: resp,
          },
        });
        console.log("ARRAY RESP", resp);
      })
      .catch((err) => {
        console.log("ERROR IN getCommentsByUser: ", err);
      });
  });


  //Post a comment and link it to a post or an article
  app.post("/media", authenticateToken, (req, res) => {
    if (!req.body.user || !req.body.media_id || !req.body.body) {
      console.log("FAILED POST TO COMMENTS, req.body: ", req.body);
      return res.sendStatus(422);
    }

    const media = req.body;
    const user = req.body.user;
    const media_id = req.body.media_id;
    const body = req.body.body;

    let type;
    let idType;

    if (!media.mediaTitle) {
      type = "post_id";
      idType = "posts";
    } else {
      type = "article_id";
      idType = "articles";
    }

    addMediaComment(
      {
        user_id: user.id,
        media_id,
        type,
        body,
      },
      db,
    )
      .then((result) => {
        if (
          result ==
          'insert or update on table "comments" violates foreign key constraint "comments_article_id_fkey"'
        ) {
          res.send({ status: 500, error: "article_id does not exist" });
        }
        console.log("addMediaComment result: ", result);
        res.send({ status: 200, result });
      })
      .catch((err) => {
        console.log("ERROR in addArticleComment: ", err);
        res.send({ status: 500, error: err });
      });
  });

  return app;
};
