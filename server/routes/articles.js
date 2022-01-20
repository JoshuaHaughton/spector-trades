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
    // console.log(req)

    // console.log(article)

    let response = "";

    try {
      insertArticle = async () => {
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
          INSERT INTO articles (url, original_id) 
          VALUES ($1, $2)
          RETURNING *;
          `,
            [article.link, article._id],
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

            // console.log("responsee", resp.rows);
            return resp.rows;
          });

        // console.log('resp', resp)
      };

      insertArticle();

      return response.rows;

    } catch (err) {
      //Maybe article already exists?
      console.log("error!");
    }


    // const { link } = req.body;
    // getUserByColumn('email', email, db)
    // .then(resp => {
    //   if (resp) {
    //   bcrypt.compare(password, resp.password_digest, function (err, result) {

    //     if (result) {
    //       console.log("success!")

    //       // Generate an access token
    //       const accessToken = jwt.sign({user_id: resp.id, user_email: resp.email} , process.env.JWT_SECRET);
    //       return res.send({status: 200, spector_jwt: accessToken})
    //     } else {
    //       return res.send({status: 401, message: "bad password"})
    //     }
    //   })
    //   } else {
    //     return res.send({status: 401, message: "user not found"})
    //   }
    // }).catch(err => {
    //   console.log("HERE")
    //   console.log(err);
    // })
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
