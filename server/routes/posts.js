let express = require('express');
const { authenticateToken } = require('../middleware/authenticateToken');
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

  } catch(err) {

    res.status(500).send;
    console.log(err)
  }
})

app.post('/', authenticateToken, async (req, res) => {

  console.log('INCOMING TO POSTS', req.body)


  try {
    const posts = await db.query(`
    INSERT INTO posts (user_id, username, description, created_at) 
    VALUES ($1, $2, $3, NOW())
    RETURNING *;
    `, [req.body.user.id, req.body.username, req.body.body]);

    res.status(200).json({
      status: 200,
      data: {
        posts: posts.rows
      }
    }) 

    console.log('POSTED SUCCESSFULLY', posts.rows)

  } catch(err) {

    res.status(500).send;
    console.log(err)
  }
})


return app;

}

