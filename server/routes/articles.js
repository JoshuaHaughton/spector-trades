const express = require("express");
const app = express.Router();
const { authenticateToken } = require("../middleware/authenticateToken");
const { insertArticle } = require("./helpers/article-helper");

//Default route is /api/articles
module.exports = (db) => {

  //Create article using full retrieved article object from News api
  app.post("/", authenticateToken, (req, res) => {

    console.log('make this article', req.body)

    const article = req.body;
    // const article = JSON.parse(req.body.config.data).media;
    console.log("CREATE ARTICLE", article);


    try {
      insertArticle(article, db)
      .then((resp) => {

        res.status(200).json({
          status: "success",
          results: resp.length,
          data: {
            article: resp.rows[0],
          },
        });
        console.log("FIXED!!!", resp.rows[0])
        return resp.rows;
      })

    } catch (err) {
      //Maybe article already exists?
      console.log("error!");
      res.status(500)
    }
  });

  return app;
};

