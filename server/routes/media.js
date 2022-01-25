const express = require("express");
const app = express.Router();
const { getMediaById } = require('./helpers/media-helpers')

//Default route is /api/articles
module.exports = (db) => {

  //Retrive an individual media type via their id
  app.get("/:type/:media_id", (req, res) => {

    const { media_id } = req.params;
    const { type } = req.params;
    console.log("OLD ID", media_id)
    console.log("TYPE", type)

    let columnType;
    let idType;

    if (type === 'post_id') {
      columnType = "id"
      idType = "posts"
    } else {
      columnType = "original_id"
      idType = "articles"
    }

  getMediaById(media_id, columnType, idType, db)
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

