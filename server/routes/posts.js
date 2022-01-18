let express = require('express');
let app = express.Router();

//Default route is /api/posts

module.exports = (db) => {

app.get('/', async (req, res) => {
  try {
    const posts = await db.query(`
    SELECT * FROM posts;
    `);

    res.status(200).json({
      status: "success",
      results: posts.rows.length,
      data: {
        posts: posts.rows
      }
    })
    res.send(posts.rows);

  } catch(err) {

    res.status(500).send;
    console.log(res)
  }
})
return app;

}

