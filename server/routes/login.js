const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const { getUserByColumn } = require('./helpers/user-helpers');
// curl -X POST -d 'password=password' -d 'email=test@example.com' http://localhost:3002/api/login

//Default route is /api/login
module.exports = (db) => {
  app.post("/", (req, res) => {

    // if (req.session['user_id']) {
    //   console.log("user cookie already exists, user id: ", req.session.user_id);
    // }

    const { password, email } = req.body;
    getUserByColumn( 'email', email, db)
      .then(async (resp) => {
        await bcrypt.compare(
          password,
          resp.password_digest,
          function (err, result) {
            if (result) {
              console.log("successful login from: ", resp.username);

              // req.session['user_id'] = resp.user_id;  // SEND COOKIE TO CLIENT

              return res.send({ status: 200, user_id: resp.user_id });
            }
              console.log("password is incorrect");
              console.log(err)
              return res.status(401).send("password is incorrect");
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return app;
};
