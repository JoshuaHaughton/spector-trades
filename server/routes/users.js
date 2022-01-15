let express = require('express');
let app = express.Router();

//Default route is /api/users

module.exports = (db) => {
app.get('/', async (req, res) => {
  try {
    const users = await db.query(`
    SELECT * FROM users;
    `);
    res.status(200).json({
      status: "success",
      results: users.rows.length,
      data: {
        users: users.rows
      }
    })
    res.send(users.rows);

  } catch(err) {

    res.status(500).send;
  }
})

app.post('/', async (req, res) => {
  try {
    console.log("test")
    console.log(req.body)
    console.log(req.body)
    //above clears


    const users = await db.query(`
    INSERT INTO users (username, email, password_digest, avatar_url, created_at) 
    VALUES ($1, $2, $3, "testURL.jpg", NOW())
    RETURNING *`, [req.body.username, req.body.email, req.body.password]);



    res.status(200).json({
      status: "success",
      results: users.rows.length,
      data: {
        users: users.rows
      }
    })
    console.log("done!")
    res.send(users.rows);

  } catch(err) {

    res.status(500).send;
  }
})

return app;
}



