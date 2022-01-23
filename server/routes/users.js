let express = require("express");
const { authenticateToken } = require("../middleware/authenticateToken");
let app = express.Router();
const { getUserByColumn } = require("./helpers/user-helpers");

//Default route is /api/users

module.exports = (db) => {

  app.get("/", async (req, res) => {
    try {
      const users = await db.query(`
    SELECT * FROM users;
    `);
      res.status(200).json({
        status: "success",
        results: users.rows.length,
        data: {
          users: users.rows,
        },
      });
      res.send(users.rows);
    } catch (err) {
      res.status(500).send;
    }
  });


  app.get("/:jwt", (req, res) => {
    const { jwt } = req.params;
  });


  //get users when they have no id
  app.get("/id/me", authenticateToken, async (req, res) => {

    const user_id = req.body.user.id
    console.log('POST', req.body)

    try {
      const resp = await getUserByColumn("id", user_id, db);


      res.status(200).json({
        status: "success",
        results: resp.length,
        data: {
          user: resp
        },
      });

    } catch (err) {}
    
  });



  //get specific user info by their id
  app.get("/id/:user_id", async (req, res) => {
    const { user_id } = req.params;

    if (user_id)

    try {
      const resp = await getUserByColumn("id", user_id, db);

      res.status(200).json({
        status: "success",
        results: resp.length,
        data: {
          user: resp,
        },
      });

    } catch (err) {}
    
  });



  return app;
};

