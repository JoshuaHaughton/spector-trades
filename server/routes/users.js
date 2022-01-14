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


return app;
}

