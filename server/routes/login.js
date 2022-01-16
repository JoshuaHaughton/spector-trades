const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// curl -X POST -d 'password=password' -d 'email=test@example.com' http://localhost:3002/api/login

//Default route is /api/login
module.exports = (db) => {
  app.post("/", (req, res) => {

    // if (req.session['user_id']) {
    //   console.log("user cookie already exists, user id: ", req.session.user_id);
    // }

    const { password, email } = req.body;
    checkEmail(email, db)
    .then(async resp => {

      await bcrypt.compare(password, resp.password_digest, function (err, result) {
        if (result) {
          console.log("success!")
          // Generate an access token
          const accessToken = jwt.sign({user_id: resp.id, user_email: resp.email} , process.env.JWT_SECRET);
          return res.send({status: 200, user_id: resp.id, spector_jwt: accessToken})
        }
        else {
          return res.status(401).send("incorrect");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return app;
};
