let express = require('express');
let app = express.Router();

//Default route is /api/comments

module.exports = (db) => {

app.get('/', async (req, res) => {
  try {
    const comments = await db.query(`
    SELECT * FROM comments;
    `);

    res.status(200).json({
      status: "success",
      results: comments.rows.length,
      data: {
        comments: comments.rows
      }
    })
    res.send(comments.rows);

  } catch(err) {

    res.status(500).send;
    console.log(res)
  }
})

app.get('/:user_id', (req, res) => {
  const { user_id } = req.params;
});

return app;

}

const getCommentsByUser = (user_id, db) => {
  
}; 
