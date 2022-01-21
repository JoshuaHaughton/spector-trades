const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getArticleByOldId } = require('./helpers/article-helper')
const { getUserByColumn } = require("./helpers/user-helpers");
const { authenticateToken } = require("../middleware/authenticateToken");

//Default route is /api/articles
module.exports = (db) => {

  //Create article using full retrieved article object from News api
  app.post("/", authenticateToken, (req, res) => {
    const article = req.body;

    console.log('SERVER', req.body)

    let articleResponse = "";

    try {

      insertArticle = async () => {
        //exist check
        let test = await db
          .query(
            `
            SELECT *
            FROM articles
            WHERE url = $1; 
            `, [article.link]
          )
          if (test.rows.length > 0 ) {
            return res.status(402).send("Already exists in database")
          }

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
            console.log("resp", resp.rows);


            res.status(200).json({
              status: "success",
              results: resp.length,
              data: {
                article: resp.rows,
              },
            });
            return resp.rows;
          });
      };

      insertArticle();

      return articleResponse.rows;

    } catch (err) {
      //Maybe article already exists?
      console.log("error!");
    }

  });


  //Retrive a specific article via their original id (already had this id upon retrieval)
  app.get("/:article_id", (req, res) => {

    const { article_id } = req.params;
    console.log("OLD ID", article_id)

  getArticleByOldId(article_id, db)
  .then(resp => {

    res.status(200).json({
      status: "success",
      data: {
        article: resp
      }
    })
    console.log(resp)

  }).catch(err => {

    console.log("ERROR IN getCommentsByUser: ", err)
  });
  })

  return app;
};
