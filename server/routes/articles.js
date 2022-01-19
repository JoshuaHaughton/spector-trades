const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
        response = await db
          .query(
            `
          INSERT INTO articles (url) 
          VALUES ($1)
          RETURNING *;
          `,
            [article.link],
          )
          .then((resp) => {
            // console.log("resp", resp.rows);

            res.status(200).json({
              status: "success",
              results: resp.length,
              data: {
                article: resp.rows,
              },
            });

            // console.log("responsee", response);
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

  return app;
};
