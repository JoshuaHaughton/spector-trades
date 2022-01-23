const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getArticleByOldId } = require('./helpers/article-helper')
const { getUserByColumn } = require("./helpers/user-helpers");
const { authenticateToken } = require("../middleware/authenticateToken");
// const bodyParser = require("body-parser");

// app.use(bodyParser.json())
//Default route is /api/articles
module.exports = (db) => {

  //Create article using full retrieved article object from News api
  app.post("/", authenticateToken, (req, res) => {


    const article = JSON.parse(req.body.config.data).media;
    console.log('UHDAIDBSYIBSIYAB', article)

    // console.log('SERVER', req.body)
    // console.log('LINKAZZ', JSON.parse(req.body.config.data))

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

          console.log("ALREADY EXISTS!!!")

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
            console.log("CREATEDDDDD!")


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

      insertArticle();

      return articleResponse.rows;

    } catch (err) {
      //Maybe article already exists?
      console.log("error!");
    }

  });


  //Retrive a specific article via their original id (already had this id upon retrieval)
  app.get("/:type/:media_id", (req, res) => {

    const { media_id } = req.params;
    const { type } = req.params;
    console.log("OLD ID", media_id)
    console.log("TYPE", type)

    // const { state } = req.body;
    // console.log("BODY", req.body)
    // console.log("PARENT STATE", state)

    let columnType;
    let idType;

    if (type === 'post_id') {
      columnType = "id"
      idType = "posts"
    } else {
      columnType = "original_id"
      idType = "articles"
    }

  getArticleByOldId(media_id, columnType, idType, db)
  .then(resp => {

    res.status(200).json({
      status: "success",
      data: {
        media: resp
      }
    })
    console.log('ALREADY EXISTS', resp)

    return resp;

  }).catch(err => {

    console.log("ERROR IN getCommentsByUser: ", err)
  });
  })

  return app;
};

