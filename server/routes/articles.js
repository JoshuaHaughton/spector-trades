const express = require("express");
const app = express.Router();
const { authenticateToken } = require("../middleware/authenticateToken");
const { insertArticle } = require("./helpers/article-helper");

//Default route is /api/articles
module.exports = (db) => {

  //Create article using full retrieved article object from News api
  app.post("/", authenticateToken, (req, res) => {

    const article = JSON.parse(req.body.config.data).media;
    console.log("CREATE ARTICLE", article);

    let articleResponse = "";

    try {
      insertArticle(article, db);

      return articleResponse.rows;

    } catch (err) {
      //Maybe article already exists?
      console.log("error!");
      res.status(500)
    }
  });

  return app;
};

