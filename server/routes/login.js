const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('./helpers/user-helpers');
// curl -X POST -d 'password=password' -d 'email=test@example.com' http://localhost:3002/api/login

//Default route is /api/login
module.exports = (db) => {
  app.post("/", (req, res) => {
    console.log(req.body);

    // if (req.session['user_id']) {
    //   console.log("user cookie already exists, user id: ", req.session.user_id);
    // }

    const { password, email } = req.body;
    getUserByEmail(email, db)
      .then(async (resp) => {
        console.log(password,  resp.password_digest);
        await bcrypt.compare(
          password,
          resp.password_digest,
          function (err, result) {
            console.log(result);
            if (result) {
              console.log("success!");

              // req.session['user_id'] = resp.user_id;  // SEND COOKIE TO CLIENT

              return res.send({ status: 200, user_id: resp.user_id });
            } else {
              console.log("password is incorrect");
              return res.status(401).send("password is incorrect");
            }
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return app;
};
