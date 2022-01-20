const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getArticleByOldId } = require('./helpers/article-helper')
const { getUserByColumn } = require("./helpers/user-helpers");

//Default route is /api/articles
module.exports = (db) => {
  app.post("/", (req, res) => {
    const article = req.body;

    let response = "";

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

        response = await db
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

      return response.rows;

    } catch (err) {
      //Maybe article already exists?
      console.log("error!");
    }

  });


  app.get("/:article_id", (req, res) => {
    const { article_id } = req.params;
    console.log("OLD ID", article_id)
  getArticleByOldId(article_id, db)
  .then(resp => {

    
    // console.log("RESP", resp)
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
